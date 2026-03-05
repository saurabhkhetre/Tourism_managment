import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import api, { setToken, clearToken } from '../api';

const AuthContext = createContext(null);

const getStoredAuth = () => {
    const stored = localStorage.getItem('tv_auth');
    return stored ? JSON.parse(stored) : null;
};

function authReducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload, isAuthenticated: true };
        case 'LOGOUT':
            return { ...state, user: null, isAuthenticated: false, users: [] };
        case 'UPDATE_USER':
            return { ...state, user: action.payload };
        case 'SET_USERS':
            return { ...state, users: action.payload };
        default:
            return state;
    }
}

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, {
        user: getStoredAuth(),
        isAuthenticated: !!getStoredAuth(),
        users: [],
    });

    useEffect(() => {
        if (state.user) {
            localStorage.setItem('tv_auth', JSON.stringify(state.user));
        } else {
            localStorage.removeItem('tv_auth');
        }
    }, [state.user]);

    // On mount, refresh user profile from server
    useEffect(() => {
        const token = localStorage.getItem('tv_token');
        if (token && state.isAuthenticated) {
            api.get('/auth/me')
                .then(user => dispatch({ type: 'UPDATE_USER', payload: user }))
                .catch(() => { /* token might be invalid, ignore */ });
        }
    }, []);

    const login = useCallback(async (email, password) => {
        try {
            const data = await api.post('/auth/login', { email, password });
            if (data.success) {
                setToken(data.token);
                dispatch({ type: 'LOGIN', payload: data.user });
                return { success: true, user: data.user };
            }
            return { success: false, message: data.message || 'Login failed' };
        } catch (err) {
            return { success: false, message: err.message || 'Invalid email or password' };
        }
    }, []);

    const register = useCallback(async (userData) => {
        try {
            const data = await api.post('/auth/register', userData);
            if (data.success) {
                setToken(data.token);
                dispatch({ type: 'LOGIN', payload: data.user });
                return { success: true, user: data.user };
            }
            return { success: false, message: data.message || 'Registration failed' };
        } catch (err) {
            return { success: false, message: err.message || 'Registration failed' };
        }
    }, []);

    const logout = useCallback(() => {
        clearToken();
        dispatch({ type: 'LOGOUT' });
    }, []);

    const updateProfile = useCallback(async (updates) => {
        try {
            const user = await api.put('/auth/profile', updates);
            dispatch({ type: 'UPDATE_USER', payload: user });
        } catch (err) {
            console.error('Profile update failed:', err);
        }
    }, []);

    const getAllUsers = useCallback(async () => {
        try {
            const users = await api.get('/users');
            dispatch({ type: 'SET_USERS', payload: users });
            return users;
        } catch (err) {
            console.error('Failed to fetch users:', err);
            return state.users;
        }
    }, [state.users]);

    const toggleUserBlock = useCallback(async (userId) => {
        try {
            await api.put(`/users/${userId}/toggle`);
            await getAllUsers();
        } catch (err) {
            console.error('Toggle block failed:', err);
        }
    }, [getAllUsers]);

    const deleteUser = useCallback(async (userId) => {
        try {
            await api.delete(`/users/${userId}`);
            await getAllUsers();
        } catch (err) {
            console.error('Delete user failed:', err);
        }
    }, [getAllUsers]);

    return (
        <AuthContext.Provider value={{
            ...state,
            login,
            register,
            logout,
            updateProfile,
            getAllUsers,
            toggleUserBlock,
            deleteUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
