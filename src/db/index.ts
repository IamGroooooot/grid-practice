import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

/* dev server가 파일을 다시 읽을 때마다 연결이 늘어나지 않도록 한 번만 만든다. */
const g = globalThis as unknown as {
  pgClient?: ReturnType<typeof postgres>
  db?: ReturnType<typeof drizzle<typeof schema>>
}

/* 첫 query 때까지 연결하지 않는다. DATABASE_URL이 없는 화면도 열리게 하기 위해서다.
   이 파일은 server에서만 돈다. 여기서 읽는 값은 browser로 내려가지 않는다. */
export function getDb() {
  if (g.db) return g.db

  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL이 없습니다. .env.example을 보고 .env.local을 만듭니다.')
  }

  const client =
    g.pgClient ??
    postgres(url, {
      max: 5,
      /* Supabase의 transaction pooler(6543)는 prepared statement를 지원하지 않는다. */
      prepare: false,
    })

  g.pgClient = client
  g.db = drizzle(client, { schema })
  return g.db
}
