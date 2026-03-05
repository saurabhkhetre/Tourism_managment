import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import api from '../api';

const ReviewContext = createContext(null);

function reviewReducer(state, action) {
    switch (action.type) {
        case 'SET':
            return { ...state, reviews: action.payload };
        default:
            return state;
    }
}

export function ReviewProvider({ children }) {
    const [state, dispatch] = useReducer(reviewReducer, {
        reviews: [],
    });

    // Load recent public reviews (no auth needed - for Home testimonials)
    const loadRecentReviews = useCallback(async () => {
        try {
            const data = await api.get('/reviews/recent');
            dispatch({ type: 'SET', payload: data });
            return data;
        } catch (err) {
            console.error('Failed to load recent reviews:', err);
            return [];
        }
    }, []);

    // Auto-load recent reviews on mount for public pages
    useEffect(() => { loadRecentReviews(); }, [loadRecentReviews]);

    const loadAllReviews = useCallback(async () => {
        try {
            const data = await api.get('/reviews');
            dispatch({ type: 'SET', payload: data });
            return data;
        } catch (err) {
            console.error('Failed to load reviews:', err);
            return [];
        }
    }, []);

    const addReview = useCallback(async (review) => {
        try {
            const newReview = await api.post('/reviews', review);
            // Refresh reviews after adding
            await loadRecentReviews();
            return newReview;
        } catch (err) {
            console.error('Add review failed:', err);
            return null;
        }
    }, [loadRecentReviews]);

    const deleteReview = useCallback(async (id) => {
        try {
            await api.delete(`/reviews/${id}`);
            await loadAllReviews();
        } catch (err) {
            console.error('Delete review failed:', err);
        }
    }, [loadAllReviews]);

    const getPackageReviews = useCallback(async (packageId) => {
        try {
            const data = await api.get(`/reviews/package/${packageId}`);
            return data.reviews || [];
        } catch (err) {
            console.error('Failed to load package reviews:', err);
            return [];
        }
    }, []);

    const getAverageRating = useCallback(async (packageId) => {
        try {
            const data = await api.get(`/reviews/package/${packageId}`);
            return data.averageRating || 0;
        } catch (err) {
            return 0;
        }
    }, []);

    return (
        <ReviewContext.Provider value={{
            reviews: state.reviews,
            addReview,
            deleteReview,
            getPackageReviews,
            getAverageRating,
            loadAllReviews,
            loadRecentReviews,
        }}>
            {children}
        </ReviewContext.Provider>
    );
}

export const useReviews = () => {
    const ctx = useContext(ReviewContext);
    if (!ctx) throw new Error('useReviews must be used within ReviewProvider');
    return ctx;
};
