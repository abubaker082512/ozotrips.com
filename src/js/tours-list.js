import { tours } from './tours-data.js';

const customTours = JSON.parse(localStorage.getItem('ozotrips_custom_packages')) || [];
const allTours = [...tours, ...customTours];

document.addEventListener('DOMContentLoaded', () => {
  const toursGrid = document.getElementById('tours-grid');
  const searchInput = document.getElementById('search-dest');
  const filterType = document.getElementById('filter-type');
  const filterBudget = document.getElementById('filter-budget');
  const filterDuration = document.getElementById('filter-duration');
  const searchBtn = document.getElementById('search-btn');
  const categoryContainer = document.getElementById('category-list');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle?.querySelector('span');

  let favorites = JSON.parse(localStorage.getItem('ozotrips_favs')) || [];

  // Theme Setup
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  if (themeIcon) themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
  }

  // Categories Setup
  const categories = ['All', 'Local', 'International', 'Adventure', 'Cultural', 'Beach', 'Mountain', 'Umrah'];
  if (categoryContainer) {
    categoryContainer.innerHTML = categories.map(cat => `
      <button class="category-btn ${cat === 'All' ? 'active' : ''}" data-category="${cat}">
        ${cat === 'All' ? '🗺️' : 
          cat === 'Local' ? '🇵🇰' : 
          cat === 'International' ? '✈️' : 
          cat === 'Adventure' ? '🧗' : 
          cat === 'Cultural' ? '🏛️' : 
          cat === 'Beach' ? '🏖️' : 
          cat === 'Mountain' ? '🏔️' : '🕋'} ${cat}
      </button>
    `).join('');

    categoryContainer.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        categoryContainer.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        applyFilters(e.currentTarget.getAttribute('data-category'));
      });
    });
  }

  // Filter Logic
  function applyFilters(selectedCategory = 'All') {
    const query = searchInput?.value.toLowerCase() || '';
    const typeVal = filterType?.value || '';
    const budgetVal = filterBudget?.value || '';
    const durationVal = filterDuration?.value || '';
    const activeCategory = selectedCategory !== 'All' ? selectedCategory : 
      (categoryContainer?.querySelector('.category-btn.active')?.getAttribute('data-category') || 'All');

    const filtered = allTours.filter(tour => {
      const matchesSearch = tour.title.toLowerCase().includes(query) || 
                            tour.description.toLowerCase().includes(query);
      
      let matchesType = true;
      if (typeVal) {
        matchesType = tour.type === typeVal;
      } else if (activeCategory === 'Local') {
        matchesType = tour.type === 'local';
      } else if (activeCategory === 'International') {
        matchesType = tour.type === 'international';
      }

      let matchesCategory = true;
      if (activeCategory !== 'All' && activeCategory !== 'Local' && activeCategory !== 'International') {
        matchesCategory = tour.category === activeCategory;
      }

      let matchesBudget = true;
      if (budgetVal) {
        matchesBudget = tour.price <= parseInt(budgetVal);
      }

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

  // Bind Events
  searchBtn?.addEventListener('click', () => applyFilters());
  filterType?.addEventListener('change', () => applyFilters());
  filterBudget?.addEventListener('change', () => applyFilters());
  filterDuration?.addEventListener('change', () => applyFilters());
  searchInput?.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') applyFilters();
  });

  // Favorite Toggling
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

  // Render Tours Grid
  function renderTours(toursList) {
    if (!toursGrid) return;
    
    if (toursList.length === 0) {
      toursGrid.innerHTML = `
        <div class="glass-panel" style="grid-column: 1 / -1; padding: 60px; text-align: center; color: var(--text-muted);">
          🔍 No tours found. Try adjusting filters.
        </div>
      `;
      return;
    }

    toursGrid.innerHTML = toursList.map(tour => {
      const isFav = favorites.includes(tour.id);
      return `
        <div class="tour-card glass-panel fade-in visible">
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
              <div class="tour-duration">🕒 ${tour.duration}</div>
              <div class="tour-rating">⭐ <span>${tour.rating}</span> (${tour.reviews})</div>
            </div>
            <h3 class="tour-title">${tour.title}</h3>
            <p class="tour-desc">${tour.description}</p>
            <div class="tour-footer">
              <div class="tour-price-box">
                <span class="tour-price-lbl">Starting from</span>
                <span class="tour-price">${tour.currency}${tour.price}<span>/person</span></span>
              </div>
              <a href="./tour-detail.html?id=${tour.id}" class="btn btn-secondary">View Details ➜</a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderTours(allTours);
});
