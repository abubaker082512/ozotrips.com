import { tours } from './tours-data.js';
import './auth.js';

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
  const tourId = parseInt(params.get('id')) || 1; 

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

  // Populate Banner & Main Details
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

  // 1. Detailed Daily Itinerary data for all 8 tours
  const itineraries = {
    1: [ // Hunza
      { title: "Arrival in Gilgit & Drive to Karimabad", desc: "Arrive in Gilgit, meet our concierge staff, and drive along the scenic Hunza River. Stop at the Rakaposhi viewpoint for a warm tea break looking at the snowy heights. Check-in at your hotel in Karimabad." },
      { title: "Explore Altit and Baltit Forts", desc: "Discover Karimabad town. Visit the historical Altit Fort (900 years old) and Baltit Fort (700 years old), walking through old fruit orchards and cobblestone markets selling traditional gemstones and dried apricots." },
      { title: "Attabad Lake Boating & Passu Cones", desc: "Travel to Attabad Lake for a boat safari over its turquoise waters. Drive further along the Karakoram Highway to Passu to photograph the majestic Passu Cones. Stay in a luxury resort overlooking the peaks." },
      { title: "Day Trip to Khunjerab Pass (China Border)", desc: "Excursion to the Pak-China Border at Khunjerab Pass, the highest paved international border crossing in the world (4,693m). Spot Himalayan Ibex in the national park." },
      { title: "Hussaini Suspension Bridge & Ganish Village", desc: "Walk on the thrilling Hussaini Suspension Bridge, then explore Ganish, the oldest settlement in Hunza. Enjoy a traditional musical dinner in Karimabad." },
      { title: "Duiker Sunrise & Return to Gilgit", desc: "Catch the sunrise over 11 high peaks from Duiker viewpoint. Drive back to Gilgit for local shopping." },
      { title: "Flight to Islamabad / Departure", desc: "Catch your scenic flight from Gilgit back to Islamabad. Services end with warm memories." }
    ],
    2: [ // Fairy Meadows
      { title: "Drive to Raikot Bridge & Jeep Safari", desc: "Arrive in Chilas or Gilgit. Travel to Raikot Bridge on the Indus River. Board local 4x4 open-top jeeps for a thrilling, narrow mountain road ride to Tatto Village." },
      { title: "Trek to Fairy Meadows", desc: "Trek 3 hours through lush pine forests and waterfalls up to Fairy Meadows (3,300m). Arrive at our custom wooden cabin camp overlooking the towering snow wall of Nanga Parbat." },
      { title: "Day Hike to Beyal Camp & Nanga Parbat View", desc: "Embark on an easy 2-hour hike to Beyal Camp (3,500m) and the edge of the Raikot Glacier, bringing you closer to the world's 9th highest peak." },
      { title: "Optional Trek to Nanga Parbat Base Camp", desc: "For adventure seekers, hike further to Nanga Parbat Base Camp (3,900m) and return for a bonfire and traditional soup under the starry sky." },
      { title: "Trek Back to Tatto & Departure", desc: "Trek back down to Tatto Village, board jeeps back to Raikot Bridge, and drive to Gilgit or Islamabad for departure." }
    ],
    3: [ // Skardu
      { title: "Flight to Skardu & Upper Kachura Lake", desc: "Catch a spectacular panoramic flight over the Karakoram range to Skardu. Visit Shangrila Resort and Upper Kachura Lake for boating." },
      { title: "Explore Katpana Desert & Kharpocho Fort", desc: "Walk through the high-altitude sand dunes of Katpana Cold Desert. Hike to the historic Kharpocho Fort for a panoramic view of the Indus River." },
      { title: "Day Excursion to Deosai Plains", desc: "Take 4x4 jeeps to the Deosai National Park, the second-highest plateau in the world. Look for Himalayan Brown Bears and cross Sheosar Lake." },
      { title: "Visit Shigar Valley & Fort", desc: "Drive to the beautiful Shigar Valley. Visit the 17th-century Shigar Fort (recently restored by Aga Khan foundation) and stay in heritage rooms." },
      { title: "Manthoka Waterfall & Sadpara Lake", desc: "Discover the spectacular 180-foot Manthoka Waterfall and stop at Sadpara Lake on the way back to Skardu city." },
      { title: "Departure Flight to Islamabad", desc: "Fly back from Skardu to Islamabad, carrying memories of the high-altitude desert and lakes." }
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
    ],
    5: [ // Santorini
      { title: "Arrival in Santorini & Fira CLIFF Walk", desc: "Arrive at Santorini airport, transfer to your luxury cliffside cave hotel. Stroll through the narrow lanes of Fira with blue Aegean views." },
      { title: "Caldera Cruise & Volcanic Hot Springs", desc: "Board a catamaran for a cruise. Swim in the volcanic hot springs and enjoy a fresh Greek barbecue dinner on board." },
      { title: "Wine Tasting & Akrotiri Excavations", desc: "Visit the ancient Bronze Age ruins of Akrotiri, followed by wine tasting of local Assyrtiko wines in a clifftop winery." },
      { title: "Oia Village Exploration & Famous Sunset", desc: "Explore the blue-domed churches and white alleys of Oia. Secure a premium spot to witness the world-famous golden sunset." },
      { title: "Beach Relaxation & Red Beach Photos", desc: "Relax on the volcanic black sands of Perissa Beach and take photos at the steep red volcanic cliffs of Red Beach." }
    ],
    6: [ // Swiss Alps
      { title: "Arrival in Zermatt & Alpine Village Stroll", desc: "Arrive in Zermatt via the glacier train (no petrol cars allowed). Walk through the historic wood cabins and enjoy a cheese fondue dinner." },
      { title: "Skiing at Matterhorn Glacier Paradise", desc: "Access the highest cable car station in Europe. Enjoy skiing or snowboarding on the year-round glacier fields." },
      { title: "Gornergrat Panoramic Rack Railway", desc: "Ride the 125-year-old cogwheel railway up to Gornergrat (3,089m) for a view of the Matterhorn and 28 other 4,000-meter peaks." },
      { title: "Luxury Thermal Alpine Spas", desc: "Spend a relaxing day in heated outdoor pools overlooking snowy summits, with steam rooms and massage treatments." },
      { title: "Snowshoe Trekking & Alpine Dining", desc: "Trek through pine forests on snowshoes, concluding with a gourmet lunch in a rustic mountain hut." },
      { title: "Departure from Zermatt", desc: "Depart Zermatt via train back to Zurich or Geneva for your international flight." }
    ],
    7: [ // Bali
      { title: "Arrival in Bali & Nusa Dua Beach Rest", desc: "Arrive in Denpasar, transfer to your luxury beach resort in Nusa Dua. Relax by the infinity pool overlooking the Indian Ocean." },
      { title: "Tegallalang Rice Terraces & Ubud Monkey Forest", desc: "Travel to Ubud. Walk through the rice terraces, try the jungle swing, and see the playful macaques in the sacred monkey forest." },
      { title: "Tanah Lot Sea Temple Sunset", desc: "Visit the iconic Tanah Lot temple perched on a rocky wave-swept offshore rock, catching a magnificent sunset." },
      { title: "Day Trip to Nusa Penida Island", desc: "Take a speed boat to Nusa Penida. Visit Kelingking Cliff (T-Rex beach), Broken Beach, and snorkel with manta rays." },
      { title: "Ulun Danu Bratan Lake Temple & Waterfalls", desc: "Explore the floating lake temple in Bedugul highlands and hike down to Aling-Aling waterfall." },
      { title: "Uluwatu Temple Cliff Walk & Kecak Dance", desc: "Visit the cliff temple of Uluwatu. Watch the traditional fire dance against the backdrop of crashing ocean waves." },
      { title: "Boutique Shopping & Departure", desc: "Pick up Balinese handicrafts in Seminyak before transferring to the airport for departure." }
    ],
    8: [ // Lahore
      { title: "Walled City Walk & Badshahi Mosque", desc: "Enter through Delhi Gate. Visit the royal Shahi Hammam and Wazir Khan Mosque. Explore Lahore Fort (Sheesh Mahal) and the Badshahi Mosque." },
      { title: "Mughal Gardens & Wagah Border Flag Ceremony", desc: "Stroll in Shalimar Gardens. Drive to the Wagah border in the afternoon to witness the high-stepping border closing military ceremony." },
      { title: "Lahore Museum & Gawalmandi Food Street", desc: "See Gandharan art at the Lahore Museum. Spend the evening tasting famous local cuisine like mutton karahi, Siri Paye, and Kulfa." }
    ]
  };

  const daysCount = parseInt(tour.duration.split(' ')[0]) || 5;
  const itineraryContainer = document.getElementById('detail-itinerary');

  const tourItinerary = itineraries[tour.id] || Array.from({ length: daysCount }).map((_, idx) => ({
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

  // 2. Weather Forecast Mock Widget
  const mockWeather = {
    1: { temp: "14", icon: "🏔️", desc: "Cool & Sunny" },   // Hunza
    2: { temp: "10", icon: "🏕️", desc: "Chilly & Clear" },  // Fairy Meadows
    3: { temp: "16", icon: "🌅", desc: "Mild Winds" },      // Skardu
    4: { temp: "21", icon: "🌸", desc: "Breezy & Warm" },   // Kyoto
    5: { temp: "26", icon: "🏖️", desc: "Sunny Mediterranean" }, // Santorini
    6: { temp: "4",  icon: "❄️", desc: "Snowing & Cold" },   // Swiss Alps
    7: { temp: "30", icon: "🌴", desc: "Humid Tropical" },   // Bali
    8: { temp: "34", icon: "☀️", desc: "Sunny & Hot" }       // Lahore
  };

  const weatherData = mockWeather[tour.id] || { temp: "20", icon: "⛅", desc: "Partly Cloudy" };
  const weatherLoc = document.getElementById('weather-location');
  const weatherIcon = document.getElementById('weather-icon');
  const weatherTemp = document.getElementById('weather-temp');
  const weatherDesc = document.getElementById('weather-desc');

  if (weatherLoc && weatherIcon && weatherTemp && weatherDesc) {
    weatherLoc.textContent = `${tour.title.split(' ')[0]} Region`;
    weatherIcon.textContent = weatherData.icon;
    weatherTemp.textContent = `${weatherData.temp}°C`;
    weatherDesc.textContent = weatherData.desc;
  }

  // 3. Interactive Packing Checklist (Customized by category)
  const categoryChecklists = {
    "Mountain": ["Warm jacket / Fleece", "Trekking boots", "Woolen socks & gloves", "Sunscreen & sunglasses", "Backpack (30L)", "Reusable water flask"],
    "Adventure": ["Hiking boots", "Waterproof shell jacket", "Headlamp / Torch", "First-aid essentials", "Energy snacks", "Trekking poles"],
    "Cultural": ["Modest cover-up clothing", "Comfortable walking slip-ons", "Hand sanitizer / wipes", "Local currency", "Journal & pen", "Portable power bank"],
    "Beach": ["Swimwear & boardshorts", "Polarized sunglasses", "Sunscreen (SPF 50+)", "Flip flops", "Beach towel", "Waterproof phone case"]
  };

  const checklistItems = categoryChecklists[tour.category] || ["Comfortable shoes", "Travel documents", "Camera", "Chargers & adaptors", "Personal toiletries", "Medicines"];
  const checklistContainer = document.getElementById('packing-checklist');

  if (checklistContainer) {
    // Load saved checklist state
    const savedState = JSON.parse(localStorage.getItem(`ozotrips_checklist_${tour.id}`)) || [];

    checklistContainer.innerHTML = checklistItems.map((item, idx) => {
      const isChecked = savedState.includes(idx);
      return `
        <label style="display: flex; align-items: center; gap: 10px; font-size: 0.95rem; cursor: pointer; user-select: none;">
          <input type="checkbox" class="pack-item-checkbox" data-idx="${idx}" ${isChecked ? 'checked' : ''} style="width: auto;">
          <span style="text-decoration: ${isChecked ? 'line-through' : 'none'}; color: ${isChecked ? 'var(--text-muted)' : 'var(--text-primary)'};">${item}</span>
        </label>
      `;
    }).join('');

    // Save checklist selection state
    checklistContainer.querySelectorAll('.pack-item-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const itemIdx = parseInt(e.currentTarget.getAttribute('data-idx'));
        const labelText = e.currentTarget.nextElementSibling;
        
        let currentState = JSON.parse(localStorage.getItem(`ozotrips_checklist_${tour.id}`)) || [];

        if (e.currentTarget.checked) {
          labelText.style.textDecoration = 'line-through';
          labelText.style.color = 'var(--text-muted)';
          if (!currentState.includes(itemIdx)) currentState.push(itemIdx);
        } else {
          labelText.style.textDecoration = 'none';
          labelText.style.color = 'var(--text-primary)';
          currentState = currentState.filter(idx => idx !== itemIdx);
        }

        localStorage.setItem(`ozotrips_checklist_${tour.id}`, JSON.stringify(currentState));
      });
    });
  }

  // 4. FAQ Accordion Click Logic
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const parent = e.currentTarget.parentElement;
      const content = parent.querySelector('.faq-content');
      const arrow = parent.querySelector('.faq-arrow');
      
      const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

      // Close all open FAQs
      document.querySelectorAll('.faq-content').forEach(c => {
        c.style.maxHeight = '0px';
      });
      document.querySelectorAll('.faq-arrow').forEach(a => {
        a.style.transform = 'rotate(0deg)';
      });

      if (!isOpen) {
        content.style.maxHeight = `${content.scrollHeight}px`;
        arrow.style.transform = 'rotate(180deg)';
      }
    });
  });

  // 5. Dynamic Pricing Calculator
  const guestsInput = document.getElementById('book-guests');
  const addonInsurance = document.getElementById('addon-insurance');
  const addonTransport = document.getElementById('addon-transport');
  const addonRoom = document.getElementById('addon-room');
  const promoInput = document.getElementById('book-discount');
  const promoBtn = document.getElementById('apply-promo-btn');
  const promoStatus = document.getElementById('promo-status');

  // Breakdown DOM Elements
  const bdBase = document.getElementById('bd-base');
  const bdInsuranceRow = document.getElementById('bd-insurance-row');
  const bdInsurance = document.getElementById('bd-insurance');
  const bdTransportRow = document.getElementById('bd-transport-row');
  const bdTransport = document.getElementById('bd-transport');
  const bdRoomRow = document.getElementById('bd-room-row');
  const bdRoom = document.getElementById('bd-room');
  const bdDiscountRow = document.getElementById('bd-discount-row');
  const bdDiscount = document.getElementById('bd-discount');
  const bdTotal = document.getElementById('bd-total');

  let discountRate = 0; // 0% default

  function calculatePrice() {
    const guests = Math.max(1, parseInt(guestsInput.value) || 1);
    const baseTotal = tour.price * guests;

    let insuranceCost = 0;
    if (addonInsurance && addonInsurance.checked) {
      insuranceCost = 25 * guests;
      bdInsuranceRow.style.display = 'flex';
      bdInsurance.textContent = `${tour.currency}${insuranceCost}`;
    } else if (bdInsuranceRow) {
      bdInsuranceRow.style.display = 'none';
    }

    let transportCost = 0;
    if (addonTransport && addonTransport.checked) {
      transportCost = 150;
      bdTransportRow.style.display = 'flex';
      bdTransport.textContent = `${tour.currency}${transportCost}`;
    } else if (bdTransportRow) {
      bdTransportRow.style.display = 'none';
    }

    let roomCost = 0;
    if (addonRoom && addonRoom.checked) {
      roomCost = 90 * guests;
      bdRoomRow.style.display = 'flex';
      bdRoom.textContent = `${tour.currency}${roomCost}`;
    } else if (bdRoomRow) {
      bdRoomRow.style.display = 'none';
    }

    const subtotal = baseTotal + insuranceCost + transportCost + roomCost;
    const discountAmount = Math.round(subtotal * discountRate);
    const finalTotal = subtotal - discountAmount;

    // Render Breakdown
    if (bdBase) bdBase.textContent = `${tour.currency}${baseTotal}`;
    
    if (discountAmount > 0 && bdDiscountRow) {
      bdDiscountRow.style.display = 'flex';
      bdDiscount.textContent = `-${tour.currency}${discountAmount}`;
    } else if (bdDiscountRow) {
      bdDiscountRow.style.display = 'none';
    }

    if (bdTotal) bdTotal.textContent = `${tour.currency}${finalTotal}`;
  }

  // Attach Event Listeners for Pricing
  if (guestsInput) guestsInput.addEventListener('input', calculatePrice);
  if (addonInsurance) addonInsurance.addEventListener('change', calculatePrice);
  if (addonTransport) addonTransport.addEventListener('change', calculatePrice);
  if (addonRoom) addonRoom.addEventListener('change', calculatePrice);

  // Promo Code Handler
  if (promoBtn && promoInput) {
    promoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (code === 'OZO2026' || code === 'EXPLORE') {
        discountRate = 0.10; // 10% discount
        promoStatus.textContent = "✓ Promo code applied! 10% discount.";
        promoStatus.style.color = "var(--color-primary)";
        promoStatus.style.display = "block";
      } else {
        discountRate = 0;
        promoStatus.textContent = "✕ Invalid promo code.";
        promoStatus.style.color = "var(--color-accent)";
        promoStatus.style.display = "block";
      }
      calculatePrice();
    });
  }

  // Run initial price calculation
  calculatePrice();

  // Pre-fill booking form if user is logged in
  const session = window.OzoAuth?.getSession();
  if (session) {
    const nameInput = document.getElementById('book-name');
    const emailInput = document.getElementById('book-email');
    if (nameInput) nameInput.value = session.name;
    if (emailInput) emailInput.value = session.email;
  }

  // Booking Form Submission Handler
  const bookingForm = document.getElementById('booking-detail-form');
  bookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!window.OzoAuth?.isLoggedIn()) {
      window.OzoAuth?.openLoginModal(() => {
        const s = window.OzoAuth.getSession();
        if (s) {
          const nameInput = document.getElementById('book-name');
          const emailInput = document.getElementById('book-email');
          if (nameInput) nameInput.value = s.name;
          if (emailInput) emailInput.value = s.email;
        }
        bookingForm.requestSubmit();
      });
      return;
    }

    const name = document.getElementById('book-name').value;
    const email = document.getElementById('book-email').value;
    const date = document.getElementById('book-date').value;
    const guests = document.getElementById('book-guests').value;

    // Calculate upgrades to add to history log
    const addons = [];
    if (document.getElementById('addon-insurance')?.checked) addons.push('Travel Insurance');
    if (document.getElementById('addon-transport')?.checked) addons.push('Premium Transport');
    if (document.getElementById('addon-room')?.checked) addons.push('Luxury Room Upgrade');

    // Get price breakdown total
    const bdTotalText = document.getElementById('bd-total')?.textContent || '';
    const finalPrice = parseInt(bdTotalText.replace(/[^0-9]/g, '')) || tour.price;

    // Log the tour booking in user's history
    window.OzoAuth.addBooking({
      type: 'tour',
      title: tour.title,
      date: date,
      guests: guests,
      price: finalPrice,
      addons: addons,
      status: 'Pending Concierge'
    });

    // Send values to success page via URL params
    const successUrl = `./booking-success.html?tour=${encodeURIComponent(tour.title)}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&date=${encodeURIComponent(date)}&guests=${guests}`;
    window.location.href = successUrl;
  });
});
