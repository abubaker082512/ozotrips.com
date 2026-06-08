// OzoTrips Client-Side Authentication & Booking History Module
// Uses localStorage to manage user accounts and reservation history

// Core functions
export function getSession() {
  return JSON.parse(localStorage.getItem('ozotrips_session'));
}

export function isLoggedIn() {
  return !!getSession();
}

export function getBookings() {
  const session = getSession();
  if (!session) return [];
  const key = `ozotrips_bookings_${session.email}`;
  return JSON.parse(localStorage.getItem(key)) || [];
}

export function addBooking(booking) {
  const session = getSession();
  if (!session) return false;
  const key = `ozotrips_bookings_${session.email}`;
  const bookings = JSON.parse(localStorage.getItem(key)) || [];
  const newBooking = {
    id: Date.now().toString(),
    dateCreated: new Date().toISOString(),
    status: booking.status || 'Pending Concierge',
    ...booking
  };
  bookings.unshift(newBooking);
  localStorage.setItem(key, JSON.stringify(bookings));
  return true;
}

export function cancelBooking(id) {
  const session = getSession();
  if (!session) return false;
  const key = `ozotrips_bookings_${session.email}`;
  const bookings = JSON.parse(localStorage.getItem(key)) || [];
  const updated = bookings.map(b => {
    if (b.id === id) {
      return { ...b, status: 'Cancelled' };
    }
    return b;
  });
  localStorage.setItem(key, JSON.stringify(updated));
  renderBookingsList();
  return true;
}

let currentOnSuccessCallback = null;

export function openLoginModal(onSuccessCallback = null) {
  currentOnSuccessCallback = onSuccessCallback;
  const overlay = document.getElementById('auth-modal-overlay');
  if (overlay) {
    overlay.classList.add('active');
    document.getElementById('login-email').focus();
  }
}

export function closeLoginModal() {
  const overlay = document.getElementById('auth-modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
  currentOnSuccessCallback = null;
}

export function openBookingsModal() {
  const overlay = document.getElementById('bookings-modal-overlay');
  if (overlay) {
    overlay.classList.add('active');
    renderBookingsList();
  }
}

export function closeBookingsModal() {
  const overlay = document.getElementById('bookings-modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  const errorMsg = document.getElementById('login-error-msg');
  const submitBtn = e.target.querySelector('button[type="submit"]');

  const users = JSON.parse(localStorage.getItem('ozotrips_users')) || [];
  const user = users.find(u => u.email === email);

  if (!user || user.password !== password) {
    errorMsg.textContent = 'Invalid email or password.';
    return;
  }

  // Show loading spinner micro-animation
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="auth-spinner"></span> Signing In...';

  setTimeout(() => {
    // Success
    localStorage.setItem('ozotrips_session', JSON.stringify({
      name: user.name,
      email: user.email
    }));

    errorMsg.textContent = '';
    closeLoginModal();
    updateHeader();
    
    if (currentOnSuccessCallback) {
      currentOnSuccessCallback();
    } else {
      window.location.reload();
    }
  }, 850);
}

function handleRegisterSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim().toLowerCase();
  const password = document.getElementById('register-password').value;
  const errorMsg = document.getElementById('register-error-msg');
  const submitBtn = e.target.querySelector('button[type="submit"]');

  if (password.length < 6) {
    errorMsg.textContent = 'Password must be at least 6 characters.';
    return;
  }

  const users = JSON.parse(localStorage.getItem('ozotrips_users')) || [];
  if (users.some(u => u.email === email)) {
    errorMsg.textContent = 'This email is already registered.';
    return;
  }

  // Show loading spinner micro-animation
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="auth-spinner"></span> Registering...';

  setTimeout(() => {
    // Create new user
    users.push({ name, email, password });
    localStorage.setItem('ozotrips_users', JSON.stringify(users));

    // Auto sign in
    localStorage.setItem('ozotrips_session', JSON.stringify({ name, email }));

    errorMsg.textContent = '';
    closeLoginModal();
    updateHeader();

    if (currentOnSuccessCallback) {
      currentOnSuccessCallback();
    } else {
      window.location.reload();
    }
  }, 850);
}

export function renderBookingsList() {
  const container = document.getElementById('bookings-list-container');
  if (!container) return;

  const bookings = getBookings();
  if (bookings.length === 0) {
    container.innerHTML = `
      <div class="empty-bookings-state">
        <div class="empty-bookings-icon">🗺️</div>
        <h4 style="color: var(--text-primary);">No Bookings Found</h4>
        <p style="margin-top: 8px; font-size: 0.9rem; color: var(--text-muted);">
          You haven't booked any tours or visa consultancies yet. Explore our packages to begin!
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = bookings.map(booking => {
    const isVisa = booking.type === 'visa';
    const statusClass = booking.status.toLowerCase().replace(/\s+/g, '-');
    const priceText = isVisa ? 'N/A' : `${booking.price.toLocaleString()} PKR`;
    
    return `
      <div class="booking-item">
        <div class="booking-item-header">
          <span class="booking-item-category">${isVisa ? '🛂 Visa Service' : '🏔️ Tour Package'}</span>
          <span class="booking-status status-${statusClass}">${booking.status}</span>
        </div>
        <h4 class="booking-item-title">${booking.title}</h4>
        <div class="booking-item-details">
          <div><strong>Date:</strong> ${booking.date}</div>
          <div><strong>${isVisa ? 'Applicant' : 'Guests'}:</strong> ${booking.guests}</div>
          <div><strong>Pricing:</strong> ${priceText}</div>
          ${booking.addons && booking.addons.length > 0 ? `
            <div style="grid-column: span 2; margin-top: 4px;"><strong>Upgrades:</strong> ${booking.addons.join(', ')}</div>
          ` : ''}
        </div>
        ${booking.status !== 'Cancelled' ? `
          <button class="btn btn-outline btn-cancel-booking" data-booking-id="${booking.id}">Cancel Reservation</button>
        ` : ''}
      </div>
    `;
  }).join('');

  // Add click handlers for cancellation
  container.querySelectorAll('.btn-cancel-booking').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-booking-id');
      if (confirm('Are you sure you want to cancel this reservation?')) {
        const item = e.currentTarget.closest('.booking-item');
        if (item) {
          // Slide-left and fade-out animation before state update
          item.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
          item.style.transform = 'translateX(-30px)';
          item.style.opacity = '0';
          setTimeout(() => {
            cancelBooking(id);
          }, 400);
        } else {
          cancelBooking(id);
        }
      }
    });
  });
}

export function updateHeader() {
  const navActions = document.querySelector('.nav-actions');
  if (!navActions) return;

  // Remove existing auth elements
  navActions.querySelectorAll('.auth-element').forEach(el => el.remove());

  const session = getSession();
  const bookNowBtn = navActions.querySelector('a[href*="tours.html"]');

  if (session) {
    if (bookNowBtn) bookNowBtn.style.display = 'none';

    // Create dynamic components
    const greeting = document.createElement('span');
    greeting.className = 'user-greeting auth-element';
    greeting.style.cssText = 'color: var(--text-secondary); font-size: 0.9rem; font-weight: 500; margin-right: 4px;';
    greeting.textContent = `Hi, ${session.name}`;

    const bookingsBtn = document.createElement('button');
    bookingsBtn.className = 'btn btn-secondary auth-element';
    bookingsBtn.id = 'auth-bookings-btn';
    bookingsBtn.style.cssText = 'padding: 8px 16px; font-size: 0.9rem; cursor: pointer;';
    bookingsBtn.textContent = 'My Bookings';
    bookingsBtn.addEventListener('click', openBookingsModal);

    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn btn-outline auth-element';
    logoutBtn.id = 'auth-logout-btn';
    logoutBtn.style.cssText = 'padding: 8px 16px; font-size: 0.9rem; cursor: pointer;';
    logoutBtn.textContent = 'Logout';
    logoutBtn.addEventListener('click', handleLogout);

    navActions.appendChild(greeting);
    navActions.appendChild(bookingsBtn);
    navActions.appendChild(logoutBtn);
  } else {
    if (bookNowBtn) bookNowBtn.style.display = 'inline-flex';

    const loginBtn = document.createElement('button');
    loginBtn.className = 'btn btn-outline auth-element';
    loginBtn.id = 'auth-login-btn';
    loginBtn.style.cssText = 'padding: 8px 16px; font-size: 0.9rem; cursor: pointer;';
    loginBtn.textContent = 'Sign In';
    loginBtn.addEventListener('click', () => openLoginModal());

    // Prepend before Book Now if Book Now exists, or just append
    if (bookNowBtn) {
      navActions.insertBefore(loginBtn, bookNowBtn);
    } else {
      navActions.appendChild(loginBtn);
    }
  }
}

function handleLogout() {
  localStorage.removeItem('ozotrips_session');
  updateHeader();
  window.location.reload();
}

function injectModals() {
  if (document.getElementById('auth-modal-overlay')) return;

  const authOverlay = document.createElement('div');
  authOverlay.id = 'auth-modal-overlay';
  authOverlay.className = 'auth-modal-overlay';
  authOverlay.innerHTML = `
    <div class="auth-modal-card">
      <button class="auth-modal-close" id="auth-modal-close-btn">&times;</button>
      
      <div class="auth-tabs">
        <button class="auth-tab-btn active" id="tab-login-btn">Sign In</button>
        <button class="auth-tab-btn" id="tab-register-btn">Register</button>
      </div>
      
      <!-- Login Form -->
      <form id="auth-login-form" class="auth-form active">
        <h3 class="auth-form-title">Welcome Back</h3>
        <p class="auth-form-subtitle">Sign in to manage your bookings and itineraries.</p>
        
        <div class="auth-input-group">
          <label for="login-email">Email Address</label>
          <input type="email" id="login-email" required placeholder="name@example.com">
        </div>
        
        <div class="auth-input-group">
          <label for="login-password">Password</label>
          <input type="password" id="login-password" required placeholder="••••••••">
        </div>
        
        <div class="auth-error-msg" id="login-error-msg"></div>
        
        <button type="submit" class="btn btn-primary btn-full-width">Sign In</button>
      </form>
      
      <!-- Register Form -->
      <form id="auth-register-form" class="auth-form">
        <h3 class="auth-form-title">Create Account</h3>
        <p class="auth-form-subtitle">Register to save your travel logs and customize quotes.</p>
        
        <div class="auth-input-group">
          <label for="register-name">Full Name</label>
          <input type="text" id="register-name" required placeholder="John Doe">
        </div>
        
        <div class="auth-input-group">
          <label for="register-email">Email Address</label>
          <input type="email" id="register-email" required placeholder="name@example.com">
        </div>
        
        <div class="auth-input-group">
          <label for="register-password">Password</label>
          <input type="password" id="register-password" required placeholder="••••••••">
        </div>
        
        <div class="auth-error-msg" id="register-error-msg"></div>
        
        <button type="submit" class="btn btn-primary btn-full-width">Create Account</button>
      </form>
    </div>
  `;

  const bookingsOverlay = document.createElement('div');
  bookingsOverlay.id = 'bookings-modal-overlay';
  bookingsOverlay.className = 'auth-modal-overlay';
  bookingsOverlay.innerHTML = `
    <div class="bookings-modal-card">
      <button class="auth-modal-close" id="bookings-modal-close-btn">&times;</button>
      <h3 class="bookings-modal-title">My Travel History</h3>
      <p class="bookings-modal-subtitle">Track and manage your upcoming reservations and inquiries.</p>
      
      <div class="bookings-list" id="bookings-list-container">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;

  document.body.appendChild(authOverlay);
  document.body.appendChild(bookingsOverlay);

  // Add event listeners for modal close
  document.getElementById('auth-modal-close-btn').addEventListener('click', closeLoginModal);
  document.getElementById('bookings-modal-close-btn').addEventListener('click', closeBookingsModal);

  // Close when clicking overlay
  authOverlay.addEventListener('click', (e) => {
    if (e.target === authOverlay) closeLoginModal();
  });
  bookingsOverlay.addEventListener('click', (e) => {
    if (e.target === bookingsOverlay) closeBookingsModal();
  });

  // Tab toggling
  const tabLoginBtn = document.getElementById('tab-login-btn');
  const tabRegisterBtn = document.getElementById('tab-register-btn');
  const loginForm = document.getElementById('auth-login-form');
  const registerForm = document.getElementById('auth-register-form');

  tabLoginBtn.addEventListener('click', () => {
    tabLoginBtn.classList.add('active');
    tabRegisterBtn.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    document.getElementById('login-error-msg').textContent = '';
  });

  tabRegisterBtn.addEventListener('click', () => {
    tabRegisterBtn.classList.add('active');
    tabLoginBtn.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
    document.getElementById('register-error-msg').textContent = '';
  });

  // Form submits
  loginForm.addEventListener('submit', handleLoginSubmit);
  registerForm.addEventListener('submit', handleRegisterSubmit);
}

// Intersection observer scroll animation
export function setupScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Staggered delay for card rendering effect
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -45px 0px'
  });

  fadeElements.forEach(el => observer.observe(el));
}

// Global hook configuration
window.OzoAuth = {
  isLoggedIn,
  getSession,
  openLoginModal,
  closeLoginModal,
  openBookingsModal,
  closeBookingsModal,
  addBooking,
  getBookings,
  cancelBooking,
  logout: handleLogout,
  setupScrollAnimations
};

// Initialize module
function initAuth() {
  injectModals();
  updateHeader();
  setupScrollAnimations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}
