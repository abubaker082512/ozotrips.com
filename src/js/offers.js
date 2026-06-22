import './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  // Theme Initial Setup
  const currentTheme = localStorage.getItem('theme') || 'dark';
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

  // 1. Live Countdown Timer (48 hours dynamically generated)
  const timerDays = document.getElementById('timer-days');
  const timerHours = document.getElementById('timer-hours');
  const timerMinutes = document.getElementById('timer-minutes');
  const timerSeconds = document.getElementById('timer-seconds');

  // Set target date to 2 days from now
  let targetTime = localStorage.getItem('ozotrips_deal_expiry');
  if (!targetTime) {
    targetTime = new Date().getTime() + (2 * 24 * 60 * 60 * 1000); // 2 days
    localStorage.setItem('ozotrips_deal_expiry', targetTime);
  } else {
    targetTime = parseInt(targetTime, 10);
    // If it already expired in the past, reset it for a fresh 2 days (evergreen offer)
    if (targetTime < new Date().getTime()) {
      targetTime = new Date().getTime() + (2 * 24 * 60 * 60 * 1000);
      localStorage.setItem('ozotrips_deal_expiry', targetTime);
    }
  }

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetTime - now;

    if (distance <= 0) {
      if (timerDays) timerDays.textContent = "00";
      if (timerHours) timerHours.textContent = "00";
      if (timerMinutes) timerMinutes.textContent = "00";
      if (timerSeconds) timerSeconds.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (timerDays) timerDays.textContent = String(days).padStart(2, '0');
    if (timerHours) timerHours.textContent = String(hours).padStart(2, '0');
    if (timerMinutes) timerMinutes.textContent = String(minutes).padStart(2, '0');
    if (timerSeconds) timerSeconds.textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 2. Interactive Spin-to-Win Promo Wheel
  const wheel = document.getElementById('wheel-spinner');
  const spinBtn = document.getElementById('spin-btn');
  const resultPanel = document.getElementById('wheel-result-panel');
  const rewardName = document.getElementById('reward-name');
  const promoCodeText = document.getElementById('promo-code');
  const copyBtn = document.getElementById('copy-code-btn');

  // 6 slices (60 degrees each)
  const prizes = [
    { text: "10% OFF Tours", code: "TOUR10", angleRange: [300, 360] }, // lands on first slice
    { text: "Free Trekking Guide", code: "FREEGUIDE", angleRange: [240, 300] },
    { text: "5% OFF Hotel", code: "STAY5", angleRange: [180, 240] },
    { text: "Premium Upgrade", code: "UPGRADE", angleRange: [120, 180] },
    { text: "15% OFF Visas", code: "VISA15", angleRange: [60, 120] },
    { text: "Free Airport Transfer", code: "FREEAIR", angleRange: [0, 60] }
  ];

  let hasSpun = localStorage.getItem('ozotrips_has_spun') === 'true';
  const savedPrize = localStorage.getItem('ozotrips_won_prize');
  const savedCode = localStorage.getItem('ozotrips_won_code');

  if (hasSpun && savedPrize && savedCode) {
    // Show already won prize
    spinBtn.disabled = true;
    spinBtn.textContent = "Spun 🏆";
    rewardName.textContent = savedPrize;
    promoCodeText.textContent = savedCode;
    resultPanel.style.display = 'block';
  }

  if (spinBtn) {
    spinBtn.addEventListener('click', () => {
      if (hasSpun) return;

      spinBtn.disabled = true;
      spinBtn.textContent = "Spinning...";
      
      // Calculate random prize index (0 to 5)
      const prizeIndex = Math.floor(Math.random() * prizes.length);
      const prize = prizes[prizeIndex];

      // Calculate target rotation angle
      // 5 full rotations (1800 deg) + angle representing the landing slice
      const fullSpins = 5;
      const sliceCenterAngle = (prize.angleRange[0] + prize.angleRange[1]) / 2;
      
      // The wheel rotates clockwise. To align the slice with the top indicator (which is at 0 degrees/360 degrees),
      // we need to rotate by (360 - sliceCenterAngle)
      const targetAngle = (fullSpins * 360) + (360 - sliceCenterAngle);

      // Apply transition to spin the wheel
      wheel.style.transition = 'transform 5s cubic-bezier(0.1, 0.8, 0.1, 1)';
      wheel.style.transform = `rotate(${targetAngle}deg)`;

      // Trigger results after animation completes
      setTimeout(() => {
        hasSpun = true;
        localStorage.setItem('ozotrips_has_spun', 'true');
        localStorage.setItem('ozotrips_won_prize', prize.text);
        localStorage.setItem('ozotrips_won_code', prize.code);

        rewardName.textContent = prize.text;
        promoCodeText.textContent = prize.code;
        resultPanel.style.display = 'block';

        spinBtn.textContent = "Spun 🏆";
        
        // Push notification of reward to active user travel log if signed in
        const userSession = JSON.parse(localStorage.getItem('ozotrips_active_user'));
        if (userSession) {
          const userDb = JSON.parse(localStorage.getItem('ozotrips_users')) || {};
          const email = userSession.email;
          if (userDb[email]) {
            if (!userDb[email].history) userDb[email].history = [];
            userDb[email].history.push({
              id: "PROMO-" + Math.floor(Math.random() * 90000 + 10000),
              destination: `Promo Reward: ${prize.text}`,
              date: new Date().toLocaleDateString(),
              price: "Free Spin Award",
              status: "Active Coupon"
            });
            localStorage.setItem('ozotrips_users', JSON.stringify(userDb));
            // Trigger storage event to refresh bookings panel in header
            window.dispatchEvent(new Event('storage'));
          }
        }
      }, 5000);
    });
  }

  // Copy Code to Clipboard
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const code = promoCodeText.textContent;
      navigator.clipboard.writeText(code).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Copied! ✓";
        copyBtn.style.background = "var(--color-primary)";
        copyBtn.style.color = "#0b0d19";
        
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.background = "";
          copyBtn.style.color = "";
        }, 2000);
      });
    });
  }
});
