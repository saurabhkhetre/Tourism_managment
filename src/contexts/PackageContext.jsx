import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import api from '../api';

const PackageContext = createContext(null);

function packageReducer(state, action) {
    switch (action.type) {
        case 'SET':
            return { ...state, packages: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        default:
            return state;
    }
}

export function PackageProvider({ children }) {
    const [state, dispatch] = useReducer(packageReducer, {
        packages: [],
        loading: false,
    });

    // Load packages on mount
    const loadPackages = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const data = await api.get('/packages');
            dispatch({ type: 'SET', payload: data });
        } catch (err) {
            console.error('Failed to load packages:', err);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    useEffect(() => { loadPackages(); }, [loadPackages]);

    const loadAllPackages = useCallback(async () => {
        try {
            const data = await api.get('/packages/all');
            dispatch({ type: 'SET', payload: data });
            return data;
        } catch (err) {
            // If not admin, fall back to public packages
            await loadPackages();
            return state.packages;
        }
    }, [loadPackages, state.packages]);

    const addPackage = useCallback(async (pkg) => {
        try {
            const newPkg = await api.post('/packages', pkg);
            await loadAllPackages();
            return newPkg;
        } catch (err) {
            console.error('Add package failed:', err);
            return null;
        }
    }, [loadAllPackages]);

    const updatePackage = useCallback(async (pkg) => {
        try {
            await api.put(`/packages/${pkg.id}`, pkg);
            await loadAllPackages();
        } catch (err) {
            console.error('Update package failed:', err);
        }
    }, [loadAllPackages]);

    const deletePackage = useCallback(async (id) => {
        try {
            await api.delete(`/packages/${id}`);
            await loadAllPackages();
        } catch (err) {
            console.error('Delete package failed:', err);
        }
    }, [loadAllPackages]);

    const toggleActive = useCallback(async (id) => {
        try {
            await api.patch(`/packages/${id}/toggle`);
            await loadAllPackages();
        } catch (err) {
            console.error('Toggle active failed:', err);
        }
    }, [loadAllPackages]);

    const getPackage = useCallback((id) => {
        return state.packages.find(p => p.id === id);
    }, [state.packages]);

    const getActivePackages = useCallback(() => {
        return state.packages.filter(p => p.active);
    }, [state.packages]);

    const getFeaturedPackages = useCallback(() => {
        return state.packages.filter(p => p.featured && p.active);
    }, [state.packages]);

    const searchPackages = useCallback((query, filters = {}) => {
        let result = state.packages.filter(p => p.active);

        if (query) {
            const q = query.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.location.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
            );
        }

        if (filters.category) {
            result = result.filter(p => p.category === filters.category);
        }
        if (filters.minPrice) {
            result = result.filter(p => p.price >= filters.minPrice);
        }
        if (filters.maxPrice) {
            result = result.filter(p => p.price <= filters.maxPrice);
        }

        if (filters.sortBy) {
            switch (filters.sortBy) {
                case 'price-low':
                    result.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    result.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    result.sort((a, b) => b.rating - a.rating);
                    break;
                case 'popular':
                    result.sort((a, b) => b.reviewCount - a.reviewCount);
                    break;
                default:
                    break;
            }
        }

        return result;
    }, [state.packages]);

    return (
        <PackageContext.Provider value={{
            packages: state.packages,
            loading: state.loading,
            addPackage,
            updatePackage,
            deletePackage,
            toggleActive,
            getPackage,
            getActivePackages,
            getFeaturedPackages,
            searchPackages,
            loadPackages,
            loadAllPackages,
        }}>
            {children}
        </PackageContext.Provider>
    );
}

export const usePackages = () => {
    const ctx = useContext(PackageContext);
    if (!ctx) throw new Error('usePackages must be used within PackageProvider');
    return ctx;
};
