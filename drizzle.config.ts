import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

/* Next.js와 같은 파일을 읽는다. .env.local이 없으면 .env를 본다. */
config({ path: '.env.local' })
config({ path: '.env' })

/* `db:generate`는 DB에 접속하지 않으므로 URL이 없어도 통과한다.
   `db:migrate`와 `db:studio`는 실제로 접속하므로 값이 필요하다. */
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgresql://placeholder@localhost/placeholder',
  },
  strict: true,
  verbose: true,
})
