import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../components/ui/Toast';
import { Star, MapPin, Plus, Edit, Trash2, X } from 'lucide-react';
import api from '../../api';
import './AdminDashboard.css';

const emptyForm = { name: '', location: '', rating: '', pricePerNight: '', capacity: '', type: 'Hotel', image: '' };

export default function AdminHotels() {
    const [hotels, setHotels] = useState([]);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    const loadHotels = useCallback(async () => {
        try {
            const data = await api.get('/hotels');
            setHotels(data);
        } catch (err) {
            console.error('Failed to load hotels:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadHotels(); }, [loadHotels]);

    const openAdd = () => { setForm({ ...emptyForm }); setModal('add'); };
    const openEdit = (h) => { setForm({ ...h, rating: String(h.rating), pricePerNight: String(h.pricePerNight), capacity: String(h.capacity) }); setModal(h); };

    const handleSave = async (e) => {
        e.preventDefault();
        const data = { ...form, rating: parseFloat(form.rating), pricePerNight: Number(form.pricePerNight), capacity: Number(form.capacity) };
        try {
            if (modal === 'add') {
                await api.post('/hotels', data);
                toast.success('Hotel added successfully!');
            } else {
                await api.put(`/hotels/${data.id}`, data);
                toast.success('Hotel updated!');
            }
            await loadHotels();
            setModal(null);
        } catch (err) {
            toast.error('Save failed: ' + (err.message || 'Unknown error'));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this hotel?')) {
            try {
                await api.delete(`/hotels/${id}`);
                toast.success('Hotel deleted.');
                await loadHotels();
            } catch (err) {
                toast.error('Delete failed');
            }
        }
    };

    const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

    if (loading) return <div className="admin-page"><p>Loading hotels...</p></div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div><h1>Hotel Management</h1><p>{hotels.length} hotels registered</p></div>
                <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Hotel</button>
            </div>

            <div className="admin-cards-grid">
                {hotels.map(h => (
                    <div key={h.id} className="admin-card">
                        <div className="admin-card-image">
                            <img src={h.image} alt={h.name} />
                        </div>
                        <div className="admin-card-body">
                            <h4>{h.name}</h4>
                            <p style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {h.location}</p>
                            <p>Type: {h.type} • Capacity: {h.capacity} rooms</p>
                        </div>
                        <div className="admin-card-footer">
                            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>₹{h.pricePerNight?.toLocaleString()}/night</span>
                            <div style={{ display: 'flex', gap: 4 }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent)', fontWeight: 600, marginRight: 8 }}>
                                    <Star size={14} fill="currentColor" /> {h.rating}
                                </span>
                                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(h)} title="Edit"><Edit size={14} /></button>
                                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(h.id)} title="Delete"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {modal && (
                <div className="modal-backdrop" onClick={() => setModal(null)}>
                    <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{modal === 'add' ? 'Add Hotel' : 'Edit Hotel'}</h3>
                            <button className="btn btn-ghost btn-icon" onClick={() => setModal(null)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="modal-body">
                                <div className="form-group"><label className="form-label">Hotel Name *</label><input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required /></div>
                                <div className="form-row-2">
                                    <div className="form-group"><label className="form-label">Location *</label><input className="form-input" value={form.location} onChange={e => set('location', e.target.value)} required /></div>
                                    <div className="form-group">
                                        <label className="form-label">Type</label>
                                        <select className="form-select" value={form.type} onChange={e => set('type', e.target.value)}>
                                            {['Hotel', 'Resort', 'Luxury', 'Heritage', 'Lodge', 'Hostel'].map(t => <option key={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row-3">
                                    <div className="form-group"><label className="form-label">Rating</label><input className="form-input" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => set('rating', e.target.value)} /></div>
                                    <div className="form-group"><label className="form-label">₹ Per Night</label><input className="form-input" type="number" value={form.pricePerNight} onChange={e => set('pricePerNight', e.target.value)} required /></div>
                                    <div className="form-group"><label className="form-label">Capacity</label><input className="form-input" type="number" value={form.capacity} onChange={e => set('capacity', e.target.value)} /></div>
                                </div>
                                <div className="form-group"><label className="form-label">Image URL</label><input className="form-input" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." /></div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{modal === 'add' ? 'Add Hotel' : 'Save Changes'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
