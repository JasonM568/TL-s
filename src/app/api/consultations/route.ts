import { NextResponse } from 'next/server'
import { insertConsultation } from '@/lib/consultations'
import { notifyNewConsultation } from '@/lib/notify'

export const runtime = 'nodejs'

const clip = (s: unknown, n: number) => (s ?? '').toString().trim().slice(0, n)

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))

    const company = clip(body.company, 200)
    const name = clip(body.name, 100)
    const phone = clip(body.phone, 50)

    if (!company || !name || !phone) {
      return NextResponse.json(
        { ok: false, error: '請填寫公司名稱、聯絡人姓名與聯絡電話' },
        { status: 400 }
      )
    }

    const record = {
      company,
      name,
      phone,
      service: clip(body.service, 50),
      amount: clip(body.amount, 50),
      note: clip(body.note, 2000),
      ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
      user_agent: req.headers.get('user-agent')?.slice(0, 300) || undefined,
    }

    await insertConsultation(record)
    // 通知不阻塞回應
    void notifyNewConsultation(record)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { ok: false, error: '送出失敗，請稍後再試，或直接來電諮詢' },
      { status: 500 }
    )
  }
}
