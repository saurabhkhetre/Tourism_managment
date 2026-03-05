import { useState, useEffect } from 'react';
import { Settings, Globe, Phone, Link as LinkIcon, Save, CheckCircle } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import api from '../../api';
import './AdminDashboard.css';

export default function AdminSettings() {
    const [form, setForm] = useState({
        siteName: '', tagline: '', aboutUs: '',
        email: '', phone: '', address: '',
        socialLinks: { facebook: '', instagram: '', twitter: '', youtube: '' },
    });
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        api.get('/settings').then(data => {
            // Merge with default form structure
            setForm(prev => ({
                ...prev,
                ...data,
                socialLinks: { ...prev.socialLinks, ...(data.socialLinks || {}) },
            }));
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('social_')) {
            const key = name.replace('social_', '');
            setForm({ ...form, socialLinks: { ...form.socialLinks, [key]: value } });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await api.put('/settings', form);
            setSaved(true);
            toast.success('Settings saved successfully!');
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            toast.error('Failed to save settings');
        }
    };

    const handleReset = async () => {
        try {
            const defaults = {
                siteName: 'TravelVista',
                tagline: 'Discover the World\'s Beauty',
                aboutUs: '',
                email: 'info@travelvista.com',
                phone: '+91-9876543210',
                address: '123 Travel Hub, New Delhi, India',
                socialLinks: { facebook: '#', instagram: '#', twitter: '#', youtube: '#' },
            };
            await api.put('/settings', defaults);
            setForm(defaults);
            toast.info('Settings reset to defaults.');
        } catch (err) {
            toast.error('Failed to reset settings');
        }
    };

    if (loading) return <div className="admin-page"><p>Loading settings...</p></div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div><h1>Site Settings</h1><p>Manage your website configuration</p></div>
                {saved && (
                    <span className="badge badge-success" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
                        <CheckCircle size={16} /> Settings saved!
                    </span>
                )}
            </div>

            <form className="settings-form" onSubmit={handleSave}>
                <div className="settings-section">
                    <h3><Globe size={20} /> General Settings</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div className="form-group">
                            <label className="form-label">Site Name</label>
                            <input className="form-input" name="siteName" value={form.siteName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tagline</label>
                            <input className="form-input" name="tagline" value={form.tagline} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">About Us</label>
                        <textarea className="form-textarea" name="aboutUs" value={form.aboutUs} onChange={handleChange} rows={4} />
                    </div>
                </div>

                <div className="settings-section">
                    <h3><Phone size={20} /> Contact Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input className="form-input" name="email" value={form.email} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input className="form-input" name="phone" value={form.phone} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Address</label>
                        <input className="form-input" name="address" value={form.address} onChange={handleChange} />
                    </div>
                </div>

                <div className="settings-section">
                    <h3><LinkIcon size={20} /> Social Links</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div className="form-group">
                            <label className="form-label">Facebook</label>
                            <input className="form-input" name="social_facebook" value={form.socialLinks?.facebook || ''} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Instagram</label>
                            <input className="form-input" name="social_instagram" value={form.socialLinks?.instagram || ''} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Twitter</label>
                            <input className="form-input" name="social_twitter" value={form.socialLinks?.twitter || ''} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">YouTube</label>
                            <input className="form-input" name="social_youtube" value={form.socialLinks?.youtube || ''} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                    <button type="button" className="btn btn-ghost" onClick={handleReset}>Reset to Default</button>
                    <button type="submit" className="btn btn-primary btn-lg">
                        <Save size={18} /> Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
}
