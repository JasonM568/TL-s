# 文章草稿匯入區

把 Claude 產出的文章 JSON（結構同 `src/lib/articles.ts` 的 `Article`）放這裡，然後執行：

```bash
node scripts/seed-articles.mjs
```

會把每個 `*.json` 以 `huangxi_upsert_article` 寫入 Supabase，狀態預設 **draft（草稿）**。
接著到 **/admin/articles** 設定發布時間 / 順序，或按「立即發布」。

## JSON 欄位（必填）
`slug` `title` `h1` `description` `keywords[]` `category` `excerpt` `content[]`
（`author` 選填，企業融資主題填「理財顧問 張揚」；`readingMinutes` 選填，預設 5；`updated` 選填）

`content` 的 Block 型別：`p / h2 / h3 / ul{items[]} / ol{items[]} / callout / related{href,label,note}`

## 注意
- `slug` 不可與既有靜態 31 篇撞名（seed 會擋）。
- upsert 以 slug 為鍵：重跑只更新內容，**不會**覆寫已設定的排程狀態/時間。
- 匯入後草稿在前台看不到，直到你在後台排程且時間到。
