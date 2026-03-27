/**
 * TravelVista — API Client (PHP Backend)
 * Wraps fetch with JWT token injection and error handling.
 * Routes via .htaccess so URLs stay clean (e.g., /api/packages).
 */
const API_BASE = 'api';

const api = {
    _getToken() { return localStorage.getItem('tv_token'); },
    setToken(token) { token ? localStorage.setItem('tv_token', token) : localStorage.removeItem('tv_token'); },
    clearToken() { localStorage.removeItem('tv_token'); },

    async _request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const headers = { 'Content-Type': 'application/json', ...options.headers };
        const token = this._getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        let res;
        try {
            res = await fetch(url, { ...options, headers });
        } catch (fetchErr) {
            throw new Error(`Network error: ${fetchErr.message}`);
        }

        if (res.status === 401) {
            const data = await res.json().catch(() => ({}));
            if (data.error === 'token_expired' || data.error === 'authorization_required') {
                this.clearToken();
                window.location.hash = '#/login';
                return;
            }
            throw new Error(data.message || 'Unauthorized');
        }
        if (!res.ok) {
            try {
                const data = await res.json();
                throw new Error(data.message || data.error || `HTTP ${res.status}`);
            } catch (parseErr) {
                const text = await res.text().catch(() => '');
                throw new Error(text || `HTTP ${res.status}`);
            }
        }
        return res.json();
    },

    get(endpoint) { return this._request(endpoint); },
    post(endpoint, body) { return this._request(endpoint, { method: 'POST', body: JSON.stringify(body) }); },
    put(endpoint, body) { return this._request(endpoint, { method: 'PUT', body: JSON.stringify(body) }); },
    patch(endpoint, body) { return this._request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }); },
    delete(endpoint) { return this._request(endpoint, { method: 'DELETE' }); },
};
