// 依文章主題切換 CTA 誘因
//
// 為什麼要這支：2026-09-05 盤點 GA4 發現 837 sessions 只有 4 次 line_add_click（0.48%）。
// 原因之一是全站只有一個誘因「免費查票信」，但流量最大的 /articles/zhi-piao-xie-cuo
// （支票寫錯，佔 31%）讀者是「開票的人」在修填寫錯誤，不是「收票的人」在擔心跳票
// —— 誘因對他們零關聯。故依文章主題切成 4 種問法。
//
// ⚠️ 四種誘因的「履行方式完全相同」：客戶在 LINE 傳一張支票照片，我們回答一個問題。
//    對 Jason 而言不是四種新服務，只是四種開場白，不增加履行成本。
//
// 誘因法源（同 site.ts）：票交所 FAQ 壹-Q7「查詢票據信用資料得免提示證件及公司大小章」
// ＝查他人票信免對方同意；壹-Q2 第 3 點可用「付款行磁字代號＋帳號」查詢，兩者印在票面上。
//
// 新增文章不需要改這裡：ctaVariantFor() 依 slug／關鍵字自動判定，判不出來就落到預設。

import type { Article } from './articles'

export type CtaVariant = 'piao-xin' | 'tie-xian' | 'tian-xie' | 'zhou-zhuan'

export type CtaOffer = {
  /** 按鈕文字 */
  label: string
  /** CTA 區塊大標 */
  headline: string
  /** CTA 區塊說明 */
  body: string
  /** 降低戒心的一句話 */
  assurance: string
  /** 文中版精簡誘因（一句話講完，不重複 headline） */
  inline: string
}

export const CTA_OFFERS: Record<CtaVariant, CtaOffer> = {
  // 收票人擔心對方跳票 —— 票信／退票／拒絕往來／詐騙／風險類
  'piao-xin': {
    label: '免費查票信',
    headline: '這張票，發票人靠得住嗎？',
    body: '加 LINE 傳一張支票照片，我們免費幫你查發票人的票信紀錄——近三年有沒有退票、是不是拒絕往來戶。',
    assurance: '加了不會有人打電話給你，你不問我們不推。',
    inline: '擔心這張票會跳？傳張照片，免費幫你查發票人近三年的退票紀錄。',
  },

  // 手上有票、在等錢 —— 入帳時間／票期／手續費／貼現／週轉類（預設）
  'tie-xian': {
    label: '免費試算實拿金額',
    headline: '這張票，還要等多久才拿得到錢？',
    body: '加 LINE 傳一張支票照片，我們免費幫你算：票期還剩幾天、現在貼現實拿多少、成本多少。',
    assurance: '算完不辦也沒關係，我們不會追著你問。',
    inline: '不想等到票期？傳張照片，免費幫你算現在貼現實拿多少。',
  },

  // 正在處理一張票、怕它不能用 —— 寫錯／怎麼寫／抬頭／背書／劃線／作廢／掛失類
  'tian-xie': {
    label: '免費幫你看這張票',
    headline: '不確定這張票還能不能用？',
    body: '加 LINE 傳一張支票照片，我們免費幫你看：這樣寫銀行會不會退票、要不要重開、還能不能補救。',
    assurance: '看完就結束，不推銷任何東西。',
    inline: '不確定這樣寫行不行？傳張照片，免費幫你看銀行會不會退票。',
  },

  // 企業融資／週轉／產業類 —— 讀者未必手上有票，先問需求
  'zhou-zhuan': {
    label: '免費評估可調額度',
    headline: '手上有客戶開的支票嗎？',
    body: '有票就有機會。加 LINE 傳一張支票照片，我們免費評估這張票能調到多少現金、多久撥款；沒有票也可以問，我們會告訴你還有哪些管道。',
    assurance: '評估免費，不適合我們會直說。',
    inline: '手上有客戶的票？傳張照片，免費評估能調到多少現金。',
  },
}

/** 預設誘因：本站核心服務是支票貼現，多數文章的讀者手上有票在等錢。 */
export const DEFAULT_CTA_VARIANT: CtaVariant = 'tie-xian'

// 判定規則。同時比對 romanized slug 片段與中文（標題／關鍵字），
// 因為 DB 排程文的 category 太粗（「票據知識」28 篇什麼都有），不能只靠分類。
// 順序＝優先序，先命中先贏。
const RULES: Array<{ variant: CtaVariant; slug: string[]; zh: string[] }> = [
  {
    // 形式／填寫疑難：讀者手上有一張「可能有問題」的票
    variant: 'tian-xie',
    slug: [
      'xie-cuo', 'zen-me-xie', 'tai-tou', 'bei-shu', 'hua-xian', 'kong-bai',
      'yi-shi-gua-shi', 'wei-tuo-qu-kuan', 'jin-zhi-bei-shu',
    ],
    // ⚠️ 不要把「託收」放這裡：託收文章問的是「錢什麼時候到」＝等錢，屬 tie-xian。
    //    放這裡會把 zhi-piao-ru-zhang-shi-jian／zhi-piao-dui-xian-shou-xu-fei
    //    （流量第 2、3 名）誤判成填寫疑難。
    zh: [
      '寫錯', '怎麼寫', '填寫', '抬頭', '背書', '劃線', '畫線', '作廢',
      '掛失', '遺失', '塗銷', '印章', '蓋章', '空白支票', '禁背',
    ],
  },
  {
    // 風險／信用：讀者怕收到的票兌不了現
    // ⚠️ 不要放寬到 'feng-xian'／「風險」——會把 zhi-piao-tie-xian-feng-xian
    //    （支票貼現風險，讀者是要辦貼現的人）誤判過來。
    variant: 'piao-xin',
    slug: [
      'piao-xin', 'tui-piao', 'tiao-piao', 'ju-jue-wang-lai', 'zha-pian',
      'kong-tou', 'shou-piao-feng-xian', 'xin-yong-cha', 'zhui-suo-quan',
      'fa-piao-ren-xin-yong', 'dui-xian-hou-tiao-piao', 'piao-ju-guan-li',
    ],
    zh: [
      '票信', '退票', '跳票', '拒絕往來', '詐騙', '空頭', '信用查詢',
      '票據信用', '受票風險', '追索權',
    ],
  },
  {
    // 手上有票在等錢：貼現／票貼／兌現／票期／入帳。
    // ⚠️ 必須排在 zhou-zhuan 前面，否則 zhi-piao-dai-kuan-* 會被 'dai-kuan' 吃成企業融資，
    //    製造業／營建業票貼也會被當成沒票的產業週轉文。
    variant: 'tie-xian',
    slug: [
      'tie-xian', 'piao-tie', 'dui-xian', 'zhi-piao-dai-kuan', 'ru-zhang',
      'piao-qi', 'shou-xu-fei', 'huan-xian-jin', 'ti-shi-qi-xian',
      'yuan-qi-zhi-piao', 'kuai-dao-qi', 'da-e-zhi-piao', 'xiao-jin-e-zhi-piao',
      'tuo-shou', 'ci-jiao-piao',
    ],
    zh: ['支票貼現', '票貼', '支票兌現', '支票貸款', '票期', '入帳', '兌現手續費', '託收'],
  },
  {
    // 企業融資／產業週轉：讀者未必手上有票
    variant: 'zhou-zhuan',
    slug: [
      'qi-ye-', 'zhou-zhuan', 'dai-kuan', 'rong-zi', 'xin-bao-ji-jin',
      'ying-shou-zhang-kuan', 'ying-shou-zhang-qi', 'she-bei-', 'qing-chuang',
      'gong-si-lian-zheng', 'cai-wu-bao-biao', 'xian-jin-liu', 'zi-jin-',
      'fa-piao-rong-zi', 'bao-li-', 'zhong-xiao-qi-ye',
      // 申請支存帳戶＝讀者手上還沒有票，「幫你看這張票」對他無意義
      'shen-qing-zhi-piao-zhang-hu',
    ],
    zh: [
      '企業融資', '企業貸款', '週轉金', '資金週轉', '信保基金', '應收帳款',
      '設備融資', '創業貸款', '現金流', '財務報表', '營運資金', '資金缺口',
    ],
  },
]

/**
 * 依文章判定該用哪個 CTA 誘因。判不出來 → DEFAULT_CTA_VARIANT。
 * 靜態文章與 DB 排程文共用（不需要新增資料庫欄位）。
 */
export function ctaVariantFor(
  article: Pick<Article, 'slug' | 'title' | 'h1' | 'keywords' | 'category'>,
): CtaVariant {
  const slug = article.slug
  const text = [article.title, article.h1, article.category, ...(article.keywords ?? [])].join(' ')

  // 兩段式：先跑完所有規則的 slug，再跑中文詞。
  // slug 是作者刻意取的主題名＝強訊號；中文詞比對到的可能只是 keywords 裡順帶提一句
  // （例：支票兌現手續費的 keywords 有「託收」，但那篇的主題是等錢，不是填寫疑難）。
  for (const rule of RULES) {
    if (rule.slug.some((s) => slug.includes(s))) return rule.variant
  }
  for (const rule of RULES) {
    if (rule.zh.some((z) => text.includes(z))) return rule.variant
  }
  return DEFAULT_CTA_VARIANT
}

export function ctaOfferFor(
  article: Pick<Article, 'slug' | 'title' | 'h1' | 'keywords' | 'category'>,
): CtaOffer & { variant: CtaVariant } {
  const variant = ctaVariantFor(article)
  return { variant, ...CTA_OFFERS[variant] }
}

// ─────────────────────────────────────────────────────────────
// 文章要不要就地嵌入費率試算工具
//
// 為什麼：2026-09-06 GA4 盤查 —— /fei-lv-ji-suan 一整個月 0 次瀏覽，
// 全站頁/次 1.05、非文章頁只佔 1.6% 的 pageviews、/contact 0 次。
// 使用者不會離開落地頁，工具必須搬進文章而不是連過去。
//
// 條件刻意收緊成「主題是等錢（tie-xian）」**且**「這篇本來就在談錢或票期」：
// 試算表體積不小，塞進《支票兌現需要哪些文件》只會打斷閱讀。
// ─────────────────────────────────────────────────────────────
const CALC_SLUG = [
  'shou-xu-fei', 'fei-yong', 'li-lv', 'e-du', 'piao-qi', 'ru-zhang',
  'huan-xian-jin', 'ti-qian-dui-xian', 'hang-qing', 'tie-xian-shi-shen-me',
  'yuan-qi-zhi-piao', 'da-e-zhi-piao', 'xiao-jin-e-zhi-piao', 'kuai-dao-qi',
  'duo-zhang-zhi-piao', 'ji-suan',
]
const CALC_ZH = [
  '手續費', '費用', '費率', '利率', '額度', '票期', '入帳',
  '換現金', '實拿', '行情', '提前兌現', '怎麼算',
]

// 例外：主題雖談入帳／費用，但台幣貼現試算表對它無意義
const CALC_EXCLUDE = ['wai-bi-zhi-piao']  // 外幣支票託收，幣別與流程都不同

export function shouldEmbedCalculator(
  article: Pick<Article, 'slug' | 'title' | 'h1' | 'keywords' | 'category'>,
): boolean {
  if (CALC_EXCLUDE.includes(article.slug)) return false
  if (ctaVariantFor(article) !== 'tie-xian') return false
  const text = [article.title, article.h1, ...(article.keywords ?? [])].join(' ')
  return CALC_SLUG.some((s) => article.slug.includes(s)) || CALC_ZH.some((z) => text.includes(z))
}
