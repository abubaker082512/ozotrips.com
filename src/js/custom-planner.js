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

  // DOM Elements
  const form = document.getElementById('custom-planner-form');
  const step1 = document.getElementById('step-1-content');
  const step2 = document.getElementById('step-2-content');
  const step3 = document.getElementById('step-3-content');

  // Badges & Labels
  const badge1 = document.getElementById('badge-step-1');
  const badge2 = document.getElementById('badge-step-2');
  const badge3 = document.getElementById('badge-step-3');
  const label2 = document.getElementById('label-step-2');
  const label3 = document.getElementById('label-step-3');

  // Buttons
  const next1 = document.getElementById('btn-next-1');
  const next2 = document.getElementById('btn-next-2');
  const back2 = document.getElementById('btn-back-2');
  const back3 = document.getElementById('btn-back-3');

  // Inputs
  const destSelect = document.getElementById('plan-dest');
  const starsSelect = document.getElementById('plan-stars');
  const dateInput = document.getElementById('plan-date');
  const daysInput = document.getElementById('plan-days');
  const guestsInput = document.getElementById('plan-guests');
  const transSelect = document.getElementById('plan-transport');
  const guideCheck = document.getElementById('addon-plan-guide');
  const advCheck = document.getElementById('addon-plan-adv');
  const culturalCheck = document.getElementById('addon-plan-cultural');

  // Pricing outputs
  const calcLodging = document.getElementById('calc-lodging');
  const calcTransport = document.getElementById('calc-transport');
  const calcGuide = document.getElementById('calc-guide');
  const calcExtras = document.getElementById('calc-extras');
  const calcTotal = document.getElementById('calc-total');

  // 1. Wizard step transitions with fade slide animations
  next1.addEventListener('click', () => {
    if (validateStep1()) {
      transitionStep(step1, step2);
      activateBadge(badge2, label2);
    }
  });

  back2.addEventListener('click', () => {
    transitionStep(step2, step1);
    deactivateBadge(badge2, label2);
  });

  next2.addEventListener('click', () => {
    if (validateStep2()) {
      transitionStep(step2, step3);
      activateBadge(badge3, label3);
    }
  });

  back3.addEventListener('click', () => {
    transitionStep(step3, step2);
    deactivateBadge(badge3, label3);
  });

  function transitionStep(fromStep, toStep) {
    fromStep.style.display = 'none';
    toStep.style.display = 'block';
    toStep.style.animation = 'formEntrance 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
  }

  function activateBadge(badge, label) {
    badge.style.background = 'var(--brand-gradient)';
    badge.style.border = 'none';
    badge.style.color = 'var(--bg-primary)';
    label.style.color = 'var(--text-primary)';
  }

  function deactivateBadge(badge, label) {
    badge.style.background = 'var(--bg-secondary)';
    badge.style.border = '1px solid var(--border-glass)';
    badge.style.color = 'var(--text-muted)';
    label.style.color = 'var(--text-muted)';
  }

  function validateStep1() {
    return destSelect.value !== '';
  }

  function validateStep2() {
    return dateInput.value !== '' && daysInput.value > 0 && guestsInput.value > 0;
  }

  // Set minimum travel date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  if (dateInput) dateInput.min = tomorrowStr;

  // 2. Dynamic Pricing Calculator
  function calculateCustomQuote() {
    const days = Math.max(1, parseInt(daysInput.value) || 1);
    const guests = Math.max(1, parseInt(guestsInput.value) || 1);
    const stars = parseInt(starsSelect.value) || 4;

    // Lodging Cost
    let starPrice = 15000; // 3-star
    if (stars === 4) starPrice = 25000;
    else if (stars === 5) starPrice = 45000;
    const lodgingTotal = starPrice * days * guests;

    // Transport Cost
    let transRate = 0;
    const transportType = transSelect.value;
    if (transportType === 'sedan') transRate = 5000;
    else if (transportType === 'prado') transRate = 18000;
    else if (transportType === 'coaster') transRate = 12000;
    const transportTotal = transRate * days;

    // Guide Cost
    const hasGuide = guideCheck.checked;
    const guideTotal = hasGuide ? 3000 * days : 0;

    // Extras Cost
    const hasAdv = advCheck.checked;
    const hasCultural = culturalCheck.checked;
    const advTotal = hasAdv ? 8000 * guests : 0;
    const culturalTotal = hasCultural ? 4000 * guests : 0;
    const extrasTotal = advTotal + culturalTotal;

    const grandTotal = lodgingTotal + transportTotal + guideTotal + extrasTotal;

    // Render Calculations
    if (calcLodging) calcLodging.textContent = `${lodgingTotal.toLocaleString()} PKR`;
    if (calcTransport) calcTransport.textContent = `${transportTotal.toLocaleString()} PKR`;
    if (calcGuide) calcGuide.textContent = `${guideTotal.toLocaleString()} PKR`;
    if (calcExtras) calcExtras.textContent = `${extrasTotal.toLocaleString()} PKR`;
    if (calcTotal) calcTotal.textContent = `${grandTotal.toLocaleString()} PKR`;
  }

  // Bind Events for Calculations
  [starsSelect, daysInput, guestsInput, transSelect, guideCheck, advCheck, culturalCheck].forEach(el => {
    el?.addEventListener('change', calculateCustomQuote);
    el?.addEventListener('input', calculateCustomQuote);
  });

  // Initial Calculation
  calculateCustomQuote();

  // 3. Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!window.OzoAuth?.isLoggedIn()) {
      window.OzoAuth?.openLoginModal(() => {
        // Form submit re-trigger on authentication success
        form.requestSubmit();
      });
      return;
    }

    const session = window.OzoAuth.getSession();
    const destinationName = destSelect.options[destSelect.selectedIndex].text.split('(')[0].trim();
    const lodgingTier = starsSelect.options[starsSelect.selectedIndex].text.split('(')[0].trim();
    const date = dateInput.value;
    const days = daysInput.value;
    const guests = guestsInput.value;
    const vehicle = transSelect.options[transSelect.selectedIndex].text.split('(')[0].trim();

    // Get pricing totals
    const lodgingVal = calcLodging.textContent;
    const transportVal = calcTransport.textContent;
    const guideVal = calcGuide.textContent;
    const extrasVal = calcExtras.textContent;
    const totalValText = calcTotal.textContent;
    const finalPrice = parseInt(totalValText.replace(/[^0-9]/g, '')) || 0;

    const upgrades = [lodgingTier];
    if (transSelect.value !== 'none') upgrades.push(`Vehicle: ${vehicle}`);
    if (guideCheck.checked) upgrades.push('Personal Tour Guide');
    if (advCheck.checked) upgrades.push('Adventure Sports package');
    if (culturalCheck.checked) upgrades.push('Cultural Feast & Show');

    // Show simulated spinner loading state
    const submitBtn = document.getElementById('btn-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="auth-spinner"></span> Creating Itinerary...';

    setTimeout(() => {
      // Save custom quotation booking log
      window.OzoAuth.addBooking({
        type: 'custom',
        title: `Custom Tour: ${destinationName} (${days} Days)`,
        date: date,
        guests: `${guests} Travelers`,
        price: finalPrice,
        addons: upgrades,
        status: 'Custom Itinerary Pending'
      });

      // Redirect to booking-success
      const successUrl = `./booking-success.html?tour=Custom+Trip+to+${encodeURIComponent(destinationName)}&name=${encodeURIComponent(session.name)}&email=${encodeURIComponent(session.email)}&date=${encodeURIComponent(date)}&guests=${guests}`;
      window.location.href = successUrl;
    }, 1000);
  });
});
