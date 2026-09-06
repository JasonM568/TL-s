#!/usr/bin/env python3
"""
GA4 設定同步（自訂維度 + 關鍵事件）

為什麼要這支：GA4 的「自訂定義」與「關鍵事件」都不會回溯——沒先建好，
埋點送上去的參數在報表裡永遠查不到。用 API 建可留下版控紀錄，
也避免手點漏掉或名稱打錯。

⚠️ 權限：讀取（不加 --apply）只要「檢視者」；**寫入需要「編輯者」**。
   ga4-reader@huangxi-analytics.iam.gserviceaccount.com 於 2026-09-06 臨時升為
   編輯者跑完設定後，**已依 Jason 指示降回檢視者**（最小權限）。
   → 現在跑 --apply 會全部 403，這是預期行為。日後若要再寫入，
     請先在 GA4「管理 → 資源存取管理」升為編輯者，做完再降回。
   ⚠️ 降權這件事**腳本做不到**：GA4 的使用者管理需要「管理員」角色，
      編輯者不含此權限（accessBindings 一律 403），只能在後台手動點。

用法：
    python3 scripts/ga4_setup.py            # 只檢查現況，不寫入（預設）
    python3 scripts/ga4_setup.py --apply    # 實際建立／修改
"""
import argparse
import os
import sys

from google.oauth2 import service_account
from google.auth.transport.requests import AuthorizedSession

KEY_PATH = os.path.expanduser('~/.config/ga4/ga4-reader.json')
DEFAULT_PROPERTY = '372168473'  # 黃璽理財支票貼 - GA4
BASE = 'https://analyticsadmin.googleapis.com/v1beta/properties/{}'

# 要存在的事件範圍自訂維度。parameterName 必須與程式碼送出的參數名完全一致
# （見 src/components/LineCta.tsx）。
WANT_DIMENSIONS = [
    dict(
        parameterName='cta_location',
        displayName='CTA 位置',
        scope='EVENT',
        description=(
            'CTA 入口：floating / floating_article / article_inline / article_end '
            '/ calculator_result / calculator_bottom / contact_card'
        ),
    ),
    dict(
        parameterName='cta_variant',
        displayName='CTA 誘因',
        scope='EVENT',
        description=(
            'CTA 誘因主題：piao-xin 查票信 / tie-xian 試算實拿 '
            '/ tian-xie 幫你看這張票 / zhou-zhuan 評估額度'
        ),
    ),
]

# 應該被算成轉換的事件。
# ⚠️ 2026-09-06 盤查發現原本只有 jf___送出諮詢（舊 WordPress 表單外掛，現站不再送出）
#    與 purchase（電商預設，本站無電商）→ 轉換數恆為 0。
#    下面兩個已於 2026-09-06 建立，jf___送出諮詢 同日已取消關鍵事件標記。
#    purchase 是 GA4 內建預設、本站永不送出，無害，故不列入 STALE。
WANT_KEY_EVENTS = [
    ('line_add_click', 'ONCE_PER_SESSION'),  # 同一次造訪重複點 LINE 只算一次
    ('generate_lead', 'ONCE_PER_EVENT'),     # 表單每送出一筆都算
]

# 已失效、建議停用的關鍵事件（本腳本只提示，不自動刪——刪掉會影響歷史報表的解讀）
STALE_KEY_EVENTS = ['jf___送出諮詢']


def session(readonly: bool):
    if not os.path.exists(KEY_PATH):
        sys.exit(f'找不到金鑰：{KEY_PATH}（見 docs/HANDOFF.md）')
    scope = ('https://www.googleapis.com/auth/analytics.readonly' if readonly
             else 'https://www.googleapis.com/auth/analytics.edit')
    creds = service_account.Credentials.from_service_account_file(KEY_PATH, scopes=[scope])
    return AuthorizedSession(creds)


def get_all(sess, prop, endpoint):
    r = sess.get(BASE.format(prop) + '/' + endpoint, params={'pageSize': 200})
    if r.status_code != 200:
        return None, f'HTTP {r.status_code} {r.text[:200]}'
    return r.json().get(endpoint, []), None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--property', default=DEFAULT_PROPERTY)
    ap.add_argument('--apply', action='store_true', help='實際寫入（預設只檢查）')
    ap.add_argument('--disable-stale', action='store_true',
                    help='一併取消 STALE_KEY_EVENTS 的關鍵事件標記（需搭配 --apply）')
    a = ap.parse_args()

    sess = session(readonly=not a.apply)
    mode = '寫入模式' if a.apply else '檢查模式（不寫入，加 --apply 才會動）'
    print(f'GA4 資源 {a.property}｜{mode}\n')

    # ── 自訂維度 ────────────────────────────────────────────────
    dims, err = get_all(sess, a.property, 'customDimensions')
    if err:
        sys.exit(f'讀取自訂維度失敗：{err}')
    have = {d['parameterName'] for d in dims}
    print(f'{"=" * 64}\n自訂維度（現有 {len(dims)} 個，事件範圍上限 50）\n{"=" * 64}')
    for d in dims:
        print(f"  已有  {d['parameterName']:16s} {d.get('displayName')}")

    for w in WANT_DIMENSIONS:
        name = w['parameterName']
        if name in have:
            print(f'  跳過  {name:16s} 已存在')
            continue
        if not a.apply:
            print(f'  待建  {name:16s} {w["displayName"]}')
            continue
        r = sess.post(BASE.format(a.property) + '/customDimensions', json=w)
        if r.status_code == 200:
            print(f'  ✅建立 {name:16s} {w["displayName"]}')
        else:
            print(f'  ❌失敗 {name:16s} HTTP {r.status_code} {r.text[:160]}')

    # ── 關鍵事件 ────────────────────────────────────────────────
    kes, err = get_all(sess, a.property, 'keyEvents')
    if err:
        sys.exit(f'讀取關鍵事件失敗：{err}')
    have_ke = {k['eventName'] for k in kes}
    print(f'\n{"=" * 64}\n關鍵事件（轉換）\n{"=" * 64}')
    for k in kes:
        flag = '⚠️ 失效' if k['eventName'] in STALE_KEY_EVENTS else '已有  '
        print(f"  {flag} {k['eventName']:20s} {k.get('countingMethod','')}")

    for name, counting in WANT_KEY_EVENTS:
        if name in have_ke:
            print(f'  跳過   {name:20s} 已存在')
            continue
        if not a.apply:
            print(f'  待建   {name:20s} {counting}')
            continue
        r = sess.post(BASE.format(a.property) + '/keyEvents',
                      json={'eventName': name, 'countingMethod': counting})
        if r.status_code == 200:
            print(f'  ✅建立 {name:20s} {counting}')
        else:
            print(f'  ❌失敗 {name:20s} HTTP {r.status_code} {r.text[:160]}')

    stale = [k for k in kes if k['eventName'] in STALE_KEY_EVENTS]
    if stale and not (a.apply and a.disable_stale):
        print('\n  ⚠️ 下列關鍵事件現站已不再送出，建議停用（要動請加 --apply --disable-stale）：')
        for k in stale:
            print(f'       {k["eventName"]}  ({k["name"].rsplit("/", 1)[1]})')
    elif stale:
        # 取消關鍵事件標記。事件本身與已收集的歷史資料都保留，
        # 只是往後不再被算成轉換 —— 這正是「停用」要的效果。
        print('\n  取消失效關鍵事件的標記：')
        for k in stale:
            r = sess.delete('https://analyticsadmin.googleapis.com/v1beta/' + k['name'])
            if r.status_code in (200, 204):
                print(f'  ✅停用 {k["eventName"]:20s} ({k["name"].rsplit("/", 1)[1]})')
            else:
                print(f'  ❌失敗 {k["eventName"]:20s} HTTP {r.status_code} {r.text[:160]}')

    if not a.apply:
        print('\n以上為檢查結果。確認無誤後加 --apply 實際寫入。')


if __name__ == '__main__':
    main()
