'use client'

import { useState } from 'react'
import BrowserEnv from '@/components/BrowserEnv'

/* NEXT_PUBLIC_ 이 붙었으므로 이 값은 빌드할 때 코드 안에 그대로 박힙니다.
   즉 이 화면을 여는 사람은 누구나 값을 꺼내 볼 수 있습니다. */
const PASSWORD = process.env.NEXT_PUBLIC_SITE_PASSWORD ?? ''

export default function Gate() {
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const [missed, setMissed] = useState(false)

  function check(e: React.FormEvent) {
    e.preventDefault()
    if (input.length > 0 && input === PASSWORD) {
      setOpen(true)
      setMissed(false)
    } else {
      setMissed(true)
    }
  }

  if (open) {
    return (
      <main className="wrap">
        <h1>열렸습니다</h1>
        <div className="card ok">
          <h3>비밀번호를 맞춘 사람만 보는 화면</h3>
          <p>이 문장이 이 화면의 &ldquo;보호된 내용&rdquo;입니다.</p>
        </div>

        <h2>그런데 이 잠금은 누구를 막았나요?</h2>
        <p>
          비밀번호를 맞추는 일과, 비밀번호를 <b>알아내는</b> 일은 다릅니다.
          지금 browser가 알고 있는 값을 그대로 꺼내 보면 이렇습니다.
        </p>
        <BrowserEnv />

        <h2>여기서 알 수 있는 것</h2>
        <div className="card warn">
          <p>
            <code>NEXT_PUBLIC_</code>이 붙은 값은 보호 장치가 아닙니다.
            browser에 공개된다는 표시입니다.
          </p>
          <p style={{ marginBottom: 0 }}>
            사람을 막는 잠금은 server에서 확인해야 합니다.
            화면 2가 그 방식입니다.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="wrap">
      <h1>비밀번호를 넣어야 보이는 화면</h1>
      <p className="lead">
        이 화면은 <code>NEXT_PUBLIC_SITE_PASSWORD</code> 하나로 잠겨 있습니다.
      </p>

      <form onSubmit={check} style={{ display: 'flex', gap: '.6rem', marginBottom: '1.4rem' }}>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="비밀번호"
          aria-label="비밀번호"
        />
        <button type="submit">확인</button>
      </form>

      {missed ? <p style={{ color: 'var(--danger)' }}>맞지 않습니다.</p> : null}

      <h2>비밀번호를 모른다면 찾아봅시다</h2>
      <div className="card">
        <p>진행자에게 묻지 말고, 이 화면만 가지고 찾아봅니다.</p>
        <ol>
          <li>
            개발자 도구를 엽니다. Windows는 <code>F12</code>, macOS는{' '}
            <code>Cmd + Option + I</code>입니다.
          </li>
          <li>
            <b>Sources</b> 탭으로 갑니다.
          </li>
          <li>
            전체 검색을 엽니다. Windows는 <code>Ctrl + Shift + F</code>, macOS는{' '}
            <code>Cmd + Option + F</code>입니다.
          </li>
          <li>
            <code>NEXT_PUBLIC_SITE_PASSWORD</code>를 검색합니다.
          </li>
          <li>검색 결과에 값이 그대로 보입니다. 그 값을 위에 넣습니다.</li>
        </ol>
        <p style={{ marginBottom: 0 }} className="muted">
          <b>Network</b> 탭에서 <code>.js</code> 파일을 하나 열고 같은 낱말을 검색해도 나옵니다.
        </p>
      </div>
    </main>
  )
}
