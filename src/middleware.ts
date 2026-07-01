import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const BOT_SIGNATURES: Record<string, string> = {
  GPTBot: 'OpenAI/ChatGPT',
  'ChatGPT-User': 'OpenAI/ChatGPT',
  'OAI-SearchBot': 'OpenAI/SearchBot',
  ClaudeBot: 'Anthropic/Claude',
  'anthropic-ai': 'Anthropic/Claude',
  PerplexityBot: 'Perplexity',
  'Google-Extended': 'Google/Gemini',
  Googlebot: 'Google/Search',
  CCBot: 'Common Crawl',
  'cohere-ai': 'Cohere',
  Bingbot: 'Microsoft/Bing',
  Applebot: 'Apple',
}

export function middleware(request: NextRequest) {
  const ua = request.headers.get('user-agent') ?? ''
  const path = request.nextUrl.pathname

  for (const [token, label] of Object.entries(BOT_SIGNATURES)) {
    if (ua.includes(token)) {
      console.log(`[BOT] ${label} | ${path} | ${ua.slice(0, 120)}`)
      break
    }
  }

  return NextResponse.next()
}

export const config = {
  // Only run on page routes, skip static assets and API
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)'],
}
