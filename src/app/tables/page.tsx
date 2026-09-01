import { sql } from 'drizzle-orm'
import { getDb } from '@/db'
import { participants } from '@/db/schema'
import BrowserEnv from '@/components/BrowserEnv'

/* 열 때마다 DB에서 다시 읽습니다. 빌드할 때 미리 만들어 두지 않습니다. */
export const dynamic = 'force-dynamic'

type TableRow = { table_name: string }
type ColumnRow = { table_name: string; column_name: string; data_type: string }

/* 이 함수는 server에서만 돕니다. DATABASE_URL은 여기서만 읽힙니다. */
async function load() {
  const db = getDb()

  const tables = (await db.execute(sql`
    select table_name
    from information_schema.tables
    where table_schema = 'public' and table_type = 'BASE TABLE'
    order by table_name
  `)) as unknown as TableRow[]

  const columns = (await db.execute(sql`
    select table_name, column_name, data_type
    from information_schema.columns
    where table_schema = 'public'
    order by table_name, ordinal_position
  `)) as unknown as ColumnRow[]

  let rows: (typeof participants.$inferSelect)[] | null = null
  try {
    rows = await db.select().from(participants).limit(20)
  } catch {
    /* 아직 migration을 적용하지 않아 표가 없는 경우 */
    rows = null
  }

  return { tables, columns, rows }
}

export default async function Tables() {
  let data: Awaited<ReturnType<typeof load>> | null = null
  let error: string | null = null

  try {
    data = await load()
  } catch (e) {
    error = e instanceof Error ? e.message : String(e)
  }

  return (
    <main className="wrap">
      <h1>DB의 표를 보여주는 화면</h1>
      <p className="lead">
        <code>DATABASE_URL</code>로 접속해서 Drizzle ORM으로 읽어옵니다. 이 일은 전부
        server에서 일어납니다.
      </p>

      {error ? (
        <div className="card warn">
          <h3>DB를 읽지 못했습니다</h3>
          <pre style={{ margin: '.6rem 0 0' }}>{error}</pre>
          <p style={{ marginTop: '.9rem', marginBottom: 0 }}>
            <code>.env.local</code>의 <code>DATABASE_URL</code>을 확인하고,{' '}
            <code>npm run db:generate</code>와 <code>npm run db:migrate</code>를 먼저
            실행합니다.
          </p>
        </div>
      ) : null}

      {data ? (
        <>
          <h2>이 DB에 있는 표</h2>
          {data.tables.length === 0 ? (
            <p className="muted">
              아직 표가 없습니다. <code>npm run db:generate</code>와{' '}
              <code>npm run db:migrate</code>를 실행합니다.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>표 이름</th>
                  <th>column</th>
                </tr>
              </thead>
              <tbody>
                {data.tables.map((t) => (
                  <tr key={t.table_name}>
                    <td><code>{t.table_name}</code></td>
                    <td className="muted">
                      {data.columns
                        .filter((c) => c.table_name === t.table_name)
                        .map((c) => `${c.column_name} (${c.data_type})`)
                        .join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h2>participants 표의 내용</h2>
          {data.rows === null ? (
            <p className="muted">
              <code>participants</code> 표가 아직 없습니다.
            </p>
          ) : data.rows.length === 0 ? (
            <p className="muted">표는 있고 행은 0개입니다.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>name</th>
                  <th>created_at</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.name}</td>
                    <td className="muted">{r.createdAt.toISOString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : null}

      <h2>이 화면에서 browser가 알고 있는 값</h2>
      <p>
        이 화면을 만들려면 <code>DATABASE_URL</code>이 반드시 필요했습니다.
        그런데 browser 쪽에서 같은 이름을 읽으면 이렇습니다.
      </p>
      <BrowserEnv />
      <div className="card ok">
        <p style={{ marginBottom: 0 }}>
          개발자 도구에서 이 화면을 아무리 뒤져도 연결 문자열은 나오지 않습니다.
          server에서 읽고, 결과인 표만 내려보냈기 때문입니다.
        </p>
      </div>
    </main>
  )
}
