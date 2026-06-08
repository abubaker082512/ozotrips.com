document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle?.querySelector('span');
  const visaForm = document.getElementById('visa-inquiry-form');
  const visaFormBox = document.getElementById('visa-form-box');

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
          <div class="success-icon" style="width: 70px; height: 70px; border-radius: 50%; background: rgba(0, 242, 195, 0.1); color: var(--color-primary); display: inline-flex; align-items: center; justify-content: center; font-size: 2rem; box-shadow: var(--glow-primary); margin-bottom: 20px;">✓</div>
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
