import { createContext, useContext, useReducer, useCallback } from 'react';
import api from '../api';

const EnquiryContext = createContext(null);

function enquiryReducer(state, action) {
    switch (action.type) {
        case 'SET':
            return { ...state, enquiries: action.payload };
        default:
            return state;
    }
}

export function EnquiryProvider({ children }) {
    const [state, dispatch] = useReducer(enquiryReducer, {
        enquiries: [],
    });

    const loadEnquiries = useCallback(async () => {
        try {
            const data = await api.get('/enquiries');
            dispatch({ type: 'SET', payload: data });
            return data;
        } catch (err) {
            console.error('Failed to load enquiries:', err);
            return [];
        }
    }, []);

    const addEnquiry = useCallback(async (enquiry) => {
        try {
            const newEnquiry = await api.post('/enquiries', enquiry);
            return newEnquiry;
        } catch (err) {
            console.error('Add enquiry failed:', err);
            return null;
        }
    }, []);

    const replyEnquiry = useCallback(async (id, reply) => {
        try {
            await api.put(`/enquiries/${id}/reply`, { reply });
            await loadEnquiries();
        } catch (err) {
            console.error('Reply failed:', err);
        }
    }, [loadEnquiries]);

    const closeEnquiry = useCallback(async (id) => {
        try {
            await api.put(`/enquiries/${id}/close`);
            await loadEnquiries();
        } catch (err) {
            console.error('Close enquiry failed:', err);
        }
    }, [loadEnquiries]);

    const deleteEnquiry = useCallback(async (id) => {
        try {
            await api.delete(`/enquiries/${id}`);
            await loadEnquiries();
        } catch (err) {
            console.error('Delete enquiry failed:', err);
        }
    }, [loadEnquiries]);

    return (
        <EnquiryContext.Provider value={{
            enquiries: state.enquiries,
            addEnquiry,
            replyEnquiry,
            closeEnquiry,
            deleteEnquiry,
            loadEnquiries,
        }}>
            {children}
        </EnquiryContext.Provider>
    );
}

export const useEnquiries = () => {
    const ctx = useContext(EnquiryContext);
    if (!ctx) throw new Error('useEnquiries must be used within EnquiryProvider');
    return ctx;
};
