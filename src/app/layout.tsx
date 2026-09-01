import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: '환경 변수 실습',
  description: 'NEXT_PUBLIC_ 변수와 server 전용 변수가 어디까지 보이는지 직접 확인해봅니다.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <nav className="top">
          <div>
            <Link href="/">홈</Link>
            <Link href="/gate">화면 1. 비밀번호</Link>
            <Link href="/tables">화면 2. 표 보기</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
