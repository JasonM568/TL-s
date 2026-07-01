'use server'

import { redirect } from 'next/navigation'
import { setAuthCookie, clearAuthCookie, isAuthed } from '@/lib/auth'
import { updateConsultationStatus } from '@/lib/consultations'

export async function login(formData: FormData) {
  const password = (formData.get('password') || '').toString()
  const expected = process.env.ADMIN_PASSWORD || ''
  if (!expected || password !== expected) {
    redirect('/admin/login?error=1')
  }
  await setAuthCookie()
  redirect('/admin')
}

export async function logout() {
  await clearAuthCookie()
  redirect('/admin/login')
}

export async function updateStatus(formData: FormData) {
  if (!(await isAuthed())) redirect('/admin/login')
  const id = (formData.get('id') || '').toString()
  const status = (formData.get('status') || '').toString()
  if (id && status) {
    await updateConsultationStatus(id, status)
  }
  redirect('/admin')
}
