# HANDOFF — 黃璽理財管理顧問 網站

> 交接與工作紀錄。下次啟動先讀「快速上手」段落即可無縫接軌。
> 最後更新：2026-08-25

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
- ✅ **後台排程發文系統已合併上線**（2026-07-10，`scheduling-work` 以 additive 方式併入 main）：新文章走 Supabase `huangxi_articles` 表，草稿→排程→到點免部署自動上線（ISR revalidate=120 + `dynamicParams`）。後台入口 `/admin` →「文章排程 →」→ `/admin/articles`。目前 **62 篇 scheduled（35 已上線 + 27 待發）+ 2 篇 archived、draft 0**（2026-08-19 收工時直查 DB 實測）：第一批 14 篇 07/11–07/26、第二批 16 篇 07/27–08/11、第三批 3 篇（07/31、08/12–08/13）、第四批 14 篇 08/18–08/31、第五批 1 篇 09/01、**第六批 14 篇 09/02–09/15**。第四批依 2026-08-08 SERP 機會分數選題；第六批依 2026-08-19 GSC query×page 對照選題（拆承接過載頁＋填真空白，見 `docs/content-plan.md`）；另 2 篇與既有靜態長文撞名已封存。⚠️ **08/20–09/15 連續每日一篇、零斷稿；09/16 起無稿**，第七批請在 09/10 前備好。⚠️ **查佇列別只信文件，直接查 DB**：Supabase MCP 常回 `permission denied`，改用 `huangxi_list_articles` RPC 直查（`.env.local` 取 `SUPABASE_URL`/`SUPABASE_ANON_KEY`/`HUANGXI_ADMIN_SECRET`，curl POST 即可）。灌新稿：把 `Article` 形狀 JSON 放 `scripts/drafts/`（或另建目錄），跑 `node scripts/seed-articles.mjs [目錄]`（進 draft）→ 到 `/admin/articles` 排程（或直接 SQL 設 status/publish_at）。詳見架構段落。
- ⚠️ **`src/app/sitemap.xml/route.ts` 必須是 `export const dynamic = 'force-dynamic'`，不可改回 `revalidate`**（2026-08-25 修，commit `5792c7b`）。`sitemap.xml` 是 Next 的保留 metadata 路由名稱，即使寫成 route handler 也會被當**靜態檔**輸出（build 表格顯示 `○`），ISR 完全不生效、函式從來不會被執行——2026-08-19～24 期間線上 sitemap 就這樣凍結在 102 篇，5 篇已上線文章進不了索引。**判別方法：`curl -sI https://huangxi.tw/sitemap.xml` 看 `age` 會不會歸零、`x-vercel-id` 有沒有 origin 區域**（正常＝`age: 0`、每次 MISS、`sin1::iad1::`；壞掉＝age 只增不減、只有 `sin1::`）。對照組 `/llms.txt`、`/llms-full.txt` 不是保留名稱，`revalidate = 120` 一直正常，**不用跟著改**。
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
| 分析 | GA4 `G-XG4CMC7JYE`（資源 ID `372168473`，帳號 `153975104`，名稱「黃璽理財支票貼 - GA4」，時區 Asia/Taipei）|
| GA4／GSC 程式化讀取 | **服務帳戶 `ga4-reader@huangxi-analytics.iam.gserviceaccount.com`**（GCP 專案 `huangxi-analytics` / `165422715325`，2026-08-19 建）。金鑰在 **`~/.config/ga4/ga4-reader.json`（repo 外、chmod 600，切勿移入 repo——會被 vercel deploy 一起上傳）**。已啟用 Analytics Data API 與 Search Console API，並分別在 GA4 加為「檢視者」、在 GSC 加為使用者。GSC 可存取 3 個資源：`sc-domain:huangxi.tw`、`sc-domain:huibang.com.tw`、`sc-domain:yuhobeef.com.tw`。只依賴本機已裝的 `google-auth`，免裝新套件。⚠️ Supermetrics MCP 也接了 GA4，但**團隊試用 2026-06-08 已到期**，查詢一律回 `TRIAL_EXPIRED`，別再繞那條路。|
| 報表工具（`scripts/`）| `ga4_report.py`（GA4，**預設只算台灣**，濾掉機器人；`--days` / `--country all` / `--property <id>` 可換 48 個客戶資源）、`gsc_report.py`（GSC；`--compare` 期間比較、`--striking` 選題機會、`--list` 列資源）、`apply_meta.py`（批次改 DB 文的 title/description，會自動回讀比對防漏欄位）。|
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
- **轉換層改版（2026-08-19，commit `6aa6e47`）**：主 CTA 由「免費諮詢→表單」改為「**免費查票信**→LINE」。
  - 共用元件 `src/components/LineCta.tsx`：`LineCtaBlock`（完整 CTA 區塊）／`LineLink`（有埋點的 LINE 連結）。
  - 套用處：文章頁文末（`ArticleView.tsx`，全站主要落地點）、費率試算頁**結果區＋底部**、聯絡頁 LINE 卡、全站浮動按鈕（`FloatingLine.tsx`，文案改「免費查票信」且手機版補上文字）。
  - ⚠️ **文案集中在 `src/lib/site.ts` 的 4 個常數**（`LINE_CTA_LABEL` / `_HEADLINE` / `_BODY` / `_ASSURANCE`），要換誘因改這裡即可全站同步，不用動元件。
  - **GA4 事件 `line_add_click`**，以 `cta_location` 區分 5 個入口：`floating` / `article_end` / `calculator_result` / `calculator_bottom` / `contact_card`。
  - 誘因法源：票交所 FAQ 壹-Q7「查詢票據信用資料得免提示證件及公司大小章」＝查他人票信免對方同意；壹-Q2 第 3 點可用「付款行磁字代號＋帳號」查詢，兩者印在票面上 → **客戶只要在 LINE 傳一張支票照片就能受理**。
- **CTA 依主題切換＋文中補位＋曝光埋點（2026-09-06）**：起因是 GA4 盤點發現 8/19 改版後 837 sessions 只有 4 次 `line_add_click`（0.48%）。診斷出兩個結構問題：①全站只有一個誘因「免費查票信」，但流量第一的 `zhi-piao-xie-cuo`（佔 31%）讀者是**開票的人在修填寫錯誤**，不是收票的人擔心跳票；②CTA 只在文末，而平均停留 2 分 10 秒、文章多 6 分鐘以上，多數人根本沒捲到。
  - **4 種誘因**在 `src/lib/cta-offers.ts`：`piao-xin`（查票信／風險）｜`tie-xian`（試算實拿金額／等錢，**預設**）｜`tian-xie`（幫你看這張票／填寫疑難）｜`zhou-zhuan`（評估可調額度／企業融資）。⚠️ 四種**履行方式完全相同**（LINE 傳一張支票照片、回答一個問題），不是四種新服務。
  - **自動分派**：`ctaVariantFor()` 依 slug／關鍵字判定，靜態與 DB 排程文共用，**不需要新增資料庫欄位、新文章不必手動指定**。129 篇實測分派：tie-xian 64／zhou-zhuan 36／piao-xin 20／tian-xie 9。
  - ⚠️ **比對是兩段式：先跑完所有規則的 slug，再跑中文詞。** 因為中文詞會打在 keywords 上誤傷——單段式時「託收」把 `zhi-piao-ru-zhang-shi-jian`、`zhi-piao-dui-xian-shou-xu-fei`（流量第 2、3 名）判成填寫疑難。同理不要把 `feng-xian`／「風險」放進 piao-xin，會掃到 `zhi-piao-tie-xian-feng-xian`。改規則後務必重跑全站分派再上線。
  - **文中 CTA**（`InlineLineCta`，`cta_location=article_inline`）：`inlineCtaIndex()` 取文章 50% 處、往前後找最近的 `h2` 插入（落在章節縫隙不切斷段落），前一塊是卡片就跳過避免堆疊；content 少於 10 塊不插。
  - **浮動鈕**改成文章頁吃 variant（`floating_article`）。做法是 `FloatingLine` 排除 `/articles/<slug>`、改由 `ArticleView` 渲染 `FloatingLineButton variant=` —— **這樣是 server render，載入後不會閃一下換字**；別改成用 client store 事後設定。
  - **新增 GA4 事件 `cta_view`**（IntersectionObserver，threshold 0.5，每次載入每個 CTA 只送一次）。有曝光才能算 view→click，才分得出「沒人看到」（改位置）還是「看到不想點」（改文案）——兩者解法相反。`line_add_click` 與 `cta_view` 都帶 `cta_location` + `cta_variant`。
  - ⚠️⚠️ **待 Jason 手動操作（沒做的話上面的量測全部看不到）**：GA4 →「管理」→「自訂定義」→「建立自訂維度」建兩個，範圍皆為「事件」：`cta_location`（CTA 位置）、`cta_variant`（CTA 誘因）。**只對往後的資料生效、不回溯。** `scripts/ga4_report.py` 已改成會偵測並提示，建好後同一支腳本就會自動列出分入口／分誘因的曝光與點擊。
- **GA4 設定補齊（2026-09-06，`scripts/ga4_setup.py`）**：用 Analytics Admin API 建立，非手點。
  - ✅ 自訂維度 `cta_location`（CTA 位置）、`cta_variant`（CTA 誘因），範圍皆為事件。
  - ✅ 關鍵事件 `line_add_click`（ONCE_PER_SESSION，同次造訪重複點只算一次）、`generate_lead`（ONCE_PER_EVENT）。
  - ⚠️ **盤查發現原本的關鍵事件只有 `jf___送出諮詢`（舊 WordPress 表單外掛，現站根本不送這個事件）與 `purchase`（電商預設，本站無電商）→ 轉換數恆為 0，而且一直在量一個不存在的事件。** `jf___送出諮詢`（id 5121852488）**尚未停用**，待 Jason 決定；留著會讓關鍵事件清單持續誤導。
  - ⚠️ **`ga4-reader@huangxi-analytics.iam.gserviceaccount.com` 已由「檢視者」升為「編輯者」**（跑寫入必須）。若只是為這次開的，做完可降回檢視者——降回後 `ga4_setup.py --apply` 會全部 403，但 `ga4_report.py` 與所有 GET 不受影響。**這把金鑰現在能改也能刪 GA4 設定，名字叫 reader 會誤導。**
  - `ga4_setup.py` 預設 dry-run，`--apply` 才寫入；重跑安全（已存在會跳過）。
- **費率試算搬進文章 + 手機閱讀成本修正（2026-09-06）**：起因是 GA4 全站盤查，見下方〈2026-09-06 GA4 盤查結論〉。
  - `DiscountCalculator`（`compact` 內嵌版／頁面版共用同一份公式，`/fei-lv-ji-suan` 已改用它）。`shouldEmbedCalculator()` 命中 **28 篇**（主題須為 `tie-xian` 且該篇本來就在談錢／票期）；外幣支票排除（台幣試算套不上）。新增事件 **`calculator_result`**（真的算出數字＝意圖最高的訊號，只送一次）。
  - **手機專屬早期 CTA**（`article_top_mobile`，緊接快速摘要之後，`md:hidden`）。理由：手機平均參與僅 22 秒＝約看完摘要就走，而文中 CTA 在 50% 處是手機第 8 屏。第一個可見 CTA 由第 6.3 屏提前到 **第 1 屏**。
  - **手機排版**：內文行高 2.0 → 1.8（`md:` 以上維持 2.0）、hero `py-14` → `py-8`。hero 佔第一屏 63% → 54%。
  - ⚠️ **桌機刻意完全不動**（參與率 61%、平均 71 秒，表現本來就好）。所有調整都掛 `md:` 斷點，改動前請先確認桌機數據仍健康再考慮動它。
  - 文中 CTA／試算表進畫面時，**手機**的浮動鈕會淡出讓路（`useReportVisibility` + `useAnyInlineCtaVisible`，在 `LineCta.tsx`）——否則兩顆同色同字的 LINE 按鈕會並排重疊。

- **2026-09-06 GA4 盤查結論（做任何轉換決策前先讀這段）**
  - **這個網站實質上是 68 個各自為政的落地頁，不是一個網站。** 全站 1,158 pageviews 中，非文章頁只佔 **19（1.6%）**：三個服務頁合計 5 PV、`/contact` **0**、`/fei-lv-ji-suan` **0**。**頁/次 = 1.05**。
  - ⚠️ **推論：任何「二段式導流」策略都是死的**（用內鏈把讀者導去服務頁或其他文章再轉換）。內鏈實際點擊率趨近於零，吞吐量約 1%。**轉換必須在落地頁當場完成。**
  - ⚠️ 表單 0 送出**不是表單設計的問題**，是沒有人到得了 `/contact`。改必填欄位不會有幫助。
  - 客群非常精準：週一～五 194–220 sessions、週六日 55–70；尖峰 9–17 時（最高 15 時）。＝上班時間、在辦公室、手上正拿著一張有問題的支票的人。
  - 流量 W32 139 → W36 377（五週約三倍），但參與率 W34 62% → W36 50%——長尾擴張帶進來的意圖漸薄，**看參與率比看造訪數誠實**。
  - `(not set)` 到達頁 87 sessions／參與率 2.3%／0 PV ＝機器人殘留。**算轉換率請用 ~1,087 當分母，不是 1,174。**
  - 效能不是問題：正式站在 4x CPU 降速 + Fast 3G 下 TTFB 274ms、FCP 1.36s、185KB。
  - 📅 **一個月後（約 2026-10-06）回頭看 `頁/次` 有沒有離開 1.05。若仍是 1.05，就別再投資任何內鏈／導流策略，全部資源押單頁轉換。**
- GoogleAnalytics 排除 `/admin`（2026-08-19）：後台操作不是網站流量。`FloatingLine` 早就排除了，GA 漏掉。
- **title/meta 改寫 10 篇（2026-08-19，commit `72525fd`）**：標的＝GSC「排名已在第 1 頁但 CTR=0」約 500 曝光。靜態 3 篇（title+h1+description）＋DB 7 篇（走 `apply_meta.py`）。改寫理由與當時的曝光基準存 `scripts/title-rewrites-2026-08-19.json`，一個月後用 `gsc_report.py --days 28 --compare` 對照驗收。⚠️ Google 重抓標題需 1–3 週且可能自行改寫，短期沒變化屬正常，**不要來回改**。
- 聯絡電話 0981-109769（已移除市話）
- 舊 WordPress 網址 301 轉址（`next.config.ts`：/blogs→/articles、票據融資文章→/zhi-piao-tie-xian）+ 友善 404

---

## 📌 待辦 / 下一步（未完成）

1. ⚠️ **使用者動作**：撤銷 2026-07-01 用來設 Email Routing 的兩組 Cloudflare API token（`cfut_`、`cfat_`）。撤銷不影響已設好的 Email Routing。
2. **內容產出**：靜態文章 67 篇 + DB 佇列 62 篇（第一～六批，排到 **2026-09-15**）。⚠️ **09/16 起無稿，第七批請在 09/10 前備好**（2026-08-14~17 曾因此斷稿 4 天）。
   - **選題一律用數據，別憑印象。** 現在有兩條路：①`python3 scripts/gsc_report.py --striking`（即時、免匯檔，推薦）；②`python3 scripts/serp_score.py <GSC zip> --save`（可對照上份快照的排名升降）。
   - ⚠️ **選題前務必先看「一個查詢由哪一頁承接」**，否則會寫出相殘的文章。2026-08-19 就發現 `piao-xin-cha-xun` 一頁扛 44 個查詢／628 曝光、`zhi-piao-ru-zhang-shi-jian` 扛 68 個查詢／327 曝光——這種頁面該「拆衛星文分擔」，而不是再寫同主題的文章去搶。查法：GSC API 用 `dimensions:['query','page']`。選題方法見 `docs/content-plan.md` 第四批段落（依 SERP 機會分數）。
   - ⚠️ **DB 排程文不支援 `faqs` 欄位**（`huangxi_articles` 無此欄、`rowToArticle` 未映射）→ 排程文沒有 FAQPage schema。要補需加欄位＋改 `huangxi_upsert_article` RPC＋改映射＋前台 JSON-LD。靜態 `articles.ts` 的文章則有。
   - 產文兩種方式：①（永久 SEO 骨幹）在 `src/lib/articles.ts` 的 `articles` 陣列加物件（企業融資設 `author: '理財顧問 張揚'`，支票不設=預設李誠信）→ build → deploy。②（排程/批次）走排程系統：JSON 放 `scripts/drafts/` → `seed-articles.mjs` → `/admin/articles` 排程，到點免部署自動上線。
3. **增流量（站外）**：Google 商家檔案（本地 SEO，CP 值最高）、Bing Webmaster + IndexNow、backlinks。多需使用者登入操作。（✅ GSC sitemap 提交／檢查已於 2026-08-25 完成，見下方 GSC 段落）
4. **後台密碼**：目前是自動產生的隨機密碼，使用者可要求改成好記的（改 Vercel + .env.local 的 `ADMIN_PASSWORD`）。
5. （可選）後台加篩選/匯出 CSV、Cloudflare AI 爬蟲封鎖規則等增強。
6. **SERP 排名優化（2026-08-08 盤點，依機會分數排序）**：
   - 排名現況：94 篇中 54 篇（57%）第 1 頁；商業大詞卡關（支票貼現 10.4 名/支票貸款 13.9/票貼 32.2/企業融資 35.0/企業貸款未進榜）。明細見 Downloads《黃璽理財_文章排名對照_20260808.xlsx》與 `docs/serp-reports/`。
   - ①（需 Jason 決策）執行《文章關鍵字佈局分析》分頁 3 的 **12 組兌現/貼現同類相殘合併＋301**——「支票貼現」推進第 1 頁的關鍵。
   - ② P0 帶 9 個 title/meta 改寫（票貼詐騙/即期票是什麼/票貼行情/申請支票要多久/禁背支票/兌現/支票兌現詐騙/票據種類/客票貼現）。
   - ③ 跳票樞紐頁叢集化（跳票家族 136 曝光卡 4–5 頁）；④ F 票信叢集 7 篇無曝光文逐篇 GSC 請求建立索引。
   - **~9/4 重新匯 GSC 跑 `python3 scripts/serp_score.py <zip> --save`**：自動對照上份快照列排名升降，驗證 canonical/301 成效。
   - ✅ 2026-08-17 已針對 ③（跳票叢集化）與 P1 striking distance 產出第四批 14 篇（08/18–08/31 排程中），效果請於 9 月的 GSC 快照驗證。
7. ✅ **舊文死連結清理（2026-08-25 完成，commit `870a5bd`）**：4 條 `related` 死連結已改指向正確文章（`zhi-piao-dui-xian`→`zhi-piao-dui-xian-liu-cheng`、`zhi-piao-tian-xie`→`zhi-piao-zen-me-xie`、`zhi-piao-guo-qi`→`zhi-piao-ti-shi-qi-xian`、`zhi-piao-dui-xian-shi-jian`→`zhi-piao-ru-zhang-shi-jian`），涉及 7 篇 DB 排程文。
   - ⚠️⚠️ **修 DB 文的內容時，絕對不要直接跑 `seed-articles.mjs` 重灌。** `scripts/drafts/` 的本地 JSON 是舊快照，會把 `apply_meta.py` 事後改寫的 title/description 蓋回去（`piao-qi-ji-suan` 就是這種情況）。正確作法：**`huangxi_list_articles` 讀 DB 現值 → 只改要動的欄位 → `huangxi_upsert_article` 寫回**，事後再把 DB 值同步回本地 JSON。
   - ⚠️ **通則：`related` 不要指向「未來排程文」**，Google 提早爬到會記成 404（`hua-xian-zhi-piao` 就這樣被記了一筆）。選內鏈標的前先確認發布日已到。

8. **GSC 索引狀態（2026-08-24~25 用 URL Inspection API 全站盤查 218 個網址）**
   - **結論：「未建立索引」數字高但 95% 正常。** sitemap 內 114 個有 **113 個已建立索引**。「未建立索引」94 個全在 sitemap 之外＝舊 WordPress 殘影：67 個是 8/07 上 301 前的過期 404 記錄（現況全 308）、16 個已正確標示為轉址、11 個是 `www.` 重複頁（canonical 正確）。
   - ✅ **sitemap 已用 API 重新提交**（`lastDownloaded` 2026-08-22→**2026-08-25T02:44:41Z**，`submitted` 114→**120**，errors/warnings 皆 0）。⚠️ `gsc_report.py` 的 `webmasters.readonly` scope 寫入會 403，要換 `https://www.googleapis.com/auth/webmasters`（同一把金鑰）。
   - ✅ Jason 已於 2026-08-25 在 GSC 後台手動完成：①`/articles/hua-xian-zhi-piao` 要求建立索引；②「索引→網頁→找不到網頁 (404)」按驗證修正。驗證程序跑幾天到兩週。
   - ❌ **「要求建立索引」與「驗證修正」沒有 API**（查過 discovery 文件，全部方法只有 `sites.*`／`sitemaps.*`／`urlInspection.index.inspect`／`urlTestingTools.mobileFriendlyTest.run`／`searchanalytics.query`），只能手點。
   - ❌ **Indexing API 別走**：GCP 專案 `165422715325` 未啟用，且 Google 官方限定只能用於 JobPosting／BroadcastEvent，推一般文章頁違反使用條款。
   - 📅 **約 2026-09-08 回頭驗收**：`gsc_report.py --days 28 --compare`，那 94 個應大幅下降，且 8/20 之後的文章要開始有曝光（驗證 sitemap 解凍生效）。

9. ✅ **robots.txt 不再對 Googlebot 封鎖 `/_next/`（2026-08-25 修，commit `95d532a`）**：GSC「遭到 robots.txt 封鎖」的來源就是 `/_next/static/chunks/*.js`，且同一支 chunk 每次部署會帶新的 `?dpl=` 部署 ID → 網址數量只增不減。`/_next/` 是全站 CSS／JS，Google 官方明講不要擋。
   - ⚠️ **`src/app/robots.ts` 的 `'*'` 群組只能擋 `/admin`、`/api`，不要再把 `/_next/` 加回去。** 9 個具名 AI 爬蟲群組維持擋 `/_next/`（robots.txt 只套用最相符的那一組，不受 `'*'` 影響）。
   - ⚠️ 副作用正常：這批網址會移到「已檢索 - 目前尚未建立索引」，JS 檔本來就不該被當網頁索引，**別再去修**。
   - ❌ **不是 Cloudflare**（Jason 問過，四個角度排除）：CF 送的 robots.txt 與 `robots.ts` 產出逐字相符、Googlebot UA 抓全站資源皆 200、無 `cf-mitigated` 標頭、Google 自己的記錄是 `pageFetchState: SUCCESSFUL`。**推理捷徑：GSC 的「遭到 robots.txt 封鎖」依定義只可能來自 robots.txt**，CF 擋的話會歸到「禁止存取 (403)」或「伺服器錯誤 (5xx)」，是不同桶子。
   - 📌 **改 robots.txt 後最慢隔天才反映到 GSC**：Cloudflare 快取 4 小時（`max-age=14400`）＋ Google 自己快取約 24 小時。**別以為沒生效就重複改。**
   - 🔜 **進行中（2026-08-25 起）**：Jason 已按「設定 → robots.txt →要求重新檢索」。**正確順序不能跳**＝要求重新檢索 →「**測試線上網址**」確認解封 → 才按「驗證修正」（robots.txt 更新前按驗證必定失敗，且冷卻更久）。
     - ⚠️ **別用 URL Inspection 的 `robotsTxtState` 判斷有沒有修好**：那顯示的是「上次檢索時」的狀態，重抓 robots.txt 與重抓 chunk 是兩件分開排程的事，會誤判成沒生效。**唯一即時驗證點是「測試線上網址」**（當場抓、當場套最新 robots.txt）。
     - ⚠️ 測試要用 `14mrh2-p_w84d.js` 那支；`28a9z-me7gs4j.js?dpl=dpl_GiwdMa88...` 實體檔案**已 404**（舊部署被 Vercel 回收），拿它測會混淆。
     - **驗收標準不是歸零**，而是「不再隨每次部署往上長」。
   - 📌 GSC robots.txt 報表的 **line 43 警告 = `Host: https://huangxi.tw`**（來源 `robots.ts` 的 `host: SITE_URL`）。`Host` 是 Yandex 專用指令、Google 不支援，故標「略過的規則」。**無害**（主網域已靠 www→301 ＋ canonical 指定）。Jason 未決定是否移除，先留著，下次有其他改動再順手帶。

10. **`/articles?page=N` 分頁 canonical（低優先）**：8 個分頁被 Google 索引，我們的 `userCanonical` 指向 `/articles` 但 `googleCanonical` 是分頁自己＝**Google 忽略了我們的 canonical**。Google 官方對分頁的建議本來就是 self-canonical，現在的寫法逆著來。影響小。

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
