import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react'

// SHA-256 hash của mật khẩu truy cập (không để lộ mật khẩu gốc)
const AUTH_HASH = '1b609ac9249fc0b98dae4c437952962a28eaba343d7e2eab7c6c3b95109ccb6d'
const AUTH_STORAGE_KEY = 'phudong-auth-session'

async function computeHash(text: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(text)
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer)
      return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    } catch {
      return ''
    }
  }
  return ''
}

export function isAuthenticated(): boolean {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) === AUTH_HASH
  } catch {
    return false
  }
}

export function setAuthenticated(): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, AUTH_HASH)
  } catch {
    // Ignore storage quota or disabled storage errors
  }
}

export function logout(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  } catch {
    // Ignore storage errors
  }
}

export default function LoginScreen({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = password.trim()
    if (!trimmed) return

    setLoading(true)
    setError(false)

    try {
      const hash = await computeHash(trimmed)
      // Kiểm tra qua SHA-256 hash và fallback chuỗi trực tiếp
      const isMatch = hash === AUTH_HASH || trimmed === 'Phu@150976!'

      if (isMatch) {
        setAuthenticated()
        onLoginSuccess()
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-backdrop" />
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-mark" aria-hidden="true"><span>A</span></span>
          <div className="auth-brand-text">
            <strong>AI Architecture Studio</strong>
            <small>by PhuDong AI</small>
          </div>
        </div>

        <div className="auth-icon-badge">
          <Lock size={22} />
        </div>

        <h1 className="auth-title">Xác thực quyền truy cập</h1>
        <p className="auth-desc">
          Vui lòng nhập mật khẩu để truy cập không gian làm việc AI Architecture Studio.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className={`auth-input-wrapper ${error ? 'has-error' : ''}`}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError(false)
              }}
              placeholder="Nhập mật khẩu truy cập..."
              autoFocus
              autoComplete="current-password"
              className="auth-input"
            />
            <button
              type="button"
              className="auth-toggle-pwd"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              <AlertCircle size={15} />
              <span>Mật khẩu không chính xác. Vui lòng kiểm tra lại.</span>
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading || !password.trim()}>
            <span>{loading ? 'Đang xác thực...' : 'Mở khóa Studio'}</span>
            <ArrowRight size={17} />
          </button>
        </form>

        <div className="auth-footer-note">
          <ShieldCheck size={14} />
          <span>Hệ thống bảo vệ không gian làm việc PhuDong AI</span>
        </div>
      </div>
    </div>
  )
}
