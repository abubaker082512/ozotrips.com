import { attractions } from './attractions-data.js';
import './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('attractions-grid');
  const buttons = document.querySelectorAll('.category-btn');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle?.querySelector('span');

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

  // Render function
  function render(list) {
    if (!grid) return;
    
    if (list.length === 0) {
      grid.innerHTML = `<div class="glass-panel" style="grid-column: 1/-1; padding: 40px; text-align: center;">No attractions found in this category.</div>`;
      return;
    }

    grid.innerHTML = list.map(item => `
      <div class="attraction-card glass-panel fade-in">
        <div class="attraction-img-box">
          <img class="attraction-img" src="${item.image}" alt="${item.name}">
        </div>
        <div class="attraction-body">
          <span class="attraction-meta">📍 ${item.location}</span>
          <h3 class="attraction-title">${item.name}</h3>
          <p class="attraction-desc">${item.description}</p>
          <div class="attraction-footer">
            <span style="color: var(--text-muted);">Season: <strong style="color: var(--color-primary);">${item.bestTime}</strong></span>
            <a href="./tour-detail.html?id=${item.tourId}" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.85rem;">View Tour Package ➔</a>
          </div>
        </div>
      </div>
    `).join('');

    // Trigger the staggered scroll reveal observer
    window.OzoAuth?.setupScrollAnimations();
  }

  // Filter Buttons Click
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      buttons.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const cat = e.currentTarget.getAttribute('data-cat');
      
      if (cat === 'All') {
        render(attractions);
      } else {
        const filtered = attractions.filter(item => item.category === cat);
        render(filtered);
      }
    });
  });

  // Initial render
  render(attractions);
});
