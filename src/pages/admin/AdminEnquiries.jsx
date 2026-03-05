import { useState, useEffect } from 'react';
import { useEnquiries } from '../../contexts/EnquiryContext';
import { MessageSquare, Send, X, CheckCircle } from 'lucide-react';
import './AdminDashboard.css';

export default function AdminEnquiries() {
    const { enquiries, replyEnquiry, closeEnquiry, deleteEnquiry, loadEnquiries } = useEnquiries();
    const [replyModal, setReplyModal] = useState(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => { loadEnquiries(); }, []);

    const handleReply = async () => {
        if (!replyText.trim()) return;
        await replyEnquiry(replyModal, replyText.trim());
        setReplyModal(null);
        setReplyText('');
    };

    const handleClose = async (id) => await closeEnquiry(id);
    const handleDelete = async (id) => { if (window.confirm('Delete this enquiry?')) await deleteEnquiry(id); };

    const open = enquiries.filter(e => e.status === 'open').length;
    const replied = enquiries.filter(e => e.status === 'replied').length;
    const closed = enquiries.filter(e => e.status === 'closed').length;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div><h1>Manage Enquiries</h1><p>{enquiries.length} total enquiries</p></div>
            </div>

            <div className="admin-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="admin-stat-card">
                    <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}><span style={{ fontSize: '1.2rem' }}>📨</span></div>
                    <div><div className="stat-value">{open}</div><div className="stat-label">Open</div></div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}><span style={{ fontSize: '1.2rem' }}>💬</span></div>
                    <div><div className="stat-value">{replied}</div><div className="stat-label">Replied</div></div>
                </div>
                <div className="admin-stat-card">
                    <div className="stat-icon" style={{ background: '#d1fae5', color: '#059669' }}><span style={{ fontSize: '1.2rem' }}>✅</span></div>
                    <div><div className="stat-value">{closed}</div><div className="stat-label">Closed</div></div>
                </div>
            </div>

            {enquiries.length === 0 ? (
                <div className="empty-state"><MessageSquare size={48} /><h3>No enquiries</h3></div>
            ) : (
                enquiries.map(enq => (
                    <div key={enq.id} className="enquiry-card">
                        <div className="enquiry-header">
                            <h4>{enq.subject}</h4>
                            <span className={`badge badge-${enq.status === 'open' ? 'warning' : enq.status === 'replied' ? 'info' : 'success'}`}>{enq.status}</span>
                        </div>
                        <div className="enquiry-meta">
                            <span>From: <strong>{enq.name}</strong></span>
                            <span>Email: {enq.email}</span>
                            <span>{enq.createdAt}</span>
                        </div>
                        <div className="enquiry-message">{enq.message}</div>
                        {enq.reply && <div className="enquiry-reply"><strong>Reply:</strong> {enq.reply}</div>}
                        <div className="enquiry-actions">
                            {enq.status === 'open' && (
                                <button className="btn btn-primary btn-sm" onClick={() => { setReplyModal(enq.id); setReplyText(''); }}>
                                    <Send size={14} /> Reply
                                </button>
                            )}
                            {enq.status !== 'closed' && (
                                <button className="btn btn-success btn-sm" onClick={() => handleClose(enq.id)}>
                                    <CheckCircle size={14} /> Close
                                </button>
                            )}
                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(enq.id)}>
                                <X size={14} /> Delete
                            </button>
                        </div>
                    </div>
                ))
            )}

            {/* Reply Modal */}
            {replyModal && (
                <div className="modal-backdrop" onClick={() => setReplyModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Reply to Enquiry</h3>
                            <button className="btn btn-ghost btn-icon" onClick={() => setReplyModal(null)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <textarea className="form-textarea" placeholder="Type your reply..." value={replyText} onChange={e => setReplyText(e.target.value)} rows={4} />
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setReplyModal(null)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleReply} disabled={!replyText.trim()}>
                                <Send size={16} /> Send Reply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
