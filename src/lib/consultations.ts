import { getSupabase, ADMIN_SECRET } from './supabase'

export type Consultation = {
  id: string
  company: string
  name: string
  phone: string
  service: string | null
  amount: string | null
  note: string | null
  status: string
  ip: string | null
  user_agent: string | null
  created_at: string
}

export type NewConsultation = {
  company: string
  name: string
  phone: string
  service?: string
  amount?: string
  note?: string
  ip?: string
  user_agent?: string
}

// 服務項目代碼 → 顯示名稱
export const SERVICE_LABELS: Record<string, string> = {
  'tie-xian': '支票貼現',
  'dai-kuan': '支票貸款',
  other: '其他融資諮詢',
}

// 處理狀態 → 顯示名稱
export const STATUS_LABELS: Record<string, string> = {
  new: '待處理',
  contacted: '已聯繫',
  done: '已完成',
  archived: '已封存',
}

export function serviceLabel(code: string | null): string {
  if (!code) return '—'
  return SERVICE_LABELS[code] ?? code
}

// 新增一筆諮詢（公開表單，走 anon insert 政策）
export async function insertConsultation(input: NewConsultation): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase.from('huangxi_consultations').insert({
    company: input.company,
    name: input.name,
    phone: input.phone,
    service: input.service || null,
    amount: input.amount || null,
    note: input.note || null,
    ip: input.ip || null,
    user_agent: input.user_agent || null,
  })
  if (error) throw new Error(error.message)
}

// 後台：列出所有諮詢（透過受保護的 security definer 函式）
export async function listConsultations(): Promise<Consultation[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase.rpc('huangxi_list_consultations', {
    p_secret: ADMIN_SECRET,
  })
  if (error) throw new Error(error.message)
  return (data ?? []) as Consultation[]
}

// 後台：更新處理狀態
export async function updateConsultationStatus(id: string, status: string): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase.rpc('huangxi_update_status', {
    p_secret: ADMIN_SECRET,
    p_id: id,
    p_status: status,
  })
  if (error) throw new Error(error.message)
}
