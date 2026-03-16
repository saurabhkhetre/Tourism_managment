/**
 * Admin Hotels Page
 */
const AdminHotelsPage = {
    async render(container) {
        const hotels = await Store.loadHotels();
        container.innerHTML = `
        <div class="admin-page">
            <div class="admin-page-header"><div><h1>Manage Hotels</h1><p>${hotels.length} hotels</p></div><button class="btn btn-primary" id="add-hotel">${Icons.plus(16)} Add Hotel</button></div>
            <div class="admin-cards-grid" id="hotels-grid">
                ${hotels.map(h => `
                    <div class="admin-card"><div class="admin-card-image"><img src="${h.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'}" alt="${h.name}"></div>
                    <div class="admin-card-body"><h4>${h.name}</h4><p>${Icons.mapPin(14)} ${h.location}</p><p>${Icons.star(14, 'var(--accent)')} ${h.rating} · ₹${h.pricePerNight}/night</p></div>
                    <div class="admin-card-footer"><span class="badge badge-primary">${h.type}</span>
                    <div><button class="btn btn-ghost btn-sm edit-hotel" data-id="${h.id}">${Icons.edit(14)}</button><button class="btn btn-ghost btn-sm del-hotel" data-id="${h.id}" style="color:var(--danger)">${Icons.trash(14)}</button></div></div></div>`).join('')}
            </div>
        </div>`;

        // Create modal in document.body
        let modalEl = document.getElementById('hotel-modal');
        if (modalEl) modalEl.remove();
        modalEl = document.createElement('div');
        modalEl.className = 'modal-backdrop';
        modalEl.id = 'hotel-modal';
        modalEl.style.display = 'none';
        modalEl.innerHTML = `<div class="modal">
            <div class="modal-header"><h3 id="h-modal-title">Add Hotel</h3><button class="btn btn-ghost btn-sm" id="close-h-modal">${Icons.x(18)}</button></div>
            <div class="modal-body"><form id="h-form">
                <div class="form-row"><div class="form-group"><label class="form-label">Name</label><input type="text" class="form-input" id="hf-name" required></div><div class="form-group"><label class="form-label">Location</label><input type="text" class="form-input" id="hf-loc" required></div></div>
                <div class="form-row"><div class="form-group"><label class="form-label">Price/Night (₹)</label><input type="number" class="form-input" id="hf-price" required></div><div class="form-group"><label class="form-label">Rating</label><input type="number" class="form-input" id="hf-rating" min="1" max="5" step="0.1" value="4"></div></div>
                <div class="form-group"><label class="form-label">Image URL</label><input type="text" class="form-input" id="hf-image"></div>
                <div class="form-group"><label class="form-checkbox"><input type="checkbox" id="hf-avail" checked> Available</label></div>
            </form></div>
            <div class="modal-footer"><button class="btn btn-ghost" id="cancel-h">Cancel</button><button class="btn btn-primary" id="save-h">Save</button></div>
        </div>`;
        document.body.appendChild(modalEl);

        let editId = null;
        const modal = modalEl;
        const open = (h = null) => { editId = h?.id || null; document.getElementById('h-modal-title').textContent = h ? 'Edit Hotel' : 'Add Hotel'; document.getElementById('hf-name').value = h?.name || ''; document.getElementById('hf-loc').value = h?.location || ''; document.getElementById('hf-price').value = h?.pricePerNight || ''; document.getElementById('hf-rating').value = h?.rating || 4; document.getElementById('hf-image').value = h?.image || ''; document.getElementById('hf-avail').checked = h?.available !== false; modal.style.display = 'flex'; };
        document.getElementById('add-hotel').addEventListener('click', () => open());
        document.getElementById('close-h-modal').addEventListener('click', () => modal.style.display = 'none');
        document.getElementById('cancel-h').addEventListener('click', () => modal.style.display = 'none');
        document.getElementById('save-h').addEventListener('click', async () => {
            const d = { name: document.getElementById('hf-name').value, location: document.getElementById('hf-loc').value, pricePerNight: Number(document.getElementById('hf-price').value), rating: Number(document.getElementById('hf-rating').value), image: document.getElementById('hf-image').value, available: document.getElementById('hf-avail').checked };
            if (editId) { d.id = editId; await Store.updateHotel(d); Toast.success('Updated!'); } else { await Store.addHotel(d); Toast.success('Added!'); }
            modal.style.display = 'none'; Router.resolve();
        });
        document.querySelectorAll('.edit-hotel').forEach(b => b.addEventListener('click', () => open(hotels.find(h => h.id == b.dataset.id))));
        document.querySelectorAll('.del-hotel').forEach(b => b.addEventListener('click', async () => { if (confirm('Delete?')) { await Store.deleteHotel(b.dataset.id); Toast.success('Deleted'); Router.resolve(); } }));
    }
};
