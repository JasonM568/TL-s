#!/usr/bin/env python3
"""
批次套用 title/description 改寫到 DB 排程文（huangxi_articles）。

寫入路徑只有 `huangxi_upsert_article` RPC（anon key 受 RLS 限制、無法直接 UPDATE），
該 RPC 吃「完整 Article 物件」，所以本腳本會先把 DB 現有列讀回來、
只換掉 title/description、其餘欄位原封送回，避免漏欄位造成資料遺失。

⚠️ upsert 的 on-conflict 不會動 status/publish_at（見 docs/HANDOFF.md），
   但每次跑完仍會自動比對全欄位並印出差異，確認只有預期欄位變動。

用法：
    python3 scripts/apply_meta.py --file scripts/title-rewrites-2026-08-19.json --dry-run
    python3 scripts/apply_meta.py --file ... --only bao-fu-zhi-piao   # 先試一篇
    python3 scripts/apply_meta.py --file ...                          # 全部套用
"""
import argparse
import json
import os
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMPARE_FIELDS = ['slug', 'title', 'h1', 'description', 'keywords', 'category',
                  'author', 'reading_minutes', 'excerpt', 'updated_display',
                  'status', 'publish_at', 'sort_order']


def env():
    vals = {}
    with open(os.path.join(ROOT, '.env.local'), encoding='utf-8') as f:
        for line in f:
            if '=' in line and not line.startswith('#'):
                k, _, v = line.partition('=')
                vals[k.strip()] = v.strip().strip('"').strip("'")
    missing = [k for k in ('SUPABASE_URL', 'SUPABASE_ANON_KEY', 'HUANGXI_ADMIN_SECRET')
               if not vals.get(k)]
    if missing:
        sys.exit(f'.env.local 缺少：{", ".join(missing)}')
    return vals


def rpc(cfg, name, payload):
    req = urllib.request.Request(
        f"{cfg['SUPABASE_URL']}/rest/v1/rpc/{name}",
        data=json.dumps(payload).encode(),
        headers={'apikey': cfg['SUPABASE_ANON_KEY'],
                 'Authorization': f"Bearer {cfg['SUPABASE_ANON_KEY']}",
                 'Content-Type': 'application/json'},
        method='POST')
    with urllib.request.urlopen(req, timeout=30) as r:
        body = r.read().decode()
    return json.loads(body) if body.strip() else None


def fetch(cfg):
    rows = rpc(cfg, 'huangxi_list_articles', {'p_secret': cfg['HUANGXI_ADMIN_SECRET']})
    return {r['slug']: r for r in rows}


def to_article(row, title, description):
    """DB 列（snake_case）→ RPC 期望的 Article 形狀（camelCase）。"""
    return {
        'slug': row['slug'],
        'title': title,
        'h1': row['h1'],
        'description': description,
        'keywords': row.get('keywords') or [],
        'category': row['category'],
        'author': row.get('author'),
        'readingMinutes': row.get('reading_minutes'),
        'excerpt': row['excerpt'],
        'updated': row.get('updated_display'),
        'content': row.get('content') or [],
    }


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--file', required=True)
    p.add_argument('--only', help='只處理這個 slug')
    p.add_argument('--dry-run', action='store_true')
    a = p.parse_args()

    cfg = env()
    spec = json.load(open(a.file, encoding='utf-8'))
    items = [r for r in spec['rewrites'] if r.get('store') == 'db']
    if a.only:
        items = [r for r in items if r['slug'] == a.only]
    if not items:
        sys.exit('沒有符合的項目（--only 打錯？靜態篇請直接改 articles.ts）')

    before = fetch(cfg)
    print(f'DB 現有 {len(before)} 篇；本次處理 {len(items)} 篇'
          f'{"（DRY RUN，不寫入）" if a.dry_run else ""}\n')

    changed = 0
    for it in items:
        slug = it['slug']
        row = before.get(slug)
        if not row:
            print(f'✗ {slug}：不在 DB，跳過')
            continue
        print(f'【{slug}】曝光 {it["impressions"]}｜{it["queries"]}')
        print(f'  舊 title: {row["title"]}')
        print(f'  新 title: {it["title"]}')
        if a.dry_run:
            print()
            continue
        rpc(cfg, 'huangxi_upsert_article',
            {'p_secret': cfg['HUANGXI_ADMIN_SECRET'],
             'p_article': to_article(row, it['title'], it['description'])})
        changed += 1
        print('  ✓ 已寫入\n')

    if a.dry_run or not changed:
        return

    # 全欄位回讀比對：確認只有 title/description 變動
    after = fetch(cfg)
    print('=' * 66)
    print('回讀比對（預期：只有 title / description 出現差異）')
    print('=' * 66)
    unexpected = 0
    for it in items:
        slug = it['slug']
        b, n = before.get(slug), after.get(slug)
        if not b or not n:
            continue
        diffs = [f for f in COMPARE_FIELDS if b.get(f) != n.get(f)]
        blocks = (len(b.get('content') or []), len(n.get('content') or []))
        if blocks[0] != blocks[1]:
            diffs.append(f'content blocks {blocks[0]}→{blocks[1]}')
        extra = [d for d in diffs if d not in ('title', 'description')]
        mark = '⚠️' if extra else '✓'
        if extra:
            unexpected += 1
        print(f'  {mark} {slug:30s} 變動欄位：{", ".join(diffs) or "（無）"}')
    print(f'\n{"⚠️ 有非預期變動，請檢查！" if unexpected else "✓ 全部只動 title/description，status/publish_at/content 未受影響"}')


if __name__ == '__main__':
    main()
