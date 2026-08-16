# HANDOFF — 黃璽理財管理顧問 網站

> 交接與工作紀錄。下次啟動先讀「快速上手」段落即可無縫接軌。
> 最後更新：2026-08-08

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
- ⚠️ **開工/部署前務必先 `git fetch` 檢查 `origin/main`**（此 repo 有多條平行開發線；vercel deploy 用本地 tree 覆蓋線上、不看遠端。2026-07-10 曾因此把正式站蓋掉，見 WORKLOG）。
- ⚠️ **`git push` 到 GitHub main 會自動觸發 Vercel production 部署**（2026-07-14 實測發現，與上面「純手動 CLI 部署」的舊認知不同）。push 前確保本地 build 綠燈，否則會直接把壞版本推上線。
- ✅ **後台排程發文系統已合併上線**（2026-07-10，`scheduling-work` 以 additive 方式併入 main）：新文章走 Supabase `huangxi_articles` 表，草稿→排程→到點免部署自動上線（ISR revalidate=120 + `dynamicParams`）。後台入口 `/admin` →「文章排程 →」→ `/admin/articles`。目前 **47 篇在佇列：第一批 14 篇 07/11–07/26、第二批 16 篇 07/27–08/11、第三批 3 篇（07/31、08/12–08/13）、第四批 14 篇 08/18–08/31**（第四批依 2026-08-08 SERP 機會分數選題＝跳票叢集 5＋P1 補洞 4＋企業融資 3＋產業長尾 2，見 `docs/content-plan.md`；另 2 篇與既有靜態長文撞名已封存）。⚠️ 08/14–08/17 有 4 天斷稿（第三批排到 08/13 就沒了），下批請在前一批到期前先補。灌新稿：把 `Article` 形狀 JSON 放 `scripts/drafts/`（或另建目錄），跑 `node scripts/seed-articles.mjs [目錄]`（進 draft）→ 到 `/admin/articles` 排程（或直接 SQL 設 status/publish_at）。詳見架構段落。
- ✅ **AI 爬蟲/AEO 已就緒**（2026-07-24）：Cloudflare「受管理的 robots.txt」已關閉（它曾注入 Disallow 擋掉 Google-Extended/GPTBot 等，是 AI 抓取失敗主因）；新增 `/llms.txt`（全站索引）與 `/llms-full.txt`（已發布文章全文 Markdown），ISR 120 秒自動同步排程文章。觀測點：Cloudflare AI Crawl Control。
- 聯絡電話：**0982-691803**（2026-07-14 Jason 確認更正，全站 7 處 + 首頁 JSON-LD 已更新）。⚠️ 舊號 `0982-697803` 已作廢、勿再引入（2026-07-10 的記載相反，以本行為準）。

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

### 排程發文系統架構（2026-07-10 上線）
- **表**：`public.huangxi_articles`（欄位含 slug/title/h1/description/keywords/category/author/reading_minutes/excerpt/content(jsonb Block[])/updated_display/status(draft|scheduled|archived)/publish_at/sort_order）。
- **5 支 security definer RPC**：`huangxi_public_articles()`（前台，DB 端已過濾 status=scheduled 且 publish_at≤now）、`huangxi_list_articles(p_secret)`（後台全佇列）、`huangxi_upsert_article(p_secret,p_article)`（灌稿，預設 draft、on-conflict 只更新內容不動排程）、`huangxi_update_article_schedule(...)`、`huangxi_delete_article(...)`。
- **程式**：`src/lib/articles-db.ts`（DB 存取 + `rowToArticle`）、`src/lib/articles-source.ts`（合併「靜態 67 篇恆發布 + DB 佇列」，**靜態 slug 優先**、DB 掛掉降級只回靜態）。前台 `articles` 列表/內文/sitemap 皆 import `articles-source` 且 ISR revalidate=120；`/articles/[slug]` 另加 `dynamicParams=true`（到點 slug 首次造訪即時渲染、免部署）。
- **後台**：`/admin/articles`（佇列 UI：改狀態/排程時間/順序、立即發布、下架、刪除）。
- **後台預覽**（2026-07-10 加）：佇列每列的「預覽 →」連到 `/admin/articles/preview/[slug]`（`isAuthed` 守門、`force-dynamic`、noindex），用 `huangxi_list_articles` 讀**任何狀態**的 DB 列渲染，讓草稿/排程中文章上線前可先看。版面由 `src/app/articles/[slug]/ArticleView.tsx` 共用元件提供（公開頁與預覽頁共用；公開頁的 JSON-LD/metadata 仍留在 `page.tsx`）。`articles-db.ts` 的 `getDbRowBySlug` 供此頁取單列。
- **灌新稿流程**：`Article` 形狀 JSON 放 `scripts/drafts/*.json`（gitignore，不進 git）→ `node scripts/seed-articles.mjs`（讀 `.env.local`、驗證、撞靜態 slug 會擋、upsert 進 draft）→ 到 `/admin/articles` 設排程（可先按「預覽 →」看內容）。批次目錄可帶參數：`node scripts/seed-articles.mjs scripts/drafts-batch4`（batch3、batch4 有進 git，batch1/2 被 gitignore）。
- **`source` 區塊（2026-08-17 加）**：`{ type:'source', href, label, note? }` ＝法規／官方來源卡，外部連結新分頁開啟，用於深度法規文提高公信力（Jason 指示：深度型文章都要附官方法規連結）。seed 腳本會驗證必須是絕對網址。**寫入前務必 curl 驗證該 pcode／網址真的存在且內容相符**（票據法 pcode 是 `G0380028`，別猜）。
- ⚠️ 撞名規則：DB slug 與 67 篇靜態文撞名者，前台永遠不顯示（靜態優先）——灌稿前先確認 slug 不撞。

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
2. **內容產出**：靜態文章 67 篇 + DB 佇列 47 篇（第一～四批，排到 **2026-08-31**）。⚠️ **09/01 起無稿，下批請在 08/25 前備好**（2026-08-14~17 曾因此斷稿 4 天）。選題方法見 `docs/content-plan.md` 第四批段落（依 SERP 機會分數）。
   - ⚠️ **DB 排程文不支援 `faqs` 欄位**（`huangxi_articles` 無此欄、`rowToArticle` 未映射）→ 排程文沒有 FAQPage schema。要補需加欄位＋改 `huangxi_upsert_article` RPC＋改映射＋前台 JSON-LD。靜態 `articles.ts` 的文章則有。
   - 產文兩種方式：①（永久 SEO 骨幹）在 `src/lib/articles.ts` 的 `articles` 陣列加物件（企業融資設 `author: '理財顧問 張揚'`，支票不設=預設李誠信）→ build → deploy。②（排程/批次）走排程系統：JSON 放 `scripts/drafts/` → `seed-articles.mjs` → `/admin/articles` 排程，到點免部署自動上線。
3. **增流量（站外）**：Google 商家檔案（本地 SEO，CP 值最高）、GSC 提交/檢查 sitemap、Bing Webmaster + IndexNow、backlinks。多需使用者登入操作。
4. **後台密碼**：目前是自動產生的隨機密碼，使用者可要求改成好記的（改 Vercel + .env.local 的 `ADMIN_PASSWORD`）。
5. （可選）後台加篩選/匯出 CSV、Cloudflare AI 爬蟲封鎖規則等增強。
6. **SERP 排名優化（2026-08-08 盤點，依機會分數排序）**：
   - 排名現況：94 篇中 54 篇（57%）第 1 頁；商業大詞卡關（支票貼現 10.4 名/支票貸款 13.9/票貼 32.2/企業融資 35.0/企業貸款未進榜）。明細見 Downloads《黃璽理財_文章排名對照_20260808.xlsx》與 `docs/serp-reports/`。
   - ①（需 Jason 決策）執行《文章關鍵字佈局分析》分頁 3 的 **12 組兌現/貼現同類相殘合併＋301**——「支票貼現」推進第 1 頁的關鍵。
   - ② P0 帶 9 個 title/meta 改寫（票貼詐騙/即期票是什麼/票貼行情/申請支票要多久/禁背支票/兌現/支票兌現詐騙/票據種類/客票貼現）。
   - ③ 跳票樞紐頁叢集化（跳票家族 136 曝光卡 4–5 頁）；④ F 票信叢集 7 篇無曝光文逐篇 GSC 請求建立索引。
   - **~9/4 重新匯 GSC 跑 `python3 scripts/serp_score.py <zip> --save`**：自動對照上份快照列排名升降，驗證 canonical/301 成效。
   - ✅ 2026-08-17 已針對 ③（跳票叢集化）與 P1 striking distance 產出第四批 14 篇（08/18–08/31 排程中），效果請於 9 月的 GSC 快照驗證。
7. **舊文死連結清理**：部分已發布文章的 `related` 指向不存在的 slug（`/articles/zhi-piao-dui-xian`、`zhi-piao-tian-xie`、`zhi-piao-guo-qi`、`zhi-piao-dui-xian-shi-jian`），需修正或改指向正確文章。

### 已完成（原待辦）
- ✅ **後台排程發文系統合併上線**（2026-07-10，原 `scheduling-work` 分支）：14 篇排程文自動發文中。見上方架構段落。
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
