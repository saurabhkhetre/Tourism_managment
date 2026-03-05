import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../components/ui/Toast';
import { Users, Plus, Edit, Trash2, X } from 'lucide-react';
import api from '../../api';
import './AdminDashboard.css';

const emptyForm = { name: '', type: 'Car', capacity: '', pricePerDay: '', image: '' };

export default function AdminTransport() {
    const [vehicles, setVehicles] = useState([]);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    const loadVehicles = useCallback(async () => {
        try {
            const data = await api.get('/transport');
            setVehicles(data);
        } catch (err) {
            console.error('Failed to load transport:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadVehicles(); }, [loadVehicles]);

    const openAdd = () => { setForm({ ...emptyForm }); setModal('add'); };
    const openEdit = (v) => { setForm({ ...v, capacity: String(v.capacity), pricePerDay: String(v.pricePerDay) }); setModal(v); };

    const handleSave = async (e) => {
        e.preventDefault();
        const data = { ...form, capacity: Number(form.capacity), pricePerDay: Number(form.pricePerDay) };
        try {
            if (modal === 'add') {
                await api.post('/transport', data);
                toast.success('Vehicle added successfully!');
            } else {
                await api.put(`/transport/${data.id}`, data);
                toast.success('Vehicle updated!');
            }
            await loadVehicles();
            setModal(null);
        } catch (err) {
            toast.error('Save failed: ' + (err.message || 'Unknown error'));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this vehicle?')) {
            try {
                await api.delete(`/transport/${id}`);
                toast.success('Vehicle deleted.');
                await loadVehicles();
            } catch (err) {
                toast.error('Delete failed');
            }
        }
    };

    const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

    if (loading) return <div className="admin-page"><p>Loading vehicles...</p></div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div><h1>Transport Management</h1><p>{vehicles.length} vehicles registered</p></div>
                <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Vehicle</button>
            </div>

            <div className="admin-cards-grid">
                {vehicles.map(v => (
                    <div key={v.id} className="admin-card">
                        <div className="admin-card-image">
                            <img src={v.image} alt={v.name} />
                        </div>
                        <div className="admin-card-body">
                            <h4>{v.name}</h4>
                            <p>Type: {v.type}</p>
                            <p style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={14} /> Capacity: {v.capacity}</p>
                        </div>
                        <div className="admin-card-footer">
                            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>₹{v.pricePerDay?.toLocaleString()}/day</span>
                            <div style={{ display: 'flex', gap: 4 }}>
                                <span className="badge badge-primary" style={{ marginRight: 8 }}>{v.type}</span>
                                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(v)} title="Edit"><Edit size={14} /></button>
                                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(v.id)} title="Delete"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {modal && (
                <div className="modal-backdrop" onClick={() => setModal(null)}>
                    <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{modal === 'add' ? 'Add Vehicle' : 'Edit Vehicle'}</h3>
                            <button className="btn btn-ghost btn-icon" onClick={() => setModal(null)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="modal-body">
                                <div className="form-group"><label className="form-label">Vehicle Name *</label><input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required /></div>
                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label className="form-label">Type</label>
                                        <select className="form-select" value={form.type} onChange={e => set('type', e.target.value)}>
                                            {['Car', 'Bus', 'Mini Bus', 'Bike', 'SUV', 'Van'].map(t => <option key={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group"><label className="form-label">Capacity</label><input className="form-input" type="number" value={form.capacity} onChange={e => set('capacity', e.target.value)} required /></div>
                                </div>
                                <div className="form-group"><label className="form-label">₹ Per Day *</label><input className="form-input" type="number" value={form.pricePerDay} onChange={e => set('pricePerDay', e.target.value)} required /></div>
                                <div className="form-group"><label className="form-label">Image URL</label><input className="form-input" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." /></div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{modal === 'add' ? 'Add Vehicle' : 'Save Changes'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
