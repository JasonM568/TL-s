// Claude 產文 → Supabase 草稿匯入腳本
// 用法：node scripts/seed-articles.mjs [drafts 目錄，預設 scripts/drafts]
// 讀取 *.json（結構同 src/lib/articles.ts 的 Article），輕量驗證後 upsert 成 draft。
// 使用者再到 /admin/articles 排程。自帶 .env.local 載入，免額外套件。
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

// --- 載入 .env.local（KEY=VALUE，值以第一個 = 分隔，去除引號） ---
function loadEnv() {
  const p = join(ROOT, '.env.local')
  if (!existsSync(p)) return
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i < 0) continue
    const k = t.slice(0, i).trim()
    let v = t.slice(i + 1).trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
    if (!(k in process.env)) process.env[k] = v
  }
}
loadEnv()

const { SUPABASE_URL, SUPABASE_ANON_KEY, HUANGXI_ADMIN_SECRET } = process.env
if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !HUANGXI_ADMIN_SECRET) {
  console.error('缺少環境變數：SUPABASE_URL / SUPABASE_ANON_KEY / HUANGXI_ADMIN_SECRET')
  process.exit(1)
}

// --- 靜態 31 篇 slug（防撞名，避免蓋掉已索引 URL） ---
function staticSlugs() {
  const src = readFileSync(join(ROOT, 'src/lib/articles.ts'), 'utf8')
  const set = new Set()
  for (const m of src.matchAll(/slug:\s*'([^']+)'/g)) set.add(m[1])
  for (const m of src.matchAll(/"slug":\s*"([^"]+)"/g)) set.add(m[1])
  return set
}

const BLOCK_TYPES = new Set(['p', 'h2', 'h3', 'ul', 'ol', 'callout', 'related'])
function validate(a, staticSet) {
  const errs = []
  for (const f of ['slug', 'title', 'h1', 'description', 'category', 'excerpt', 'content']) {
    if (a[f] == null || a[f] === '') errs.push(`缺 ${f}`)
  }
  if (!Array.isArray(a.keywords)) errs.push('keywords 非陣列')
  if (!Array.isArray(a.content)) errs.push('content 非陣列')
  else
    a.content.forEach((b, i) => {
      if (!BLOCK_TYPES.has(b?.type)) errs.push(`content[${i}] type 非法：${b?.type}`)
      if ((b?.type === 'ul' || b?.type === 'ol') && !Array.isArray(b.items)) errs.push(`content[${i}] 缺 items`)
      if (b?.type === 'related' && !b.href) errs.push(`content[${i}] related 缺 href`)
    })
  if (staticSet.has(a.slug)) errs.push(`slug 與靜態文章撞名（會被忽略）：${a.slug}`)
  return errs
}

const dir = process.argv[2] || join(ROOT, 'scripts/drafts')
if (!existsSync(dir)) {
  console.error(`草稿目錄不存在：${dir}`)
  process.exit(1)
}
const files = readdirSync(dir).filter((f) => f.endsWith('.json'))
if (!files.length) {
  console.log('（沒有 *.json 草稿檔）')
  process.exit(0)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } })
const staticSet = staticSlugs()

let ok = 0
let fail = 0
for (const f of files) {
  const a = JSON.parse(readFileSync(join(dir, f), 'utf8'))
  const errs = validate(a, staticSet)
  if (errs.length) {
    console.error(`✗ ${f}: ${errs.join('；')}`)
    fail++
    continue
  }
  const { data, error } = await supabase.rpc('huangxi_upsert_article', {
    p_secret: HUANGXI_ADMIN_SECRET,
    p_article: a,
  })
  if (error) {
    console.error(`✗ ${f}: RPC 失敗 ${error.message}`)
    fail++
  } else {
    console.log(`✓ upsert ${a.slug}  (id=${data})  → draft`)
    ok++
  }
}
console.log(`\n完成：成功 ${ok}、失敗 ${fail}。到 /admin/articles 設定排程。`)
process.exit(fail ? 1 : 0)
