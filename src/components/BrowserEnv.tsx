'use client'

/* 이 파일은 browser에서 돕니다.
   그래서 여기서 읽히는 값은 이미 사용자 PC까지 내려온 값입니다.

   NEXT_PUBLIC_ 이 붙은 변수만 값이 들어옵니다.
   붙지 않은 변수는 빈 값입니다. 빌드할 때 코드에 넣어주지 않기 때문입니다. */
const publicPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD
const databaseUrl = process.env.DATABASE_URL

export default function BrowserEnv() {
  return (
    <div>
      <div className="env-row">
        <span className="k">NEXT_PUBLIC_SITE_PASSWORD</span>
        <span className="v shown">{publicPassword ? publicPassword : '(비어 있음)'}</span>
      </div>
      <div className="env-row">
        <span className="k">DATABASE_URL</span>
        <span className="v empty">{databaseUrl ? databaseUrl : '(비어 있음)'}</span>
      </div>
      <p className="muted" style={{ marginTop: '.9rem' }}>
        둘 다 같은 <code>.env.local</code> 파일에 적혀 있습니다. 이름 앞의{' '}
        <code>NEXT_PUBLIC_</code> 하나로 갈립니다.
      </p>
    </div>
  )
}
