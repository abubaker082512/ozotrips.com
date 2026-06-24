document.addEventListener('DOMContentLoaded', () => {
  const flightSearchForm = document.getElementById('flight-search-form');
  const manualInquiryForm = document.getElementById('manual-inquiry-form');
  const comingSoonPanel = document.getElementById('coming-soon-panel');
  const inquirySummaryText = document.getElementById('inquiry-summary-text');
  const inquiryPhoneInput = document.getElementById('inquiry-phone');
  
  const tabRoundTrip = document.getElementById('tab-round-trip');
  const tabOneWay = document.getElementById('tab-one-way');
  const returnDateGroup = document.getElementById('return-date-group');
  const returnDateInput = document.getElementById('flight-ret-date');
  const departureDateInput = document.getElementById('flight-dept-date');
  
  let currentTripType = 'round-trip';
  let capturedSearch = null;

  // 1. Set min date for departures and return to today
  const today = new Date().toISOString().split('T')[0];
  if (departureDateInput) {
    departureDateInput.min = today;
    departureDateInput.addEventListener('change', () => {
      if (returnDateInput) {
        returnDateInput.min = departureDateInput.value;
      }
    });
  }
  if (returnDateInput) {
    returnDateInput.min = today;
  }

  // 2. Tab Toggling (Round Trip vs One Way)
  if (tabRoundTrip && tabOneWay && returnDateGroup && returnDateInput) {
    tabRoundTrip.addEventListener('click', (e) => {
      e.preventDefault();
      tabRoundTrip.classList.add('active');
      tabOneWay.classList.remove('active');
      returnDateGroup.style.display = 'block';
      returnDateInput.required = true;
      currentTripType = 'round-trip';
    });

    tabOneWay.addEventListener('click', (e) => {
      e.preventDefault();
      tabOneWay.classList.add('active');
      tabRoundTrip.classList.remove('active');
      returnDateGroup.style.display = 'none';
      returnDateInput.required = false;
      returnDateInput.value = '';
      currentTripType = 'one-way';
    });
  }

  // 3. Search Form Submit
  if (flightSearchForm) {
    flightSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const fromVal = document.getElementById('flight-from').value;
      const toVal = document.getElementById('flight-to').value;
      const deptDate = departureDateInput.value;
      const retDate = returnDateInput ? returnDateInput.value : '';
      const guests = document.getElementById('flight-guests').value;
      const cabinClass = document.getElementById('flight-class').value;
      
      capturedSearch = {
        tripType: currentTripType === 'round-trip' ? 'Round Trip' : 'One Way',
        from: fromVal,
        to: toVal,
        deptDate,
        retDate,
        guests,
        cabinClass
      };

      // Format Summary
      let summary = `${capturedSearch.tripType}: ${capturedSearch.from} ➔ ${capturedSearch.to} (${capturedSearch.cabinClass}, ${capturedSearch.guests} traveler(s)) departing on ${capturedSearch.deptDate}`;
      if (currentTripType === 'round-trip' && retDate) {
        summary += ` and returning on ${retDate}`;
      }
      
      if (inquirySummaryText) {
        inquirySummaryText.textContent = summary;
      }

      // Show manual inquiry form panel
      if (comingSoonPanel) {
        comingSoonPanel.style.display = 'block';
        comingSoonPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Prefill user phone if logged in
      if (window.OzoAuth?.isLoggedIn() && inquiryPhoneInput) {
        const session = window.OzoAuth.getSession();
        if (session.phone) {
          inquiryPhoneInput.value = session.phone;
        }
      }
    });
  }

  // 4. Manual Inquiry Form Submit (Saves to user profile bookings)
  if (manualInquiryForm) {
    manualInquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!capturedSearch) {
        alert('Please fill out the flight search form above first.');
        return;
      }

      // Enforce Login
      if (!window.OzoAuth?.isLoggedIn()) {
        window.OzoAuth?.openLoginModal(() => {
          // Re-submit on successful login
          manualInquiryForm.requestSubmit();
        });
        return;
      }

      const session = window.OzoAuth.getSession();
      const phone = inquiryPhoneInput.value.trim();

      // Show loader on button
      const submitBtn = manualInquiryForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="auth-spinner" style="border-top-color: white;"></span> Submitting...';

      setTimeout(() => {
        // Save flight booking log in shared profile bookings database
        window.OzoAuth.addBooking({
          type: 'flight',
          title: `Flight: ${capturedSearch.from} to ${capturedSearch.to} (${capturedSearch.cabinClass})`,
          date: capturedSearch.deptDate + (capturedSearch.retDate ? ` ➔ ${capturedSearch.retDate}` : ''),
          guests: `${capturedSearch.guests} Passenger(s)`,
          price: 0, // TBD / Pending Quote
          addons: [`WhatsApp Contact: ${phone}`, `Trip Mode: ${capturedSearch.tripType}`],
          status: 'Inquiry Submitted'
        });

        // Redirect to booking-success
        const successUrl = `./booking-success.html?tour=Flight+Inquiry+from+${encodeURIComponent(capturedSearch.from)}+to+${encodeURIComponent(capturedSearch.to)}&name=${encodeURIComponent(session.name)}&email=${encodeURIComponent(session.email)}&date=${encodeURIComponent(capturedSearch.deptDate)}&guests=${capturedSearch.guests}`;
        window.location.href = successUrl;
      }, 1000);
    });
  }

  // 5. Popular route click handler
  window.selectRoute = (fromVal, toVal) => {
    const fromSelect = document.getElementById('flight-from');
    const toSelect = document.getElementById('flight-to');
    if (fromSelect && toSelect) {
      fromSelect.value = fromVal;
      toSelect.value = toVal;
      // Focus departure date
      if (departureDateInput) {
        departureDateInput.focus();
      }
      // Scroll smoothly to search panel
      document.querySelector('.search-panel').scrollIntoView({ behavior: 'smooth' });
    }
  };
});
