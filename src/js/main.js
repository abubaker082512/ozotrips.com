import { tours } from './tours-data.js';

document.addEventListener('DOMContentLoaded', () => {
  // Select DOM Elements
  const header = document.querySelector('header');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle?.querySelector('span');
  const toursGrid = document.getElementById('tours-grid');
  
  // Search & Filter elements
  const searchInput = document.getElementById('search-dest');
  const filterType = document.getElementById('filter-type');
  const filterBudget = document.getElementById('filter-budget');
  const filterDuration = document.getElementById('filter-duration');
  const searchBtn = document.getElementById('search-btn');
  const categoryContainer = document.getElementById('category-list');
  
  // Modal elements
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalDetails = document.getElementById('modal-details');
  const bookingContainer = document.getElementById('booking-container');

  // Favorites state
  let favorites = JSON.parse(localStorage.getItem('ozotrips_favs')) || [];

  // Theme Initial Setup
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      updateThemeIcon(theme);
    });
  }

  function updateThemeIcon(theme) {
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  // Header Scroll style
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Render Category buttons dynamically
  const categories = ['All', 'Local', 'International', 'Adventure', 'Cultural', 'Beach', 'Mountain'];
  if (categoryContainer) {
    categoryContainer.innerHTML = categories.map(cat => `
      <button class="category-btn ${cat === 'All' ? 'active' : ''}" data-category="${cat}">
        ${cat === 'All' ? '🗺️' : 
          cat === 'Local' ? '🇵🇰' : 
          cat === 'International' ? '✈️' : 
          cat === 'Adventure' ? '🧗' : 
          cat === 'Cultural' ? '🏛️' : 
          cat === 'Beach' ? '🏖️' : '🏔️'} ${cat}
      </button>
    `).join('');

    categoryContainer.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        categoryContainer.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        // When clicking a quick category, synchronize search filters if possible
        const categoryVal = e.currentTarget.getAttribute('data-category');
        if (categoryVal === 'Local') {
          filterType.value = 'local';
        } else if (categoryVal === 'International') {
          filterType.value = 'international';
        } else {
          filterType.value = '';
        }
        
        applyFilters(categoryVal);
      });
    });
  }

  // Filter logic
  function applyFilters(selectedCategory = 'All') {
    const query = searchInput?.value.toLowerCase() || '';
    const typeVal = filterType?.value || '';
    const budgetVal = filterBudget?.value || '';
    const durationVal = filterDuration?.value || '';

    // If a button category is active (and not type overrides), use it
    const activeCategory = selectedCategory !== 'All' ? selectedCategory : 
      (categoryContainer?.querySelector('.category-btn.active')?.getAttribute('data-category') || 'All');

    const filtered = tours.filter(tour => {
      // 1. Search Query match
      const matchesSearch = tour.title.toLowerCase().includes(query) || 
                            tour.description.toLowerCase().includes(query);
      
      // 2. Type Match (Local/International)
      let matchesType = true;
      if (typeVal) {
        matchesType = tour.type === typeVal;
      } else if (activeCategory === 'Local') {
        matchesType = tour.type === 'local';
      } else if (activeCategory === 'International') {
        matchesType = tour.type === 'international';
      }

      // 3. Category Match
      let matchesCategory = true;
      if (activeCategory !== 'All' && activeCategory !== 'Local' && activeCategory !== 'International') {
        matchesCategory = tour.category === activeCategory;
      }

      // 4. Budget Match
      let matchesBudget = true;
      if (budgetVal) {
        const maxBudget = parseInt(budgetVal);
        matchesBudget = tour.price <= maxBudget;
      }

      // 5. Duration Match
      let matchesDuration = true;
      if (durationVal) {
        const days = parseInt(tour.duration.split(' ')[0]);
        if (durationVal === 'short') matchesDuration = days <= 4;
        else if (durationVal === 'medium') matchesDuration = days > 4 && days <= 7;
        else if (durationVal === 'long') matchesDuration = days > 7;
      }

      return matchesSearch && matchesType && matchesCategory && matchesBudget && matchesDuration;
    });

    renderTours(filtered);
  }

  // Bind filter triggers
  searchBtn?.addEventListener('click', () => applyFilters());
  filterType?.addEventListener('change', () => applyFilters());
  filterBudget?.addEventListener('change', () => applyFilters());
  filterDuration?.addEventListener('change', () => applyFilters());
  searchInput?.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') applyFilters();
  });

  // Favorites Toggling
  window.toggleFavorite = (id) => {
    const tourId = parseInt(id);
    if (favorites.includes(tourId)) {
      favorites = favorites.filter(favId => favId !== tourId);
    } else {
      favorites.push(tourId);
    }
    localStorage.setItem('ozotrips_favs', JSON.stringify(favorites));
    applyFilters();
  };

  // Render Tours to grid
  function renderTours(toursList) {
    if (!toursGrid) return;
    
    if (toursList.length === 0) {
      toursGrid.innerHTML = `
        <div class="glass-panel" style="grid-column: 1 / -1; padding: 60px; text-align: center; font-size: 1.2rem; color: var(--text-muted);">
          🔍 No tours found matching your current filters. Try adjusting your preferences.
        </div>
      `;
      return;
    }

    toursGrid.innerHTML = toursList.map(tour => {
      const isFav = favorites.includes(tour.id);
      return `
        <div class="tour-card glass-panel fade-in">
          <div class="tour-image-container">
            <img class="tour-image" src="${tour.image}" alt="${tour.title}" loading="lazy">
            <div class="tour-badge ${tour.type === 'international' ? 'international' : ''}">
              ${tour.type === 'local' ? '🇵🇰 Local' : '✈️ International'}
            </div>
            <button class="tour-fav-btn" aria-label="Add to favorites" onclick="toggleFavorite(${tour.id})">
              ${isFav ? '❤️' : '🤍'}
            </button>
          </div>
          <div class="tour-info">
            <div class="tour-meta">
              <div class="tour-duration">
                🕒 ${tour.duration}
              </div>
              <div class="tour-rating">
                ⭐ <span>${tour.rating}</span> (${tour.reviews})
              </div>
            </div>
            <h3 class="tour-title">${tour.title}</h3>
            <p class="tour-desc">${tour.description}</p>
            <div class="tour-footer">
              <div class="tour-price-box">
                <span class="tour-price-lbl">Starting from</span>
                <span class="tour-price">${tour.currency}${tour.price}<span>/person</span></span>
              </div>
              <button class="btn btn-secondary detail-trigger" data-id="${tour.id}">Details & Booking</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach click events to "Details & Booking" buttons
    toursGrid.querySelectorAll('.detail-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'));
        openBookingModal(id);
      });
    });

    // Run fade-in scroll animation setup
    setupScrollAnimations();
  }

  // Open Details & Booking Modal
  function openBookingModal(tourId) {
    const tour = tours.find(t => t.id === tourId);
    if (!tour || !modalOverlay) return;

    // Render left panel details
    modalDetails.innerHTML = `
      <div class="modal-img-wrapper">
        <img class="modal-img" src="${tour.image}" alt="${tour.title}">
      </div>
      <div>
        <span class="modal-tag">${tour.category} Tour</span>
        <h2 class="modal-title">${tour.title}</h2>
      </div>
      <div class="modal-meta-grid">
        <div class="modal-meta-item">
          <span class="modal-meta-lbl">Duration</span>
          <span class="modal-meta-val">🕒 ${tour.duration}</span>
        </div>
        <div class="modal-meta-item">
          <span class="modal-meta-lbl">Rating</span>
          <span class="modal-meta-val">⭐ ${tour.rating} / 5</span>
        </div>
        <div class="modal-meta-item">
          <span class="modal-meta-lbl">Tour Type</span>
          <span class="modal-meta-val">${tour.type === 'local' ? '🇵🇰 Local Pakistan' : '✈️ International'}</span>
        </div>
        <div class="modal-meta-item">
          <span class="modal-meta-lbl">Price Per Person</span>
          <span class="modal-meta-val" style="color: var(--color-primary); font-weight: 800;">${tour.currency}${tour.price}</span>
        </div>
      </div>
      <div>
        <h4 style="margin-bottom: 8px;">About the tour</h4>
        <p class="modal-description">${tour.description}</p>
      </div>
      <div>
        <h4 style="margin-bottom: 8px;">Key Highlights</h4>
        <ul style="padding-left: 20px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 6px;">
          ${tour.highlights.map(hl => `<li>${hl}</li>`).join('')}
        </ul>
      </div>
    `;

    // Render right booking form
    bookingContainer.innerHTML = `
      <form id="booking-form" class="booking-form">
        <h3>Secure Your Seat</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 10px;">Fill out the details below to initiate booking. No payment needed now.</p>
        
        <div class="form-group">
          <label for="book-name">Full Name</label>
          <input type="text" id="book-name" required placeholder="e.g. John Doe">
        </div>
        
        <div class="form-group">
          <label for="book-email">Email Address</label>
          <input type="email" id="book-email" required placeholder="e.g. name@example.com">
        </div>

        <div class="form-group">
          <label for="book-phone">Phone Number</label>
          <input type="tel" id="book-phone" required placeholder="e.g. +92 300 1234567">
        </div>

        <div class="form-group">
          <label for="book-date">Preferred Travel Date</label>
          <input type="date" id="book-date" required>
        </div>
        
        <div class="form-group">
          <label for="book-guests">Number of Guests</label>
          <input type="number" id="book-guests" min="1" max="20" value="1" required>
        </div>

        <button type="submit" class="btn btn-primary" style="margin-top: 10px; width: 100%;">
          Proceed to Reserve 🚀
        </button>
      </form>
    `;

    // Add Form validation and Submission interaction
    const form = document.getElementById('booking-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('book-name').value;
      const email = document.getElementById('book-email').value;
      const guests = document.getElementById('book-guests').value;
      const date = document.getElementById('book-date').value;

      // Beautiful animated success transition
      bookingContainer.innerHTML = `
        <div class="booking-success-card">
          <div class="success-icon">✓</div>
          <h2>Booking Requested!</h2>
          <p style="color: var(--text-secondary); margin-bottom: 10px;">
            Thank you <strong>${name}</strong>. We have registered your reservation request for <strong>${tour.title}</strong> on <strong>${date}</strong> for <strong>${guests} guest(s)</strong>.
          </p>
          <p style="color: var(--text-muted); font-size: 0.9rem;">
            A travel concierge will reach out to you at <strong>${email}</strong> within 2 hours to confirm your flight/hotel preferences and secure tickets.
          </p>
          <button class="btn btn-secondary" style="margin-top: 20px;" onclick="document.getElementById('modal-overlay').classList.remove('open')">
            Close Panel
          </button>
        </div>
      `;
    });

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // Stop scroll leak
  }

  // Close modal logic
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  function closeModal() {
    modalOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Scroll Animations intersection observer
  function setupScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Staggered delay for card rendering effect
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 80);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
  }

  // Render initial tours
  renderTours(tours);
});
