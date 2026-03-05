/**
 * Admin Enquiries Page
 */
const AdminEnquiriesPage = {
    async render(container) {
        const enquiries = await Store.loadEnquiries();
        container.innerHTML = `
        <div class="admin-page">
            <div class="admin-page-header"><div><h1>Manage Enquiries</h1><p>${enquiries.length} enquiries</p></div></div>
            <div id="enq-list">
                ${enquiries.length === 0 ? '<div class="empty-state"><p>No enquiries.</p></div>' :
                enquiries.map(e => `
                    <div class="enquiry-card">
                        <div class="enquiry-header"><h4>${e.subject || 'No Subject'}</h4><span class="badge badge-${e.status === 'open' ? 'warning' : e.status === 'replied' ? 'primary' : 'success'}">${e.status}</span></div>
                        <div class="enquiry-meta"><span>${e.name}</span><span>${e.email}</span><span>${e.createdAt}</span></div>
                        <div class="enquiry-message">${e.message}</div>
                        ${e.reply ? `<div class="enquiry-reply"><strong>Reply:</strong> ${e.reply}</div>` : ''}
                        <div class="enquiry-actions">
                            ${e.status === 'open' ? `<button class="btn btn-primary btn-sm reply-enq" data-id="${e.id}">${Icons.reply(14)} Reply</button>` : ''}
                            ${e.status !== 'closed' ? `<button class="btn btn-secondary btn-sm close-enq" data-id="${e.id}">Close</button>` : ''}
                            <button class="btn btn-ghost btn-sm del-enq" data-id="${e.id}" style="color:var(--danger)">${Icons.trash(14)}</button>
                        </div>
                    </div>`).join('')}
            </div>
        </div>

        <div class="modal-backdrop" id="reply-modal" style="display:none"><div class="modal">
            <div class="modal-header"><h3>Reply to Enquiry</h3><button class="btn btn-ghost btn-sm" id="close-reply-modal">${Icons.x(18)}</button></div>
            <div class="modal-body"><textarea class="form-textarea" id="reply-text" placeholder="Type your reply..."></textarea></div>
            <div class="modal-footer"><button class="btn btn-primary" id="send-reply">Send Reply</button></div>
        </div></div>`;

        let replyId = null;
        document.querySelectorAll('.reply-enq').forEach(btn => {
            btn.addEventListener('click', () => { replyId = btn.dataset.id; document.getElementById('reply-modal').style.display = 'flex'; });
        });
        document.getElementById('close-reply-modal')?.addEventListener('click', () => document.getElementById('reply-modal').style.display = 'none');
        document.getElementById('send-reply')?.addEventListener('click', async () => {
            const text = document.getElementById('reply-text').value;
            if (text && replyId) { await Store.replyEnquiry(replyId, text); document.getElementById('reply-modal').style.display = 'none'; Toast.success('Reply sent!'); Router.resolve(); }
        });
        document.querySelectorAll('.close-enq').forEach(btn => btn.addEventListener('click', async () => { await Store.closeEnquiry(btn.dataset.id); Toast.info('Closed'); Router.resolve(); }));
        document.querySelectorAll('.del-enq').forEach(btn => btn.addEventListener('click', async () => { if (confirm('Delete?')) { await Store.deleteEnquiry(btn.dataset.id); Toast.success('Deleted'); Router.resolve(); } }));
    }
};
