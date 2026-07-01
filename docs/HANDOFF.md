# HANDOFF — 黃璽理財管理顧問 網站

> 交接與工作紀錄。下次啟動先讀「快速上手」段落即可無縫接軌。
> 最後更新：2026-07-01

---

## ⚡ 快速上手（先讀這段）

- **專案**：`~/TL-s`，Next.js 16（App Router）+ Tailwind v4 + TypeScript
- **正式站**：https://huangxi.tw （+ www），品牌名「黃璽理財管理顧問」
- **部署指令**（在 repo 目錄）：
  ```
  vercel deploy --prod --yes --scope tjs-projects-435187fd
  ```
- **本機驗證**：`npm run build`（部署前務必先跑）
- **後台**：https://huangxi.tw/admin （單一密碼登入，密碼見 `.env.local` 的 `ADMIN_PASSWORD`）
- **每次改完流程**：`npm run build` → `git commit` → `vercel deploy --prod` → curl 驗證正式站

---

## 🏗️ 基礎設施

| 項目 | 內容 |
|------|------|
| 部署 | Vercel 專案 `tl-s`，team scope `tjs-projects-435187fd` |
| 網域 | huangxi.tw。**DNS/代理已遷到 Cloudflare**（2026-07-01，NS: owen/zelda.ns.cloudflare.com）；網域註冊仍在 GoDaddy。A `@`→76.76.21.21、CNAME `www`→cname.vercel-dns.com 皆 **Proxied（橘雲）**，SSL Full(strict)。詳見 `docs/dns-cloudflare-migration.md` |
| AI 爬蟲觀測 | Cloudflare 儀表板 → huangxi.tw → Analytics & Logs / AI Audit / Security→Bots（因流量已走 Cloudflare 代理才看得到） |
| 資料庫 | Supabase 專案 **hb-erp**（ref `hzegtnihbpweppxsrsck`, ap-southeast-2），表 `huangxi_consultations` |
| Email 通知（寄） | Resend（網域 huangxi.tw 已驗證）。寄 `notify@huangxi.tw` → 收 `jyuli780@gmail.com`。Resend 帳號註冊於 306465@gmail.com |
| Email 收信（轉發） | Cloudflare Email Routing：`service@huangxi.tw` → 轉發到 `jyuli780@gmail.com`（2026-07-01 以 Cloudflare API 設定；根網域 MX=route*.mx.cloudflare.net、SPF、DKIM cf2024-1）|
| 分析 | GA4 `G-XG4CMC7JYE` |
| LINE | 官方帳號加好友 `https://lin.ee/Qw6v7OD` |

### 資料庫細節（Supabase hb-erp，與其他 ERP 資料共用專案、以表名隔離）
- 表：`public.huangxi_consultations`（欄位 company/name/phone/service/amount/note/status/ip/user_agent/created_at）
- RLS：匿名只能 INSERT、不能 SELECT。
- 後台讀取/改狀態透過 security definer 函式 `huangxi_list_consultations(p_secret)` / `huangxi_update_status(p_secret,p_id,p_status)`，密鑰存 `huangxi_admin_config` 表。
- 可用 Supabase MCP 直接查（`execute_sql` project_id=hzegtnihbpweppxsrsck）。

### 環境變數（值存 Vercel production + 本機 `.env.local`，皆 gitignore）
`SUPABASE_URL` / `SUPABASE_ANON_KEY` / `HUANGXI_ADMIN_SECRET` / `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` / `NEXT_PUBLIC_GA_ID` / `RESEND_API_KEY` / `NOTIFY_EMAIL` / `NOTIFY_FROM`
> ⚠️ 不要把這些值寫進任何 git 追蹤的檔案。

---

## ✅ 已完成功能

- 網站上線、SSL、Next.js 16（升級修 CVE）
- 品牌名：黃璽理財管理顧問（全站；nested 頁 title 不再重複品牌）
- SEO：sitemap.ts（自動含文章）、robots.ts（擋 /admin /api）、metadataBase、canonical、JSON-LD（FinancialService / FAQPage / Article / Breadcrumb）
- 服務頁：/zhi-piao-tie-xian、/zhi-piao-dai-kuan、**/qi-ye-dai-kuan（企業貸款 pillar，交叉導流到支票兩頁）**
- 知識專欄 /articles + 文章頁（資料在 `src/lib/articles.ts`，目前 9 篇）
- GA4 串接（含表單送出 generate_lead 事件）
- 諮詢表單 → Supabase + Email 通知（Resend）
- 可登入後台 /admin（列表、狀態管理、登出）
- LINE 全站浮動按鈕（`src/components/FloatingLine.tsx`）+ 聯絡頁 LINE 卡
- 聯絡電話 0981-109769（已移除市話）
- 舊 WordPress 網址 301 轉址（`next.config.ts`：/blogs→/articles、票據融資文章→/zhi-piao-tie-xian）+ 友善 404

---

## 📌 待辦 / 下一步（未完成）

1. ⚠️ **使用者動作**：撤銷 2026-07-01 用來設 Email Routing 的兩組 Cloudflare API token（`cfut_`、`cfat_`）。撤銷不影響已設好的 Email Routing。
2. **內容產出**：已完成 15 篇（支票 9 + 企業融資集群 G 6）。**W5–W12（約 8 篇）尚未寫**。
   - 產文方式：在 `src/lib/articles.ts` 的 `articles` 陣列加物件（企業融資主題設 `author: '理財顧問 張揚'`，支票主題不設=預設李誠信）→ build → deploy → 把 content-plan 對應列 ⬜ 改 ✅。
3. **增流量（站外）**：Google 商家檔案（本地 SEO，CP 值最高）、GSC 提交/檢查 sitemap、Bing Webmaster + IndexNow、backlinks。多需使用者登入操作。
4. **後台密碼**：目前是自動產生的隨機密碼，使用者可要求改成好記的（改 Vercel + .env.local 的 `ADMIN_PASSWORD`）。
5. （可選）後台加篩選/匯出 CSV、Cloudflare AI 爬蟲封鎖規則等增強。

### 已完成（原待辦）
- ✅ 公開聯絡資訊：電話 0981-109769、地址 高雄市新興區民權一路251號21樓、信箱 service@huangxi.tw（全站 placeholder 已清）
- ✅ 企業融資集群 G 6 篇文章
- ✅ Email 收信：Cloudflare Email Routing service@huangxi.tw→jyuli780@gmail.com

---

## 🗒️ 工作紀錄（時間序，2026-07-01 當日）

1. 建立/連結 Vercel 專案 `tl-s`，升級 Next.js 15.1→16.2.9（修 CVE-2025-66478），部署上線。
2. 綁定自訂網域 huangxi.tw + www（GoDaddy A/CNAME），簽發 SSL。
3. 修 SEO：sitemap/robots 由 placeholder 改 huangxi.tw、補 metadataBase/canonical。
4. 建知識專欄 /articles + 文章頁（Article/Breadcrumb schema），初始 5 篇。
5. 內容排程 `docs/content-plan.md`（28 選題 + 12 週）。寫 W1–W4（共 9 篇），新增 related 內部連結區塊。
6. 串 GA4 `G-XG4CMC7JYE`。
7. 舊站調查（Wayback）：舊為 WordPress 單頁站，無重要舊頁；後續發現 Google 仍索引 /blogs 與英文 slug 文章 → 設 301。
8. 諮詢表單接 Supabase（hb-erp / huangxi_consultations，RLS + definer 函式）+ 建可登入後台 /admin。
9. Email 通知（Resend）：驗證 huangxi.tw 網域（DKIM/SPF/MX 加到 GoDaddy），端對端測試 delivered 到 jyuli780@gmail.com。
10. 網站改名 泰誠企業融資 → 黃璽理財管理顧問（全站）。
11. LINE 浮動按鈕 + 聯絡頁 LINE 卡；電話改 0981-109769、移除市話。
12. 新增 /qi-ye-dai-kuan（企業貸款 pillar）+ content-plan 加「企業貸款/企業融資」Pillar-Cluster SEO 策略與集群 G。
13. 修 nested 頁 title 重複品牌名。
