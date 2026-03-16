/**
 * TravelVista — Global State Store
 * Replaces React Contexts with a simple pub/sub state management.
 */
const Store = {
    _state: {
        user: JSON.parse(localStorage.getItem('tv_auth') || 'null'),
        isAuthenticated: !!localStorage.getItem('tv_auth'),
        users: [],
        packages: [],
        packagesLoading: false,
        bookings: [],
        reviews: [],
        enquiries: [],
    },
    _listeners: [],

    get(key) { return this._state[key]; },
    getAll() { return { ...this._state }; },

    set(key, value) {
        this._state[key] = value;
        this._listeners.forEach(fn => fn(key, value));
    },

    subscribe(fn) {
        this._listeners.push(fn);
        return () => { this._listeners = this._listeners.filter(l => l !== fn); };
    },

    // ── Auth ──
    async login(email, password) {
        try {
            const data = await api.post('/auth/login', { email, password });
            if (data.success) {
                api.setToken(data.token);
                this.set('user', data.user);
                this.set('isAuthenticated', true);
                localStorage.setItem('tv_auth', JSON.stringify(data.user));
                return { success: true, user: data.user };
            }
            return { success: false, message: data.message || 'Login failed' };
        } catch (err) {
            return { success: false, message: err.message || 'Invalid email or password' };
        }
    },

    async register(userData) {
        try {
            const data = await api.post('/auth/register', userData);
            if (data.success) {
                api.setToken(data.token);
                this.set('user', data.user);
                this.set('isAuthenticated', true);
                localStorage.setItem('tv_auth', JSON.stringify(data.user));
                return { success: true, user: data.user };
            }
            return { success: false, message: data.message || 'Registration failed' };
        } catch (err) {
            return { success: false, message: err.message || 'Registration failed' };
        }
    },

    logout() {
        api.clearToken();
        this.set('user', null);
        this.set('isAuthenticated', false);
        this.set('users', []);
        localStorage.removeItem('tv_auth');
    },

    async updateProfile(updates) {
        try {
            const user = await api.put('/auth/profile', updates);
            this.set('user', user);
            localStorage.setItem('tv_auth', JSON.stringify(user));
        } catch (err) { console.error('Profile update failed:', err); }
    },

    async getAllUsers() {
        try {
            const users = await api.get('/users');
            this.set('users', users);
            return users;
        } catch (err) { console.error('Failed to fetch users:', err); return []; }
    },

    async toggleUserBlock(userId) {
        try { await api.put(`/users/${userId}/toggle`); await this.getAllUsers(); } catch (err) { console.error(err); }
    },

    async deleteUser(userId) {
        try { await api.delete(`/users/${userId}`); await this.getAllUsers(); } catch (err) { console.error(err); }
    },

    // ── Packages ──
    async loadPackages() {
        this.set('packagesLoading', true);
        try {
            const data = await api.get('/packages');
            this.set('packages', data);
        } catch (err) { console.error('Failed to load packages:', err); }
        this.set('packagesLoading', false);
    },

    async loadAllPackages() {
        try {
            const data = await api.get('/packages/all');
            this.set('packages', data);
            return data;
        } catch (err) {
            await this.loadPackages();
            return this._state.packages;
        }
    },

    async addPackage(pkg) {
        try { const p = await api.post('/packages', pkg); await this.loadAllPackages(); return p; }
        catch (err) { console.error(err); return null; }
    },

    async updatePackage(pkg) {
        try { await api.put(`/packages/${pkg.id}`, pkg); await this.loadAllPackages(); }
        catch (err) { console.error(err); }
    },

    async deletePackage(id) {
        try { await api.delete(`/packages/${id}`); await this.loadAllPackages(); }
        catch (err) { console.error(err); }
    },

    async togglePackageActive(id) {
        try { await api.patch(`/packages/${id}/toggle`); await this.loadAllPackages(); }
        catch (err) { console.error(err); }
    },

    getPackage(id) { return this._state.packages.find(p => p.id == id); },
    getActivePackages() { return this._state.packages.filter(p => p.active); },
    getFeaturedPackages() { return this._state.packages.filter(p => p.featured && p.active); },

    searchPackages(query, filters = {}) {
        let result = this._state.packages.filter(p => p.active);
        if (query) {
            const q = query.toLowerCase();
            result = result.filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
        }
        if (filters.category) result = result.filter(p => p.category === filters.category);
        if (filters.minPrice) result = result.filter(p => p.price >= filters.minPrice);
        if (filters.maxPrice) result = result.filter(p => p.price <= filters.maxPrice);
        if (filters.sortBy) {
            switch (filters.sortBy) {
                case 'price-low': result.sort((a, b) => a.price - b.price); break;
                case 'price-high': result.sort((a, b) => b.price - a.price); break;
                case 'rating': result.sort((a, b) => b.rating - a.rating); break;
                case 'popular': result.sort((a, b) => b.reviewCount - a.reviewCount); break;
            }
        }
        return result;
    },

    // ── Bookings ──
    async loadAllBookings() {
        try { const d = await api.get('/bookings'); this.set('bookings', d); return d; }
        catch (err) { console.error(err); return []; }
    },

    async loadMyBookings() {
        try { const d = await api.get('/bookings/my'); this.set('bookings', d); return d; }
        catch (err) { console.error(err); return []; }
    },

    async createBooking(data) {
        try { return await api.post('/bookings', data); }
        catch (err) { console.error(err); return null; }
    },

    async updateBookingStatus(bookingId, status) {
        try { await api.put(`/bookings/${bookingId}/status`, { status }); await this.loadAllBookings(); }
        catch (err) { console.error(err); }
    },

    async cancelBooking(id) {
        try { await api.put(`/bookings/${id}/cancel`); await this.loadMyBookings(); }
        catch (err) { console.error(err); }
    },

    async confirmPayment(bookingId, method) {
        try { await api.put(`/bookings/${bookingId}/pay`, { paymentMethod: method }); await this.loadMyBookings(); }
        catch (err) { console.error(err); }
    },

    getTotalRevenue() {
        return this._state.bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmount, 0);
    },

    getMonthlyRevenue() {
        const months = {};
        this._state.bookings.filter(b => b.paymentStatus === 'paid').forEach(b => {
            const m = b.createdAt.slice(0, 7);
            months[m] = (months[m] || 0) + b.totalAmount;
        });
        return Object.entries(months).map(([month, revenue]) => ({ month, revenue }));
    },

    // ── Reviews ──
    async loadRecentReviews() {
        try { const d = await api.get('/reviews/recent'); this.set('reviews', d); return d; }
        catch (err) { console.error(err); return []; }
    },

    async loadAllReviews() {
        try { const d = await api.get('/reviews'); this.set('reviews', d); return d; }
        catch (err) { console.error(err); return []; }
    },

    async addReview(review) {
        try { const r = await api.post('/reviews', review); await this.loadRecentReviews(); return r; }
        catch (err) { console.error(err); return null; }
    },

    async deleteReview(id) {
        try { await api.delete(`/reviews/${id}`); await this.loadAllReviews(); }
        catch (err) { console.error(err); }
    },

    async getPackageReviews(packageId) {
        try { const d = await api.get(`/reviews/package/${packageId}`); return d.reviews || []; }
        catch (err) { return []; }
    },

    // ── Enquiries ──
    async loadEnquiries() {
        try { const d = await api.get('/enquiries'); this.set('enquiries', d); return d; }
        catch (err) { console.error(err); return []; }
    },

    async addEnquiry(enquiry) {
        try { return await api.post('/enquiries', enquiry); }
        catch (err) { console.error(err); return null; }
    },

    async replyEnquiry(id, reply) {
        try { await api.put(`/enquiries/${id}/reply`, { reply }); await this.loadEnquiries(); }
        catch (err) { console.error(err); }
    },

    async closeEnquiry(id) {
        try { await api.put(`/enquiries/${id}/close`); await this.loadEnquiries(); }
        catch (err) { console.error(err); }
    },

    async deleteEnquiry(id) {
        try { await api.delete(`/enquiries/${id}`); await this.loadEnquiries(); }
        catch (err) { console.error(err); }
    },

    // ── Hotels & Transport (admin) ──
    async loadHotels() {
        try { return await api.get('/hotels'); } catch { return []; }
    },
    async addHotel(h) {
        try { return await api.post('/hotels', h); } catch { return null; }
    },
    async updateHotel(h) {
        try { await api.put(`/hotels/${h.id}`, h); } catch (e) { console.error(e); }
    },
    async deleteHotel(id) {
        try { await api.delete(`/hotels/${id}`); } catch (e) { console.error(e); }
    },
    async loadTransport() {
        try { return await api.get('/transport'); } catch { return []; }
    },
    async addTransport(t) {
        try { return await api.post('/transport', t); } catch { return null; }
    },
    async updateTransport(t) {
        try { await api.put(`/transport/${t.id}`, t); } catch (e) { console.error(e); }
    },
    async deleteTransport(id) {
        try { await api.delete(`/transport/${id}`); } catch (e) { console.error(e); }
    },

    // ── Settings ──
    async loadSettings() {
        try { return await api.get('/settings'); } catch { return {}; }
    },
    async saveSettings(settings) {
        try { return await api.put('/settings', settings); } catch (e) { console.error(e); return null; }
    },
};
