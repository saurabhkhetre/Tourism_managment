/**
 * TravelVista — API Client
 * Wraps fetch with JWT token injection and error handling.
 */
const API_BASE = '/api';

const api = {
    _getToken() { return localStorage.getItem('tv_token'); },
    setToken(token) { token ? localStorage.setItem('tv_token', token) : localStorage.removeItem('tv_token'); },
    clearToken() { localStorage.removeItem('tv_token'); },

    async _request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const headers = { 'Content-Type': 'application/json', ...options.headers };
        const token = this._getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(url, { ...options, headers });

        if (res.status === 401) {
            const data = await res.json().catch(() => ({}));
            if (data.error === 'token_expired') {
                this.clearToken();
                window.location.hash = '#/login';
                return;
            }
            throw { status: 401, ...data };
        }
        if (!res.ok) {
            const data = await res.json().catch(() => ({ message: 'Request failed' }));
            throw { status: res.status, ...data };
        }
        return res.json();
    },

    get(endpoint) { return this._request(endpoint); },
    post(endpoint, body) { return this._request(endpoint, { method: 'POST', body: JSON.stringify(body) }); },
    put(endpoint, body) { return this._request(endpoint, { method: 'PUT', body: JSON.stringify(body) }); },
    patch(endpoint, body) { return this._request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }); },
    delete(endpoint) { return this._request(endpoint, { method: 'DELETE' }); },
};
