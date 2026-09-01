# 환경 변수 실습 템플릿

`NEXT_PUBLIC_`이 붙은 변수와 붙지 않은 변수가 각각 어디까지 가는지
직접 눈으로 확인하는 실습용 저장소입니다.

- Next.js 16, React 19, TypeScript
- Drizzle ORM + PostgreSQL
- Node.js 20 이상

## 준비

```bash
npm install
cp .env.example .env.local        # Windows PowerShell: Copy-Item .env.example .env.local
```

`.env.local`을 열어 `DATABASE_URL`에 **각자 만든 training DB**의 연결 문자열을
넣습니다. 실제 서비스 DB와 Production DB는 넣지 않습니다.

```bash
npm run db:generate               # drizzle/ 아래에 .sql 파일이 생깁니다
npm run db:migrate                # training DB에 적용합니다
npm run dev                       # http://localhost:3000
```

`npm run db:studio`로 DB를 화면에서 직접 볼 수 있습니다.

## 두 화면

| 주소 | 쓰는 변수 | 어디서 도는가 |
|---|---|---|
| `/gate` | `NEXT_PUBLIC_SITE_PASSWORD` | browser |
| `/tables` | `DATABASE_URL` | server |

두 값은 같은 `.env.local` 파일에 나란히 적혀 있습니다. 이름 앞의
`NEXT_PUBLIC_` 하나로 도착하는 곳이 갈립니다.

## 실습 순서

1. `/gate`를 엽니다. 비밀번호를 모르는 상태에서 시작합니다.
2. 개발자 도구를 엽니다. Windows는 `F12`, macOS는 `Cmd + Option + I`입니다.
3. **Sources** 탭에서 전체 검색을 엽니다. Windows는 `Ctrl + Shift + F`,
   macOS는 `Cmd + Option + F`입니다.
4. `NEXT_PUBLIC_SITE_PASSWORD`를 검색합니다. 값이 그대로 보입니다.
5. 찾은 값을 입력해 화면을 엽니다.
6. `/tables`를 엽니다. 이 화면은 `DATABASE_URL`이 없으면 아예 만들어지지
   않습니다. 그런데 같은 방법으로 개발자 도구를 뒤져도 연결 문자열은
   나오지 않습니다.

여기까지 하면 다음을 말할 수 있습니다.

- `NEXT_PUBLIC_`은 보호 장치가 아니라 **browser에 공개된다는 표시**입니다.
- 사람을 막는 잠금은 server에서 확인해야 합니다.
- 지금 이 코드가 server에서 도는지 browser에서 도는지를 먼저 정하면,
  어느 변수를 쓸 수 있는지가 따라옵니다.

## schema를 바꿔보기

`src/db/schema.ts`가 **코드가 원하는 DB 구조**입니다. 여기에 column을
하나 더한 뒤 아래를 실행하면 실제 DB가 그 모양을 따라옵니다.

```bash
npm run db:generate               # drizzle/ 에 변경 명령서(.sql)가 생깁니다
                                  # 생긴 .sql을 먼저 읽어봅니다
npm run db:migrate                # 그다음 적용합니다
```

`db:generate`로 생긴 `.sql`을 읽지 않고 `db:migrate`를 실행하지 않습니다.
`DROP`, `TRUNCATE`, rename, type 변경이 보이면 적용하지 말고 진행자를 부릅니다.

## 안 하는 것

- `db:push`는 변경 명령서 없이 schema를 직접 맞춰버려서 이 저장소에 넣지 않았습니다.
- `.env.local`은 Git에 올라가지 않습니다. 값은 채팅, 문서, 화면에 복사하지 않습니다.
- Production DB와 고객 데이터에는 연결하지 않습니다.

## 기본값

`.env.example`의 `NEXT_PUBLIC_SITE_PASSWORD` 기본값은 `1234grid`입니다.
이 값은 **공개되는 값**이라서 저장소에 그대로 적어 두었습니다.
실제로 무언가를 지켜야 하는 비밀번호는 이렇게 두지 않습니다.
