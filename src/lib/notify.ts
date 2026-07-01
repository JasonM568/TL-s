import { serviceLabel, type NewConsultation } from './consultations'

// 有新諮詢時寄 Email 通知（透過 Resend API）。
// 未設定 RESEND_API_KEY / NOTIFY_EMAIL 時自動略過，不影響表單送出。
export async function notifyNewConsultation(c: NewConsultation): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.NOTIFY_EMAIL
  const from = process.env.NOTIFY_FROM || '泰誠企業融資 <onboarding@resend.dev>'
  if (!apiKey || !to) return

  const rows: [string, string][] = [
    ['公司名稱', c.company],
    ['聯絡人', c.name],
    ['聯絡電話', c.phone],
    ['洽詢服務', serviceLabel(c.service || null)],
    ['需求金額', c.amount || '—'],
    ['備註', c.note || '—'],
  ]
  const html = `
    <div style="font-family:sans-serif;max-width:560px">
      <h2 style="color:#0D2B5E">📩 網站新諮詢</h2>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .map(
            ([k, v]) =>
              `<tr>
                <td style="padding:8px 12px;background:#F0F4FF;font-weight:bold;color:#0D2B5E;width:120px">${k}</td>
                <td style="padding:8px 12px;border-bottom:1px solid #eee">${escapeHtml(v)}</td>
              </tr>`
          )
          .join('')}
      </table>
      <p style="color:#888;font-size:12px;margin-top:16px">
        此信由 huangxi.tw 諮詢表單自動寄出。請登入後台查看完整名單。
      </p>
    </div>`

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: to.split(',').map((s) => s.trim()),
        subject: `【新諮詢】${c.company} - ${c.name}`,
        html,
      }),
    })
  } catch {
    // 通知失敗不影響表單送出，靜默處理
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
