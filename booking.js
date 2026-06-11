/**
 * Booking and Details Controller
 * Handles: Custom Calendar, Gallery slider, Tour scheduling, and Multistep Checkout wizard
 */

document.addEventListener('DOMContentLoaded', () => {
  const detailsRoot = document.getElementById('details-root');
  const bookingWizard = document.getElementById('booking-wizard-form');

  if (detailsRoot) {
    initDetailsPage();
  }

  if (bookingWizard) {
    initBookingWizard();
  }
});

/* ==========================================================================
   1. Details Page & Calendar Logic
   ========================================================================== */
let calendarCurrentDate = new Date(2026, 5, 1); // Seed calendar around June 2026
let selectedEventDate = '';

function initDetailsPage() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id')) || 1;
  const hall = HALLS_DATA.find(h => h.id === id) || HALLS_DATA[0];

  renderHallDetails(hall);
}

function renderHallDetails(hall) {
  const root = document.getElementById('details-root');
  if (!root) return;

  const favs = getStoredFavorites();
  const isFav = favs.includes(hall.id) ? 'active' : '';

  // Get similar halls (exclude current hall, filter by city or capacity)
  const similarHalls = HALLS_DATA
    .filter(h => h.id !== hall.id)
    .slice(0, 2);

  // Generate similar halls HTML
  let similarHtml = '';
  similarHalls.forEach(sh => {
    similarHtml += `
      <div class="card" style="margin-top: 16px;">
        <div class="card-img-wrapper" style="aspect-ratio:16/9;">
          <img src="${sh.images[0]}" alt="${sh.name}">
        </div>
        <div class="card-content" style="padding: 16px;">
          <h4 style="font-size:1rem;"><a href="hall-details.html?id=${sh.id}">${sh.name}</a></h4>
          <p style="font-size:0.8rem; color:var(--text-secondary);">📍 ${sh.city} • Cap: ${sh.capacity}</p>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
            <span style="font-size:0.9rem; font-weight:700;">₹${sh.price.toLocaleString('en-IN')}</span>
            <a href="hall-details.html?id=${sh.id}" class="btn btn-primary btn-sm" style="padding: 4px 8px; font-size:0.75rem;">View</a>
          </div>
        </div>
      </div>
    `;
  });

  root.innerHTML = `
    <!-- Left Column: Details & Reviews -->
    <div>
      <div class="glass-panel details-main-card reveal-on-scroll">
        <!-- Main Image Gallery -->
        <div class="gallery-container">
          <div class="gallery-main">
            <img src="${hall.images[0]}" alt="${hall.name}" id="active-gallery-img">
            <div class="card-badge">${hall.ac ? 'Air Conditioned' : 'Non-AC'}</div>
          </div>
          <div class="gallery-thumbs">
            <div class="gallery-thumb-item active"><img src="${hall.images[0]}" alt="Thumb 1"></div>
            <div class="gallery-thumb-item"><img src="${hall.images[1]}" alt="Thumb 2"></div>
            <div class="gallery-thumb-item"><img src="${hall.images[2]}" alt="Thumb 3"></div>
          </div>
        </div>

        <!-- Meta headers -->
        <div class="details-title-row">
          <div>
            <h1>${hall.name}</h1>
            <p style="color:var(--text-secondary); margin-top: 4px;">📍 ${hall.address}</p>
          </div>
          <button class="card-fav-btn ${isFav}" id="detail-fav-btn" style="position:static; width:48px; height:48px; font-size:1.2rem;">❤️</button>
        </div>

        <!-- Facilities Pills -->
        <div class="facility-badge-grid">
          <span class="facility-badge">❄️ ${hall.ac ? 'AC Hall' : 'Non-AC'}</span>
          <span class="facility-badge">🚗 Parking (${hall.parking} slots)</span>
          <span class="facility-badge">🛏️ Rooms (${hall.rooms} guest rooms)</span>
          <span class="facility-badge">🍲 In-house Catering: ${hall.catering ? 'Yes' : 'No'}</span>
          <span class="facility-badge">✨ Decoration: ${hall.decoration ? 'Available' : 'Custom'}</span>
          <span class="facility-badge">⚡ Power Generator: ${hall.generator ? 'Yes' : 'No'}</span>
          <span class="facility-badge">🎭 Stage Setup: ${hall.stage ? 'Yes' : 'No'}</span>
          <span class="facility-badge">🎵 DJ Sound: ${hall.dj ? 'Available' : 'Restricted'}</span>
        </div>

        <!-- Video embed -->
        <div style="margin-top: 30px;">
          <h3 style="margin-bottom:15px;">Video Tour</h3>
          <div style="position:relative; padding-bottom:56.25%; height:0; border-radius:var(--border-radius-sm); overflow:hidden;">
            <iframe src="${hall.video}" style="position:absolute; top:0; left:0; width:100%; height:100%;" frameborder="0" allowfullscreen></iframe>
          </div>
        </div>

        <!-- Description -->
        <div style="margin-top: 30px; border-top: 1px solid var(--glass-border); padding-top: 30px;">
          <h3 style="margin-bottom:12px;">About the Venue</h3>
          <p style="color:var(--text-secondary); line-height:1.7;">${hall.description}</p>
        </div>

        <!-- Pricing Categories table -->
        <div class="pricing-table-container">
          <h3>Event Category Pricing</h3>
          <table class="details-table">
            <thead>
              <tr>
                <th>Event Type</th>
                <th>Pricing Structure</th>
                <th>Estimated Cost</th>
              </tr>
            </thead>
            <tbody>
              ${Object.keys(EVENT_CATEGORIES).map(catKey => {
                const multiplier = EVENT_CATEGORIES[catKey].baseFactor;
                const cost = Math.round(hall.price * multiplier);
                return `
                  <tr>
                    <td>${EVENT_CATEGORIES[catKey].icon} ${catKey}</td>
                    <td>${multiplier * 100}% of Baseline</td>
                    <td><b>₹${cost.toLocaleString('en-IN')}</b></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Availability Calendar & Visit Scheduling -->
      <div class="glass-panel details-main-card reveal-on-scroll" style="margin-top: 40px;">
        <h2>Check Dates Availability</h2>
        <p style="color:var(--text-secondary); margin-bottom: 24px;">Interact with our real-time availability calendar. Green dates are vacant; Red dates are booked.</p>
        
        <div class="calendar-widget">
          <div class="calendar-header">
            <button class="slider-btn" id="cal-prev">◀</button>
            <h3 id="cal-month-year" style="font-size:1.25rem;">June 2026</h3>
            <button class="slider-btn" id="cal-next">▶</button>
          </div>
          <div class="calendar-grid" id="calendar-days-root"></div>
          <div class="calendar-legend">
            <div class="legend-item"><span class="legend-color" style="background:#d1fae5;"></span> Available</div>
            <div class="legend-item"><span class="legend-color" style="background:#fecdd3;"></span> Booked</div>
            <div class="legend-item"><span class="legend-color" style="background:var(--color-primary);"></span> Selected</div>
          </div>
        </div>

        <!-- Physical visit request -->
        <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid var(--glass-border);">
          <h3>Schedule a Physical Visit</h3>
          <p style="color:var(--text-secondary); margin-bottom:20px; font-size:0.9rem;">Would you like a physical guided tour of this venue? Select an available date above and schedule below.</p>
          <form id="visit-form" class="grid-2" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            <div class="form-group" style="margin-bottom:0;">
              <label>Selected Tour Date</label>
              <input type="text" id="visit-date" class="form-input" required readonly placeholder="Click a green date above">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label>Prefer Time Slot</label>
              <select id="visit-time" class="form-input" required>
                <option value="10:00 AM">10:00 AM - 12:00 PM</option>
                <option value="02:00 PM">02:00 PM - 04:00 PM</option>
                <option value="05:00 PM">05:00 PM - 07:00 PM</option>
              </select>
            </div>
            <div class="form-group" style="grid-column: 1 / -1; margin-bottom: 0;">
              <button type="submit" class="btn btn-outline" style="width:100%;">Schedule Guided Tour</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Customer Reviews list -->
      <div class="glass-panel details-main-card reveal-on-scroll" style="margin-top: 40px;">
        <h2>User Reviews (${hall.reviews.length})</h2>
        <div class="divider" style="margin: 10px 0 30px 0;"></div>
        
        <div id="reviews-list-container" style="display:flex; flex-direction:column; gap:20px; margin-bottom: 30px;">
          ${hall.reviews.map(rev => `
            <div style="border-bottom:1px solid var(--glass-border); padding-bottom: 16px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <h4 style="font-size:1rem;">${rev.author}</h4>
                <span class="rating-stars">${'★'.repeat(rev.rating)}${'☆'.repeat(5 - rev.rating)}</span>
              </div>
              <span style="font-size:0.8rem; color:var(--text-muted);">${rev.date}</span>
              <p style="color:var(--text-secondary); margin-top:8px; font-size:0.9rem;">${rev.text}</p>
            </div>
          `).join('')}
        </div>

        <!-- Add Review form -->
        <h3 style="margin-bottom:16px;">Write a Review</h3>
        <form id="review-submit-form">
          <div class="grid-2">
            <div class="form-group">
              <label for="rev-author">Your Name</label>
              <input type="text" id="rev-author" class="form-input" required placeholder="Guest Name">
            </div>
            <div class="form-group">
              <label for="rev-rating">Star Rating</label>
              <select id="rev-rating" class="form-input">
                <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                <option value="3">⭐⭐⭐ (3 Stars)</option>
                <option value="2">⭐⭐ (2 Stars)</option>
                <option value="1">⭐ (1 Star)</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="rev-text">Review Comment</label>
            <textarea id="rev-text" class="form-input" rows="4" required placeholder="Tell us about your experience hosting or attending an event here..."></textarea>
          </div>
          <button type="submit" class="btn btn-outline">Submit Review</button>
        </form>
      </div>
    </div>

    <!-- Right Column: Booking panel & Similar venues -->
    <div>
      <aside style="position:sticky; top:100px; display:flex; flex-direction:column; gap:30px;">
        
        <!-- Book Now panel -->
        <div class="glass-panel" style="padding: 30px; border: 2px solid var(--color-primary);">
          <span style="font-size: 0.8rem; text-transform:uppercase; font-weight:700; color:var(--text-muted);">Ready to book?</span>
          <div style="font-size:1.8rem; font-weight:800; color:var(--text-primary); margin: 8px 0 20px 0;">
            ₹${hall.price.toLocaleString('en-IN')} <span style="font-size:0.9rem; font-weight:400; color:var(--text-secondary);">Starting Rent</span>
          </div>
          <a href="booking.html?hallId=${hall.id}" id="sidebar-book-btn" class="btn btn-primary" style="width:100%; display:block; padding: 16px;">
            Book This Hall Now
          </a>
          <p style="font-size:0.75rem; text-align:center; color:var(--text-muted); margin-top:12px;">Lock this venue in by creating a booking slot.</p>
        </div>

        <!-- Similar Halls widget -->
        <div class="glass-panel" style="padding: 30px;">
          <h3>Similar Venues</h3>
          <div class="divider" style="margin: 8px 0 16px 0;"></div>
          ${similarHtml}
        </div>
      </aside>
    </div>
  `;

  // Bind Gallery switcher
  const thumbs = document.querySelectorAll('.gallery-thumb-item');
  const mainImg = document.getElementById('active-gallery-img');
  thumbs.forEach((th, index) => {
    th.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      th.classList.add('active');
      mainImg.src = hall.images[index];
    });
  });

  // Bind Favorites click
  const favBtn = document.getElementById('detail-fav-btn');
  if (favBtn) {
    favBtn.addEventListener('click', () => {
      const active = toggleFavorite(hall.id);
      if (active) {
        favBtn.classList.add('active');
        showNotification('Added to favorites', 'success');
      } else {
        favBtn.classList.remove('active');
        showNotification('Removed from favorites', 'info');
      }
    });
  }

  // Bind Review Submit
  const reviewForm = document.getElementById('review-submit-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = document.getElementById('rev-author').value;
      const rating = parseInt(document.getElementById('rev-rating').value);
      const text = document.getElementById('rev-text').value;
      const date = new Date().toISOString().split('T')[0];

      // Insert review into mock dataset locally
      hall.reviews.unshift({ author, rating, date, text });
      
      // Update UI list
      const list = document.getElementById('reviews-list-container');
      const newRevNode = document.createElement('div');
      newRevNode.style.borderBottom = '1px solid var(--glass-border)';
      newRevNode.style.paddingBottom = '16px';
      newRevNode.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h4 style="font-size:1rem;">${author}</h4>
          <span class="rating-stars">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</span>
        </div>
        <span style="font-size:0.8rem; color:var(--text-muted);">${date}</span>
        <p style="color:var(--text-secondary); margin-top:8px; font-size:0.9rem;">${text}</p>
      `;
      list.prepend(newRevNode);

      // Reset form
      reviewForm.reset();
      showNotification('Review submitted successfully', 'success');
    });
  }

  // Bind Tour Visit Request Submit
  const visitForm = document.getElementById('visit-form');
  if (visitForm) {
    visitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const vDate = document.getElementById('visit-date').value;
      const vTime = document.getElementById('visit-time').value;

      if (!vDate) {
        showNotification('Please select a calendar date first', 'error');
        return;
      }

      const user = getStoredUser();
      const name = user ? user.name : 'Guest User';
      const email = user ? user.email : 'guest@example.com';

      const request = {
        id: Math.floor(100000 + Math.random() * 900000),
        hallId: hall.id,
        hallName: hall.name,
        date: vDate,
        time: vTime,
        userName: name,
        userEmail: email,
        status: 'Scheduled'
      };

      saveVisitRequest(request);
      showNotification('Guided tour scheduled! Access Dashboard to track visits.', 'success');
      visitForm.reset();
      document.querySelectorAll('.calendar-day-cell').forEach(cell => cell.classList.remove('selected'));
    });
  }

  // Initial Calendar Rendering
  renderCalendarWidget(hall);

  // Bind Calendar Next/Prev
  const calPrev = document.getElementById('cal-prev');
  const calNext = document.getElementById('cal-next');

  if (calPrev && calNext) {
    calPrev.addEventListener('click', () => {
      calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1);
      renderCalendarWidget(hall);
    });
    calNext.addEventListener('click', () => {
      calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1);
      renderCalendarWidget(hall);
    });
  }

  // Auto trigger reveal animations
  if (typeof initScrollReveal !== 'undefined') {
    initScrollReveal();
  }
}

function renderCalendarWidget(hall) {
  const daysRoot = document.getElementById('calendar-days-root');
  const monthYearLabel = document.getElementById('cal-month-year');
  if (!daysRoot || !monthYearLabel) return;

  const year = calendarCurrentDate.getFullYear();
  const month = calendarCurrentDate.getMonth();

  // Set month-year label
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  monthYearLabel.textContent = `${monthNames[month]} ${year}`;

  daysRoot.innerHTML = '';

  // Render day headers
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  dayNames.forEach(d => {
    const headerCell = document.createElement('div');
    headerCell.className = 'calendar-day-header';
    headerCell.textContent = d;
    daysRoot.appendChild(headerCell);
  });

  // Calc starting blanks
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day-cell empty';
    daysRoot.appendChild(emptyCell);
  }

  // Render calendar days
  for (let d = 1; d <= totalDays; d++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell';
    cell.textContent = d;

    // Build ISO string
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    
    // Check if booked
    if (hall.bookedDates.includes(dStr)) {
      cell.classList.add('booked');
    } else {
      cell.classList.add('available');
      // Click handler
      cell.addEventListener('click', () => {
        document.querySelectorAll('.calendar-day-cell').forEach(c => c.classList.remove('selected'));
        cell.classList.add('selected');
        
        selectedEventDate = dStr;

        // Sync inputs
        const visitInput = document.getElementById('visit-date');
        if (visitInput) visitInput.value = dStr;

        // Sync book link
        const bookBtn = document.getElementById('sidebar-book-btn');
        if (bookBtn) {
          bookBtn.href = `booking.html?hallId=${hall.id}&date=${dStr}`;
        }
      });
    }

    daysRoot.appendChild(cell);
  }
}

/* ==========================================================================
   2. Booking Multistep Checkout Logic
   ========================================================================== */
let checkoutCurrentStep = 1;
let checkoutSelectedHall = null;

function initBookingWizard() {
  const params = new URLSearchParams(window.location.search);
  const paramHallId = parseInt(params.get('hallId'));
  const paramDate = params.get('date');

  // Populate Select Hall Dropdown
  const hallSelector = document.getElementById('bkg-hall');
  if (hallSelector) {
    hallSelector.innerHTML = '<option value="">Choose Function Hall</option>' + 
      HALLS_DATA.map(h => `<option value="${h.id}">${h.name} (${h.city})</option>`).join('');

    if (paramHallId) {
      hallSelector.value = paramHallId;
    }

    hallSelector.addEventListener('change', () => {
      updateCheckoutCosts();
    });
  }

  // Pre-fill Date
  const dateInput = document.getElementById('bkg-date');
  if (dateInput) {
    if (paramDate) {
      dateInput.value = paramDate;
    }
    dateInput.addEventListener('change', () => {
      validateDateAvailability();
    });
  }

  // Bind step switching buttons
  const nextBtns = document.querySelectorAll('.checkout-next-btn');
  const prevBtns = document.querySelectorAll('.checkout-prev-btn');

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(checkoutCurrentStep)) {
        changeCheckoutStep(checkoutCurrentStep + 1);
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      changeCheckoutStep(checkoutCurrentStep - 1);
    });
  });

  // Bind recalculations on change inputs
  const guestInput = document.getElementById('bkg-guests');
  if (guestInput) {
    guestInput.addEventListener('input', updateCheckoutCosts);
  }

  const categoryInput = document.getElementById('bkg-category');
  if (categoryInput) {
    categoryInput.addEventListener('change', updateCheckoutCosts);
  }

  document.querySelectorAll('.bkg-service-checkbox').forEach(cb => {
    cb.addEventListener('change', updateCheckoutCosts);
  });

  // Bind coupon code application
  const applyCouponBtn = document.getElementById('apply-coupon-btn');
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', () => {
      const codeInput = document.getElementById('bkg-coupon-code').value.toUpperCase().trim();
      applyDiscountCoupon(codeInput);
    });
  }

  // Wizard checkout submit
  const wizardForm = document.getElementById('booking-wizard-form');
  if (wizardForm) {
    wizardForm.addEventListener('submit', (e) => {
      e.preventDefault();
      confirmFinalBooking();
    });
  }

  // Preload details if pre-selected
  updateCheckoutCosts();
}

function changeCheckoutStep(step) {
  // Hide current step panel
  const activePanel = document.querySelector(`.booking-form-step[data-step="${checkoutCurrentStep}"]`);
  const nextPanel = document.querySelector(`.booking-form-step[data-step="${step}"]`);
  
  if (activePanel && nextPanel) {
    activePanel.classList.remove('active');
    nextPanel.classList.add('active');
  }

  // Update step indicators
  const indicators = document.querySelectorAll('.step-indicator-item');
  indicators.forEach(ind => {
    const s = parseInt(ind.dataset.step);
    ind.classList.remove('active');
    if (s === step) {
      ind.classList.add('active');
    }
    if (s < step) {
      ind.classList.add('completed');
    } else {
      ind.classList.remove('completed');
    }
  });

  checkoutCurrentStep = step;

  // Build summary values if advancing to Step 4 (Summary)
  if (step === 4) {
    renderBookingCheckoutSummary();
  }
}

function validateStep(step) {
  if (step === 1) {
    const name = document.getElementById('bkg-name').value.trim();
    const phone = document.getElementById('bkg-phone').value.trim();
    const email = document.getElementById('bkg-email').value.trim();

    if (!name || !phone || !email) {
      showNotification('Please fill in all personal contact details', 'error');
      return false;
    }
    return true;
  }

  if (step === 2) {
    const hallId = parseInt(document.getElementById('bkg-hall').value);
    const category = document.getElementById('bkg-category').value;
    const date = document.getElementById('bkg-date').value;
    const guests = parseInt(document.getElementById('bkg-guests').value);

    if (!hallId || !category || !date || !guests) {
      showNotification('Please specify the hall, event category, guests, and date', 'error');
      return false;
    }

    // Double check date availability
    return validateDateAvailability();
  }

  return true;
}

function validateDateAvailability() {
  const hallId = parseInt(document.getElementById('bkg-hall').value);
  const dateStr = document.getElementById('bkg-date').value;
  if (!hallId || !dateStr) return true;

  const hall = HALLS_DATA.find(h => h.id === hallId);
  if (hall && hall.bookedDates.includes(dateStr)) {
    showNotification('This date is already booked for this venue! Please select another date.', 'error');
    return false;
  }
  return true;
}

let checkoutSubtotal = 0;
let checkoutServicesTotal = 0;
let checkoutTotal = 0;
let checkoutCouponCode = '';
let checkoutDiscount = 0;

function updateCheckoutCosts() {
  const hallId = parseInt(document.getElementById('bkg-hall').value);
  const category = document.getElementById('bkg-category').value;
  const guests = parseInt(document.getElementById('bkg-guests').value) || 100;

  const summaryText = document.getElementById('summary-hall-name');
  const sumBase = document.getElementById('sum-base');
  const sumServices = document.getElementById('sum-services');
  const sumDiscountRow = document.getElementById('sum-discount-row');
  const sumDiscount = document.getElementById('sum-discount');
  const sumTotal = document.getElementById('sum-total');

  if (!sumBase || !sumServices || !sumTotal) return;

  if (!hallId) {
    summaryText.textContent = 'None Selected';
    sumBase.textContent = '₹0';
    sumServices.textContent = '₹0';
    sumTotal.textContent = '₹0';
    return;
  }

  checkoutSelectedHall = HALLS_DATA.find(h => h.id === hallId);
  summaryText.textContent = checkoutSelectedHall.name;

  // 1. Calculate base hall cost
  const mult = EVENT_CATEGORIES[category] ? EVENT_CATEGORIES[category].baseFactor : 1.0;
  checkoutSubtotal = Math.round(checkoutSelectedHall.price * mult);

  // 2. Services calculations
  checkoutServicesTotal = 0;
  document.querySelectorAll('.bkg-service-checkbox:checked').forEach(cb => {
    const serviceKey = cb.value;
    const servData = ADDITIONAL_SERVICES[serviceKey];
    if (servData) {
      if (servData.unit === 'guest') {
        checkoutServicesTotal += servData.price * guests;
      } else {
        checkoutServicesTotal += servData.price;
      }
    }
  });

  // 3. Totals
  checkoutTotal = checkoutSubtotal + checkoutServicesTotal;

  // Re-eval coupon if already applied
  if (checkoutCouponCode) {
    const coupon = COUPONS[checkoutCouponCode];
    if (coupon) {
      if (checkoutTotal >= coupon.minBooking) {
        if (coupon.type === 'percentage') {
          checkoutDiscount = Math.round(checkoutTotal * (coupon.value / 100));
        } else {
          checkoutDiscount = coupon.value;
        }
      } else {
        checkoutCouponCode = '';
        checkoutDiscount = 0;
        showNotification('Discount cancelled: total is below minimum coupon value', 'error');
      }
    }
  }

  // Update UI Elements
  sumBase.textContent = '₹' + checkoutSubtotal.toLocaleString('en-IN');
  sumServices.textContent = '₹' + checkoutServicesTotal.toLocaleString('en-IN');

  if (checkoutDiscount > 0) {
    sumDiscountRow.style.display = 'flex';
    sumDiscount.textContent = '-₹' + checkoutDiscount.toLocaleString('en-IN');
  } else {
    sumDiscountRow.style.display = 'none';
  }

  const finalTotal = checkoutTotal - checkoutDiscount;
  sumTotal.textContent = '₹' + finalTotal.toLocaleString('en-IN');
}

function applyDiscountCoupon(code) {
  if (!checkoutSelectedHall) {
    showNotification('Select a function hall first', 'error');
    return;
  }

  if (!code) {
    showNotification('Enter a coupon code', 'error');
    return;
  }

  const coupon = COUPONS[code];
  if (!coupon) {
    showNotification('Invalid coupon code', 'error');
    return;
  }

  const subTotalBeforeDiscount = checkoutSubtotal + checkoutServicesTotal;
  if (subTotalBeforeDiscount < coupon.minBooking) {
    showNotification(`Coupon requires a minimum booking value of ₹${coupon.minBooking.toLocaleString('en-IN')}`, 'error');
    return;
  }

  checkoutCouponCode = code;
  showNotification(`Coupon '${code}' applied successfully!`, 'success');
  updateCheckoutCosts();
}

function renderBookingCheckoutSummary() {
  const name = document.getElementById('bkg-name').value;
  const email = document.getElementById('bkg-email').value;
  const phone = document.getElementById('bkg-phone').value;
  const category = document.getElementById('bkg-category').value;
  const date = document.getElementById('bkg-date').value;
  const guests = document.getElementById('bkg-guests').value;

  const target = document.getElementById('summary-details-box');
  if (!target || !checkoutSelectedHall) return;

  // Selected services list
  const selectedServices = [];
  document.querySelectorAll('.bkg-service-checkbox:checked').forEach(cb => {
    const sData = ADDITIONAL_SERVICES[cb.value];
    if (sData) selectedServices.push(sData.label);
  });

  target.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:12px;">
      <div>
        <span style="font-size:0.8rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Venue Choice</span>
        <h4 style="font-size:1.1rem; color:var(--text-primary);">${checkoutSelectedHall.name}</h4>
        <p style="font-size:0.85rem; color:var(--text-secondary);">📍 ${checkoutSelectedHall.address}</p>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; border-top: 1px solid var(--glass-border); padding-top:12px;">
        <div>
          <span style="font-size:0.75rem; color:var(--text-muted);">Event Type</span>
          <p style="font-weight:600;">${EVENT_CATEGORIES[category].icon} ${category}</p>
        </div>
        <div>
          <span style="font-size:0.75rem; color:var(--text-muted);">Event Date</span>
          <p style="font-weight:600;">📅 ${date}</p>
        </div>
        <div>
          <span style="font-size:0.75rem; color:var(--text-muted);">Guests Expected</span>
          <p style="font-weight:600;">👥 ${guests} guests</p>
        </div>
        <div>
          <span style="font-size:0.75rem; color:var(--text-muted);">AC / Non-AC</span>
          <p style="font-weight:600;">❄️ ${checkoutSelectedHall.ac ? 'AC Hall' : 'Non-AC'}</p>
        </div>
      </div>
      <div style="border-top:1px solid var(--glass-border); padding-top:12px;">
        <span style="font-size:0.8rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Customer Profile</span>
        <p style="font-size:0.9rem; font-weight:600;">${name} (${phone})</p>
        <p style="font-size:0.85rem; color:var(--text-secondary);">${email}</p>
      </div>
      <div style="border-top:1px solid var(--glass-border); padding-top:12px;">
        <span style="font-size:0.8rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Services Appended</span>
        ${selectedServices.length > 0 ? 
          `<ul style="font-size:0.85rem; padding-left:16px; color:var(--text-secondary);">${selectedServices.map(s => `<li>${s}</li>`).join('')}</ul>` : 
          '<p style="font-size:0.85rem; color:var(--text-muted);">No additional service add-ons chosen</p>'
        }
      </div>
    </div>
  `;
}

function confirmFinalBooking() {
  if (!checkoutSelectedHall) return;

  const name = document.getElementById('bkg-name').value;
  const email = document.getElementById('bkg-email').value;
  const phone = document.getElementById('bkg-phone').value;
  const category = document.getElementById('bkg-category').value;
  const date = document.getElementById('bkg-date').value;
  const guests = document.getElementById('bkg-guests').value;

  const selectedServices = [];
  document.querySelectorAll('.bkg-service-checkbox:checked').forEach(cb => {
    selectedServices.push(cb.value);
  });

  const finalCost = (checkoutSubtotal + checkoutServicesTotal) - checkoutDiscount;
  const bookingId = 'BKG-' + Math.floor(100000 + Math.random() * 900000);

  const newBooking = {
    bookingId: bookingId,
    hallId: checkoutSelectedHall.id,
    hallName: checkoutSelectedHall.name,
    customerName: name,
    customerEmail: email,
    customerPhone: phone,
    eventType: category,
    eventDate: date,
    guestsCount: parseInt(guests),
    services: selectedServices,
    pricePaid: finalCost,
    couponApplied: checkoutCouponCode || 'None',
    status: 'Confirmed',
    createdAt: new Date().toISOString().split('T')[0]
  };

  // 1. Save Booking
  saveBooking(newBooking);

  // 2. Mock add date to bookedDates so it blocks future lookups
  checkoutSelectedHall.bookedDates.push(date);

  // 3. Show Success notification
  showNotification(`Success! Booking slot booked. ID: ${bookingId}`, 'success');

  // 4. Force logged user session details if guest checked out
  const user = getStoredUser();
  if (!user) {
    setUserSession({ name: name.split(' ')[0], email: email });
  }

  // 5. Trigger animated success check and redirect to dashboard
  const wizardRoot = document.getElementById('booking-wizard-form');
  if (wizardRoot) {
    wizardRoot.innerHTML = `
      <div class="glass-panel text-center reveal-on-scroll" style="padding: 60px; grid-column:1/-1;">
        <div style="font-size: 5rem; margin-bottom: 24px;">🎉</div>
        <h2 style="font-size:2rem; margin-bottom:12px;">Booking Confirmed!</h2>
        <p style="color:var(--text-secondary); margin-bottom: 12px; font-size:1.1rem;">Thank you for booking with GrandVows. Your Booking ID is <b>${bookingId}</b>.</p>
        <p style="color:var(--text-muted); margin-bottom: 30px; font-size:0.9rem;">A confirmation invoice has been sent to <b>${email}</b>.</p>
        <div style="display:flex; justify-content:center; gap:16px;">
          <a href="dashboard.html" class="btn btn-primary">Go to Dashboard</a>
          <a href="index.html" class="btn btn-outline">Back to Home</a>
        </div>
      </div>
    `;
  }
}
