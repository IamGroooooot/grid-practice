import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

/* 이 파일이 "코드가 원하는 DB 구조"다.
   여기에 표나 column을 더한 뒤 db:generate, db:migrate를 실행하면
   실제 DB가 이 모양을 따라온다. */
export const participants = pgTable('participants', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/* 강의자. participants(수강생)와는 성격이 다른 대상이라 표를 나눈다.
   traits는 "실무예제", "Next.js" 같은 특징 태그를 여러 개 담는 배열이다. */
export const instructors = pgTable('instructors', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  traits: text('traits').array().notNull().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
