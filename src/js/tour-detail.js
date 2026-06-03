import { tours } from './tours-data.js';

const customTours = JSON.parse(localStorage.getItem('ozotrips_custom_packages')) || [];
const allTours = [...tours, ...customTours];

document.addEventListener('DOMContentLoaded', () => {
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

  // Parse ID parameter
  const params = new URLSearchParams(window.location.search);
  const tourId = parseInt(params.get('id')) || 1; // Default to Hunza Tour if no ID

  const tour = allTours.find(t => t.id === tourId);
  if (!tour) {
    document.querySelector('main').innerHTML = `
      <div style="padding: 100px 0; text-align: center;">
        <h2>Tour Package Not Found</h2>
        <p style="margin-top: 15px;"><a href="./tours.html" class="btn btn-primary">Back to Catalog</a></p>
      </div>
    `;
    return;
  }

  // Populate Elements
  const banner = document.getElementById('detail-banner');
  if (banner) {
    banner.style.backgroundImage = `url('${tour.image}')`;
  }

  document.getElementById('detail-badge').textContent = tour.type === 'local' ? '🇵🇰 Local Pakistan' : '✈️ International';
  document.getElementById('detail-category').textContent = `${tour.category} Tour`;
  document.getElementById('detail-title').textContent = tour.title;
  document.getElementById('detail-subtitle').textContent = tour.description;
  
  document.getElementById('stat-duration').textContent = tour.duration;
  document.getElementById('stat-rating').textContent = `${tour.rating} (${tour.reviews} reviews)`;
  document.getElementById('detail-price').textContent = `${tour.currency}${tour.price}`;

  // Populate Inclusions & Exclusions dynamically
  const inclusionsContainer = document.getElementById('detail-inclusions');
  const exclusionsContainer = document.getElementById('detail-exclusions');
  
  if (inclusionsContainer && tour.inclusions) {
    inclusionsContainer.innerHTML = tour.inclusions.map(inc => `<li>${inc}</li>`).join('');
  }
  if (exclusionsContainer && tour.exclusions) {
    exclusionsContainer.innerHTML = tour.exclusions.map(exc => `<li>${exc}</li>`).join('');
  }

  // Display Makkah/Madinah Hotels if category is Umrah
  const hotelSection = document.getElementById('hotel-section');
  if (tour.category === 'Umrah' && hotelSection) {
    hotelSection.style.display = 'block';
    document.getElementById('makkah-hotel-name').textContent = tour.makkahHotel || 'TBD';
    document.getElementById('makkah-hotel-dist').textContent = tour.makkahDistance || '--';
    document.getElementById('madinah-hotel-name').textContent = tour.madinahHotel || 'TBD';
    document.getElementById('madinah-hotel-dist').textContent = tour.madinahDistance || '--';
  } else if (hotelSection) {
    hotelSection.style.display = 'none';
  }

  // Note: Itinerary timeline is hidden in HTML for now per user requirements,
  // so we do not need to populate it.

  // Handle Booking Form Submission redirecting to Success page
  const bookingForm = document.getElementById('booking-detail-form');
  bookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('book-name').value;
    const email = document.getElementById('book-email').value;
    const phone = document.getElementById('book-phone').value;
    const date = document.getElementById('book-date').value;
    const guests = document.getElementById('book-guests').value;

    // Send values to success page via URL params
    const successUrl = `./booking-success.html?tour=${encodeURIComponent(tour.title)}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&date=${encodeURIComponent(date)}&guests=${guests}`;
    window.location.href = successUrl;
  });
});
