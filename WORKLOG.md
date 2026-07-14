# WORKLOG — 黃璽理財管理顧問 網站

> 逐次工作紀錄（日期 + 做了什麼 + 決策原因 + 未完成）。
> 目前狀態與待辦看 `docs/HANDOFF.md`；SEO 內容排程看 `docs/content-plan.md`。

---

## 2026-07-14

**聯絡電話更正**
- Jason 確認正確號碼為 **0982-691803**（07-10 記載的 0982-697803 反而是錯的，末三碼 7↔1 對調）。
- 全站 0982-697803 → 0982-691803：首頁 JSON-LD（`+886-982-691803`）、聯絡頁 ×3、FAQ、/zhi-piao-dui-xian、Footer 共 7 處。
- 同步更正 `docs/HANDOFF.md` 快速上手段落的號碼記載與警告方向。
- 部署 prod 並 curl 驗證：/contact ×8、首頁 JSON-LD ×2、/faq ×4 全為新號碼，線上無殘留舊號。

**新發現：GitHub push 會自動觸發 Vercel 部署**
- 部署清單出現兩筆 production（push 後一筆、CLI 一筆），證實 GitHub 整合已生效，與 HANDOFF 舊記載「純手動 CLI 部署」不符。已補進 HANDOFF 警告：push 前務必本地 build 綠燈。

---

## 2026-07-10

**聯絡電話更新**
- 全站電話 0981-109769 → **0982-697803**（首頁 schema、聯絡頁、FAQ、/zhi-piao-dui-xian、Footer 共 7 處）。已部署。

**⚠️ 平行開發事故與待合併工作（重要交接）**
- 本日有另一條開發線（此 main）與一條獨立 session 平行進行，起點都是 `b3e66f4`。
  獨立 session 因未先 `git fetch`，用 `vercel deploy` 反覆把較舊版本覆蓋上線，一度把本 main 的
  67 篇文章版本從正式站蓋掉；最後 `git reset --hard origin/main` + 重新部署救回，正式站已恢復完整。
- 教訓：**開工前、`vercel deploy --prod` 前，務必 `git fetch` 檢查 origin/main**（vercel 部署用本地 tree，不看遠端）。
- 該 session 的成果保存在分支 **`scheduling-work`**（未合併進 main），內含：
  1. **後台排程發文系統**：Supabase 新表 `huangxi_articles` + 5 支 security definer RPC、
     `src/lib/articles-db.ts`/`articles-source.ts`、文章頁/列表/sitemap 改 ISR、`/admin/articles` 佇列 UI、
     `scripts/seed-articles.mjs`。可讓新文章「先進後台草稿→排程→到點免部署自動上線」。
  2. 16 篇支票兌現/票據知識/票據風險管理長文（已灌進 `huangxi_articles`，排程 07/11–07/26）。
- **Supabase 現況**：`huangxi_articles` 表 + 16 篇排程草稿存在但**本 main 程式不讀取 → 休眠、線上不顯示、無害**。
  若要啟用排程功能，需把 `scheduling-work` 的排程系統合併進來（會與本線的文章/分類篩選/支票兌現內容重疊，需去重）。

**✅ 排程發文系統已合併上線（同日稍晚）**
- 決策：不用 `git merge`（兩分支從 `b3e66f4` 分岔後 main 已大幅前進到 67 篇 + AEO schema，scheduling-work 的 `articles.ts` 仍是舊 ~31 篇版，直接 merge 會在 articles.ts 產生數千行衝突並可能蓋掉 main 較新內容）。改用 **additive cherry-pick**：`git checkout scheduling-work -- <新檔>` 帶入排程系統（`articles-db.ts`/`articles-source.ts`/`admin/articles/*`/`seed-articles.mjs`/`drafts/README`），再手動把 main 版的 `articles/page`/`articles/[slug]`/`sitemap` 改 import `articles-source` 並加 ISR（revalidate=120，[slug] 加 `dynamicParams=true`）、`admin/page` 加「文章排程 →」入口。**完全不動** main 的 `articles.ts`、`contact/faq/page/Footer`（保留較新內容與正確電話）。
- 資料去重：16 篇 DB 草稿中 2 篇 slug 與既有靜態長文撞名（`zhi-piao-bei-shu`、`kong-tou-zhi-piao`）→ 設 `archived`；4 篇分類 `支票兌換` 正規化為 `支票兌現`（對齊列表頁 tab）。剩 **14 篇 07/11–07/26 自動發文中**。
- ⚠️ scheduling-work 帶了錯誤電話 `0982-691803`；合併時已排除（保留 main 的 `0982-697803`）。
- 驗證：本機 `npm run build` 綠燈（67 靜態 SSG + [slug] ISR 2m）；prod 部署 READY；暫時把 `piao-ju-zhong-lei` 改 publish_at 過去 → ~100s 後線上 200、列表落「票據知識」tab、在 sitemap、署名李誠信、Article/Breadcrumb JSON-LD 正常 → 復原回 07/11。首頁電話仍 `0982-697803` 未被污染。
- Commit `318937c`（+merge `883ec28`）已 push origin/main + `vercel deploy --prod`。

**✅ 後台文章預覽（同日再加）**
- 需求：排程佇列原本只有「已發布」列能預覽，草稿/排程中的點了會 404（前台 `huangxi_public_articles` 會過濾未到點者）。
- 作法：抽出 `src/app/articles/[slug]/ArticleView.tsx` 共用版面元件（公開頁與預覽頁共用；公開頁 JSON-LD/metadata 不變），新增 `/admin/articles/preview/[slug]`（`isAuthed` 守門、`force-dynamic`、noindex），用 `huangxi_list_articles` 讀任何狀態 DB 列渲染、頂部「預覽模式」橫幅；`articles-db.ts` 加 `getDbRowBySlug`；佇列每列都改成顯示「預覽 →」。
- 驗證：本機 build 綠燈；prod 預覽路由未登入 307→/admin/login、公開頁仍 200 且 Article JSON-LD/延伸閱讀完整。
- Commit `9bd5840`（+docs `4439827`）push origin/main + `vercel deploy --prod`（使用者當次授權部署）。

**未完成 / 待辦**
- Cloudflare API token `Huangxi_Email Routing Addresses` 待使用者後台刪除（安全衛生）。
- content-plan W5–W12 若有缺口可續補（現在可走排程系統批次上稿）。

---

## 2026-07-01

**建置與上線**
- 建 Vercel 專案 `tl-s`、Next.js 15.1→**16.2.9**（修 CVE-2025-66478）、部署上線。
- 綁自訂網域 **huangxi.tw**（+www），SSL 簽發。

**SEO 基礎**
- 修 sitemap/robots 的 placeholder→huangxi.tw、補 metadataBase/canonical。
- 舊站調查（Wayback）：舊為 WordPress 單頁站；後發現 Google 仍索引 /blogs 與英文 slug 文章 → `next.config.ts` 設 301（/blogs→/articles、票據融資文章→/zhi-piao-tie-xian）+ 友善 404。

**內容**
- 知識專欄 /articles + 文章頁（Article/Breadcrumb schema）。
- 文章總數 **15 篇**：支票主題 9 篇（作者 **李誠信**）+ 企業融資集群 6 篇（作者 **張揚**）。作者機制 `author` 欄位 + 顯示署名 + JSON-LD Person。
- 內容排程 `docs/content-plan.md`（含企業貸款/企業融資 Pillar-Cluster 策略、集群 G）。**W5–W12 尚未寫。**

**服務頁**
- 新增 **/qi-ye-dai-kuan**（企業貸款/企業融資 pillar），內含「手上有支票嗎？」交叉導流到支票兩頁；首頁服務區改 3 欄。
- 決策：企業貸款當 SEO 入口（大字流量）→ 導流到利潤較好的支票服務。

**功能**
- GA4 `G-XG4CMC7JYE`（含表單 generate_lead 事件）。
- 諮詢表單→Supabase（hb-erp / huangxi_consultations，RLS + security definer 函式）。
- 可登入後台 /admin（密碼登入、名單列表、狀態管理）。
- Email 通知：Resend，驗證 huangxi.tw 網域，`notify@huangxi.tw`→`jyuli780@gmail.com`，端對端測試通過。
- LINE 浮動按鈕（lin.ee/Qw6v7OD）+ 聯絡頁 LINE 卡。

**改名與資訊**
- 全站 泰誠企業融資 → **黃璽理財管理顧問**；修 nested 頁 title 重複品牌。
- 聯絡電話 **0981-109769**（移除市話）；公司地址 **高雄市新興區民權一路251號21樓**；公開信箱 **service@huangxi.tw**（使用者原寫 hungxi，確認為筆誤修正）。

**基礎設施：Cloudflare**
- DNS/代理由 GoDaddy 遷到 **Cloudflare**（NS owen/zelda；網域註冊仍在 GoDaddy）。網站記錄 Proxied、SSL Full(strict)。目的：觀測入站 AI 爬蟲（AI Audit）。完整記錄清單見 `docs/dns-cloudflare-migration.md`。
- **Cloudflare Email Routing**（用 CF API 設定，因後台自動加 DNS 失敗）：`service@huangxi.tw`→轉發到 `jyuli780@gmail.com`，測試收信成功。

**未完成 / 待辦**
- ⚠️ 使用者需**撤銷**本次用的兩組 Cloudflare API token（`cfut_`、`cfat_`）。
- 內容：W5–W12（約 8 篇）尚未寫。
- Google 商家檔案、GSC 提交/檢查、Bing/IndexNow（增流量）尚未做。
- 後台密碼仍為隨機產生（使用者可要求改好記的）。
