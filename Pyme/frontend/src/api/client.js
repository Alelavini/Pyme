// Wrapper sobre fetch que maneja JWT y auto-refresh
let _refreshFn = null
export function setRefreshFn(fn) { _refreshFn = fn }

let _getToken = null
export function setGetToken(fn) { _getToken = fn }

async function apiFetch(url, options = {}) {
  const token = _getToken?.()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  let res = await fetch(url, { ...options, headers })

  // Si expiró el token, intentar refresh una vez
  if (res.status === 401 && _refreshFn) {
    try {
      const newToken = await _refreshFn()
      headers.Authorization = `Bearer ${newToken}`
      res = await fetch(url, { ...options, headers })
    } catch {
      throw new Error('SESSION_EXPIRED')
    }
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || `Error ${res.status}`)
  }

  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export default apiFetch
