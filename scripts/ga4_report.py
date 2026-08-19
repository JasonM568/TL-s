#!/usr/bin/env python3
"""
GA4 乾淨報表（預設只算台灣流量）

為什麼要這支：huangxi.tw 的 GA4 裡約 2/3 的工作階段是中國/美國/越南來的機器人
（平均停留 1 秒、跳出率 97%）。Jason 決定不擋（不動 Cloudflare），
所以過濾只能在報表層做。而 GA4 的「資料篩選器」只支援內部/開發人員流量、
不支援國家，UI 的「比較」又是個人層級且無法用 API 建立 —— 故改用這支腳本。

憑證：服務帳戶金鑰 ~/.config/ga4/ga4-reader.json（repo 外、chmod 600）
      需在 GA4「資源存取管理」把該帳戶加為檢視者。
相依：google-auth（本機已裝，不需要 google-analytics-data）

用法：
    python3 scripts/ga4_report.py                      # 近 30 天，只看台灣
    python3 scripts/ga4_report.py --days 7
    python3 scripts/ga4_report.py --start 2026-07-01 --end 2026-08-19
    python3 scripts/ga4_report.py --country all        # 不過濾，看含機器人的原始值
    python3 scripts/ga4_report.py --property 282346828 # 換別的客戶資源
"""
import argparse
import datetime as dt
import os
import sys

from google.oauth2 import service_account
from google.auth.transport.requests import AuthorizedSession

KEY_PATH = os.path.expanduser('~/.config/ga4/ga4-reader.json')
DEFAULT_PROPERTY = '372168473'  # 黃璽理財支票貼 - GA4
API = 'https://analyticsdata.googleapis.com/v1beta/properties/{}:runReport'


def session():
    if not os.path.exists(KEY_PATH):
        sys.exit(f'找不到金鑰：{KEY_PATH}\n見 docs/HANDOFF.md「GA4 程式化讀取」。')
    creds = service_account.Credentials.from_service_account_file(
        KEY_PATH, scopes=['https://www.googleapis.com/auth/analytics.readonly'])
    return AuthorizedSession(creds)


def run(sess, prop, dims, mets, start, end, country=None, limit=25, order=None):
    body = {
        'dateRanges': [{'startDate': start, 'endDate': end}],
        'dimensions': [{'name': d} for d in dims],
        'metrics': [{'name': m} for m in mets],
        'limit': limit,
    }
    if order:
        body['orderBys'] = [{'metric': {'metricName': order}, 'desc': True}]
    if country:
        body['dimensionFilter'] = {
            'filter': {'fieldName': 'country', 'stringFilter': {'value': country}}
        }
    r = sess.post(API.format(prop), json=body)
    j = r.json()
    if r.status_code != 200:
        return None, j.get('error', {}).get('message', r.text[:200])
    rows = [
        ([d['value'] for d in row.get('dimensionValues', [])],
         [m['value'] for m in row.get('metricValues', [])])
        for row in j.get('rows', [])
    ]
    return rows, None


def fmt(metric_name, raw):
    """把 GA4 回傳的字串整理成可讀格式。"""
    try:
        v = float(raw)
    except ValueError:
        return raw
    if 'Rate' in metric_name:
        return f'{v * 100:.1f}%'
    if 'Duration' in metric_name:
        return f'{int(v // 60)}分{int(v % 60):02d}秒' if v >= 60 else f'{v:.0f}秒'
    return f'{int(v):,}' if v == int(v) else f'{v:,.2f}'


def table(title, rows, dims, mets, note=None):
    print(f'\n{"=" * 72}\n{title}\n{"=" * 72}')
    if note:
        print(f'· {note}')
    if rows is None:
        print('  查詢失敗')
        return
    if not rows:
        print('  （無資料）')
        return
    headers = dims + mets
    body = [d + [fmt(m, v) for m, v in zip(mets, vals)] for d, vals in rows]
    widths = [
        max(len(str(h)), *(len(str(r[i])) for r in body)) if body else len(str(h))
        for i, h in enumerate(headers)
    ]
    print('  ' + ' │ '.join(str(h).ljust(w) for h, w in zip(headers, widths)))
    print('  ' + '─┼─'.join('─' * w for w in widths))
    for r in body:
        print('  ' + ' │ '.join(str(c).ljust(w) for c, w in zip(r, widths)))


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--property', default=DEFAULT_PROPERTY)
    p.add_argument('--days', type=int, default=30)
    p.add_argument('--start')
    p.add_argument('--end')
    p.add_argument('--country', default='Taiwan',
                   help="預設 Taiwan；傳 'all' 則不過濾（會含機器人）")
    a = p.parse_args()

    end = a.end or dt.date.today().isoformat()
    start = a.start or (dt.date.fromisoformat(end) - dt.timedelta(days=a.days)).isoformat()
    country = None if a.country.lower() == 'all' else a.country
    scope = f'國家 = {country}' if country else '全部國家（含機器人，僅供對照）'

    s = session()
    print(f'\nGA4 資源 {a.property}｜{start} ~ {end}｜{scope}')

    rows, err = run(s, a.property, [], ['sessions', 'totalUsers', 'newUsers',
                                        'screenPageViews', 'averageSessionDuration',
                                        'bounceRate'],
                    start, end, country)
    table('總覽', rows, [], ['sessions', 'totalUsers', 'newUsers', 'screenPageViews',
                            'averageSessionDuration', 'bounceRate'], err)

    for title, dims, mets, limit, note in [
        ('管道別', ['sessionDefaultChannelGrouping'],
         ['sessions', 'totalUsers', 'averageSessionDuration', 'bounceRate'], 15, None),
        ('來源／媒介 Top 10', ['sessionSourceMedium'],
         ['sessions', 'averageSessionDuration'], 10, None),
        ('到達網頁 Top 15', ['landingPage'],
         ['sessions', 'bounceRate', 'averageSessionDuration'], 15, None),
        ('裝置', ['deviceCategory'],
         ['sessions', 'averageSessionDuration', 'bounceRate'], 5, None),
    ]:
        r, e = run(s, a.property, dims, mets, start, end, country,
                   limit=limit, order='sessions')
        table(title, r, dims, mets, e or note)

    # 轉換：LINE 加好友點擊（2026-08-19 起埋點）
    r, e = run(s, a.property, ['eventName'], ['eventCount', 'totalUsers'],
               start, end, country, limit=25, order='eventCount')
    table('事件（找 line_add_click / generate_lead）', r,
          ['eventName'], ['eventCount', 'totalUsers'], e)

    r, e = run(s, a.property, ['customEvent:cta_location'], ['eventCount'],
               start, end, country, limit=15, order='eventCount')
    if e and 'not a valid dimension' in e:
        print(f'\n{"=" * 72}\nLINE 點擊：各入口表現\n{"=" * 72}')
        print('  ⚠️ cta_location 尚未註冊為自訂維度，GA4 收得到參數但報表查不到。')
        print('     GA4 →「管理」→「自訂定義」→「建立自訂維度」：')
        print('       維度名稱：CTA 位置｜範圍：事件｜事件參數：cta_location')
        print('     註冊後僅對「往後」的資料生效，不會回溯，所以越早設越好。')
    else:
        table('LINE 點擊：各入口表現', r, ['customEvent:cta_location'], ['eventCount'],
              e or '埋點 2026-08-19 上線；標準報表約 24 小時回流，即時報表可立即驗。')


if __name__ == '__main__':
    main()
