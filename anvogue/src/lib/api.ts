const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, { cache: 'no-store', ...options })
  const data = await res.json()
  if (!res.ok) throw data
  return data
}

// Wraps apiFetch for authenticated endpoints.
// On 401: silently refreshes the access token and retries once.
// On refresh failure: clears tokens and fires 'auth:logout' so AuthContext can update React state.
async function apiFetchAuth(path: string, options: RequestInit = {}) {
  const access = localStorage.getItem('access_token')
  const withAuth = (token: string): RequestInit => ({
    cache: 'no-store',
    ...options,
    headers: {
      ...(options.headers as Record<string, string> || {}),
      Authorization: `Bearer ${token}`,
    },
  })

  // First attempt
  const res = await fetch(`${API_BASE}${path}`, access ? withAuth(access) : { cache: 'no-store', ...options })
  if (res.status !== 401) {
    if (res.status === 204) return null
    const data = await res.json()
    if (!res.ok) throw data
    return data
  }

  // 401 — try to refresh
  const refresh = localStorage.getItem('refresh_token')
  if (!refresh) {
    window.dispatchEvent(new Event('auth:logout'))
    throw await res.json()
  }

  let newAccess: string
  try {
    const refreshed = await refreshAccessToken(refresh)
    newAccess = refreshed.access
    localStorage.setItem('access_token', newAccess)
    window.dispatchEvent(new CustomEvent('auth:token-refreshed', { detail: newAccess }))
  } catch {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    window.dispatchEvent(new Event('auth:logout'))
    throw { detail: 'Session expired. Please log in again.' }
  }

  // Retry once with the new token
  const retry = await fetch(`${API_BASE}${path}`, withAuth(newAccess))
  if (retry.status === 204) return null
  const retryData = await retry.json()
  if (!retry.ok) throw retryData
  return retryData
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

export async function fetchFilterOptions(params?: Record<string, string>) {
  const query = params && Object.keys(params).length > 0
    ? '?' + new URLSearchParams(params).toString()
    : ''
  return apiFetch(`/inventory/filter-options${query}`)
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

export async function fetchBanners() {
  return apiFetch('/inventory/banners')
}

export async function fetchBenefits() {
  return apiFetch('/inventory/benefits')
}

export async function fetchBrandCarousel() {
  return apiFetch('/inventory/brand-carousel')
}

export async function fetchInstagramSettings() {
  return apiFetch('/inventory/instagram-settings')
}

export async function fetchBlogPosts(params?: Record<string, string>) {
  const query = params && Object.keys(params).length > 0
    ? '?' + new URLSearchParams(params).toString()
    : ''
  return apiFetch(`/blog/posts${query}`)
}

export async function fetchBlogPost(id: string | number) {
  return apiFetch(`/blog/posts/${id}`)
}

export async function fetchBlogCategories() {
  return apiFetch('/blog/categories')
}

export async function fetchInstagramPosts() {
  return apiFetch('/inventory/instagram-posts')
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

export async function fetchUserProfile() {
  return apiFetchAuth('/users/me/')
}

export async function updateUserProfile(payload: object) {
  return apiFetchAuth('/users/me/', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function fetchAddresses() {
  return apiFetchAuth('/users/addresses')
}

export async function createAddress(data: object) {
  return apiFetchAuth('/users/addresses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateAddress(id: number, data: object) {
  return apiFetchAuth(`/users/addresses/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteAddress(id: number) {
  return apiFetchAuth(`/users/addresses/${id}`, { method: 'DELETE' })
}

export async function requestPasswordReset(email: string) {
  return apiFetch('/users/password-reset/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
}

export async function confirmPasswordReset(uidb64: string, token: string, password: string, password2: string) {
  return apiFetch('/users/password-reset/confirm/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uidb64, token, password, password2 }),
  })
}

export async function fetchFAQs() {
  return apiFetch('/inventory/faqs')
}

export async function submitContactForm(name: string, email: string, message: string) {
  return apiFetch('/users/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message }),
  })
}

// Orders
export async function createOrder(payload: object) {
  return apiFetchAuth('/invoice/invoice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function trackGuestOrder(email: string, orderId: number) {
  return apiFetch('/invoice/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, order_id: orderId }),
  })
}

export async function subscribeNewsletter(email: string) {
  return apiFetch('/users/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
}