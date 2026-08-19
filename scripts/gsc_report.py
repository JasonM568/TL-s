#!/usr/bin/env python3
"""
Search Console 報表（排名現況／期間比較／striking distance 選題）

憑證：與 GA4 共用服務帳戶 ~/.config/ga4/ga4-reader.json
      需在 GSC「設定 →使用者和權限」把該帳戶加為使用者，
      並在 GCP 啟用 Search Console API。
相依：google-auth（本機已裝）

用法：
    python3 scripts/gsc_report.py                     # 近 28 天現況
    python3 scripts/gsc_report.py --days 14
    python3 scripts/gsc_report.py --compare           # 與前一個等長期間比較
    python3 scripts/gsc_report.py --striking          # 只列選題機會（第 2 頁卡關）
    python3 scripts/gsc_report.py --site sc-domain:huibang.com.tw
    python3 scripts/gsc_report.py --list              # 列出可存取的資源

注意：GSC 資料約有 2–3 天延遲，預設 end 會自動退 3 天。
"""
import argparse
import datetime as dt
import os
import sys

from google.oauth2 import service_account
from google.auth.transport.requests import AuthorizedSession

KEY_PATH = os.path.expanduser('~/.config/ga4/ga4-reader.json')
DEFAULT_SITE = 'sc-domain:huangxi.tw'
BASE = 'https://searchconsole.googleapis.com/webmasters/v3'

# 核心商業詞：對照 docs/gsc-baseline-2026-08-07.md 的基準值
CORE_TERMS = ['支票貼現', '支票貸款', '票貼', '支票貼現是什麼', '企業融資', '企業貸款']


def session():
    if not os.path.exists(KEY_PATH):
        sys.exit(f'找不到金鑰：{KEY_PATH}（見 docs/HANDOFF.md）')
    creds = service_account.Credentials.from_service_account_file(
        KEY_PATH, scopes=['https://www.googleapis.com/auth/webmasters.readonly'])
    return AuthorizedSession(creds)


def query(sess, site, start, end, dims=None, limit=1000, filters=None):
    body = {'startDate': start, 'endDate': end, 'rowLimit': limit,
            'dimensions': dims or []}
    if filters:
        body['dimensionFilterGroups'] = [{'filters': filters}]
    url = f'{BASE}/sites/{site.replace("/", "%2F").replace(":", "%3A")}/searchAnalytics/query'
    r = sess.post(url, json=body)
    if r.status_code != 200:
        return None, r.json().get('error', {}).get('message', r.text[:200])
    return r.json().get('rows', []), None


def totals(rows):
    if not rows:
        return dict(clicks=0, impressions=0, ctr=0.0, position=0.0)
    c = sum(r['clicks'] for r in rows)
    i = sum(r['impressions'] for r in rows)
    # 平均排名要用曝光加權，直接平均會失真
    pos = sum(r['position'] * r['impressions'] for r in rows) / i if i else 0
    return dict(clicks=c, impressions=i, ctr=(c / i if i else 0), position=pos)


def pct(new, old):
    if not old:
        return '—' if not new else '新增'
    return f'{(new - old) / old * 100:+.0f}%'


def table(title, headers, rows, note=None):
    print(f'\n{"=" * 78}\n{title}\n{"=" * 78}')
    if note:
        print(f'· {note}')
    if not rows:
        print('  （無資料）')
        return
    body = [[str(c) for c in r] for r in rows]
    w = [max(len(h), *(len(r[i]) for r in body)) for i, h in enumerate(headers)]
    print('  ' + ' │ '.join(h.ljust(x) for h, x in zip(headers, w)))
    print('  ' + '─┼─'.join('─' * x for x in w))
    for r in body:
        print('  ' + ' │ '.join(c.ljust(x) for c, x in zip(r, w)))


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--site', default=DEFAULT_SITE)
    p.add_argument('--days', type=int, default=28)
    p.add_argument('--start')
    p.add_argument('--end')
    p.add_argument('--compare', action='store_true', help='與前一個等長期間比較')
    p.add_argument('--striking', action='store_true', help='只列 striking distance 選題機會')
    p.add_argument('--list', action='store_true', help='列出可存取資源')
    a = p.parse_args()

    s = session()

    if a.list:
        r = s.get(f'{BASE}/sites')
        for e in r.json().get('siteEntry', []):
            print(f"{e.get('permissionLevel'):15s} {e.get('siteUrl')}")
        return

    end = a.end or (dt.date.today() - dt.timedelta(days=3)).isoformat()
    start = a.start or (dt.date.fromisoformat(end) - dt.timedelta(days=a.days - 1)).isoformat()
    span = (dt.date.fromisoformat(end) - dt.date.fromisoformat(start)).days + 1
    print(f'\nGSC {a.site}｜{start} ~ {end}（{span} 天）')

    qrows, err = query(s, a.site, start, end, ['query'], 5000)
    if err:
        sys.exit(f'查詢失敗：{err}')

    # ── striking distance：有曝光、排名 8–25，最容易推進第 1 頁 ──
    if a.striking:
        cand = [r for r in qrows
                if 8 <= r['position'] <= 25 and r['impressions'] >= 10]
        cand.sort(key=lambda r: -(r['impressions'] / max(r['position'], 1)))
        table('Striking distance 選題機會（排名 8–25、曝光≥10，依機會分數排序）',
              ['關鍵字', '曝光', '點擊', '排名', '機會分數'],
              [[r['keys'][0], r['impressions'], r['clicks'], f"{r['position']:.1f}",
                f"{r['impressions'] / max(r['position'], 1):.1f}"] for r in cand[:40]],
              '機會分數 = 曝光 ÷ 排名。分數高＝需求大但還沒接住，最值得寫／擴寫。')
        return

    # ⚠️ 真實總計必須用「無維度」查詢。用 query 維度加總會低估——
    # GSC 為保護隱私會把罕見查詢匿名化、不納入 query 維度的回傳。
    trows, _ = query(s, a.site, start, end, [], 1)
    t = totals(trows or [])

    if a.compare:
        pend = (dt.date.fromisoformat(start) - dt.timedelta(days=1)).isoformat()
        pstart = (dt.date.fromisoformat(pend) - dt.timedelta(days=span - 1)).isoformat()
        ptrows, _ = query(s, a.site, pstart, pend, [], 1)
        prows, _ = query(s, a.site, pstart, pend, ['query'], 5000)
        pt = totals(ptrows or [])
        table(f'期間比較（本期 {start}~{end}　vs　前期 {pstart}~{pend}）',
              ['指標', '本期', '前期', '變化'],
              [['點擊', t['clicks'], pt['clicks'], pct(t['clicks'], pt['clicks'])],
               ['曝光', f"{t['impressions']:,}", f"{pt['impressions']:,}",
                pct(t['impressions'], pt['impressions'])],
               ['CTR', f"{t['ctr']*100:.2f}%", f"{pt['ctr']*100:.2f}%", ''],
               ['平均排名', f"{t['position']:.1f}", f"{pt['position']:.1f}",
                f"{pt['position']-t['position']:+.1f}（正=進步）"],
               ['關鍵字數', len(qrows), len(prows or []), pct(len(qrows), len(prows or []))]])
    else:
        table('總覽', ['點擊', '曝光', 'CTR', '平均排名', '可見關鍵字數'],
              [[t['clicks'], f"{t['impressions']:,}", f"{t['ctr']*100:.2f}%",
                f"{t['position']:.1f}", len(qrows)]],
              '點擊/曝光為無維度真實總計；關鍵字數不含 GSC 匿名化的罕見查詢，'
              '故以下各表加總會小於總覽。')

    page1 = [r for r in qrows if r['position'] <= 10]
    table('排名分布', ['區間', '關鍵字數', '曝光'],
          [[label,
            len([r for r in qrows if lo <= r['position'] < hi]),
            f"{sum(r['impressions'] for r in qrows if lo <= r['position'] < hi):,}"]
           for label, lo, hi in [('第 1 頁（1–10）', 0, 10), ('第 2 頁（11–20）', 10, 20),
                                 ('第 3 頁（21–30）', 20, 30), ('30 名以後', 30, 9999)]],
          f'第 1 頁佔比 {len(page1)/len(qrows)*100:.0f}%' if qrows else None)

    lookup = {r['keys'][0]: r for r in qrows}
    table('核心商業詞', ['關鍵字', '點擊', '曝光', 'CTR', '排名'],
          [[k, lookup[k]['clicks'], f"{lookup[k]['impressions']:,}",
            f"{lookup[k]['ctr']*100:.2f}%", f"{lookup[k]['position']:.1f}"]
           if k in lookup else [k, '—', '—', '—', '未進榜'] for k in CORE_TERMS],
          '對照基準見 docs/gsc-baseline-2026-08-07.md')

    top = sorted(qrows, key=lambda r: -r['clicks'])[:15]
    table('帶點擊的關鍵字 Top 15', ['關鍵字', '點擊', '曝光', 'CTR', '排名'],
          [[r['keys'][0], r['clicks'], f"{r['impressions']:,}",
            f"{r['ctr']*100:.2f}%", f"{r['position']:.1f}"] for r in top])

    prows_, _ = query(s, a.site, start, end, ['page'], 1000)
    top_pages = sorted(prows_ or [], key=lambda r: -r['clicks'])[:15]
    table('流量頁 Top 15', ['網址', '點擊', '曝光', '排名'],
          [[r['keys'][0].replace('https://huangxi.tw', ''), r['clicks'],
            f"{r['impressions']:,}", f"{r['position']:.1f}"] for r in top_pages])

    # CTR=0 但排名在第 1 頁 → title/meta 改寫候選
    zero = [r for r in qrows if r['clicks'] == 0 and r['position'] <= 10
            and r['impressions'] >= 15]
    zero.sort(key=lambda r: -r['impressions'])
    table('排名前 10 但 CTR=0（title/meta 改寫候選，曝光≥15）',
          ['關鍵字', '曝光', '排名'],
          [[r['keys'][0], r['impressions'], f"{r['position']:.1f}"] for r in zero[:20]],
          '排得到卻沒人點＝標題沒說服力，改寫成本最低、見效最快。')


if __name__ == '__main__':
    main()
