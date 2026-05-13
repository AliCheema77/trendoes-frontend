const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, { cache: 'no-store', ...options })
  const data = await res.json()
  if (!res.ok) throw data
  return data
}

// Products
export async function fetchProducts(params?: Record<string, string>) {
  const query = params && Object.keys(params).length > 0
    ? '?' + new URLSearchParams(params).toString()
    : ''
  return apiFetch(`/inventory/product${query}`)
}

export async function fetchProductById(id: string | number) {
  return apiFetch(`/inventory/product/${id}`)
}

export async function fetchBestSellers() {
  return apiFetch('/inventory/best_seller')
}

export async function fetchSubCategories() {
  return apiFetch('/inventory/subcategories')
}

export async function fetchTestimonials() {
  return apiFetch('/inventory/testimonials')
}

export async function fetchSliders() {
  return apiFetch('/inventory/sliders')
}

export async function fetchActivePromotion() {
  return apiFetch('/inventory/promotion')
}

// Auth
export async function loginUser(email: string, password: string) {
  return apiFetch('/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

export async function registerUser(payload: {
  username: string
  email: string
  password: string
  password2: string
  phone_number?: string
}) {
  return apiFetch('/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function refreshAccessToken(refresh: string) {
  return apiFetch('/users/login/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  })
}

export async function fetchUserProfile(token: string) {
  return apiFetch('/users/me/', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function updateUserProfile(token: string, payload: object) {
  return apiFetch('/users/me/', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
}

// Orders
export async function createOrder(payload: object, token?: string | null) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  return apiFetch('/invoice/invoice', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })
}