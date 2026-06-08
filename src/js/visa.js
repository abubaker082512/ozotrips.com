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

  // Visa Pricing Data List (PKR prices with +2,000 PKR increment applied)
  const visaPrices = [
    { country: "Azerbaijan", type: "Tourist e-Visa", price: 20000, category: "no-statement" },
    { country: "Bahrain", type: "14 Days Tourist", price: 42000, category: "no-statement" },
    { country: "Bahrain", type: "30 Days Tourist", price: 57000, category: "no-statement" },
    { country: "Benin", type: "30 Days Tourist / Transit", price: 36500, category: "no-statement" },
    { country: "Benin", type: "90 Days Tourist", price: 52000, category: "no-statement" },
    { country: "Benin", type: "Multiple Entry", price: 56500, category: "no-statement" },
    { country: "Cambodia", type: "Tourist Sticker Visa", price: 26500, category: "sticker" },
    { country: "Ethiopia", type: "30 Days e-Visa", price: 37000, category: "no-statement" },
    { country: "Indonesia", type: "Sticker Visa", price: 49000, category: "sticker" },
    { country: "Iran", type: "Tourist Visa", price: 72000, category: "no-statement" },
    { country: "Kenya", type: "Tourist e-Visa", price: 31500, category: "no-statement" },
    { country: "Malaysia", type: "1 Year Multiple Entry", price: 87000, category: "sticker" },
    { country: "Nepal", type: "Tourist Sticker Visa", price: 24500, category: "sticker" },
    { country: "Oman", type: "Tourist Visa Support", price: 197000, category: "no-statement" },
    { country: "Pakistan", type: "E-Visa Invitation Support", price: 42000, category: "no-statement" },
    { country: "Rwanda", type: "Tourist e-Visa", price: 32000, category: "no-statement" },
    { country: "South Africa", type: "Tourist Sticker Visa", price: 32000, category: "sticker" },
    { country: "Tajikistan", type: "Tourist Visa", price: 22000, category: "other" },
    { country: "Tanzania", type: "Tourist e-Visa", price: 72000, category: "other" },
    { country: "Thailand", type: "Tourist Sticker Visa", price: 26900, category: "other" },
    { country: "Turkey", type: "Tourist Sticker / e-Visa Support", price: 13500, category: "other" },
    { country: "UAE", type: "30 Days Tourist e-Visa", price: 37400, category: "other" },
    { country: "UAE (Sharjah)", type: "30 Days Tourist e-Visa", price: 56500, category: "other" },
    { country: "UAE", type: "60 Days Tourist e-Visa", price: 53500, category: "other" },
    { country: "UAE (Sharjah)", type: "60 Days Tourist e-Visa", price: 71500, category: "other" },
    { country: "Uganda", type: "Tourist e-Visa", price: 32000, category: "other" },
    { country: "United Kingdom (UK)", type: "Tourist / Visitor Consultancy", price: 92000, category: "other" },
    { country: "United States (USA)", type: "B1/B2 Visa Prep & Appointment", price: 57000, category: "other" },
    { country: "Uzbekistan", type: "7 Days Tourist e-Visa", price: 69500, category: "other" },
    { country: "Uzbekistan", type: "15 Days Tourist e-Visa", price: 76900, category: "other" },
    { country: "Uzbekistan", type: "30 Days Tourist e-Visa", price: 83500, category: "other" },
    { country: "Uzbekistan", type: "Business Visa", price: 262000, category: "other" },
    { country: "Vietnam", type: "Tourist e-Visa Approval Letter", price: 31500, category: "sticker" }
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
        <td style="padding: 16px 24px; font-weight: 600; color: var(--text-primary);">${item.country}</td>
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

  // Inquiry Form Handler
  if (visaForm && visaFormBox) {
    visaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('visa-name').value;
      const email = document.getElementById('visa-email').value;
      const country = document.getElementById('visa-country').value;
      const category = document.getElementById('visa-type').options[document.getElementById('visa-type').selectedIndex].text;

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
    });
  }
});
