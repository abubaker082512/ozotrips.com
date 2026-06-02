import { tours } from './tours-data.js';

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

  const tour = tours.find(t => t.id === tourId);
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

  // Populate Itinerary Days based on duration
  const daysCount = parseInt(tour.duration.split(' ')[0]) || 5;
  const itineraryContainer = document.getElementById('detail-itinerary');

  // Hardcode beautiful itineraries per tour to look premium, or fallback
  const itineraries = {
    1: [ // Hunza
      { title: "Arrival in Gilgit & Drive to Hunza", desc: "Arrive in Gilgit, meet our concierge staff, and drive along the scenic Hunza River. Stop at the Rakaposhi viewpoint for a warm tea break looking at the snowy heights. Check-in at your hotel in Karimabad." },
      { title: "Explore Altit and Baltit Forts", desc: "Discover Karimabad town. Visit the historical Altit Fort (900 years old) and Baltit Fort (700 years old), walking through old fruit orchards and cobblestone markets selling traditional gemstones and dried apricots." },
      { title: "Attabad Lake Boating & Passu Cones", desc: "Travel to Attabad Lake for a boat safari over its turquoise waters. Drive further along the Karakoram Highway to Passu to photograph the majestic Passu Cones. Stay in a luxury resort overlooking the peaks." },
      { title: "Day Trip to Khunjerab Pass (China Border)", desc: "Excursion to the Pak-China Border at Khunjerab Pass, the highest paved international border crossing in the world (4,693m). Spot Himalayan Ibex in the national park." },
      { title: "Hussaini Suspension Bridge & Ganish Village", desc: "Walk on the thrilling Hussaini Suspension Bridge, then explore Ganish, the oldest settlement in Hunza. Enjoy a traditional musical dinner in Karimabad." },
      { title: "Duiker Sunrise & Return to Gilgit", desc: "Catch the sunrise over 11 high peaks from Duiker viewpoint. Drive back to Gilgit for local shopping." },
      { title: "Flight to Islamabad / Departure", desc: "Catch your scenic flight from Gilgit back to Islamabad. Services end with warm memories." }
    ],
    4: [ // Kyoto
      { title: "Arrival in Kyoto & Gion Evening Walk", desc: "Land at Osaka/Kyoto, transfer to your boutique hotel. Experience an evening walking tour of the Gion geisha district under traditional wooden lanterns." },
      { title: "Fushimi Inari Shrine & Kiyomizu-dera", desc: "Wander early morning through the 10,000 Torii gates of Fushimi Inari. Walk up to Kiyomizu-dera temple overlooking Kyoto city." },
      { title: "Kinkaku-ji & Arashiyama Bamboo Forest", desc: "Visit the stunning Golden Pavilion (Kinkaku-ji) reflected in its surrounding mirror pond. Stroll through the towering stalks of Arashiyama Bamboo Forest." },
      { title: "Traditional Tea Ceremony & Nijo Castle", desc: "Participate in a Zen-guided matcha tea ceremony in a historic garden. Tour Nijo Castle to hear the famous nightingale security floors." },
      { title: "Day Trip to Nara Deer Park", desc: "Take a fast train to Nara. Visit Todai-ji Temple, housing Japan's largest bronze Buddha, and feed the friendly bowing deer in Nara Park." },
      { title: "Ginkaku-ji and Philosopher's Path", desc: "Walk along the cherry-tree lined canal path of the Philosopher's Walk to the Silver Pavilion." },
      { title: "Traditional Kaiseki Dining Experience", desc: "Indulge in a premium multi-course Kaiseki dinner at a Michelin-starred river lodge." },
      { title: "Departure from Kansai Airport", desc: "Enjoy your morning at leisure before taking the airport shuttle for your return flight." }
    ]
  };

  // Generate itinerary HTML
  const tourItinerary = itineraries[tourId] || Array.from({ length: daysCount }).map((_, idx) => ({
    title: `Day ${idx + 1}: Discover ${tour.title.split(' ')[0]} Highlights`,
    desc: `Experience custom excursions, premium local sightseeing, gourmet meals, and luxury stay arrangements curated especially for our signature itinerary on Day ${idx + 1}.`
  }));

  if (itineraryContainer) {
    itineraryContainer.innerHTML = tourItinerary.map((day, idx) => `
      <div class="itinerary-day fade-in visible">
        <div class="itinerary-day-num">Day ${idx + 1}</div>
        <h3 class="itinerary-day-title">${day.title}</h3>
        <p style="color: var(--text-secondary); font-size: 0.95rem;">${day.desc}</p>
      </div>
    `).join('');
  }

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
