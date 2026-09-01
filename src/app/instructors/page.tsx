import { asc } from 'drizzle-orm'
import { getDb } from '@/db'
import { instructors } from '@/db/schema'

/* 열 때마다 DB에서 다시 읽습니다. 빌드할 때 미리 만들어 두지 않습니다. */
export const dynamic = 'force-dynamic'

/* 이 함수는 server에서만 돕니다. DATABASE_URL은 여기서만 읽힙니다. */
async function load() {
  const db = getDb()

  let rows: (typeof instructors.$inferSelect)[] | null = null
  try {
    rows = await db.select().from(instructors).orderBy(asc(instructors.id))
  } catch {
    /* 아직 migration을 적용하지 않아 표가 없는 경우 */
    rows = null
  }

  return { rows }
}

export default async function Instructors() {
  let data: Awaited<ReturnType<typeof load>> | null = null
  let error: string | null = null

  try {
    data = await load()
  } catch (e) {
    error = e instanceof Error ? e.message : String(e)
  }

  return (
    <main className="wrap">
      <h1>강의자 목록</h1>
      <p className="lead">
        <code>instructors</code> 표에 저장된 강의자를 모두 모아서 보여줍니다.
        읽는 일은 전부 server에서 일어납니다.
      </p>

      {error ? (
        <div className="card warn">
          <h3>DB를 읽지 못했습니다</h3>
          <pre style={{ margin: '.6rem 0 0' }}>{error}</pre>
          <p style={{ marginTop: '.9rem', marginBottom: 0 }}>
            <code>.env.local</code>의 <code>DATABASE_URL</code>을 확인합니다.
          </p>
        </div>
      ) : null}

      {data ? (
        data.rows === null ? (
          <div className="card warn">
            <h3><code>instructors</code> 표가 아직 없습니다</h3>
            <p style={{ marginBottom: 0 }}>
              <code>npm run db:migrate</code>를 먼저 실행합니다.
            </p>
          </div>
        ) : data.rows.length === 0 ? (
          <p className="muted">아직 등록된 강의자가 없습니다.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>이름</th>
                <th>email</th>
                <th>특징</th>
                <th>등록한 때</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>
                    {r.traits.length === 0 ? (
                      <span className="muted">—</span>
                    ) : (
                      <span style={{ display: 'inline-flex', gap: '.5rem', flexWrap: 'wrap' }}>
                        {r.traits.map((t) => (
                          <code key={t}>{t}</code>
                        ))}
                      </span>
                    )}
                  </td>
                  <td className="muted">{r.createdAt.toISOString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      ) : null}
    </main>
  )
}
