export const API = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/v1';


export async function apiFetch(path, options = {}) {
  // Use localStorage token as fallback, but HTTP-only cookies handle refresh automatically now.
  const token = localStorage.getItem('rc_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Make sure we send credentials for the httpOnly refresh cookie
  const fetchOptions = { ...options, headers, credentials: 'omit' };
  
  // We need to send credentials if we're hitting our own API to send/receive the refresh cookie
  // But for simple requests, we might not always need it. Let's include it for auth routes.
  if (path.startsWith('/auth/refresh') || path.startsWith('/auth/login')) {
      fetchOptions.credentials = 'include';
  }

  const res = await fetch(`${API}${path}`, fetchOptions);
  
  if (res.status === 401 && !options._retry && !path.startsWith('/auth/')) {
      // Try to refresh token if we get 401
      try {
          const refreshRes = await fetch(`${API}/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include'
          });
          if (refreshRes.ok) {
              const data = await refreshRes.json();
              localStorage.setItem('rc_token', data.access_token);
              // Retry original request
              headers['Authorization'] = `Bearer ${data.access_token}`;
              const retryRes = await fetch(`${API}${path}`, { ...fetchOptions, headers, _retry: true });
              if (!retryRes.ok) throw new Error('Retry failed');
              return retryRes.json();
          }
      } catch (e) {
          localStorage.removeItem('rc_token');
          localStorage.removeItem('rc_user');
          window.location.href = '/login';
          throw new Error('Session expired');
      }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}
