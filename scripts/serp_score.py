#!/usr/bin/env python3
"""SERP 機會分數評分腳本 — 吃 GSC 成效匯出,輸出四個行動帶的優化順序。

用法:
    python3 scripts/serp_score.py <GSC匯出.zip 或解壓資料夾> [--save] [--min-imp 10]

    --save      將本次快照存到 docs/serp-reports/,並產出 markdown 報告
    --min-imp   查詢字最低曝光門檻(預設 10,低於此不進榜)

資料來源:Search Console → 成效 → 匯出(zip 內含 查詢.csv / 網頁.csv,Big5 檔名)。
再次執行且 docs/serp-reports/ 已有舊快照時,自動列出排名升降對照。

評分模型:機會分數 = 曝光 × (目標排名預期CTR − 實際CTR)
行動帶:
  P0  排名≤10 但 CTR 低於預期一半 → 改 title/meta 搶 CTR
  P1  排名 11–20(striking distance) → 內鏈/擴充推上第 1 頁
  P2  排名 21–50 高曝光 → 重寫/叢集化/權重集中
  AMP 排名 4–10 已有點擊 → 衝前 3 放大
"""

import csv
import io
import sys
import zipfile
from datetime import date
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
REPORT_DIR = REPO / "docs" / "serp-reports"

# 業界保守版 CTR 曲線(自然結果,台灣中文 SERP)
CTR_CURVE = {1: .28, 2: .15, 3: .11, 4: .08, 5: .07, 6: .05, 7: .04, 8: .03, 9: .025, 10: .02}


def exp_ctr(pos: float) -> float:
    if pos <= 10:
        return CTR_CURVE[max(1, round(pos))]
    if pos <= 20:
        return .01
    return .003


def parse_num(s: str) -> float:
    return float(s.replace(",", "").replace("%", "").strip() or 0)


def load_csv_rows(data: bytes):
    text = data.decode("utf-8-sig")
    rows = list(csv.reader(io.StringIO(text)))
    return rows[1:]  # 跳過表頭


def load_gsc(source: Path):
    """回傳 (queries, pages):查詢字與頁面各為 (name, clicks, imp, ctr, pos) 列表。"""
    files = {}
    if source.suffix == ".zip":
        z = zipfile.ZipFile(source)
        for info in z.infolist():
            try:
                name = info.filename.encode("cp437").decode("big5")
            except (UnicodeDecodeError, UnicodeEncodeError):
                name = info.filename
            files[name] = z.read(info.filename)
    else:
        for p in source.iterdir():
            if p.suffix == ".csv":
                files[p.name] = p.read_bytes()

    def find(keyword):
        for name, data in files.items():
            if keyword in name:
                return load_csv_rows(data)
        return []

    def normalize(rows):
        out = []
        for r in rows:
            if len(r) < 5:
                continue
            clicks, imp, pos = int(parse_num(r[1])), int(parse_num(r[2])), parse_num(r[4])
            ctr = clicks / imp if imp else 0
            out.append((r[0], clicks, imp, ctr, pos))
        return out

    return normalize(find("查詢")), normalize(find("網頁"))


def band_queries(queries, min_imp):
    p0, p1, p2, amp = [], [], [], []
    for q, clicks, imp, ctr, pos in queries:
        if imp < min_imp:
            continue
        if pos <= 10 and ctr < exp_ctr(pos) / 2:
            p0.append((q, pos, imp, clicks, imp * (exp_ctr(pos) - ctr)))
        elif 10 < pos <= 20:
            p1.append((q, pos, imp, clicks, imp * (exp_ctr(6) - ctr)))
        elif 20 < pos <= 50:
            p2.append((q, pos, imp, clicks, imp * (exp_ctr(6) - ctr)))
        if pos <= 10 and clicks > 0:
            amp.append((q, pos, imp, clicks, imp * (exp_ctr(2) - ctr)))
    key = lambda x: -x[4]
    return sorted(p0, key=key), sorted(p1, key=key), sorted(p2, key=key), sorted(amp, key=key)


def fmt_band(title, rows, action, limit=15):
    lines = [f"## {title}", f"> 建議動作:{action}", ""]
    if not rows:
        lines.append("(無符合項目)")
        lines.append("")
        return lines
    lines.append("| 查詢字 | 排名 | 第幾頁 | 曝光 | 點擊 | 機會分數(潛在點擊/期間) |")
    lines.append("|---|---|---|---|---|---|")
    for q, pos, imp, clicks, score in rows[:limit]:
        page = -(-int(pos) // 10) if pos >= 1 else 1
        lines.append(f"| {q} | {pos:.1f} | {page} | {imp} | {clicks} | +{score:.1f} |")
    if len(rows) > limit:
        lines.append(f"| …另有 {len(rows) - limit} 筆(見快照 CSV) | | | | | |")
    lines.append("")
    return lines


def load_prev_snapshot():
    snap_dir = REPORT_DIR / "snapshots"
    if not snap_dir.is_dir():
        return None, None
    snaps = sorted(snap_dir.glob("*.csv"))
    today_name = f"{date.today().isoformat()}.csv"
    snaps = [s for s in snaps if s.name != today_name]
    if not snaps:
        return None, None
    prev = snaps[-1]
    data = {}
    with open(prev, encoding="utf-8") as f:
        for r in list(csv.reader(f))[1:]:
            data[r[0]] = float(r[4])
    return prev.stem, data


def fmt_movers(queries, prev_date, prev):
    lines = [f"## 排名變化(對照 {prev_date} 快照)", ""]
    movers = []
    for q, clicks, imp, ctr, pos in queries:
        if q in prev and imp >= 5:
            delta = prev[q] - pos  # 正值 = 進步
            if abs(delta) >= 2:
                movers.append((q, prev[q], pos, delta, imp))
    if not movers:
        lines.append("(無明顯變動,|Δ| ≥ 2 名才列出)")
        lines.append("")
        return lines
    movers.sort(key=lambda x: -x[3])
    lines.append("| 查詢字 | 上次 | 本次 | Δ | 曝光 |")
    lines.append("|---|---|---|---|---|")
    for q, old, new, delta, imp in movers[:25]:
        arrow = "▲" if delta > 0 else "▼"
        lines.append(f"| {q} | {old:.1f} | {new:.1f} | {arrow}{abs(delta):.1f} | {imp} |")
    lines.append("")
    return lines


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        print(__doc__)
        sys.exit(1)
    source = Path(args[0]).expanduser()
    if not source.exists():
        sys.exit(f"找不到:{source}")
    save = "--save" in sys.argv
    min_imp = 10
    if "--min-imp" in sys.argv:
        min_imp = int(sys.argv[sys.argv.index("--min-imp") + 1])

    queries, pages = load_gsc(source)
    if not queries:
        sys.exit("讀不到 查詢.csv — 確認是 GSC 成效匯出的 zip 或解壓資料夾")

    p0, p1, p2, amp = band_queries(queries, min_imp)
    today = date.today().isoformat()

    lines = [f"# SERP 機會分數報告 — {today}", "",
             f"來源:{source.name}|查詢字 {len(queries)} 個|曝光門檻 ≥{min_imp}", ""]

    prev_date, prev = load_prev_snapshot()
    if prev:
        lines += fmt_movers(queries, prev_date, prev)

    lines += fmt_band("P1|Striking distance(11–20 名)— 本期主戰場", p1,
                      "內鏈權重集中、內容擴充、消除同類相殘,推上第 1 頁")
    lines += fmt_band("P0|第 1 頁但 CTR 漏水", p0,
                      "title 前 15 字放答案鉤子、meta 直接回答、FAQ schema")
    lines += fmt_band("AMP|已有點擊,衝前 3 放大", amp,
                      "補 SERP 差異化元素(試算表/流程圖),搶 featured snippet")
    lines += fmt_band("P2|21–50 名高曝光", p2,
                      "重寫加厚、叢集化互連、灌 pillar")

    report = "\n".join(lines)
    print(report)

    if save:
        snap_dir = REPORT_DIR / "snapshots"
        snap_dir.mkdir(parents=True, exist_ok=True)
        with open(snap_dir / f"{today}.csv", "w", encoding="utf-8", newline="") as f:
            w = csv.writer(f)
            w.writerow(["query", "clicks", "impressions", "ctr", "position"])
            for q, clicks, imp, ctr, pos in queries:
                w.writerow([q, clicks, imp, f"{ctr:.4f}", pos])
        (REPORT_DIR / f"serp-score-{today}.md").write_text(report, encoding="utf-8")
        print(f"\n已存:docs/serp-reports/serp-score-{today}.md + snapshots/{today}.csv", file=sys.stderr)


if __name__ == "__main__":
    main()
