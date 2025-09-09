// Lightweight typed HTTP client built on fetch
import { useAuth } from '@/store/auth'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type RequestOptions<TBody = unknown> = {
  method?: HttpMethod
  baseURL?: string
  headers?: Record<string, string>
  query?: Record<string, any>
  body?: TBody | FormData | URLSearchParams
  timeoutMs?: number
  credentials?: RequestCredentials
  signal?: AbortSignal
  skipAuth?: boolean // do not attach Authorization
  transform?: (json: any, response: Response) => any // map response json to desired shape
  redirectOn401?: boolean // auto redirect to /login on 401 (default true)
}

export type ApiErrorPayload = {
  code?: string | number
  message?: string
  data?: any
}

export class ApiError extends Error {
  status: number
  code?: string | number
  data?: any

  constructor(message: string, status: number, code?: string | number, data?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.data = data
  }
}

const DEFAULT_BASE = import.meta.env.VITE_API_BASE ?? '/api'
const DEFAULT_TIMEOUT = 20000

function isAbsoluteUrl(url: string) {
  return /^https?:\/\//i.test(url)
}

function toQueryString(q?: Record<string, any>) {
  if (!q) return ''
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(q)) {
    if (v === undefined || v === null) continue
    if (Array.isArray(v)) {
      for (const item of v) sp.append(k, String(item))
    } else if (typeof v === 'object') {
      sp.append(k, JSON.stringify(v))
    } else {
      sp.append(k, String(v))
    }
  }
  const s = sp.toString()
  return s ? `?${s}` : ''
}

async function parseBody(response: Response): Promise<any> {
  if (response.status === 204) return undefined
  const ctype = response.headers.get('content-type') || ''
  if (ctype.includes('application/json')) {
    return await response.json().catch(() => undefined)
  }
  return await response.text()
}

// removed handleError to allow option-aware 401 handling inline

export async function request<T = any, TBody = unknown>(url: string, opts: RequestOptions<TBody> = {}): Promise<T> {
  const {
    method = 'GET',
    baseURL = DEFAULT_BASE,
    headers,
    query,
    body,
    timeoutMs = DEFAULT_TIMEOUT,
    credentials,
    signal,
    skipAuth,
    transform,
  } = opts

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(new DOMException('Timeout', 'AbortError')), timeoutMs)
  const compositeSignal = signal
    ? (new AbortController().signal as AbortSignal)
    : controller.signal

  // If external signal provided, forward aborts
  if (signal) {
    signal.addEventListener('abort', () => controller.abort(signal.reason), { once: true })
  }

  try {
    const token = !skipAuth ? useAuth.getState().token : undefined
    const resolved = isAbsoluteUrl(url) ? url : `${baseURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
    const qs = toQueryString(query)

    const hdrs: Record<string, string> = {
      ...(headers || {}),
    }

    let finalBody: BodyInit | undefined
    if (body instanceof FormData || body instanceof URLSearchParams) {
      finalBody = body
    } else if (body !== undefined && body !== null) {
      hdrs['Content-Type'] = hdrs['Content-Type'] || 'application/json'
      finalBody = JSON.stringify(body)
    }

    if (token) {
      hdrs['Authorization'] = hdrs['Authorization'] || `Bearer ${token}`
    }

    const res = await fetch(resolved + qs, {
      method,
      headers: hdrs,
      body: method === 'GET' ? undefined : (finalBody as any),
      credentials,
      signal: compositeSignal,
    })

    if (!res.ok) {
      const payload = (await parseBody(res)) as ApiErrorPayload | string | undefined
      const message = typeof payload === 'string' ? payload : payload?.message || `Request failed with status ${res.status}`
      const code = typeof payload === 'object' ? (payload as any)?.code : undefined

      if (
        res.status === 401 &&
        opts.redirectOn401 !== false &&
        !skipAuth &&
        // avoid self-redirect/flicker on the login page itself
        typeof location !== 'undefined' &&
        location.pathname !== '/login'
      ) {
        try {
          useAuth.getState().setToken(undefined)
        } catch {}
        const from = encodeURIComponent(location.pathname + location.search)
        location.replace(`/login?from=${from}`)
      }

      throw new ApiError(message, res.status, code, typeof payload === 'object' ? (payload as any)?.data : undefined)
    }
    const parsed = await parseBody(res)
    return (transform ? transform(parsed, res) : parsed) as T
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new ApiError('Request timeout', 0)
    }
    throw err
  } finally {
    clearTimeout(timeoutId)
  }
}

export const http = {
  get: <T = any>(url: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    request<T>(url, { ...options, method: 'GET' }),
  post: <T = any, B = any>(url: string, body?: B, options: Omit<RequestOptions<B>, 'method' | 'body'> = {}) =>
    request<T, B>(url, { ...options, method: 'POST', body }),
  put: <T = any, B = any>(url: string, body?: B, options: Omit<RequestOptions<B>, 'method' | 'body'> = {}) =>
    request<T, B>(url, { ...options, method: 'PUT', body }),
  patch: <T = any, B = any>(url: string, body?: B, options: Omit<RequestOptions<B>, 'method' | 'body'> = {}) =>
    request<T, B>(url, { ...options, method: 'PATCH', body }),
  delete: <T = any>(url: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    request<T>(url, { ...options, method: 'DELETE' }),
}

export default http
