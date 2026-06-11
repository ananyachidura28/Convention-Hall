/**
 * Halls Catalog Controller
 * Handles Search, Filter, Sort, Favorites, and Comparison selectors
 */

let selectedCompareIds = [];

document.addEventListener('DOMContentLoaded', () => {
  // Load selected comparison halls from local storage
  const storedCompare = localStorage.getItem('function_hall_compare');
  selectedCompareIds = storedCompare ? JSON.parse(storedCompare) : [];

  initFilters();
  initMobileFilters();
});

function initFilters() {
  const gridContainer = document.getElementById('halls-grid-container');
  if (!gridContainer) return;

  // Grab UI elements
  const searchInput = document.getElementById('filter-search');
  const regionSelect = document.getElementById('filter-region');
  const priceInput = document.getElementById('filter-price');
  const priceVal = document.getElementById('price-slider-val');
  const ratingSelect = document.getElementById('filter-rating');
  const sortSelect = document.getElementById('sort-halls');
  const clearBtn = document.getElementById('clear-filters-btn');

  // Parse URL Parameters (e.g. ?region=hyderabad&date=...)
  const params = new URLSearchParams(window.location.search);
  const urlRegion = params.get('region');
  const urlSearch = params.get('search');
  const urlEvent = params.get('event'); // can seed custom category

  if (urlRegion && regionSelect) {
    regionSelect.value = urlRegion.toLowerCase();
  }
  if (urlSearch && searchInput) {
    searchInput.value = urlSearch;
  }

  // Update price display label on slider slide
  if (priceInput && priceVal) {
    priceInput.addEventListener('input', () => {
      priceVal.textContent = '₹' + parseInt(priceInput.value).toLocaleString('en-IN');
      applyFilters();
    });
  }

  // Bind event listeners to filters
  [searchInput, regionSelect, priceInput, ratingSelect, sortSelect].forEach(input => {
    if (input) {
      input.addEventListener('change', applyFilters);
      input.addEventListener('input', applyFilters);
    }
  });

  // Bind event listeners to checkboxes and radios
  document.querySelectorAll('.filter-capacity, .filter-facilities, input[name="filter-ac"]').forEach(el => {
    el.addEventListener('change', applyFilters);
  });

  // Clear filters trigger
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (regionSelect) regionSelect.value = '';
      if (priceInput) {
        priceInput.value = 200000;
        priceVal.textContent = '₹2,00,000';
      }
      if (ratingSelect) ratingSelect.value = '0';
      if (sortSelect) sortSelect.value = 'popularity';

      document.querySelectorAll('.filter-capacity').forEach(cb => cb.checked = false);
      document.querySelectorAll('.filter-facilities').forEach(cb => cb.checked = false);
      
      const acDefault = document.querySelector('input[name="filter-ac"][value="all"]');
      if (acDefault) acDefault.checked = true;

      applyFilters();
      showNotification('Filters reset', 'info');
    });
  }

  // Initial render
  applyFilters();

  function applyFilters() {
    let halls = [...HALLS_DATA];

    // 1. Search Query Filter (Name, Address, City)
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (query) {
      halls = halls.filter(hall => 
        hall.name.toLowerCase().includes(query) || 
        hall.city.toLowerCase().includes(query) ||
        hall.address.toLowerCase().includes(query)
      );
    }

    // 2. Region Filter
    const region = regionSelect ? regionSelect.value : '';
    if (region) {
      halls = halls.filter(hall => hall.region === region);
    }

    // 3. Price Filter (Starting Price)
    const maxPrice = priceInput ? parseInt(priceInput.value) : 200000;
    halls = halls.filter(hall => hall.price <= maxPrice);

    // 4. Capacity Bands Filter
    const capacityCbs = document.querySelectorAll('.filter-capacity:checked');
    if (capacityCbs.length > 0) {
      const selectedBands = Array.from(capacityCbs).map(cb => cb.value);
      halls = halls.filter(hall => {
        const cap = hall.capacity;
        if (selectedBands.includes('small') && cap <= 300) return true;
        if (selectedBands.includes('medium') && cap > 300 && cap <= 700) return true;
        if (selectedBands.includes('large') && cap > 700 && cap <= 1200) return true;
        if (selectedBands.includes('grand') && cap > 1200) return true;
        return false;
      });
    }

    // 5. AC / Non-AC Radio Filter
    const acRadio = document.querySelector('input[name="filter-ac"]:checked');
    const acVal = acRadio ? acRadio.value : 'all';
    if (acVal === 'ac') {
      halls = halls.filter(hall => hall.ac === true);
    } else if (acVal === 'non-ac') {
      halls = halls.filter(hall => hall.ac === false);
    }

    // 6. Facilities Checkbox Filter
    const facilityCbs = document.querySelectorAll('.filter-facilities:checked');
    if (facilityCbs.length > 0) {
      const required = Array.from(facilityCbs).map(cb => cb.value);
      halls = halls.filter(hall => {
        return required.every(facility => {
          if (facility === 'parking') return hall.parking >= 80; // moderate parking slots
          if (facility === 'rooms') return hall.rooms >= 4;
          if (facility === 'catering') return hall.catering === true;
          if (facility === 'dj') return hall.dj === true;
          return false;
        });
      });
    }

    // 7. Rating Filter
    const minRating = ratingSelect ? parseFloat(ratingSelect.value) : 0;
    if (minRating > 0) {
      halls = halls.filter(hall => hall.rating >= minRating);
    }

    // 8. Sorting
    const sortVal = sortSelect ? sortSelect.value : 'popularity';
    if (sortVal === 'price-asc') {
      halls.sort((a, b) => a.price - b.price);
    } else if (sortVal === 'price-desc') {
      halls.sort((a, b) => b.price - a.price);
    } else if (sortVal === 'rating-desc') {
      halls.sort((a, b) => b.rating - a.rating);
    } else {
      // Popularity (by reviewsCount)
      halls.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    // Render count
    const countLabel = document.getElementById('toolbar-count');
    if (countLabel) {
      countLabel.textContent = `Showing ${halls.length} function hall${halls.length !== 1 ? 's' : ''}`;
    }

    renderHalls(halls);
  }

  function renderHalls(halls) {
    if (halls.length === 0) {
      gridContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">🏛️</div>
          <h3>No function halls match your filter criteria.</h3>
          <p>Try resetting some filters or searching for another city.</p>
        </div>
      `;
      return;
    }

    let html = '';
    halls.forEach(hall => {
      // Check favorites
      const favs = getStoredFavorites();
      const isFav = favs.includes(hall.id) ? 'active' : '';

      // Check comparison status
      const isCompared = selectedCompareIds.includes(hall.id) ? 'checked' : '';

      html += `
        <div class="card reveal-on-scroll">
          <div class="card-img-wrapper">
            <img src="${hall.images[0]}" alt="${hall.name}">
            <div class="card-badge">${hall.ac ? 'AC Hall' : 'Non-AC'}</div>
            <button class="card-fav-btn ${isFav}" data-id="${hall.id}" aria-label="Add to Favorites">
              ❤️
            </button>
          </div>
          <div class="card-content">
            <h3 class="card-title"><a href="hall-details.html?id=${hall.id}">${hall.name}</a></h3>
            <div class="card-location">📍 ${hall.address.split(',')[1] || hall.city}, ${hall.city}</div>
            
            <div class="card-details-grid">
              <div class="card-detail-item">👥 Capacity: <b>${hall.capacity}</b></div>
              <div class="card-detail-item">🚗 Parking: <b>${hall.parking} cars</b></div>
              <div class="card-detail-item">🛏️ Rooms: <b>${hall.rooms} rooms</b></div>
              <div class="card-detail-item">⭐ Rating: <b>${hall.rating}</b> (${hall.reviewsCount})</div>
            </div>

            <!-- Facilities tiny strip -->
            <div style="display:flex; gap: 8px; flex-wrap:wrap; margin-bottom: 20px;">
              ${hall.catering ? '<span style="font-size:0.75rem; background:var(--bg-input); padding: 2px 6px; border-radius:4px;">🍲 Catering</span>' : ''}
              ${hall.dj ? '<span style="font-size:0.75rem; background:var(--bg-input); padding: 2px 6px; border-radius:4px;">🎵 DJ</span>' : ''}
              ${hall.generator ? '<span style="font-size:0.75rem; background:var(--bg-input); padding: 2px 6px; border-radius:4px;">⚡ Generator</span>' : ''}
            </div>

            <!-- Compare Checkbox -->
            <div style="margin-bottom: 20px;">
              <label class="service-checkbox-label" style="font-size:0.85rem; font-weight:600; color:var(--text-primary);">
                <input type="checkbox" class="compare-checkbox" value="${hall.id}" ${isCompared}>
                Add to Comparison Matrix
              </label>
            </div>

            <div class="card-footer">
              <div class="card-price">Starting Price <span>₹${hall.price.toLocaleString('en-IN')}</span></div>
              <a href="hall-details.html?id=${hall.id}" class="btn btn-primary btn-sm">View Details</a>
            </div>
          </div>
        </div>
      `;
    });

    gridContainer.innerHTML = html;

    // Bind Favorites buttons
    document.querySelectorAll('.card-fav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = parseInt(btn.dataset.id);
        const active = toggleFavorite(id);
        if (active) {
          btn.classList.add('active');
          showNotification('Added to favorites', 'success');
        } else {
          btn.classList.remove('active');
          showNotification('Removed from favorites', 'info');
        }
      });
    });

    // Bind Compare check buttons
    document.querySelectorAll('.compare-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const id = parseInt(cb.value);
        if (cb.checked) {
          if (selectedCompareIds.length >= 3) {
            cb.checked = false; // block check
            showNotification('You can compare a maximum of 3 halls', 'error');
            return;
          }
          selectedCompareIds.push(id);
          showNotification('Hall added to comparison list', 'success');
        } else {
          selectedCompareIds = selectedCompareIds.filter(cid => cid !== id);
          showNotification('Hall removed from comparison list', 'info');
        }
        
        // Save back
        localStorage.setItem('function_hall_compare', JSON.stringify(selectedCompareIds));
        updateCompareBar();
      });
    });

    updateCompareBar();

    // Trigger scroll animations for newly rendered components
    if (typeof initScrollReveal !== 'undefined') {
      initScrollReveal();
    }
  }
}

function updateCompareBar() {
  const bar = document.getElementById('compare-bar');
  const text = document.getElementById('compare-bar-text');
  if (!bar || !text) return;

  if (selectedCompareIds.length > 0) {
    bar.style.display = 'flex';
    text.textContent = `${selectedCompareIds.length} / 3 hall${selectedCompareIds.length !== 1 ? 's' : ''} selected for comparison`;
  } else {
    bar.style.display = 'none';
  }
}

function initMobileFilters() {
  const trigger = document.getElementById('mobile-filter-trigger');
  const sidebar = document.getElementById('filters-sidebar');
  const overlay = document.getElementById('filters-overlay');

  if (!trigger || !sidebar || !overlay) return;

  const toggle = () => {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
  };

  trigger.addEventListener('click', toggle);
  overlay.addEventListener('click', toggle);
}
