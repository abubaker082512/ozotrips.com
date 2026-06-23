import './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  // Theme Initial Setup
  const currentTheme = 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle?.querySelector('span');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
  }

  // Header Scroll style
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Blog data
  const blogPosts = [
    {
      id: "b1",
      title: "The Ultimate Packing List for Hunza Valley Expedition",
      category: "adventure",
      tag: "Pakistan",
      readTime: "5 min read",
      date: "June 15, 2026",
      summary: "Preparing for a trip to the northern valleys of Pakistan? Here is a comprehensive packing checklist detailing gear, apparel, and documents.",
      content: `Planning a journey to the legendary Hunza Valley requires careful preparation, as weather conditions in the Karakoram range can shift rapidly. Here is your definitive gear checklist:
      
      <h3>1. Technical Apparel</h3>
      - Layered clothing: moisture-wicking base layers, fleece mid-layers, and a windproof, waterproof outer shell.
      - Sturdy, broken-in trekking boots with excellent ankle support.
      - Thermal socks and gloves.
      
      <h3>2. Essential Equipment</h3>
      - A lightweight, durable 40L backpack.
      - UV-protection polarized sunglasses and high SPF sunscreen.
      - Refillable water purification bottles or filtration tablets.
      
      <h3>3. Crucial Documents</h3>
      - Multiple physical copies of your Pakistani Visa/e-Visa.
      - Government issued ID and NOC permits if venturing to restricted border zones.
      
      Always prioritize traveling light, but do not compromise on warm gear. A quality sleeping bag and down jacket are non-negotiable if planning overnight stays in altitude tents.`,
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "b2",
      title: "How to Secure Your Schengen Travel Visa: Step-by-Step",
      category: "visas",
      tag: "Visa Guides",
      readTime: "8 min read",
      date: "May 28, 2026",
      summary: "An expert walkthrough on gathering visa documents, bank statements, itinerary drafts, and embassy interviews for a successful Schengen application.",
      content: `Applying for a Schengen Visa can be daunting, but following a structured approach ensures embassy approval. Follow these steps:
      
      <h3>1. Choose the Correct Consulate</h3>
      Apply to the embassy of the country where you will spend the most nights. If spending equal nights in multiple countries, apply to the country of your first entry.
      
      <h3>2. Build Your Document Dossier</h3>
      Your application checklist must include:
      - A fully completed and signed application form.
      - Passport valid for at least 3 months beyond your planned departure.
      - Round-trip flight reservations and confirmed hotel bookings (OzoTrips provides embassy-ready flight and lodging itineraries).
      - Comprehensive travel health insurance covering up to €30,000.
      
      <h3>3. Prove Financial Sufficiency</h3>
      Provide stamped bank statements showing sufficient funds for your entire duration. Embassies look for steady income balances rather than sudden large cash deposits.
      
      <h3>4. The Interview Prep</h3>
      Arrive on time, dress professionally, and answer questions truthfully. Be ready to explain your exact travel itinerary, your ties to your home country, and your commitment to return.`,
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "b3",
      title: "Top 5 Luxury Resorts in Santorini for a Perfect Honeymoon",
      category: "luxury",
      tag: "Luxury Travel",
      readTime: "4 min read",
      date: "April 12, 2026",
      summary: "From infinity pools overlooking the caldera to private cave suites in Oia, discover the most spectacular hotels for a dream escape.",
      content: `Santorini is the ultimate romantic escape. For couples seeking privacy and world-class service, these resorts offer unparalleled luxury:
      
      <h3>1. Grace Hotel Santorini (Imerovigli)</h3>
      Carved into the volcanic cliffs, Grace features a breathtaking infinity pool that merges seamlessly with the caldera horizon. Enjoy champagne breakfasts and private terraces.
      
      <h3>2. Katikies Hotel (Oia)</h3>
      An iconic cluster of classic white cave suites linked by arched bridges and sparkling pools. Katikies is perfect for capturing dramatic caldera sunsets in total privacy.
      
      <h3>3. Canaves Oia Epitome (Oia)</h3>
      Located slightly away from the crowded paths, Epitome offers massive villas with private pools, combining volcanic stone architecture with modern, minimalist luxury.
      
      <h3>4. Mystique, a Luxury Collection Hotel</h3>
      Featuring soft, hand-sculpted curves and natural cave designs, Mystique offers cliffside dining, deep wine cellars, and panoramic views of the Aegean Sea.
      
      Book these locations at least six months in advance to secure the best caldera-facing suites for your honeymoon.`,
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "b4",
      title: "Traveling Solo: Crucial Safety Tips for Mountain Trekking",
      category: "adventure",
      tag: "Safety",
      readTime: "6 min read",
      date: "March 3, 2026",
      summary: "Essential advice on altitude sickness prep, hiring local certified guides, GPS tracking, and safety protocols for high altitude trails.",
      content: `Solo trekking offers ultimate freedom, but mountains demand respect. Follow these crucial safety rules on your next wilderness adventure:
      
      <h3>1. Share Your Route Itinerary</h3>
      Never start a trail without informing someone. Leave a detailed day-by-day plan with your hotel, local rangers, or OzoTrips support representatives.
      
      <h3>2. Understand Altitude Sickness</h3>
      Acute Mountain Sickness (AMS) can affect anyone, regardless of fitness. Acclimatize slowly, drink plenty of water, and descend immediately if you experience dizziness, nausea, or severe headaches.
      
      <h3>3. Hire a Certified Local Guide</h3>
      While you may hike solo, having a local guide for complex routes (like Concordia or K2 Base Camp) is highly recommended. They understand weather patterns and local languages.
      
      <h3>4. Pack Emergency Navigation</h3>
      Carry a physical topographic map, a compass, and a satellite GPS communicator (such as Garmin InReach) for areas without cellular network coverage.
      
      Respect the weather forecasts, keep an emergency kit handy, and know when to turn back.`,
      image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80"
    }
  ];

  // DOM Elements
  const blogGrid = document.getElementById('blog-grid');
  const searchInput = document.getElementById('blog-search');
  const categoryBtns = document.querySelectorAll('.blog-cat-btn');

  // Modal elements
  const readModal = document.getElementById('read-modal');
  const readModalClose = document.getElementById('read-modal-close');
  const modalCover = document.getElementById('modal-cover');
  const modalMeta = document.getElementById('modal-meta');
  const modalTitle = document.getElementById('modal-title-text');
  const modalBody = document.getElementById('modal-body-content');

  // Active states
  let activeCategory = 'all';
  let searchQuery = '';

  // Render initial posts
  renderPosts();

  // Search filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase();
      renderPosts();
    });
  }

  // Category buttons
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      activeCategory = e.currentTarget.getAttribute('data-cat');
      renderPosts();
    });
  });

  function renderPosts() {
    if (!blogGrid) return;

    const filtered = blogPosts.filter(post => {
      const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery) || 
                            post.summary.toLowerCase().includes(searchQuery) ||
                            post.tag.toLowerCase().includes(searchQuery);
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      blogGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary);">
          <p style="font-size: 1.2rem;">🔍 No articles found matching your query.</p>
        </div>
      `;
      return;
    }

    blogGrid.innerHTML = filtered.map(post => `
      <article class="glass-panel blog-card">
        <div class="blog-card-img-wrapper">
          <img src="${post.image}" alt="${post.title}" class="blog-card-img">
          <span class="blog-card-tag">${post.tag}</span>
        </div>
        <div class="blog-card-content">
          <div class="blog-card-meta">
            <span>📅 ${post.date}</span>
            <span>⏱️ ${post.readTime}</span>
          </div>
          <h3 class="blog-card-title">${post.title}</h3>
          <p class="blog-card-summary">${post.summary}</p>
          <button class="btn btn-secondary read-more-btn" data-id="${post.id}" style="width: 100%; margin-top: 15px;">Read Article ➔</button>
        </div>
      </article>
    `).join('');

    // Bind details trigger
    blogGrid.querySelectorAll('.read-more-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openArticle(id);
      });
    });
  }

  function openArticle(id) {
    const post = blogPosts.find(p => p.id === id);
    if (!post) return;

    modalCover.src = post.image;
    modalTitle.textContent = post.title;
    modalMeta.innerHTML = `
      <span class="badge" style="background: var(--color-secondary); padding: 4px 12px; border-radius: 12px; color: white;">${post.tag}</span>
      <span>📅 ${post.date}</span>
      <span>⏱️ ${post.readTime}</span>
    `;
    modalBody.innerHTML = post.content;
    readModal.classList.add('active');
  }

  if (readModalClose) {
    readModalClose.addEventListener('click', () => {
      readModal.classList.remove('active');
    });
  }

  // Close modal when clicking outside content box
  if (readModal) {
    readModal.addEventListener('click', (e) => {
      if (e.target === readModal) {
        readModal.classList.remove('active');
      }
    });
  }
});
