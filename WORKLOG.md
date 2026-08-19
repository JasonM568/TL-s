# WORKLOG — 黃璽理財管理顧問 網站

> 逐次工作紀錄（日期 + 做了什麼 + 決策原因 + 未完成）。
> 目前狀態與待辦看 `docs/HANDOFF.md`；SEO 內容排程看 `docs/content-plan.md`。

---

## 2026-08-19

**起點：Jason 問「網站上線 45 天，LINE 官方帳號人數都沒成長」**

**先查真相：表單轉換是 0，不是「少」**
- 用 `huangxi_list_consultations` RPC 直查 Supabase（MCP 一樣回 `permission denied`，改 curl）：**總筆數 1**，2026-07-01、公司名「惠邦創意整合行銷有限公司」＝Jason 自己上線那天的測試。**49 天真實表單詢問 0 筆。**
- 讀 code 找轉換斷點：全站 CTA（首頁 hero／首頁頁尾／Header／`ArticleView` 文末／費率試算頁）**無一例外全部 `href="/contact"`**，而表單要填公司名＋聯絡人＋電話＋金額。文章頁是主要落地點，模板裡**一個 LINE 連結都沒有**。`FloatingLine` 是純 `<a>`、**零埋點**，所以「沒成長」根本分不出是沒人點還是點了沒加成。

**打通 GA4 程式化讀取（過程有兩條死路，記下來免得重踩）**
- ❌ Supabase MCP → `permission denied`。❌ Vercel Web Analytics → 專案沒裝 `@vercel/analytics`，`404 Web Analytics not found`。
- ❌ **Supermetrics MCP**：GA4 連接器 OAuth 授權成功，但一送查詢就 `[TRIAL_EXPIRED]`（Team 306465 試用 2026-06-08 到期）。**別再走這條。**
- ✅ 最後走 **GA4 Data API + 服務帳戶**：GCP 專案 `huangxi-analytics`、服務帳戶 `ga4-reader@...`、金鑰放 `~/.config/ga4/ga4-reader.json`（**repo 外 + chmod 600**，因為 `.gitignore` 只擋 `.env*` 擋不住 `.json`，放進 repo 會被 `vercel deploy` 一起上傳）。本機已有 `google-auth`，直打 REST 免裝套件。

**GA4 診斷結論：direct 過高 = 中國機器人，不是我原本猜的後台流量**
- 全期（07/01–08/19）：工作階段 2,025／使用者 1,876／瀏覽量 2,115。**瀏覽量÷工作階段 = 1.04**，這個比例本身就是機器人的簽名。
- 拆國家後決定性證據：**China/Direct 1,193 場、平均停留 1.15 秒、跳出 97.2%**；US/Direct 112 場**停留 0.30 秒**；Vietnam 26 場**停留 0 秒**。合計 1,342，佔全部 direct（1,384）的 **97%**。城市層級更露骨：蘇州 195 場停留 **0.06 秒**、惠州／佛山 **0 秒**。
- ⚠️ **我一開始的頭號假設是錯的**：猜 `/admin` 被計入污染數據，實查只有 **19 次瀏覽、14 場**，完全不構成影響。（排除還是做了，屬衛生問題。）**教訓：先量再改，不要憑 code review 推論流量成因。**
- **真實流量比原本從 GSC 推估的好**：台灣自然搜尋 **585 場／467 個不重複使用者／平均停留 188 秒／跳出率 47%**，約每天 13 個真人（先前只看 GSC 推估 7/天，因為 GSC 只算 Google，漏了 Yahoo 30＋Bing 29＋search.google.com 31）。
- **所以問題定位＝純轉換層**：467 個真人平均讀了 3 分鐘，然後沒有任何理由留下來。內容與流量都沒問題。
- Jason 決策：**不擋中國爬蟲**（不動 Cloudflare）。→ 代價是報表層必須自己濾，**之後看 GA4 一律加「國家 = 台灣」比較條件**，否則轉換率會被算成十分之一。

**改版：把「免費諮詢」換成「免費查票信」（commit `6aa6e47`，已部署驗收）**
- 選這個 hook 的理由：①客戶付出的是「一張照片」不是「電話號碼」；②需求是當下的（怕票跳）而非「等我缺錢」；③交付必須經過人 → 天然開啟一對一對話；④自帶篩選——會來查票信的就是手上真的有票的人。
- **法源先查證再寫**（延續 08/17 的教訓）：curl 票交所官網確認 `inqService05` 壹-Q7「查詢票據信用資料得免提示證件及公司大小章」＝**查他人票信不需對方同意**；壹-Q2 第 3 點允許用「發票人的支票存款往來金融業者名稱（磁字代號）及帳號」查詢，而**這兩項就印在支票票面上** → 傳照片即可受理，不必問負責人身分證字號（一問就嚇跑人）。另 `inqService01` 官方把「融資公司」與「一般持票人收受票據」列為適用對象，寫落地頁文案可直接引用。
- ⚠️ 文案有承諾成本：`LINE_CTA_*` 四個常數集中在 `src/lib/site.ts`，票交所查詢卡若還沒買，改一行就能全站切回保守版本。
- **不做全自動**（Jason 問過能不能 LINE 收圖→OCR→自動查）：票交所只有書面／網路查詢卡／語音三條管道，**沒有 API**；官方的自動化路徑是 Q11 客製化簽約與 Q13 批次查詢，繞過去寫爬蟲不可行也不該做。且全自動會殺掉這個 hook——產品是「顧問判讀」那一行，不是數字。結論：Phase 0 純人工（每天 <3 件根本不需要系統）。

**同批修掉的三件**
- GA4 埋點：`line_add_click` + `cta_location` 五個入口。⚠️ **驗收時特別確認 server component 傳入的 prop**（`article_end`／`contact_card`）確實進了 RSC payload——它們不會出現在 client chunk 裡，只 grep bundle 會誤判成沒埋到。
- 補 2 條漏掉的 301（GA4 實測仍在收流量但實際 404）：`/can-invoice-factoring-improve-your-smes-finances` → 應收帳款融資文；`/success_case/:slug*` → `/zhi-piao-tie-xian`（用萬用比對涵蓋整個舊 WP 自訂型態，不只那一頁）。
- `GoogleAnalytics.tsx` 改 client component 並排除 `/admin`。

**驗收**（本機 build 綠燈 → push 觸發自動部署 → 正式站逐項 curl）
- 四處 CTA 文案命中、`article_end`／`contact_card` 在 RSC payload、3 條轉址皆 308 到正確目標、`/admin/login` 的 gtag 數 = 0 而首頁 = 1。
- ⚠️ 測試時發現 **port 3000 被其他程序佔用**（非本次啟動），改用 3100，沒有動別人的程序。

**打通 GSC 程式化讀取（同一組服務帳戶）**
- 啟用 Search Console API ＋ 在 GSC 加 `ga4-reader@...` 為使用者後即通。可存取 **3 個資源**：`sc-domain:huangxi.tw`、`sc-domain:huibang.com.tw`、`sc-domain:yuhobeef.com.tw`（皆 siteFullUser）。
- 新增 `scripts/gsc_report.py`（現況／`--compare` 期間比較／`--striking` 選題／`--list`）。
- ⚠️ **實作踩到的坑**：GSC 為保護隱私會把罕見查詢匿名化、不納入 `query` 維度回傳，用 query 維度加總會嚴重低估（實測 **57 vs 真實 357**）。真實總計必須用「**無維度**」查詢。已寫進程式碼註解與 commit。
- **成效驗收（近 28 天 2026-07-20~08-16 vs 前 28 天）**：點擊 **59→357（+505%）**、曝光 **3,882→16,138（+316%）**、平均排名 **10.2→7.8（進步 2.4）**、關鍵字數 177→535。對照年度基準（365 天 292 點擊／16,433 曝光）＝**最近 28 天約等於過去一整年**。第 1 頁關鍵字佔比 56%。
- 商業頁仍接不到：`/zhi-piao-tie-xian` 4→16 曝光（排名 36.8→25.0）、`/zhi-piao-dai-kuan` 0→7、`/qi-ye-dai-kuan` 0→5，**全部 0 點擊**。canonical 修正（08/07）方向對但才 10 天，仍在第 3 頁，需要時間。

**title/meta 改寫 10 篇（commit `72525fd`，已部署驗收）**
- 標的＝GSC「排名已在第 1 頁但點擊為 0」清單，合計約 500 曝光 0 點擊——排得到卻沒人點是標題問題，成本最低、見效最快。
- 靜態 3 篇改 `articles.ts`（**title + h1 + description 一起改**，因為原本 title 與 h1 完全相同）；DB 7 篇用新寫的 `scripts/apply_meta.py`。
- ⚠️ **DB 寫入路徑只有 `huangxi_upsert_article` RPC**（anon key 受 RLS 無法直接 UPDATE），該 RPC 吃完整 Article 物件 → 腳本先讀回原列、只換 title/description 再送回，並**自動回讀比對全欄位**確認 status/publish_at/content 未受影響。先單篇測試通過才批次跑。
- 刻意不改的 2 個（改標題救不了，轉為第六批選題）：**支票抬頭** 88 曝光被 `zhi-piao-zen-me-xie` 與 `zhi-piao-xie-cuo` 兩頁分食；**申請支票要多久** 意圖錯配（使用者問開票戶流程、承接頁講兌現撥款速度）。
- 改寫理由與改寫當下的曝光基準存 `scripts/title-rewrites-2026-08-19.json`，一個月後可直接對照。
- ⚠️ 提醒：Google 重抓標題約需 1–3 週，且可能自行改寫。短期沒變化屬正常，**不要來回改**。

**第六批 14 篇（commit `2149e63`，已排程 09/02–09/15）**
- ⚠️ **原訂「票信叢集 8 篇」在分析後砍成 2 篇**：查 query×page 對照後發現站上已有 `piao-xin-cha-xun`／`piao-ju-xin-yong-cha-xun`／`fa-piao-ren-xin-yong-cha` **三頁在搶同一批票信字**，再寫 8 篇會直接相殘（SERP 報告點名同類相殘正是商業大詞卡關主因）。
- 改用兩條軸線：①**拆承接過載的頁面**——`piao-xin-cha-xun` 一頁扛 **44 個查詢／628 曝光**、排名全卡 9–11.5；`zhi-piao-ru-zhang-shi-jian` 一頁扛 **68 個查詢／327 曝光**。拆出退票紀錄是什麼（130 曝光@11.5）、票信查詢卡、支票託收（66）、次交票（37，**確認站上從未定義過此詞**）。②**填 title 改寫救不了的 2 個意圖錯配**（支票抬頭、申請支票開戶）。③產業長尾 3 篇＋企業融資 5 篇，比對過 115 篇既有 slug 無重疊。
- QA：**33,018 字（平均 2,358）、0 撞名、0 死連結**（related 目標逐一比對靜態 67＋DB 50＋本批 14）、block 型別合法、source 皆絕對網址、description 82–94 字。
- 法規一律先 curl 驗證條文內容才寫入：票據法 `G0380028` §4 支票定義／§18 止付通知／§30 背書轉讓與禁止轉讓／§125 應記載事項／§128 見票即付／§130 提示期限／§144 支票準用；票交所 `inqService01`（適用對象含融資公司與一般持票人）、`inqService05`。
- seed 進 DB（14 成功 0 失敗）→ 排程每日台北 10:00（UTC 02:00）。**現況：08/20–09/15 連續 27 天每日一篇、零斷稿；draft 清空。**

**未完成 / 待辦**
- **Jason 待辦**：①**GA4 註冊 `cta_location` 自訂維度**（管理→自訂定義→建立自訂維度，範圍＝事件、參數＝`cta_location`）——⚠️ **不回溯**，沒設的期間永遠看不到各入口表現；②打票交所高雄分所 (07)291-5035 問單次查詢費用、買 500 元查詢卡跑通 SOP（文案已對外承諾）；③LINE 官方帳號的**歡迎訊息＋圖文選單**要配合改（站內做到位、加進來卻是制式歡迎詞的話前面全白做）。
- **觀察節奏**：24h 看 `line_add_click` 有無累積、哪個入口最有效；1 週看「點擊數 vs LINE 實際新增好友數」的落差——落差大＝LINE 那端有問題，而不是站內。一個月後跑 `gsc_report.py --days 28 --compare` 驗收 title 改寫成效。
- 內容佇列：**09/16 起斷稿**（第六批最後一篇 09/15），第七批請在 **09/10 前**備好；屆時可用 GSC 先驗收第六批成效再選題。
- **商業頁 0 點擊仍未解**：服務頁曝光開始回升但點擊掛零，這是目前最大的未解問題。SERP 報告的兩個處方（12 組兌現/貼現同類相殘合併＋301、P0 九個 title/meta）都還沒動，前者需 Jason 決策。
- 上次留的待辦都還在：DB 排程文不支援 `faqs`（無 FAQPage schema）、P0 的 9 個 title/meta 改寫、12 組同類相殘合併＋301（待 Jason 決策）、舊文死連結清理。

---

## 2026-08-17

**排程佇列盤點：發現斷稿 4 天**
- 開工先查排程進度（`git fetch` 確認與 origin/main 同步在 45a5b9b、tree 乾淨）。Supabase MCP 這次回 `permission denied`，改寫臨時 node 腳本用 `huangxi_list_articles` RPC 直查（`.env.local` 載入方式抄 seed-articles.mjs）。
- 結果：33 篇 scheduled **全部已到點**、未來待發 0、draft 0 → **08/14–08/17 斷稿 4 天**（第三批只排到 08/13）。HANDOFF 原記載「30 篇排到 08/11」也不正確（漏了第三批 3 篇）。

**第四批 14 篇：選題 + 產稿 + 排程 08/18–08/31**
- 選題依 `docs/serp-reports/serp-score-2026-08-08.md` 三條主軸（明細見 content-plan 第四批段落）：
  ①**跳票叢集 5 篇**（P2 機會分數最高：跳票怎麼辦 +3.0／支票跳票 +2.4／跳票 +1.4，全卡第 4–5 頁，原本只有 `zhi-piao-tiao-piao-zen-me-ban` 一篇孤島樞紐頁，缺衛星文）：追索權／法律途徑／退票理由單／預警訊號／軋票。
  ②**P1 striking-distance 補洞 4 篇**（有曝光但站上無對應專文）：貼現是什麼(15.0)／支票換現金(16.3)／保理(16.2)／票貼好做嗎(12.9)。
  ③**企業融資 pillar 加厚 3 篇**（企業融資 35.0 第 4 頁）＋**產業長尾 2 篇**（延續餐飲/製造/營建系列：批發經銷、物流貨運）。
- 刻意**不**新增「支票融資」專文——SERP 報告點名同類相殘是「支票貼現」卡 10.4 名的主因，該詞應靠既有 `zhi-piao-tie-xian-shi-shen-me` 擴寫而非再開新頁。
- 產稿共 28,000+ 字（每篇 1,700–2,750 字、3–6 條內部連結）。QA 腳本檢查：0 slug 撞名（比對靜態 67 + DB 35）、0 死連結、檔名＝slug、description 長度合規。5 篇偏短者補「常見問題」h3 段（兼顧 AEO 問答型搜尋）。
- 草稿源檔進 git（`scripts/drafts-batch4/`，比照 batch3；batch1/2 仍被 gitignore）。

**新增 `source` 區塊（法規依據卡）— 依 Jason 中途指示**
- 需求：「深度型的文章都要加入法規連結，增加公信力」。既有 `related` 不適用（會渲染成「延伸閱讀」、同分頁開啟、且 href 是站內相對路徑）。
- 作法：`Block` union 加 `{ type:'source', href, label, note? }`；`ArticleView` 渲染成虛線「法規依據・官方來源」卡（`target=_blank rel="noopener noreferrer"`）；`article-markdown.ts` 同步輸出到 `llms-full.txt`；`seed-articles.mjs` 加入白名單並驗證必須是絕對網址。DB 的 content 是 jsonb，新型別免 migration。
- ⚠️ 過程教訓：憑記憶猜的票據法 pcode `G0380044` 其實是「商業銀行設立標準」。**所有法規連結都先 curl 驗證標題與條文內容才寫入**——票據法正確為 `G0380028`（§22 時效／§130 提示期限／§131 拒絕證書／§123 本票裁定／§144-1 已刪除＝票據刑罰不再適用）、民訴 `B0010001`（§508 支付命令／§516 異議 20 日）、民法 `B0000001`（§294 債權讓與，保理法源），另加票交所 inqservice02／inqService05。
- 內容正確性也用官方條文對過：支票追索權時效（對發票人 1 年、對前手 4 個月、背書人對前手 2 個月）、支票**不適用**本票裁定、退票理由單＝拒絕證書同一效力。

**上線**
- `npm run build` 綠燈 → commit `a8022cc`（稿件＋source 區塊）→ `vercel deploy --prod` READY → 14 篇由 draft 改 scheduled，08/18–08/31 每日 10:00（UTC 02:00）。
- 部署順序有先後依賴：`source` 是新 block type，舊版 render 會**靜默略過**（不會壞頁，但整塊內容消失），所以必須先部署再排程。
- 佇列現況：**47 篇 scheduled（33 已上線 + 14 待發）**，最後一篇 08/31。

**未完成 / 待辦**
- ⚠️ **09/01 起又會斷稿**——下批請在 08/25 前備好，別再等到期才發現。
- **DB 排程文不支援 `faqs`**（`huangxi_articles` 無此欄、`rowToArticle` 未映射）→ 所有排程文都沒有 FAQPage schema，與 SERP 報告 P0「補 FAQ schema」建議衝突。要補需：加欄位 + 改 `huangxi_upsert_article` RPC + 改映射 + 前台 JSON-LD。
- P0 的 9 個 title/meta 改寫、12 組兌現/貼現同類相殘合併＋301（需 Jason 決策）皆未動工。
- `source` 卡片視覺未肉眼驗證（build/型別過關，首篇 08/18 才公開）；可在 `/admin/articles/preview/zhi-piao-zhui-suo-quan` 先看。
- 舊文中發現數條指向不存在 slug 的 related 連結（如 `/articles/zhi-piao-dui-xian`、`zhi-piao-tian-xie`、`zhi-piao-guo-qi`、`zhi-piao-dui-xian-shi-jian`），未修，下次可一併清理。

---

## 2026-08-08

**七大叢集排名總盤點 + SERP 機會分數評分系統**
- Jason 問七大叢集主目標詞與各文章目前 Google 排名。嘗試無頭瀏覽器即時查 SERP 被 Google CAPTCHA 擋下，改以 GSC 實際回報排名為準（07/24 匯出的近 28 天 zip + 08/07 年度基準）。
- 以 Jason 提供的《黃璽理財_文章關鍵字佈局分析_20260807.xlsx》（Downloads）的七大叢集（A貼現/B兌現/C貸款/D企業融資/E產業別/F票信/H票據知識）為準，94 篇逐一比對 GSC 頁面與查詢排名，產出《黃璽理財_文章排名對照_20260808.xlsx》（Downloads，94 篇明細＋叢集摘要＋資料說明）。
- 盤點結論：**54 篇（57%）已在第 1 頁**，但集中長尾；商業大詞卡關——支票貼現 10.4 名（160 曝光/28 天，全站最大單點機會）、支票貸款 13.9、票貼 32.2、企業融資 35.0、企業貸款未進榜、支票跳票 46.9（跳票家族合計 136 曝光全卡 4–5 頁）。24 篇無曝光（多為 7/11–7/31 第 4 波新文，已驗證非網址比對錯誤；F 票信叢集 9 篇有 7 篇無曝光最需追蹤）。
- **新工具 `scripts/serp_score.py`**（純標準庫）：吃 GSC 成效匯出 zip（自動處理 Big5 檔名），算機會分數 = 曝光 ×（目標排名預期 CTR − 實際 CTR），分四行動帶輸出：P1 striking distance 11–20 名（首位＝支票貼現）、P0 第 1 頁 CTR 漏水（首位＝票貼詐騙 5.4 名/76 曝光/僅 1 點擊）、AMP 衝前 3、P2 21–50 名重寫。`--save` 存快照到 `docs/serp-reports/`，下次執行自動對照上份快照列排名升降（|Δ|≥2）——即 canonical/301 成效的驗證工具。已存首份基準（serp-score-2026-08-08.md + snapshots/2026-08-08.csv，資料期間至 07/24）。
- 優化優先序（依評分）：①佈局分析檔分頁 3 的 12 組兌現/貼現同類相殘合併＋301（「支票貼現」卡 10.4 名的最可能原因，需 Jason 決策）；②Band P0 的 9 個 title/meta 改寫（半天工作量）；③跳票樞紐頁叢集化（F 叢集 7 篇無曝光文當衛星）；④F 叢集無曝光文 GSC 逐篇請求建立索引。
- 未完成：上述①–④皆未動工；~9/4 重新匯 GSC 跑 `serp_score.py --save` 看 band 遷移。

---

## 2026-08-07

**SEO 稽核內容工程（同日第二批：P0-4 / P1-3 / P2-2 第一批）**
- 公司資料類（統編/商家檔案/照片/市話）依 Jason 指示暫緩，先做內容工程。
- **[P0-4] 在地頁 2 頁上線**：`/gaoxiong-zhi-piao-tie-xian`（高雄產業票源：岡山螺絲/小港鋼鐵/林園石化/前鎮漁業/營造；行政區清單；到府與 LINE 辦理方式；8 題在地 FAQ）＋ `/gaoxiong-piao-tie`（銀行/當鋪/民間三管道比較表＋誠實勸退段＋7 題 FAQ）。兩頁互連、各含 FAQPage/BreadcrumbList/FinancialProduct(areaServed 高雄台南屏東) schema。掛進 Footer 新「服務地區」欄、sitemap、llms.txt。案例一律標「示意情境」，不假造客戶案例。
- **[P1-3] 服務頁擴充**：tie-xian 加必備文件（逐項為什麼）/當日撥款時程表/可辦不可辦清單/銀行當鋪三方比較表/FAQ 5→9、內文 10 條連結；dai-kuan 加三種還款方式/貸款vs貼現情境示例/FAQ 4→9；fei-lv-ji-suan 加計算邏輯推導/三情境試算/市場費率區間表（767→2,500+ 字元）；qi-ye-dai-kuan 補 7 條內文文章連結（原本 0 條）。
- **[P2-2] 第一批 5 篇薄文重寫**（原地保留 URL、updated=2026-08-07）：duo-zhang-zhi-piao-tie-xian（704→3,055）、zhi-piao-tie-xian-feng-xian（722→3,011）、min-jian-piao-tie（783→3,000）、ke-piao-tie-xian（844→3,001）、he-fa-piao-tie-ye-zhe（874→3,006）。每篇 H2 改真實問句＋緊接答案句、含本站獨有實務段（分票計費 vs 加權費率、跳票後時間線、七問電話檢查法、客票分級表、收票習慣管理）、FAQ 擴至 5-8 題。
- 盤點備忘：靜態 31 篇裡 <2,000 字元的遠多於稽核估的 20 篇（含支票兌現系列多篇 900-1,300）。下批建議：di-yi-ci-piao-tie、zhi-piao-tie-xian-shou-xu-fei、yuan-qi-zhi-piao-tie-xian、tui-piao-ji-lu、piao-tie-li-lv-hang-qing。
- 建置驗證：114 頁全過、兩在地頁 canonical/schema 正確、sitemap 106 URL、llms.txt 同步。

**GSC 年度數據分析 + 舊網址 301 修復 + 部署（同日第三批）**
- Jason 匯出 GSC 一年成效（365 天：292 點擊/16,433 曝光）。關鍵發現：①週曝光 6 週 ×7（W23 169→W32 2,802），策略生效中；②「支票貼現」曝光 1,014 次但 /zhi-piao-tie-xian 頁全年僅 7 次曝光——canonical 傷害被數據證實；③在地詞 0 筆；④**126 個舊 WordPress 網址仍在索引、年曝光 7,000+、全部 404**（稽核建議書未發現）。
- 修復：`src/lib/legacy-redirects.ts` 126 條 301 按主題對應（貼現/貸款/發票融資/企業融資/知識庫），中文網址 percent-encoding。基準快照存 `docs/gsc-baseline-2026-08-07.md`（含 CTR=0 title 改寫候選 12 字）。
- Supermetrics MCP 已連 GSC（sc-domain:huangxi.tw）但免費試用過期無法查數，之後用 GSC 匯出 CSV 或 Windsor.ai。
- **已部署正式站**（Jason 授權）：在地頁 200、舊網址 308 兩段轉址到位、sitemap 106 URL、重寫文 wordCount 上線。待 Jason：GSC 重新提交 sitemap + 5 個修正頁「要求建立索引」。

**SEO 稽核工程項目修復（依 OPZ/黃璽理財_SEO優化建議書）**
- 收到惠邦行銷 SEO 稽核建議書（健康分數 56/100，見 `OPZ/`），本次先修完全部「純工程」項目：
- **[P0-1] canonical 修正**：根因是 `layout.tsx` 全站 `alternates.canonical: '/'`，未自行宣告的頁面（tie-xian/dai-kuan/qi-ye/faq/contact 共 5 頁）全部繼承指向首頁，把商業頁排名資格讓渡給首頁。修法：5 頁各自補 canonical；並把 layout 的 canonical 移到首頁 `page.tsx`，杜絕未來新頁再犯。
- **[P1-1] sitemap ISR 失效修復**：`app/sitemap.ts`（metadata route）的 `revalidate = 120` 在正式站未生效，sitemap 凍結在 7/31 build 時間（87 篇 vs llms.txt 94 篇，7 篇 8 月 DB 排程文進不了索引）。改寫為 `app/sitemap.xml/route.ts` route handler（與 llms.txt 同模式、同 `getAllArticles()` 資料源），lastmod 改用文章真實日期、靜態頁不再用 build 當下時間充數。本地驗證 104 URL（10 靜態 + 94 文章）。
- **[P1-2] www 301**：next.config 加 host 條件轉址 `www.huangxi.tw/* → 301 → huangxi.tw/$1`（原本 www 回 200 雙網址並存）。
- **[P2-6] 安全標頭**：X-Content-Type-Options / X-Frame-Options / Referrer-Policy。
- **[P1-7] Schema 補強**：首頁新增 WebSite schema（@id 串 #organization）；FinancialService 補 priceRange/hasMap/sameAs(LINE)、areaServed 由 Country 改為高雄/台南/屏東（配合在地 SEO 方向）；Article schema 補 articleSection/wordCount/inLanguage；contact 補 BreadcrumbList（其餘頁面本來就有——稽核說服務頁缺 BreadcrumbList/HowTo 與現況不符，實際已存在）。
- **待使用者提供才能做**：統編/負責人/成立年份（P0-2 關於我們頁 + schema taxID）、Google 商家檔案（P0-3）、辦公室與團隊照片（P2-1）、市話（P1-6）、logo 圖檔（public/ 目前是空的）。內容類（在地頁 P0-4、服務頁擴寫 P1-3、作者頁 P1-4）另行安排。
- 部署後續：GSC 對 5 頁跑「即時網址測試」+ 重新提交 sitemap（需 Jason 操作）。

**以票交所官方 FAQ 擴寫跳票文與票信查詢文**
- 爬取台灣票據交換所「票信查詢常見問答」（twnch.org.tw/inqService05.html，34 題）存進 `docs/references/twnch-faq-inqService05.md`，作為票據主題的官方佐證來源庫。
- **跳票文**（靜態 `zhi-piao-tiao-piao-zen-me-ban`）擴寫：拒往規則精確化（三理由分別計算、支票與擔當付款本票合併計算、通報日起三年）、提前解除拒往與公司重整註記、清償註記細節（退票次日起三年內可辦、註記滿六個月不再對外揭露、四種必辦理由、提存備付動用規則）、新增「颱風地震天災退票特別規定」段落、FAQ 由 6 題增至 8 題、文末標註官方來源。updated 2026-07-31、readingMinutes 9→11。
- **票信查詢文**（DB `piao-xin-cha-xun`）大改版：修正原稿「查他人需符合特定身分」的錯誤（官方明定查詢**免提示證件**、免大小章），補具體管道（書面/查詢卡網路查詢 500 與 1000 元面額、語音專線 (02)2391-0379）、第一類 vs 第二類查覆內容、關係戶資訊、三年列管與註記滿六個月不揭露的界線、批次與客製化查詢，文末標官方來源＋高雄分所電話。title/description 同步改（佈「查詢管道」「費用」字）。已重灌 Supabase，status 仍 scheduled（07/23 已上線）、updated_display 2026-07-31。
- ⚠️ 事故與修復：驗證時誤把整個 `scripts/drafts/` 重灌，蓋掉 7/10 做過的 4 篇分類正規化（支票兌換→支票兌現）。已把 4 個 JSON 源檔的 category 改為「支票兌現」並重灌復原（此後源檔與 DB 一致，重灌不再回歸）。教訓：seed 單篇時務必用暫存目錄，且 drafts JSON 應與 DB 後續修改保持同步。

**行業別統計數據 + 產業聚落新文 2 篇（同日稍晚）**
- 收錄票交所開放資料「交換票據行業別統計表」（`docs/references/twnch-50-industry-checks.csv`，112/07–115/06 共 36 個月，官方每月更新可重抓）＋ `docs/references/README.md` 引用素材庫索引與統計速記。114 年公司戶 3,295 萬張/10.06 兆；製造 37%、批發零售 16%、營建 14%；115H1 張數年減 7.1% 但金額僅減 1.9%。
- 新文 2 篇（`scripts/drafts-batch3/`，**有進版控**，與 DB 保持同步）：製造業票貼（`zhi-zao-ye-piao-tie`，排程 08/12）、營建業票貼（`ying-jian-ye-piao-tie`，排程 08/13），佇列接在 batch2（08/11 止）之後。兩篇皆含北中南「地區抬頭」段落（高雄台南屏東／台中彰化苗栗／新竹桃園台北，對應各產業聚落），開頭用行業統計當數據 Hook，文末標票交所來源。
- 技術備忘：`huangxi_update_article_schedule` RPC 必帶 `p_sort_order`，缺了會報 schema cache 找不到函式。
- **加發即時文 1 篇**：拒絕往來戶自救攻略（`ju-jue-wang-lai-hu`，票據知識），排 07/31 10:00 即時上線（不動既有佇列）。跳票字群下游高意圖主題，全文以票交所 FAQ 參（拒往 10 題）為據：認定條件、分別/合併計算、提前解除步驟、重整註記、拒往期間可貼現客票周轉。已驗證文章頁/列表/sitemap/llms.txt 皆上線。
- 待辦：年關文（08/11）與餐飲文（08/09）可再把 12 月開票高峰、餐飲業小額多張等數據補進去（上線前改 JSON 重灌即可）。

---

## 2026-07-24

**AI 爬蟲抓取修復（Cloudflare）**
- 發現 Cloudflare「受管理的 robots.txt」在檔案頂部注入 Managed Content，把 Google-Extended/GPTBot/ClaudeBot/CCBot 等全部 `Disallow: /`，與自家 `robots.ts` 的 Allow 規則打架——這是 AI 爬蟲抓取被擋的主因。Jason 已在 Cloudflare 關閉該功能，線上 robots.txt 恢復乾淨（已驗證）。
- 決策：目標是衝 AI 曝光，故全開；若日後想擋純訓練爬蟲（CCBot/Bytespider），在 `robots.ts` 自行控制，不再開 Cloudflare 管理功能。

**GSC 數據分析（前 28 天：75 點擊 / 4,370 曝光）**
- 曝光 7/5 起翻 6–8 倍（日 30-45 → 150-350），策略正在生效；DB 排程文〈票期計算〉上線數日即成全站點擊第一（排名 7）。
- 瓶頸：①「跳票」字群（合計曝光 136）卡第 3-5 頁，對應舊薄文；②多個字排名前 10 但 CTR 0（title 不吸引人）；③「支票貼現」頭部字卡第一二頁交界（10.4）。

**內容三步優化（依數據執行，commit 9d42a2c）**
- 擴寫 4 篇：跳票攻略（3,156 字，修正「票據刑罰已廢除」等過時資訊）、兌現後跳票（2,672 字）、支票貼現是什麼（3,369 字）、/qi-ye-dai-kuan pillar +1,109 字（比較表/情境指引/FAQ+3）。
- title/meta 改寫 8 篇：5 篇把零點擊查詢字（即期票是什麼、票貼行情、申請支票要多久、支票兌現詐騙、禁背支票）佈進標題；3 篇移除「| 黃璽理財」雙重品牌尾綴（線上實測會變成「…| 黃璽理財 | 黃璽理財管理顧問」）。
- 16 篇新文（每篇 2,400–3,000 字）：票據民生 7（支票怎麼寫/遺失/入帳/提示期限/寫錯/台支/劃線）+ 企業融資 6（信保基金/青創/聯徵/負責人信用/發票融資/設備融資）+ 情境比較 3（當舖 vs 票貼/餐飲業/年關）。JSON 在 `scripts/drafts-batch2/`（gitignore），已 seed 進 Supabase 並排程 **07/27–08/11 每日 10:00**。發文佇列從 7/26 斷稿延長到 8/11。
- 決策：民生高搜量字（支票怎麼寫等）搜量是票貼字數倍，用來衝曝光；企業融資群集餵 pillar 權威；擴寫優先於加量（81 篇已夠多，薄才是問題）。

**AEO：llms.txt + llms-full.txt**
- Jason 提議做「隱藏英文版」給 AI 爬蟲；評估後否決（cloaking，Google 垃圾內容政策風險；中文問句用不到英文版），改做正規方案：`/llms.txt`（全站索引：服務頁 + 79 篇文章分類清單）+ `/llms-full.txt`（全部已發布文章的 Markdown 全文，含來源 URL/作者/日期）。兩者 ISR 120 秒，排程未發布文章不會提前洩漏（已驗證）。新增 `src/lib/article-markdown.ts`（Block→Markdown）。

**雜項**
- 修正記憶筆記過時資訊（曾誤稱站上聯絡資訊是 placeholder，實際 7/1 已補齊）。
- GSC 匯出 zip 與 .DS_Store 移出版控，`.gitignore` 加 `docs/*.zip`、`.DS_Store`。

**未完成 / 待辦**
- 8 月中旬回看 GSC：「跳票怎麼辦」「支票貼現」「企業融資」排名與新文曝光；Cloudflare AI Crawl Control 看 /llms.txt 抓取量。
- 尚有 ~60 篇舊靜態文平均僅 1,200 字，可依 GSC 數據分批擴寫。
- Vercel Web Analytics 未開通（開了 Claude 可直接查瀏覽數）。
- Google 商家檔案、Bing/IndexNow 仍未做（沿用舊待辦）。

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
