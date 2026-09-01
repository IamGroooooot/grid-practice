import Link from 'next/link'

export default function Home() {
  return (
    <main className="wrap">
      <h1>환경 변수는 어디까지 보이나요?</h1>
      <p className="lead">
        같은 <code>.env.local</code> 파일에 적어도, 이름에 따라 도착하는 곳이 다릅니다.
        두 화면을 차례로 열어보면서 직접 확인해봅시다.
      </p>

      <div className="card">
        <h3><Link href="/gate">화면 1. 비밀번호를 넣어야 보이는 화면</Link></h3>
        <p>
          <code>NEXT_PUBLIC_SITE_PASSWORD</code>로 잠근 화면입니다.
          비밀번호를 모른 채로 열어서, 개발자 도구만으로 찾아낼 수 있는지 해봅시다.
        </p>
      </div>

      <div className="card">
        <h3><Link href="/tables">화면 2. DB의 표를 보여주는 화면</Link></h3>
        <p>
          <code>DATABASE_URL</code>로 DB에 접속해서 Drizzle ORM으로 읽어옵니다.
          이 값은 server에서만 읽고 browser로 내려가지 않습니다.
        </p>
      </div>

      <h2>먼저 할 일</h2>
      <pre>{`npm install
cp .env.example .env.local     # Windows: Copy-Item .env.example .env.local
npm run db:generate            # drizzle/ 아래에 .sql 파일이 생깁니다
npm run db:migrate             # training DB에 적용합니다
npm run dev`}</pre>
      <p className="muted">
        <code>DATABASE_URL</code>에는 각자 만든 training DB만 적습니다.
        실제 서비스 DB와 Production DB는 적지 않습니다.
      </p>
    </main>
  )
}
