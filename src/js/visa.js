import './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle?.querySelector('span');
  const visaForm = document.getElementById('visa-inquiry-form');
  const visaFormBox = document.getElementById('visa-form-box');

  // Pricing Table DOM Elements
  const searchInput = document.getElementById('visa-search-input');
  const tableBody = document.getElementById('visa-pricing-table-body');
  const filterTabs = document.querySelectorAll('#table-filter-tabs button');

  // Theme Setup
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

  // Visa Pricing Data List (PKR prices with ±200-500 PKR difference from Yugo.pk applied)
  const visaPrices = [
    { country: "Azerbaijan", flag: "🇦🇿", type: "Tourist e-Visa", price: 13300, category: "no-statement" },
    { country: "Australia", flag: "🇦🇺", type: "Visitor Visa Subclass 600", price: 94700, category: "other" },
    { country: "Canada", flag: "🇨🇦", type: "Temporary Resident Visa", price: 95350, category: "other" },
    { country: "Egypt", flag: "🇪🇬", type: "Tourist Sticker Visa", price: 74800, category: "sticker" },
    { country: "Greece", flag: "🇬🇷", type: "Schengen Tourist Visa", price: 75300, category: "other" },
    { country: "Hong Kong", flag: "🇭🇰", type: "Tourist Visa Support", price: 48700, category: "no-statement" },
    { country: "Malaysia", flag: "🇲🇾", type: "Tourist e-Visa", price: 16350, category: "no-statement" },
    { country: "Singapore", flag: "🇸🇬", type: "Tourist e-Visa", price: 24700, category: "no-statement" },
    { country: "Thailand", flag: "🇹🇭", type: "Tourist Sticker Visa", price: 20200, category: "sticker" },
    { country: "Turkey", flag: "🇹🇷", type: "Tourist Sticker Visa Support", price: 38300, category: "sticker" },
    { country: "UAE (Dubai)", flag: "🇦🇪", type: "30 Days Tourist e-Visa (Dubai ID)", price: 32300, category: "no-statement" },
    { country: "United Kingdom (UK)", flag: "🇬🇧", type: "Standard Visitor Visa Support", price: 94800, category: "other" },
    { country: "United States (USA)", flag: "🇺🇸", type: "B1/B2 Visa Prep & Advisory", price: 95250, category: "other" },
    { country: "Saudi Arabia (Umrah)", flag: "🇸🇦", type: "Umrah Visit Visa (With Insurance)", price: 44700, category: "no-statement" },
    { country: "Schengen Support", flag: "🇪🇺", type: "Visa File Preparation & Consultancy", price: 45300, category: "other" }
  ];

  // Function to Render Table Rows
  function renderTable(dataList) {
    if (!tableBody) return;
    
    if (dataList.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="3" style="padding: 24px; text-align: center; color: var(--text-muted);">
            No matching visa destinations found.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = dataList.map(item => `
      <tr style="border-bottom: 1px solid var(--border-glass); transition: background var(--transition-fast);">
        <td style="padding: 16px 24px; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.35rem; display: inline-flex; align-items: center;">${item.flag || ''}</span>
          <span>${item.country}</span>
        </td>
        <td style="padding: 16px 24px; color: var(--text-secondary);">${item.type}</td>
        <td style="padding: 16px 24px; text-align: right; font-weight: 700; color: var(--color-primary);">${item.price.toLocaleString()} PKR</td>
      </tr>
    `).join('');

    // Add row hover styling dynamically
    tableBody.querySelectorAll('tr').forEach(row => {
      row.addEventListener('mouseenter', () => {
        row.style.background = 'rgba(255, 255, 255, 0.02)';
      });
      row.addEventListener('mouseleave', () => {
        row.style.background = 'transparent';
      });
    });
  }

  // Filter & Search Event Listeners
  function applyFilters() {
    const query = searchInput?.value.toLowerCase().trim() || "";
    const activeTab = document.querySelector('#table-filter-tabs button.active');
    const filterVal = activeTab ? activeTab.getAttribute('data-filter') : 'all';

    const filtered = visaPrices.filter(item => {
      const matchesSearch = item.country.toLowerCase().includes(query) || 
                            item.type.toLowerCase().includes(query);
      
      const matchesCategory = filterVal === 'all' || item.category === filterVal;
      
      return matchesSearch && matchesCategory;
    });

    renderTable(filtered);
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      filterTabs.forEach(t => t.classList.remove('active'));
      e.currentTarget.classList.add('active');
      applyFilters();
    });
  });

  // Render initial table contents
  renderTable(visaPrices);

  // Pre-fill visa form if user is logged in
  const session = window.OzoAuth?.getSession();
  if (session) {
    const nameInput = document.getElementById('visa-name');
    const emailInput = document.getElementById('visa-email');
    if (nameInput) nameInput.value = session.name;
    if (emailInput) emailInput.value = session.email;
  }

  // Inquiry Form Handler
  if (visaForm && visaFormBox) {
    visaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (!window.OzoAuth?.isLoggedIn()) {
        window.OzoAuth?.openLoginModal(() => {
          const s = window.OzoAuth.getSession();
          if (s) {
            const nameInput = document.getElementById('visa-name');
            const emailInput = document.getElementById('visa-email');
            if (nameInput) nameInput.value = s.name;
            if (emailInput) emailInput.value = s.email;
          }
          visaForm.requestSubmit();
        });
        return;
      }
      
      const name = document.getElementById('visa-name').value;
      const email = document.getElementById('visa-email').value;
      const country = document.getElementById('visa-country').value;
      const category = document.getElementById('visa-type').options[document.getElementById('visa-type').selectedIndex].text;

      // Show spinner loading state
      const submitBtn = visaForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="auth-spinner"></span> Processing...';

      setTimeout(() => {
        // Log the visa booking
        window.OzoAuth.addBooking({
          type: 'visa',
          title: `Visa Consultation: ${country}`,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          guests: '1 Applicant',
          price: 0,
          status: 'Inquiry Pending'
        });

        visaFormBox.innerHTML = `
          <div class="booking-success-card" style="text-align: center; padding: 20px; animation: fadeIn var(--transition-normal) forwards;">
            <div class="success-icon" style="width: 70px; height: 70px; border-radius: 50%; background: rgba(181, 153, 111, 0.1); color: var(--color-primary); display: inline-flex; align-items: center; justify-content: center; font-size: 2rem; box-shadow: var(--glow-primary); margin-bottom: 20px;">✓</div>
            <h3 style="font-size: 1.4rem; margin-bottom: 12px; color: var(--text-primary);">Consultation Booked!</h3>
            <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; margin-bottom: 16px;">
              Thank you <strong>${name}</strong>. We have registered your inquiry for a <strong>${category}</strong> to <strong>${country}</strong>.
            </p>
            <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.6;">
              A senior immigration counselor will email you at <strong>${email}</strong> or call you within the next 24 business hours to analyze your documents.
            </p>
          </div>
        `;
      }, 1000);
    });
  }
});
