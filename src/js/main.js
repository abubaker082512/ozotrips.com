import { tours } from './tours-data.js';
import './auth.js';

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
  const currentTheme = 'light';
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

  // Hero Background Carousel Rotation
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  const indicatorsContainer = document.getElementById('carousel-indicators');

  if (slides.length > 0) {
    // Generate indicators dynamically
    if (indicatorsContainer) {
      indicatorsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.className = idx === 0 ? 'indicator active' : 'indicator';
        dot.setAttribute('data-slide', idx);
        indicatorsContainer.appendChild(dot);
      });
    }

    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    let autoplayTimer;
    const slideTitle = document.querySelector('.slide-tour-title');
    const slideDesc = document.querySelector('.slide-tour-desc');
    const tourInfoCard = document.getElementById('hero-tour-info');

    const showSlide = (index) => {
      // Deactivate current slide
      slides[currentSlide].classList.remove('active');
      if (indicators[currentSlide]) {
        indicators[currentSlide].classList.remove('active');
      }

      // Activate target slide
      currentSlide = index;
      slides[currentSlide].classList.add('active');
      if (indicators[currentSlide]) {
        indicators[currentSlide].classList.add('active');
      }

      // Update dynamic tour info card on the right
      if (tourInfoCard && slideTitle && slideDesc) {
        // Fade out
        tourInfoCard.style.opacity = '0';
        tourInfoCard.style.transform = 'translateY(-40%)';

        setTimeout(() => {
          const activeSlide = slides[currentSlide];
          const title = activeSlide.getAttribute('data-title') || '';
          const desc = activeSlide.getAttribute('data-desc') || '';
          const tourId = activeSlide.getAttribute('data-tour-id') || '3';
          const tourPrice = activeSlide.getAttribute('data-tour-price') || '';
          const tourDuration = activeSlide.getAttribute('data-tour-duration') || '';
          const tourBadge = activeSlide.getAttribute('data-tour-badge') || '';

          slideTitle.textContent = title;
          slideDesc.textContent = desc;

          const badgeEl = document.getElementById('hero-tour-badge');
          if (badgeEl) badgeEl.textContent = tourBadge;

          const priceEl = document.getElementById('hero-tour-price');
          if (priceEl) priceEl.textContent = tourPrice;

          const durationEl = document.getElementById('hero-tour-duration');
          if (durationEl) durationEl.textContent = tourDuration;

          const bookBtnEl = document.getElementById('hero-tour-book-btn');
          if (bookBtnEl) {
            bookBtnEl.setAttribute('onclick', `openBookingModal(${tourId})`);
          }

          // Fade back in
          tourInfoCard.style.opacity = '1';
          tourInfoCard.style.transform = 'translateY(-50%)';
        }, 300);
      }
    };

    const nextSlide = () => {
      const nextIdx = (currentSlide + 1) % slides.length;
      showSlide(nextIdx);
    };

    const prevSlide = () => {
      const prevIdx = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prevIdx);
    };

    const startAutoplay = () => {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(nextSlide, 6000);
    };

    const resetAutoplay = () => {
      startAutoplay();
    };

    // Auto switch slides
    startAutoplay();

    // Event listeners for arrows
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
      });
    }

    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        showSlide(index);
        resetAutoplay();
      });
    });
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
          filterType.value = '';
        } else if (categoryVal === 'International') {
          filterType.value = '';
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
      
      // 2. Type Match (Local/International/Group/Private)
      let matchesType = true;
      if (typeVal) {
        matchesType = tour.type === typeVal;
      } else if (activeCategory === 'Local') {
        matchesType = tour.type.startsWith('local');
      } else if (activeCategory === 'International') {
        matchesType = tour.type.startsWith('international');
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

  // Search Portal card search logic
  const portalSearchBtn = document.getElementById("portal-search-btn");
  const portalDestInput = document.getElementById("portal-dest");
  const portalBudgetSelect = document.getElementById("portal-budget");
  const portalThemeSelect = document.getElementById("portal-theme");

  if (portalSearchBtn) {
    portalSearchBtn.addEventListener("click", () => {
      let url = "./tours.html?";
      if (portalDestInput && portalDestInput.value) {
        url += "search=" + encodeURIComponent(portalDestInput.value) + "&";
      }
      if (portalBudgetSelect && portalBudgetSelect.value) {
        url += "budget=" + portalBudgetSelect.value + "&";
      }
      if (portalThemeSelect && portalThemeSelect.value) {
        url += "category=" + portalThemeSelect.value + "&";
      }
      window.location.href = url;
    });
  }

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
            <div class="tour-badge ${tour.type.startsWith('international') ? 'international' : ''}">
              ${tour.type === 'local-group' ? '🇵🇰 Local Group' : 
                tour.type === 'local-private' ? '🏡 Local Private' : 
                tour.type === 'international-group' ? '✈️ International Group' : '💎 International Private'}
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
            <div class="tour-footer" style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
              <div class="tour-price-box" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <span class="tour-price-lbl">Starting from</span>
                <span class="tour-price" style="font-size: 1.15rem; font-weight: 700; color: var(--color-primary);">${tour.currency} ${tour.price.toLocaleString()}</span>
              </div>
              <div style="display: flex; gap: 8px; width: 100%;">
                <a href="./tour-detail.html?id=${tour.id}" class="btn btn-secondary" style="flex: 1; text-align: center; font-size: 0.85rem; padding: 10px 0; justify-content: center;">Details</a>
                <button class="btn btn-primary" onclick="openBookingModal(${tour.id})" style="flex: 1; font-size: 0.85rem; padding: 10px 0; justify-content: center;">Book Now</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

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
          <span class="modal-meta-val">
            ${tour.type === 'local-group' ? '🇵🇰 Local Group' : 
              tour.type === 'local-private' ? '🏡 Local Private' : 
              tour.type === 'international-group' ? '✈️ International Group' : '💎 International Private'}
          </span>
        </div>
        <div class="modal-meta-item">
          <span class="modal-meta-lbl">Price Per Person</span>
          <span class="modal-meta-val" style="color: var(--color-primary); font-weight: 800;">${tour.currency} ${tour.price.toLocaleString()}</span>
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
  window.openBookingModal = openBookingModal;

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

  // 6. Interactive Destination Recommendation Quiz Logic
  const quizBox = document.getElementById('recommendation-quiz-box');
  if (quizBox) {
    let selectedMood = '';
    let selectedBudget = '';
    let selectedCompany = '';

    quizBox.addEventListener('click', (e) => {
      const btn = e.target.closest('.quiz-opt-btn');
      if (!btn) return;

      const step = parseInt(btn.getAttribute('data-step'));
      const val = btn.getAttribute('data-val');

      if (step === 1) {
        selectedMood = val;
        quizBox.innerHTML = `
          <div id="quiz-question-container" style="animation: fadeIn var(--transition-fast) forwards;">
            <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--color-primary); letter-spacing: 1px;">Step 2 of 3</span>
            <h3 style="font-size: 1.4rem; margin-top: 8px; margin-bottom: 24px;">What is your budget tier?</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <button type="button" class="btn btn-secondary quiz-opt-btn" data-step="2" data-val="low" style="width: 100%; text-align: left; justify-content: flex-start; padding: 16px 20px;">💵 Budget-Friendly (Under $500)</button>
              <button type="button" class="btn btn-secondary quiz-opt-btn" data-step="2" data-val="medium" style="width: 100%; text-align: left; justify-content: flex-start; padding: 16px 20px;">💳 Moderate Spending ($500 - $1500)</button>
              <button type="button" class="btn btn-secondary quiz-opt-btn" data-step="2" data-val="high" style="width: 100%; text-align: left; justify-content: flex-start; padding: 16px 20px;">💎 Luxury / Premium ($1500+)</button>
            </div>
          </div>
        `;
      } else if (step === 2) {
        selectedBudget = val;
        quizBox.innerHTML = `
          <div id="quiz-question-container" style="animation: fadeIn var(--transition-fast) forwards;">
            <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--color-primary); letter-spacing: 1px;">Step 3 of 3</span>
            <h3 style="font-size: 1.4rem; margin-top: 8px; margin-bottom: 24px;">Who are you traveling with?</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <button type="button" class="btn btn-secondary quiz-opt-btn" data-step="3" data-val="solo" style="width: 100%; text-align: left; justify-content: flex-start; padding: 16px 20px;">🧘 Wandering Solo</button>
              <button type="button" class="btn btn-secondary quiz-opt-btn" data-step="3" data-val="partner" style="width: 100%; text-align: left; justify-content: flex-start; padding: 16px 20px;">👩‍❤️‍👨 Romantic Couple</button>
              <button type="button" class="btn btn-secondary quiz-opt-btn" data-step="3" data-val="family" style="width: 100%; text-align: left; justify-content: flex-start; padding: 16px 20px;">👨‍👩‍👧‍👦 Family / Group</button>
            </div>
          </div>
        `;
      } else if (step === 3) {
        selectedCompany = val;
        let matchedId = 1;
        
        if (selectedMood === 'mountain') {
          if (selectedBudget === 'high') matchedId = 6;
          else if (selectedCompany === 'family') matchedId = 1;
          else matchedId = 2;
        } else if (selectedMood === 'beach') {
          if (selectedBudget === 'high') matchedId = 5;
          else matchedId = 7;
        } else if (selectedMood === 'culture') {
          if (selectedBudget === 'high') matchedId = 4;
          else if (selectedCompany === 'family') matchedId = 8;
          else matchedId = 3;
        }

        const matchedTour = tours.find(t => t.id === matchedId) || tours[0];

        quizBox.innerHTML = `
          <div id="quiz-result-container" style="text-align: center; animation: fadeIn var(--transition-normal) forwards;">
            <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--color-primary); letter-spacing: 1px;">Your Match Found! 🎉</span>
            <h3 style="font-size: 1.4rem; margin-top: 8px; margin-bottom: 20px;">We recommend:</h3>
            
            <div style="border-radius: var(--border-radius-md); overflow: hidden; border: 1px solid var(--border-glass); margin-bottom: 20px; background: rgba(255,255,255,0.01);">
              <img src="${matchedTour.image}" alt="${matchedTour.title}" style="width: 100%; height: 160px; object-fit: cover;">
              <div style="padding: 16px; text-align: left;">
                <span style="font-size: 0.75rem; color: var(--color-primary); font-weight: 700; text-transform: uppercase;">${matchedTour.duration} • ${matchedTour.category}</span>
                <h4 style="font-size: 1.1rem; margin-top: 4px; margin-bottom: 8px; font-weight: 700;">${matchedTour.title}</h4>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
                  <span style="font-size: 1.2rem; font-weight: 800; color: var(--color-primary);">${matchedTour.currency}${matchedTour.price}</span>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">★ ${matchedTour.rating}</span>
                </div>
              </div>
            </div>

            <div style="display: flex; gap: 12px;">
              <a href="./tour-detail.html?id=${matchedTour.id}" class="btn btn-primary" style="flex-grow: 1;">View Details ➜</a>
              <button type="button" id="reset-quiz-btn" class="btn btn-secondary">Retry ↺</button>
            </div>
          </div>
        `;
      }
    });

    // Reset Quiz
    quizBox.addEventListener('click', (e) => {
      if (e.target.id === 'reset-quiz-btn') {
        quizBox.innerHTML = `
          <div id="quiz-question-container" style="animation: fadeIn var(--transition-fast) forwards;">
            <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--color-primary); letter-spacing: 1px;">Step 1 of 3</span>
            <h3 id="quiz-question-title" style="font-size: 1.4rem; margin-top: 8px; margin-bottom: 24px;">What is your current travel mood?</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;" id="quiz-options">
              <button type="button" class="btn btn-secondary quiz-opt-btn" data-step="1" data-val="mountain" style="width: 100%; text-align: left; justify-content: flex-start; padding: 16px 20px;">🏔️ Majestic Mountain Summits</button>
              <button type="button" class="btn btn-secondary quiz-opt-btn" data-step="1" data-val="beach" style="width: 100%; text-align: left; justify-content: flex-start; padding: 16px 20px;">🏖️ Relaxing Tropical Beaches</button>
              <button type="button" class="btn btn-secondary quiz-opt-btn" data-step="1" data-val="culture" style="width: 100%; text-align: left; justify-content: flex-start; padding: 16px 20px;">🏛️ Rich Cultural Heritage & Cities</button>
            </div>
          </div>
        `;
      }
    });
  }

  // Render initial tours
  renderTours(tours);

  // Counter Count Up Animation
  const stats = document.querySelectorAll('.stat-num');
  if (stats.length > 0) {
    const countUp = (el) => {
      const target = parseFloat(el.getAttribute('data-target'));
      const isFloat = target % 1 !== 0;
      let count = 0;
      const speed = isFloat ? 0.1 : Math.ceil(target / 100);
      const interval = setInterval(() => {
        count += speed;
        if (count >= target) {
          el.textContent = isFloat ? target.toFixed(1) : target + '+';
          clearInterval(interval);
        } else {
          el.textContent = isFloat ? count.toFixed(1) : Math.floor(count) + '+';
        }
      }, 20);
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));
  }

  // Dynamic Marquee Loader
  const marqueeTextEl = document.getElementById('marquee-text-content');
  if (marqueeTextEl) {
    const savedMarquee = localStorage.getItem('customMarquee');
    if (savedMarquee) {
      marqueeTextEl.innerHTML = savedMarquee;
    }
  }

  // Dynamic Homepage Blogs Loader
  const homeBlogGrid = document.getElementById('home-blog-grid');
  if (homeBlogGrid) {
    const defaultBlogPosts = [
      {
        id: "b1",
        title: "The Ultimate Packing List for Hunza Valley Expedition",
        category: "Guides & Tips",
        summary: "Preparing for a trip to the northern valleys of Pakistan? Here is a comprehensive packing checklist detailing gear, apparel, and documents.",
        image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "b2",
        title: "How to Secure Your Schengen Travel Visa: Step-by-Step",
        category: "Visa Guides",
        summary: "An expert walkthrough on gathering visa documents, bank statements, itinerary drafts, and embassy interviews for a successful Schengen application.",
        image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "b3",
        title: "Top 5 Luxury Resorts in Santorini for a Perfect Honeymoon",
        category: "Luxury Travel",
        summary: "From infinity pools overlooking the caldera to private cave suites in Oia, discover the most spectacular hotels for a dream escape.",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80"
      }
    ];

    const customBlogsJSON = localStorage.getItem('customBlogs');
    const customBlogPosts = customBlogsJSON ? JSON.parse(customBlogsJSON) : [];
    const allBlogs = [...customBlogPosts, ...defaultBlogPosts];

    // Take top 3 blogs
    const topThree = allBlogs.slice(0, 3);
    homeBlogGrid.innerHTML = '';
    topThree.forEach(blog => {
      const blogCard = document.createElement('div');
      blogCard.className = 'glass-panel fade-in';
      blogCard.style.cssText = 'border-radius: var(--border-radius-lg); overflow: hidden; display: flex; flex-direction: column;';
      blogCard.innerHTML = `
        <div style="height: 200px; overflow: hidden;">
          <img src="${blog.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'}" alt="${blog.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-slow);">
        </div>
        <div style="padding: 30px; display: flex; flex-direction: column; gap: 12px; flex: 1;">
          <span style="color: var(--color-secondary); font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">${blog.category || 'Travel'}</span>
          <h3 style="font-size: 1.25rem; font-weight: 700; line-height: 1.4;">${blog.title}</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">${blog.summary || (blog.content ? blog.content.substring(0, 100) + '...' : '')}</p>
          <a href="./blog.html" style="font-weight: 700; color: var(--color-primary); margin-top: auto; font-size: 0.9rem;">Read Story ➔</a>
        </div>
      `;
      homeBlogGrid.appendChild(blogCard);
    });
  }

});
