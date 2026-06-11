/**
 * Compare Halls Controller
 * Handles Rendering comparison tables and removing items
 */

document.addEventListener('DOMContentLoaded', () => {
  renderComparisonMatrix();
});

function renderComparisonMatrix() {
  const root = document.getElementById('compare-root');
  if (!root) return;

  // Retrieve comparison list
  const storedIds = localStorage.getItem('function_hall_compare');
  const ids = storedIds ? JSON.parse(storedIds) : [];

  // Filter halls from dataset
  const halls = HALLS_DATA.filter(h => ids.includes(h.id));

  if (halls.length === 0) {
    root.innerHTML = `
      <div class="glass-panel text-center reveal-on-scroll" style="padding: 60px;">
        <div style="font-size: 4rem; margin-bottom: 20px;">📊</div>
        <h2>No halls selected for comparison</h2>
        <p style="color:var(--text-secondary); margin-bottom: 30px; font-size:1.1rem;">You can compare up to 3 halls. Browse our catalog and check "Add to Comparison Matrix" on any hall.</p>
        <a href="halls.html" class="btn btn-primary">Browse Function Halls</a>
      </div>
    `;
    return;
  }

  // Construct table structure
  let tableHtml = `
    <table class="compare-table">
      <thead>
        <tr>
          <th>Attributes</th>
          ${halls.map(hall => `
            <th class="compare-hall-header">
              <span class="compare-remove-btn" data-id="${hall.id}" title="Remove from comparison">&times;</span>
              <img src="${hall.images[0]}" alt="${hall.name}" style="width:100%; height:120px; object-fit:cover; border-radius:4px; margin-bottom:12px;">
              <div style="font-size:1.1rem; line-height:1.3; font-weight:700; font-family:'Outfit',sans-serif;">${hall.name}</div>
            </th>
          `).join('')}
        </tr>
      </thead>
      <tbody>
        <!-- Price Row -->
        <tr>
          <td>Starting Rent</td>
          ${halls.map(hall => `
            <td style="font-size:1.2rem; font-weight:800; color:var(--color-primary);">₹${hall.price.toLocaleString('en-IN')}</td>
          `).join('')}
        </tr>

        <!-- Capacity Row -->
        <tr>
          <td>Guest Capacity</td>
          ${halls.map(hall => `
            <td>👥 <b>${hall.capacity} guests</b></td>
          `).join('')}
        </tr>

        <!-- Location Row -->
        <tr>
          <td>Region / City</td>
          ${halls.map(hall => `
            <td>📍 ${hall.city}</td>
          `).join('')}
        </tr>

        <!-- AC Row -->
        <tr>
          <td>Air Conditioning</td>
          ${halls.map(hall => `
            <td>${hall.ac ? '❄️ Yes (Full AC)' : '💨 No (Traditional Ventilation)'}</td>
          `).join('')}
        </tr>

        <!-- Parking Row -->
        <tr>
          <td>Parking Facility</td>
          ${halls.map(hall => `
            <td>🚗 <b>${hall.parking} Cars</b> capacity</td>
          `).join('')}
        </tr>

        <!-- Rooms Row -->
        <tr>
          <td>Changing / Lodging Rooms</td>
          ${halls.map(hall => `
            <td>🛏️ <b>${hall.rooms} rooms</b> available</td>
          `).join('')}
        </tr>

        <!-- Catering Row -->
        <tr>
          <td>In-house Catering</td>
          ${halls.map(hall => `
            <td>${hall.catering ? '🍲 Yes, customizable menus' : '❌ No (External caterers allowed)'}</td>
          `).join('')}
        </tr>

        <!-- DJ System -->
        <tr>
          <td>DJ Sound System</td>
          ${halls.map(hall => `
            <td>${hall.dj ? '🎵 Yes (Sound limits apply)' : '❌ Not Allowed'}</td>
          `).join('')}
        </tr>

        <!-- Rating Row -->
        <tr>
          <td>Ratings & Feedback</td>
          ${halls.map(hall => `
            <td>
              <span class="rating-stars">${'★'.repeat(Math.round(hall.rating))}${'☆'.repeat(5 - Math.round(hall.rating))}</span>
              <div><b>${hall.rating} / 5</b> (${hall.reviewsCount} reviews)</div>
            </td>
          `).join('')}
        </tr>

        <!-- Actions Row -->
        <tr>
          <td>Booking Details</td>
          ${halls.map(hall => `
            <td>
              <a href="booking.html?hallId=${hall.id}" class="btn btn-primary btn-sm" style="width:100%;">Book Now</a>
              <a href="hall-details.html?id=${hall.id}" style="display:block; font-size:0.85rem; color:var(--color-primary); margin-top:10px; font-weight:600;">View Full Gallery ➔</a>
            </td>
          `).join('')}
        </tr>
      </tbody>
    </table>
  `;

  root.innerHTML = tableHtml;

  // Bind Remove buttons
  document.querySelectorAll('.compare-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      let list = JSON.parse(localStorage.getItem('function_hall_compare')) || [];
      list = list.filter(cid => cid !== id);
      localStorage.setItem('function_hall_compare', JSON.stringify(list));
      
      showNotification('Removed from comparison list', 'info');
      renderComparisonMatrix(); // Redraw
    });
  });

  // Re-run animation observer
  if (typeof initScrollReveal !== 'undefined') {
    initScrollReveal();
  }
}
