import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-lg">
        <p className="text-6xl font-bold text-[#0D2B5E] mb-4">404</p>
        <h1 className="text-2xl font-bold text-[#0D2B5E] mb-3">找不到這個頁面</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          您要找的頁面可能已移動或不存在。
          <br />
          以下連結或許能幫上忙：
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-lg font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#0D2B5E' }}
          >
            回首頁
          </Link>
          <Link
            href="/articles"
            className="inline-block px-6 py-3 rounded-lg font-bold border-2 transition-colors hover:bg-gray-50"
            style={{ borderColor: '#0D2B5E', color: '#0D2B5E' }}
          >
            知識專欄
          </Link>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 rounded-lg font-bold border-2 transition-colors hover:bg-gray-50"
            style={{ borderColor: '#C9922A', color: '#C9922A' }}
          >
            免費諮詢
          </Link>
        </div>
      </div>
    </div>
  )
}
