import { cookies } from 'next/headers'

const COOKIE = 'hx_admin'

// 驗證目前請求是否已登入後台
export async function isAuthed(): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET || ''
  if (!secret) return false
  const store = await cookies()
  return store.get(COOKIE)?.value === secret
}

// 設定登入 cookie（httpOnly，30 天）
export async function setAuthCookie(): Promise<void> {
  const secret = process.env.ADMIN_SESSION_SECRET || ''
  const store = await cookies()
  store.set(COOKIE, secret, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
}

// 清除登入 cookie
export async function clearAuthCookie(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE)
}
