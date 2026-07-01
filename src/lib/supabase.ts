import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const anonKey = process.env.SUPABASE_ANON_KEY

// 建立 Supabase 用戶端（匿名金鑰）。僅在伺服器端呼叫。
export function getSupabase() {
  if (!url || !anonKey) {
    throw new Error('Supabase 環境變數未設定（SUPABASE_URL / SUPABASE_ANON_KEY）')
  }
  return createClient(url, anonKey, { auth: { persistSession: false } })
}

// 後台讀取名單用的管理密鑰（對應 DB 內 security definer 函式的驗證）
export const ADMIN_SECRET = process.env.HUANGXI_ADMIN_SECRET || ''
