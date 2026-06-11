/**
 * Dashboard Page Controller
 * Handles user panels, upcoming/past booking displays, favorites grid, and visit schedules
 */

document.addEventListener('DOMContentLoaded', () => {
  const user = getStoredUser();

  const lockBlock = document.getElementById('dashboard-lock-block');
  const mainView = document.getElementById('dashboard-main-view');

  if (!user) {
    // Show Lock Screen
    if (lockBlock && mainView) {
      lockBlock.style.display = 'block';
      mainView.style.display = 'none';

      // Bind Login modal trigger
      const triggerBtn = document.getElementById('lock-trigger-login-btn');
      if (triggerBtn) {
        triggerBtn.addEventListener('click', () => {
          const authBtn = document.getElementById('auth-nav-btn');
          if (authBtn) authBtn.click(); // simulated trigger
        });
      }
    }
  } else {
    // Show Main Dashboard
    if (lockBlock && mainView) {
      lockBlock.style.display = 'none';
      mainView.style.display = 'grid';
    }

    initDashboardPanels();
  }
});

function initDashboardPanels() {
  // Bind Tab switching
  const tabs = document.querySelectorAll('.dash-menu-item');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const panelId = tab.dataset.panel;
      document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
      const targetPanel = document.getElementById(`panel-${panelId}`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // Render all active states
  renderUpcomingBookings();
  renderPastBookings();
  renderFavoritesGrid();
  renderVisitsList();
}

/* ==========================================================================
   1. Render Upcoming Bookings
   ========================================================================== */
function renderUpcomingBookings() {
  const root = document.getElementById('upcoming-bookings-root');
  if (!root) return;

  const bookings = getStoredBookings();

  if (bookings.length === 0) {
    root.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📅</div>
        <h3>No upcoming bookings found</h3>
        <p style="color:var(--text-secondary); margin-bottom:20px;">You haven't booked any function halls yet.</p>
        <a href="halls.html" class="btn btn-primary btn-sm">Browse Venues</a>
      </div>
    `;
    return;
  }

  let html = '';
  bookings.forEach(b => {
    html += `
      <div class="booking-item-card glass-panel reveal-on-scroll">
        <div class="booking-item-details">
          <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">ID: ${b.bookingId}</span>
          <h4 style="margin-top: 4px;">${b.hallName}</h4>
          <div class="booking-item-meta">
            <span>📅 Date: <b>${b.eventDate}</b></span>
            <span>💍 Event: <b>${b.eventType}</b></span>
            <span>👥 Guests: <b>${b.guestsCount}</b></span>
          </div>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:8px;">
            Services: ${b.services.length > 0 ? b.services.map(s => s.toUpperCase()).join(', ') : 'None selected'}
          </p>
        </div>
        <div style="text-align: right; display:flex; flex-direction:column; gap:12px; align-items:flex-end;">
          <span class="badge badge-success">Confirmed</span>
          <div style="font-size:1.15rem; font-weight:800; color:var(--text-primary);">₹${b.pricePaid.toLocaleString('en-IN')}</div>
          <button class="btn btn-outline btn-sm cancel-booking-btn" data-id="${b.bookingId}" style="border-color:var(--error); color:var(--error); padding: 4px 8px; font-size:0.75rem;">
            Cancel Booking
          </button>
        </div>
      </div>
    `;
  });

  root.innerHTML = html;

  // Bind Cancel buttons
  document.querySelectorAll('.cancel-booking-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const bId = btn.dataset.id;
      if (confirm(`Are you sure you want to cancel booking ${bId}? This action cannot be undone.`)) {
        let list = getStoredBookings();
        list = list.filter(b => b.bookingId !== bId);
        localStorage.setItem('function_hall_bookings', JSON.stringify(list));

        showNotification(`Booking ${bId} has been cancelled`, 'info');
        renderUpcomingBookings(); // Redraw
      }
    });
  });

  if (typeof initScrollReveal !== 'undefined') initScrollReveal();
}

/* ==========================================================================
   2. Render Past Bookings (Realistic Seeded Data)
   ========================================================================== */
function renderPastBookings() {
  const root = document.getElementById('past-bookings-root');
  if (!root) return;

  const pastBookings = [
    {
      bookingId: 'BKG-209481',
      hallName: 'Glow Gardens Banquets',
      eventDate: '2025-11-14',
      eventType: 'Anniversary',
      guestsCount: 200,
      pricePaid: 65000,
      status: 'Completed'
    },
    {
      bookingId: 'BKG-104823',
      hallName: 'Orchid Banquet & Conference Hall',
      eventDate: '2025-12-05',
      eventType: 'Birthday Party',
      guestsCount: 100,
      pricePaid: 45000,
      status: 'Completed'
    }
  ];

  let html = '';
  pastBookings.forEach(pb => {
    html += `
      <div class="booking-item-card glass-panel" style="opacity:0.8;">
        <div class="booking-item-details">
          <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">ID: ${pb.bookingId}</span>
          <h4 style="margin-top: 4px;">${pb.hallName}</h4>
          <div class="booking-item-meta">
            <span>📅 Date: <b>${pb.eventDate}</b></span>
            <span>🎂 Event: <b>${pb.eventType}</b></span>
            <span>👥 Guests: <b>${pb.guestsCount}</b></span>
          </div>
        </div>
        <div style="text-align: right; display:flex; flex-direction:column; gap:12px; align-items:flex-end;">
          <span class="badge" style="background:#e2e8f0; color:#475569;">Completed</span>
          <div style="font-size:1.15rem; font-weight:800; color:var(--text-muted);">₹${pb.pricePaid.toLocaleString('en-IN')}</div>
        </div>
      </div>
    `;
  });

  root.innerHTML = html;
}

/* ==========================================================================
   3. Render Favorites Grid
   ========================================================================== */
function renderFavoritesGrid() {
  const root = document.getElementById('favorite-halls-root');
  if (!root) return;

  const favIds = getStoredFavorites();
  const halls = HALLS_DATA.filter(h => favIds.includes(h.id));

  if (halls.length === 0) {
    root.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">❤️</div>
        <h3>No saved halls found</h3>
        <p style="color:var(--text-secondary); margin-bottom:20px;">Save venues by clicking the heart icon on any card.</p>
        <a href="halls.html" class="btn btn-primary btn-sm">Find Venues</a>
      </div>
    `;
    return;
  }

  let html = '';
  halls.forEach(hall => {
    html += `
      <div class="card reveal-on-scroll">
        <div class="card-img-wrapper" style="aspect-ratio:16/9;">
          <img src="${hall.images[0]}" alt="${hall.name}">
          <div class="card-badge">${hall.ac ? 'AC Hall' : 'Non-AC'}</div>
        </div>
        <div class="card-content" style="padding: 20px;">
          <h3 class="card-title" style="font-size:1.15rem; margin-bottom:4px;"><a href="hall-details.html?id=${hall.id}">${hall.name}</a></h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:12px;">📍 ${hall.city}</p>
          <div style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">
            👥 Capacity: <b>${hall.capacity} guests</b>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px dashed var(--glass-border); padding-top:12px;">
            <button class="btn btn-outline btn-sm remove-fav-btn" data-id="${hall.id}" style="border-color:var(--error); color:var(--error); padding:6px 12px;">Remove</button>
            <a href="hall-details.html?id=${hall.id}" class="btn btn-primary btn-sm" style="padding:6px 12px;">View Details</a>
          </div>
        </div>
      </div>
    `;
  });

  root.innerHTML = html;

  // Bind Remove buttons
  document.querySelectorAll('.remove-fav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      toggleFavorite(id);
      showNotification('Removed from favorites', 'info');
      renderFavoritesGrid(); // Redraw
    });
  });

  if (typeof initScrollReveal !== 'undefined') initScrollReveal();
}

/* ==========================================================================
   4. Render Scheduled Visits
   ========================================================================== */
function renderVisitsList() {
  const root = document.getElementById('scheduled-visits-root');
  if (!root) return;

  const visits = getStoredVisits();

  if (visits.length === 0) {
    root.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">👣</div>
        <h3>No tour visits scheduled</h3>
        <p style="color:var(--text-secondary);">Go to a venue details page to request a guided visit tour.</p>
      </div>
    `;
    return;
  }

  let html = '';
  visits.forEach(v => {
    html += `
      <div class="booking-item-card glass-panel reveal-on-scroll">
        <div>
          <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Tour Request: #${v.id}</span>
          <h4 style="margin-top: 4px;">${v.hallName}</h4>
          <div style="font-size:0.85rem; color:var(--text-secondary); margin-top:8px;">
            <span>📅 Target Date: <b>${v.date}</b></span>
            <span style="margin-left: 20px;">⏰ Preferred Slot: <b>${v.time}</b></span>
          </div>
        </div>
        <div style="text-align: right; display:flex; flex-direction:column; gap:8px;">
          <span class="badge" style="background:#fef3c7; color:#92400e;">Scheduled</span>
          <p style="font-size:0.75rem; color:var(--text-muted);">Guided physical visit</p>
        </div>
      </div>
    `;
  });

  root.innerHTML = html;

  if (typeof initScrollReveal !== 'undefined') initScrollReveal();
}
