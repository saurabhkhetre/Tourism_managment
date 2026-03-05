import { useState, useEffect } from 'react';
import { usePackages } from '../../contexts/PackageContext';
import { useToast } from '../../components/ui/Toast';
import { Search, Plus, Edit, Trash2, Eye, EyeOff, X, Star } from 'lucide-react';
import './AdminDashboard.css';

const CATEGORIES = ['Beach', 'Mountain', 'Adventure', 'Heritage', 'Nature', 'Cultural'];

const emptyForm = {
    title: '', location: '', duration: '', price: '', originalPrice: '',
    maxPersons: '', category: 'Beach', description: '', image: '',
    active: true, featured: false,
    highlightsText: '',
    inclusionsText: '',
    exclusionsText: '',
    itineraryText: '',
};

function formFromPackage(pkg) {
    return {
        ...pkg,
        price: String(pkg.price),
        originalPrice: String(pkg.originalPrice),
        maxPersons: String(pkg.maxPersons),
        highlightsText: (pkg.highlights || []).join(', '),
        inclusionsText: (pkg.inclusions || []).join(', '),
        exclusionsText: (pkg.exclusions || []).join(', '),
        itineraryText: (pkg.itinerary || []).map(d => `Day ${d.day}: ${d.title} - ${d.description}`).join('\n'),
    };
}

function parseItinerary(text) {
    if (!text.trim()) return [];
    return text.split('\n').filter(l => l.trim()).map((line, i) => {
        const match = line.match(/^Day\s*(\d+)\s*:\s*(.+?)\s*-\s*(.+)$/i);
        if (match) {
            return { day: parseInt(match[1]), title: match[2].trim(), description: match[3].trim() };
        }
        return { day: i + 1, title: line.trim(), description: '' };
    });
}

function parseCSV(text) {
    if (!text.trim()) return [];
    return text.split(',').map(s => s.trim()).filter(Boolean);
}

export default function AdminPackages() {
    const { packages, addPackage, updatePackage, deletePackage, toggleActive, loadAllPackages } = usePackages();
    const toast = useToast();
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(emptyForm);

    useEffect(() => { loadAllPackages(); }, []);

    const filtered = packages.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase())
    );

    const openAdd = () => {
        setForm({ ...emptyForm });
        setModal('add');
    };

    const openEdit = (pkg) => {
        setForm(formFromPackage(pkg));
        setModal(pkg);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const data = {
            ...form,
            price: Number(form.price),
            originalPrice: Number(form.originalPrice),
            maxPersons: Number(form.maxPersons),
            highlights: parseCSV(form.highlightsText),
            inclusions: parseCSV(form.inclusionsText),
            exclusions: parseCSV(form.exclusionsText),
            itinerary: parseItinerary(form.itineraryText),
            gallery: form.image ? [form.image] : [],
        };
        // Clean up text fields before saving
        delete data.highlightsText;
        delete data.inclusionsText;
        delete data.exclusionsText;
        delete data.itineraryText;

        if (modal === 'add') {
            await addPackage(data);
            toast.success('Package added successfully!');
        } else {
            await updatePackage(data);
            toast.success('Package updated successfully!');
        }
        setModal(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this package permanently?')) {
            await deletePackage(id);
            toast.success('Package deleted successfully.');
        }
    };

    const handleToggle = async (id, isActive) => {
        await toggleActive(id);
        toast.info(isActive ? 'Package deactivated.' : 'Package activated.');
    };

    const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div><h1>Manage Packages</h1><p>{packages.length} total packages</p></div>
                <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Package</button>
            </div>

            <div className="admin-table-container">
                <div className="admin-table-header">
                    <div className="admin-search">
                        <Search size={16} />
                        <input placeholder="Search packages..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Package</th>
                            <th>Location</th>
                            <th>Price</th>
                            <th>Duration</th>
                            <th>Rating</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No packages found.</td></tr>
                        ) : filtered.map(p => (
                            <tr key={p.id}>
                                <td style={{ fontWeight: 600, maxWidth: 200 }}>{p.title}</td>
                                <td>{p.location}</td>
                                <td>₹{p.price?.toLocaleString()}</td>
                                <td>{p.duration}</td>
                                <td><span style={{ color: 'var(--accent)' }}>⭐ {p.rating}</span></td>
                                <td>
                                    <span className={`badge ${p.active ? 'badge-success' : 'badge-danger'}`}>
                                        {p.active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <div className="admin-table-actions">
                                        <button className="btn btn-ghost btn-sm" onClick={() => handleToggle(p.id, p.active)} title={p.active ? 'Deactivate' : 'Activate'}>
                                            {p.active ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)} title="Edit"><Edit size={15} /></button>
                                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(p.id)} title="Delete"><Trash2 size={15} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modal && (
                <div className="modal-backdrop" onClick={() => setModal(null)}>
                    <div className="modal" style={{ maxWidth: 660 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{modal === 'add' ? 'Add New Package' : 'Edit Package'}</h3>
                            <button className="btn btn-ghost btn-icon" onClick={() => setModal(null)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Package Title *</label>
                                    <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Magical Goa Beach Getaway" required />
                                </div>
                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label className="form-label">Location *</label>
                                        <input className="form-input" value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Goa, India" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Duration *</label>
                                        <input className="form-input" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="4 Days / 3 Nights" required />
                                    </div>
                                </div>
                                <div className="form-row-3">
                                    <div className="form-group">
                                        <label className="form-label">Price (₹) *</label>
                                        <input className="form-input" type="number" value={form.price} onChange={e => set('price', e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Original Price (₹)</label>
                                        <input className="form-input" type="number" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Max Persons</label>
                                        <input className="form-input" type="number" value={form.maxPersons} onChange={e => set('maxPersons', e.target.value)} required />
                                    </div>
                                </div>
                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label className="form-label">Category</label>
                                        <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Image URL</label>
                                        <input className="form-input" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea className="form-textarea" value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Describe the tour package..." />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Highlights <span className="form-hint">(comma separated)</span></label>
                                    <input className="form-input" value={form.highlightsText} onChange={e => set('highlightsText', e.target.value)} placeholder="Beach Visit, Water Sports, Heritage Walk" />
                                </div>
                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label className="form-label">Inclusions <span className="form-hint">(comma separated)</span></label>
                                        <input className="form-input" value={form.inclusionsText} onChange={e => set('inclusionsText', e.target.value)} placeholder="Hotel, Meals, Transport" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Exclusions <span className="form-hint">(comma separated)</span></label>
                                        <input className="form-input" value={form.exclusionsText} onChange={e => set('exclusionsText', e.target.value)} placeholder="Flights, Personal Expenses" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Itinerary <span className="form-hint">(one day per line: Day 1: Title - Description)</span></label>
                                    <textarea className="form-textarea" value={form.itineraryText} onChange={e => set('itineraryText', e.target.value)} rows={4} placeholder={"Day 1: Arrival & Explore - Airport pickup, check-in, evening sightseeing\nDay 2: Adventure Day - Full day activities and tours"} />
                                </div>
                                <div style={{ display: 'flex', gap: 20 }}>
                                    <label className="form-checkbox">
                                        <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
                                        <span>Featured Package</span>
                                    </label>
                                    <label className="form-checkbox">
                                        <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} />
                                        <span>Active</span>
                                    </label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{modal === 'add' ? 'Add Package' : 'Save Changes'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
