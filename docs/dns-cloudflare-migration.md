# DNS 遷移到 Cloudflare（huangxi.tw）

目的：讓網站流量經過 Cloudflare 代理，以便用 **AI Audit / Bot Analytics** 觀察 AI 爬蟲。
盤點日期：2026-07-01（來源：GoDaddy 現有 DNS）

---

## 📋 現有 DNS 記錄完整清單（務必全部搬到 Cloudflare）

| # | 類型 | 名稱/主機 | 值 | Cloudflare 代理 | 用途 |
|---|------|----------|-----|----------------|------|
| 1 | A | `@` | `76.76.21.21` | 🟠 **Proxied** | Vercel 網站（apex） |
| 2 | CNAME | `www` | `cname.vercel-dns.com` | 🟠 **Proxied** | Vercel 網站（www） |
| 3 | TXT | `@` | `google-site-verification=xVxmNxU0M6tEko3F5icXy0pIAWxCNO1koJWzxcmTS8I` | ⬜ DNS only | Google Search Console 驗證（漏了 GSC 會失效） |
| 4 | TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDB8EslRKda44oRuUXJ01XGOzYVRDA9bgaHHTrHxxebuQ7GB88k3+b9J4XkaKAIjrorH9qiPsQPEmLuOZV87GNsq4lp4rbuVtbWOoARFYHlu+3TwGHOlkugcRJ0nwnWzovblXTImSwPcaFgnSdqRXHAGVXR+VzaB/6PWsoKk1Iz0QIDAQAB` | ⬜ DNS only | Resend Email 通知（DKIM） |
| 5 | MX | `send` | `feedback-smtp.us-east-1.amazonses.com`（優先權 10） | ⬜ DNS only | Resend（SPF MX） |
| 6 | TXT | `send` | `v=spf1 include:amazonses.com ~all` | ⬜ DNS only | Resend（SPF） |

> 🟠 只有 Vercel 網站的兩筆（A `@`、CNAME `www`）設 **Proxied（橘雲）**——這是啟用 AI 爬蟲觀測的關鍵。
> ⬜ 其餘 TXT/MX 一律 **DNS only（灰雲）**，否則 Email 驗證會壞。

---

## 🛠️ 遷移步驟

1. **註冊 Cloudflare**（cloudflare.com，免費方案即可）→ **Add a site** → 輸入 `huangxi.tw` → 選 Free。
2. Cloudflare 會**自動掃描**現有 DNS。**逐筆對照上表**，缺的補上、值有誤的修正、代理狀態（橘/灰）依上表設定。
3. **SSL/TLS → Overview →** 加密模式設 **Full (strict)**（❗必做，否則會與 Vercel 產生無限轉址）。
4. **SSL/TLS → Edge Certificates →** 開啟 **Always Use HTTPS**。
5. **（建議）Caching → Cache Rules：** 對 `/api/*` 與 `/admin/*` 設 **Bypass cache**（避免動態頁被 Cloudflare 快取）。
6. Cloudflare 會給你**兩組 nameserver**（例如 `xxx.ns.cloudflare.com`）。到 **GoDaddy → huangxi.tw → Nameservers →** 改成 Cloudflare 這兩組。
7. 等 Cloudflare 狀態變 **Active**（數分鐘～數小時）。

---

## ⚠️ Vercel 注意事項
- 代理後，外部查 DNS 會解析到 Cloudflare IP，**Vercel 儀表板的網域可能顯示「Misconfigured」警告**——這是正常的，網站仍正常運作（Cloudflare 會帶著 Host 轉給 Vercel，配合 Full strict）。網域保留在 Vercel 專案即可。
- 不要用 Cloudflare 的「Flexible」SSL（會壞）。

## 📧 Email（Resend）
- 只要記錄 4/5/6 照搬（DNS only），Resend 網域驗證會維持 verified。遷移後再確認一次即可。

## 🔍 遷移完成後：在哪看 AI 爬蟲
- Cloudflare 儀表板 → 選 `huangxi.tw` → **Analytics & Logs**、以及 **AI Audit**（或 Security → Bots）
- 可看到 GPTBot、ClaudeBot、PerplexityBot、CCBot、Bytespider、Google-Extended 等造訪次數，並可允許/封鎖
- ⚠️ 別開 Cloudflare 的「managed robots.txt」——本站 robots 由 Next.js（`src/app/robots.ts`）提供，避免衝突

---

## ✅ 遷移後驗證（可請 Claude 幫忙 dig 檢查）
- `dig NS huangxi.tw` → 應顯示 Cloudflare 的 nameserver
- 網站 https://huangxi.tw 正常、無轉址迴圈
- 6 筆記錄都在（尤其 GSC 驗證 TXT、Resend 三筆）
- Resend 網域狀態仍 verified、送測試諮詢仍收到通知信
