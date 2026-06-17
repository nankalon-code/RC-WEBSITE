export const API = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/v1';

let _isRefreshing = false;
let _refreshQueue = [];

async function _processQueue(newToken, error) {
  _refreshQueue.forEach((cb) => (error ? cb.reject(error) : cb.resolve(newToken)));
  _refreshQueue = [];
}

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('rc_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Always include credentials so the httpOnly refresh cookie is sent
  const fetchOptions = { ...options, headers, credentials: 'include' };

  const res = await fetch(`${API}${path}`, fetchOptions);

  // Auto-refresh on 401 (token expired) — queue concurrent requests
  if (res.status === 401 && !options._retry && !path.startsWith('/auth/')) {
    if (_isRefreshing) {
      return new Promise((resolve, reject) => {
        _refreshQueue.push({ resolve, reject });
      }).then((newToken) => {
        headers['Authorization'] = `Bearer ${newToken}`;
        return fetch(`${API}${path}`, { ...fetchOptions, headers }).then((r) => {
          if (!r.ok) throw new Error('Request failed after refresh');
          return r.json();
        });
      });
    }

    _isRefreshing = true;
    try {
      const refreshRes = await fetch(`${API}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!refreshRes.ok) throw new Error('Refresh failed');
      const data = await refreshRes.json();
      const newToken = data.access_token;
      localStorage.setItem('rc_token', newToken);
      if (data.user) localStorage.setItem('rc_user', JSON.stringify(data.user));
      _processQueue(newToken, null);
      headers['Authorization'] = `Bearer ${newToken}`;
      const retryRes = await fetch(`${API}${path}`, { ...fetchOptions, headers, _retry: true });
      if (!retryRes.ok) {
        const errBody = await retryRes.json().catch(() => ({ detail: 'Request failed' }));
        throw new Error(errBody.detail || 'Request failed');
      }
      return retryRes.json();
    } catch (e) {
      _processQueue(null, e);
      localStorage.removeItem('rc_token');
      localStorage.removeItem('rc_user');
      window.location.href = '/login';
      throw new Error('Session expired');
    } finally {
      _isRefreshing = false;
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}
