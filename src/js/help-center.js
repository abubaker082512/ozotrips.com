import './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle?.querySelector('span');

  // Theme Sync
  const currentTheme = 'light';
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

  // FAQ Database
  const faqDatabase = [
    {
      category: "bookings",
      q: "How do I cancel my tour booking?",
      a: "You can cancel any reservation directly from your travel dashboard. Click on 'My Bookings' in the top navigation bar, locate the tour, and click 'Cancel Reservation'. There are no cancellation fees for requests made at least 14 days prior to departure."
    },
    {
      category: "bookings",
      q: "Can I customize a tour itinerary after booking?",
      a: "Yes! Every OzoTrips booking includes dedicated concierge alignment. A travel manager will contact you within 24 hours of reserving to finalize hotel categories, flight times, and optional excursions. You can request custom rerouting or date edits at this stage."
    },
    {
      category: "bookings",
      q: "Are booking payments processed online instantly?",
      a: "No. To ensure absolute quality and slot availability, we do not charge your card instantly. A travel manager reviews your request first. Once aligned on hotels and flights, we send a secure payment link via email."
    },
    {
      category: "visas",
      q: "Do I need a bank statement for e-visas like Azerbaijan or Turkey?",
      a: "Destinations like Azerbaijan, Benin, Rwanda, and Uganda do not require bank statements or heavy documentation. They are processed entirely online. Sticker visas (like Thailand or South Africa) or premium consultancies (US/UK) will require verified statements."
    },
    {
      category: "visas",
      q: "What is the fast-track visa processing time?",
      a: "Electronic e-visas (Azerbaijan, UAE, Kenya) are generally approved in 3-5 business days. Embassy sticker visas require 15-20 business days. Consultancy cases (US/UK visa preps) are aligned based on interview appointments."
    },
    {
      category: "guides",
      q: "Are local tour guides licensed and English-speaking?",
      a: "Absolutely. All OzoTrips guides in Northern Pakistan (Hunza, Skardu, Swat) are government-certified, first-aid trained, and speak fluent English and Urdu. For international tours, we partner with verified local operators."
    },
    {
      category: "guides",
      q: "How should I prepare for Northern Pakistan mountain weather?",
      a: "Mountain weather can change quickly. We recommend dressing in layers: a moisture-wicking base layer, a warm fleece mid-layer, and a waterproof shell jacket. Sturdy trekking boots are essential. Check the packing list on your tour details page for specific items."
    }
  ];

  // DOM Elements
  const searchInput = document.getElementById('faq-search-input');
  const container = document.getElementById('faq-accordion-container');
  const filterTabs = document.querySelectorAll('#faq-filter-tabs button');
  const ticketForm = document.getElementById('support-ticket-form');
  const ticketMsg = document.getElementById('ticket-msg');
  const ticketStatus = document.getElementById('ticket-status-msg');

  // Render FAQs
  function renderFAQs() {
    if (!container) return;

    const query = searchInput?.value.toLowerCase().trim() || "";
    const activeTab = document.querySelector('#faq-filter-tabs button.active');
    const categoryFilter = activeTab ? activeTab.getAttribute('data-category') : 'all';

    const filtered = faqDatabase.filter(item => {
      const matchesSearch = item.q.toLowerCase().includes(query) || item.a.toLowerCase().includes(query);
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="glass-panel" style="padding: 40px; text-align: center; color: var(--text-muted);">
          🔍 No FAQs found. Try searching different keywords.
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map((item, idx) => `
      <div class="faq-item glass-panel fade-in" style="overflow: hidden; transition: transform var(--transition-fast);">
        <button class="faq-trigger" style="display: flex; justify-content: space-between; align-items: center; width: 100%; text-align: left; padding: 20px 24px; background: none; border: none; cursor: pointer; color: var(--text-primary); font-family: var(--font-sans); font-weight: 600; font-size: 1.25rem;">
          <span>${item.q}</span>
          <span class="faq-arrow" style="transition: transform var(--transition-normal); font-size: 1.2rem; color: var(--color-primary);">▼</span>
        </button>
        <div class="faq-content" style="max-height: 0px; overflow: hidden; transition: max-height var(--transition-normal);">
          <p style="padding: 0 24px 20px 24px; color: var(--text-secondary); font-size: 1.08rem; line-height: 1.6;">
            ${item.a}
          </p>
        </div>
      </div>
    `).join('');

    // Attach click listeners for Accordions
    container.querySelectorAll('.faq-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        const item = e.currentTarget.parentElement;
        const content = item.querySelector('.faq-content');
        const arrow = item.querySelector('.faq-arrow');
        
        const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

        // Close all other accordions
        container.querySelectorAll('.faq-content').forEach(c => {
          c.style.maxHeight = '0px';
        });
        container.querySelectorAll('.faq-arrow').forEach(a => {
          a.style.transform = 'rotate(0deg)';
        });

        if (!isOpen) {
          content.style.maxHeight = `${content.scrollHeight}px`;
          arrow.style.transform = 'rotate(180deg)';
        }
      });
    });

    // Staggered reveal animations
    window.OzoAuth?.setupScrollAnimations();
  }

  // Bind Events for filters & search
  if (searchInput) {
    searchInput.addEventListener('input', renderFAQs);
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      filterTabs.forEach(t => t.classList.remove('active'));
      e.currentTarget.classList.add('active');
      renderFAQs();
    });
  });

  // Initial render
  renderFAQs();

  // Support Ticket Form Submit
  if (ticketForm) {
    ticketForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!window.OzoAuth?.isLoggedIn()) {
        window.OzoAuth?.openLoginModal(() => {
          ticketForm.requestSubmit();
        });
        return;
      }

      const msg = ticketMsg.value.trim();
      const snippet = msg.length > 30 ? msg.substring(0, 30) + '...' : msg;

      const submitBtn = ticketForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="auth-spinner"></span> Filing Ticket...';

      setTimeout(() => {
        // Log ticket into user inquiry history
        window.OzoAuth.addBooking({
          type: 'visa', // Keep schema clean
          title: `Support Ticket: ${snippet}`,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          guests: 'Pending Review',
          price: 0,
          status: 'Inquiry Pending'
        });

        // Show status message
        ticketStatus.style.display = 'block';
        ticketStatus.style.color = 'var(--color-primary)';
        ticketStatus.textContent = "✓ Support ticket filed successfully! A concierge will contact you.";
        
        // Reset form controls
        ticketMsg.value = '';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Support Ticket';

        // Hide notice after 4 seconds
        setTimeout(() => {
          ticketStatus.style.display = 'none';
        }, 4000);

      }, 1000);
    });
  }
});
