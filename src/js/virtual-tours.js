import './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  // Theme Initial Setup (from main.js)
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

  // Tour Data
  const toursData = {
    hunza: {
      name: "Hunza Valley Virtual Tour",
      desc: "Explore the ancient forts, crystal clear lakes, and towering peaks of Hunza Valley, Pakistan.",
      image: "https://images.unsplash.com/photo-1622218413697-3f9b8df790eb?auto=format&fit=crop&w=2000&q=80",
      audioSrc: "Simulated Hunza Guide Narration...",
      hotspots: [
        { id: "h1", name: "Baltit Fort", desc: "Baltit Fort is a 700-year-old medieval fort overlooking Karimabad, showing ancient Tibetan-Balti architectural influences.", top: "42%", left: "35%" },
        { id: "h2", name: "Attabad Lake", desc: "Formed in 2010 by a landslide, Attabad Lake is famous for its vibrant turquoise waters cutting through towering rock walls.", top: "58%", left: "68%" }
      ]
    },
    skardu: {
      name: "Skardu Karakoram Virtual Experience",
      desc: "Venture to the gateway of K2, showcasing high-altitude lakes and cold deserts.",
      image: "https://images.unsplash.com/photo-1622187627448-9c16bcf29f52?auto=format&fit=crop&w=2000&q=80",
      audioSrc: "Simulated Skardu Guide Narration...",
      hotspots: [
        { id: "s1", name: "Shangrila Lake", desc: "Also known as Lower Kachura Lake, this heart-shaped alpine lake is surrounded by deep green pine forests and red cabins.", top: "52%", left: "28%" },
        { id: "s2", name: "Katpana Cold Desert", desc: "One of the highest deserts in the world, Katpana features white sand dunes surrounded by massive glaciers and snow cliffs.", top: "46%", left: "75%" }
      ]
    },
    lahore: {
      name: "Lahore Mughal Heritage Walk",
      desc: "Walk through the historic walled city and grand monuments of the Mughal Empire.",
      image: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=2000&q=80",
      audioSrc: "Simulated Lahore Heritage Guide Narration...",
      hotspots: [
        { id: "l1", name: "Sheesh Mahal", desc: "The Palace of Mirrors was built by Mughal Emperor Shah Jahan, decorated with intricate glass mosaics that glitter like diamonds.", top: "36%", left: "46%" },
        { id: "l2", name: "Badshahi Mosque", desc: "Commissioned by Aurangzeb in 1673, Badshahi Mosque is built in red sandstone and white marble, representing Mughal architecture.", top: "52%", left: "82%" }
      ]
    },
    santorini: {
      name: "Santorini Sunset Caldera Experience",
      desc: "Fly above the whitewashed houses, blue domes, and volcanic cliffs of Greece.",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=2000&q=80",
      audioSrc: "Simulated Santorini Caldera Guide Narration...",
      hotspots: [
        { id: "st1", name: "Oia Blue Dome", desc: "The world-famous blue dome churches of Santorini sit on cliffs overlooking the volcanic caldera and the Aegean Sea.", top: "44%", left: "32%" },
        { id: "st2", name: "Submerged Volcano Caldera", desc: "The crescent-shaped lagoon is a volcanic crater formed by one of the largest eruptions in history about 3,600 years ago.", top: "62%", left: "72%" }
      ]
    }
  };

  // State Variables
  let currentTourId = "hunza";
  let offset = 0; // horizontal pan offset
  let zoom = 1.0; // zoom level
  let isDragging = false;
  let startX = 0;
  let audioPlaying = false;
  let vrMode = false;
  let audioTimer = null;

  // DOM Elements
  const tourSelectBtns = document.querySelectorAll('.tour-btn');
  const tourTitle = document.getElementById('tour-title');
  const tourDesc = document.getElementById('tour-desc');
  const panWrapper = document.getElementById('pan-wrapper');
  const panImg = document.getElementById('pan-img');
  const hotspotsContainer = document.getElementById('hotspots-container');
  const vrWrapper = document.getElementById('vr-wrapper');
  
  // Controls
  const panLeftBtn = document.getElementById('pan-left');
  const panRightBtn = document.getElementById('pan-right');
  const zoomInBtn = document.getElementById('zoom-in');
  const zoomOutBtn = document.getElementById('zoom-out');
  const vrToggleBtn = document.getElementById('vr-toggle');
  
  // Audio Narrator Elements
  const audioPlayBtn = document.getElementById('play-audio');
  const audioStatusText = document.getElementById('audio-status');
  const soundWave = document.getElementById('sound-wave');
  const waveBars = soundWave?.querySelectorAll('.bar');
  
  // Info Modal Drawer
  const hotspotModal = document.getElementById('hotspot-modal');
  const hotspotModalTitle = document.getElementById('hotspot-modal-title');
  const hotspotModalDesc = document.getElementById('hotspot-modal-desc');
  const hotspotModalClose = document.getElementById('hotspot-modal-close');

  // Initial Load
  loadTour(currentTourId);

  // Switch Tours
  tourSelectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tourSelectBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentTourId = e.currentTarget.getAttribute('data-tour');
      loadTour(currentTourId);
    });
  });

  function loadTour(tourId) {
    const data = toursData[tourId];
    if (!data) return;
    
    // Update labels
    tourTitle.textContent = data.name;
    tourDesc.textContent = data.desc;
    
    // Set background image
    panImg.src = data.image;
    
    // Reset offset and zoom
    offset = 0;
    zoom = 1.0;
    updateTransforms();
    
    // Stop audio if playing
    if (audioPlaying) {
      toggleAudio();
    }
    
    // Render Hotspots
    renderHotspots(data.hotspots);
  }

  function renderHotspots(hotspots) {
    hotspotsContainer.innerHTML = '';
    hotspots.forEach(hs => {
      const btn = document.createElement('button');
      btn.className = 'hotspot-btn';
      btn.style.top = hs.top;
      btn.style.left = hs.left;
      btn.innerHTML = `
        <span class="hotspot-pulse"></span>
        <span class="hotspot-icon">ℹ️</span>
        <span class="hotspot-label">${hs.name}</span>
      `;
      btn.addEventListener('click', () => {
        showHotspotDetail(hs.name, hs.desc);
      });
      hotspotsContainer.appendChild(btn);
    });
  }

  function showHotspotDetail(title, desc) {
    hotspotModalTitle.textContent = title;
    hotspotModalDesc.textContent = desc;
    hotspotModal.classList.add('active');
  }

  if (hotspotModalClose) {
    hotspotModalClose.addEventListener('click', () => {
      hotspotModal.classList.remove('active');
    });
  }

  // Panning & Dragging Physics
  function handleDragStart(e) {
    isDragging = true;
    startX = (e.pageX || e.touches[0].pageX) - offset;
    panWrapper.style.cursor = 'grabbing';
  }

  function handleDragMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const currentX = e.pageX || e.touches[0].pageX;
    offset = currentX - startX;
    
    // Clamping: prevent panning too far left/right
    const containerWidth = panWrapper.clientWidth;
    const maxOffset = 0;
    const minOffset = -containerWidth * 2;
    
    if (offset > maxOffset) offset = maxOffset;
    if (offset < minOffset) offset = minOffset;
    
    updateTransforms();
  }

  function handleDragEnd() {
    isDragging = false;
    panWrapper.style.cursor = 'grab';
  }

  // Bind Drag Events
  panWrapper.addEventListener('mousedown', handleDragStart);
  panWrapper.addEventListener('mousemove', handleDragMove);
  window.addEventListener('mouseup', handleDragEnd);

  panWrapper.addEventListener('touchstart', handleDragStart, { passive: false });
  panWrapper.addEventListener('touchmove', handleDragMove, { passive: false });
  window.addEventListener('touchend', handleDragEnd);

  // Button Panning Controls
  panLeftBtn.addEventListener('click', () => {
    const containerWidth = panWrapper.clientWidth;
    offset += 150;
    if (offset > 0) offset = 0;
    updateTransforms();
  });

  panRightBtn.addEventListener('click', () => {
    const containerWidth = panWrapper.clientWidth;
    const minOffset = -containerWidth * 2;
    offset -= 150;
    if (offset < minOffset) offset = minOffset;
    updateTransforms();
  });

  // Zoom Controls
  zoomInBtn.addEventListener('click', () => {
    zoom += 0.15;
    if (zoom > 2.0) zoom = 2.0;
    updateTransforms();
  });

  zoomOutBtn.addEventListener('click', () => {
    zoom -= 0.15;
    if (zoom < 1.0) zoom = 1.0;
    updateTransforms();
  });

  function updateTransforms() {
    panImg.style.transform = `translateX(${offset}px) scale(${zoom})`;
    hotspotsContainer.style.transform = `translateX(${offset}px) scale(${zoom})`;
    
    if (vrMode) {
      const rightImg = document.getElementById('pan-img-right');
      const rightHotspots = document.getElementById('hotspots-container-right');
      if (rightImg) rightImg.style.transform = `translateX(${offset}px) scale(${zoom})`;
      if (rightHotspots) rightHotspots.style.transform = `translateX(${offset}px) scale(${zoom})`;
    }
  }

  // Audio Narrator Guide
  if (audioPlayBtn) {
    audioPlayBtn.addEventListener('click', toggleAudio);
  }

  function toggleAudio() {
    audioPlaying = !audioPlaying;
    
    if (audioPlaying) {
      audioPlayBtn.innerHTML = `<span>⏸️</span> Stop Guide`;
      audioStatusText.textContent = "Playing narration: Local guide detailing attractions...";
      soundWave.style.display = 'flex';
      waveBars.forEach((bar, idx) => {
        bar.style.animationPlayState = 'running';
      });
      
      audioTimer = setTimeout(() => {
        if (audioPlaying) toggleAudio();
      }, 25000);
      
    } else {
      audioPlayBtn.innerHTML = `<span>🔊</span> Listen Guide`;
      audioStatusText.textContent = "Audio guide paused.";
      soundWave.style.display = 'none';
      waveBars.forEach((bar) => {
        bar.style.animationPlayState = 'paused';
      });
      if (audioTimer) {
        clearTimeout(audioTimer);
        audioTimer = null;
      }
    }
  }

  // VR Mode Split-Screen
  if (vrToggleBtn) {
    vrToggleBtn.addEventListener('click', toggleVRMode);
  }

  function toggleVRMode() {
    vrMode = !vrMode;
    
    if (vrMode) {
      vrToggleBtn.classList.add('active');
      vrToggleBtn.innerHTML = `<span>🕶️</span> Exit VR`;
      vrWrapper.classList.add('vr-split');
      
      const rightEye = document.createElement('div');
      rightEye.id = 'vr-eye-right';
      rightEye.className = 'panorama-viewport';
      
      const tour = toursData[currentTourId];
      rightEye.innerHTML = `
        <img id="pan-img-right" src="${tour.image}" class="panorama-image" alt="VR Mirror Right" style="transform: translateX(${offset}px) scale(${zoom})">
        <div id="hotspots-container-right" class="hotspots-overlay" style="transform: translateX(${offset}px) scale(${zoom})"></div>
      `;
      
      vrWrapper.appendChild(rightEye);
      
      const hsRight = rightEye.querySelector('#hotspots-container-right');
      tour.hotspots.forEach(hs => {
        const marker = document.createElement('div');
        marker.className = 'hotspot-btn hs-mirror';
        marker.style.top = hs.top;
        marker.style.left = hs.left;
        marker.innerHTML = `<span class="hotspot-pulse"></span><span class="hotspot-icon">ℹ️</span>`;
        hsRight.appendChild(marker);
      });
      
    } else {
      vrToggleBtn.classList.remove('active');
      vrToggleBtn.innerHTML = `<span>🕶️</span> VR Mode`;
      vrWrapper.classList.remove('vr-split');
      
      const rightEye = document.getElementById('vr-eye-right');
      if (rightEye) {
        rightEye.remove();
      }
    }
  }
});
