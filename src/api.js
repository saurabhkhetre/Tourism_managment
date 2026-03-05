/**
 * TravelVista — Centralized API Client
 * Wraps fetch with JWT token injection and error handling.
 */

const API_BASE = '/api';

function getToken() {
    return localStorage.getItem('tv_token');
}

export function setToken(token) {
    if (token) {
        localStorage.setItem('tv_token', token);
    } else {
        localStorage.removeItem('tv_token');
    }
}

export function clearToken() {
    localStorage.removeItem('tv_token');
}

async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
        ...options,
        headers,
    });

    // Handle 401 (token expired)
    if (res.status === 401) {
        const data = await res.json().catch(() => ({}));
        if (data.error === 'token_expired') {
            clearToken();
            window.location.href = '/login';
            return;
        }
        throw { status: 401, ...data };
    }

    if (!res.ok) {
        const data = await res.json().catch(() => ({ message: 'Request failed' }));
        throw { status: res.status, ...data };
    }

    return res.json();
}

const api = {
    get: (endpoint) => request(endpoint),
    post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

export default api;
