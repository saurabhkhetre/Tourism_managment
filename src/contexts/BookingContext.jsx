import { createContext, useContext, useReducer, useCallback } from 'react';
import api from '../api';

const BookingContext = createContext(null);

function bookingReducer(state, action) {
    switch (action.type) {
        case 'SET':
            return { ...state, bookings: action.payload };
        default:
            return state;
    }
}

export function BookingProvider({ children }) {
    const [state, dispatch] = useReducer(bookingReducer, {
        bookings: [],
    });

    const loadAllBookings = useCallback(async () => {
        try {
            const data = await api.get('/bookings');
            dispatch({ type: 'SET', payload: data });
            return data;
        } catch (err) {
            console.error('Failed to load bookings:', err);
            return [];
        }
    }, []);

    const loadMyBookings = useCallback(async () => {
        try {
            const data = await api.get('/bookings/my');
            dispatch({ type: 'SET', payload: data });
            return data;
        } catch (err) {
            console.error('Failed to load bookings:', err);
            return [];
        }
    }, []);

    const createBooking = useCallback(async (bookingData) => {
        try {
            const newBooking = await api.post('/bookings', bookingData);
            return newBooking;
        } catch (err) {
            console.error('Create booking failed:', err);
            return null;
        }
    }, []);

    const updateBooking = useCallback(async (booking) => {
        // For admin status updates
        try {
            await api.put(`/bookings/${booking.id}/status`, { status: booking.status });
            await loadAllBookings();
        } catch (err) {
            console.error('Update booking failed:', err);
        }
    }, [loadAllBookings]);

    const cancelBooking = useCallback(async (id) => {
        try {
            await api.put(`/bookings/${id}/cancel`);
            // Refresh whichever list is currently loaded
            await loadMyBookings();
        } catch (err) {
            console.error('Cancel booking failed:', err);
        }
    }, [loadMyBookings]);

    const confirmPayment = useCallback(async (bookingId, method) => {
        try {
            await api.put(`/bookings/${bookingId}/pay`, { paymentMethod: method });
            await loadMyBookings();
        } catch (err) {
            console.error('Confirm payment failed:', err);
        }
    }, [loadMyBookings]);

    const updateStatus = useCallback(async (bookingId, status) => {
        try {
            await api.put(`/bookings/${bookingId}/status`, { status });
            await loadAllBookings();
        } catch (err) {
            console.error('Update status failed:', err);
        }
    }, [loadAllBookings]);

    const getUserBookings = useCallback((userId) => {
        return state.bookings.filter(b => b.userId === userId);
    }, [state.bookings]);

    const getBooking = useCallback((id) => {
        return state.bookings.find(b => b.id === id);
    }, [state.bookings]);

    const getTotalRevenue = useCallback(() => {
        return state.bookings
            .filter(b => b.paymentStatus === 'paid')
            .reduce((sum, b) => sum + b.totalAmount, 0);
    }, [state.bookings]);

    const getMonthlyRevenue = useCallback(() => {
        const months = {};
        state.bookings.filter(b => b.paymentStatus === 'paid').forEach(b => {
            const month = b.createdAt.slice(0, 7);
            months[month] = (months[month] || 0) + b.totalAmount;
        });
        return Object.entries(months).map(([month, revenue]) => ({ month, revenue }));
    }, [state.bookings]);

    return (
        <BookingContext.Provider value={{
            bookings: state.bookings,
            createBooking,
            updateBooking,
            cancelBooking,
            confirmPayment,
            updateStatus,
            getUserBookings,
            getBooking,
            getTotalRevenue,
            getMonthlyRevenue,
            loadAllBookings,
            loadMyBookings,
        }}>
            {children}
        </BookingContext.Provider>
    );
}

export const useBookings = () => {
    const ctx = useContext(BookingContext);
    if (!ctx) throw new Error('useBookings must be used within BookingProvider');
    return ctx;
};
