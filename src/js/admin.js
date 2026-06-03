import { tours, UMRAH_PRESETS } from './tours-data.js';

document.addEventListener('DOMContentLoaded', () => {
  // Theme Setup
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  if (themeToggle) {
    const themeIcon = themeToggle.querySelector('span');
    if (themeIcon) themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    themeToggle.addEventListener('click', () => {
      const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
  }

  // DOM Elements
  const form = document.getElementById('admin-package-form');
  const listBody = document.getElementById('admin-packages-list');
  const categorySelect = document.getElementById('pkg-category');
  const umrahPresetGroup = document.getElementById('umrah-preset-group');
  const umrahHotelInputs = document.getElementById('umrah-hotel-inputs');

  // Fields
  const idInput = document.getElementById('pkg-id');
  const titleInput = document.getElementById('pkg-title');
  const typeSelect = document.getElementById('pkg-type');
  const presetSelect = document.getElementById('pkg-preset');
  const priceInput = document.getElementById('pkg-price');
  const durationInput = document.getElementById('pkg-duration');
  const imageInput = document.getElementById('pkg-image');
  const descInput = document.getElementById('pkg-desc');
  
  const makkahHotelInput = document.getElementById('pkg-makkah-hotel');
  const makkahDistSelect = document.getElementById('pkg-makkah-dist');
  const madinahHotelInput = document.getElementById('pkg-madinah-hotel');
  const madinahDistSelect = document.getElementById('pkg-madinah-dist');

  // Toggle Umrah specifics
  categorySelect.addEventListener('change', () => {
    const isUmrah = categorySelect.value === 'Umrah';
    if (isUmrah) {
      umrahPresetGroup.style.display = 'block';
      umrahHotelInputs.classList.add('active');
      makkahHotelInput.setAttribute('required', 'true');
      madinahHotelInput.setAttribute('required', 'true');
    } else {
      umrahPresetGroup.style.display = 'none';
      umrahHotelInputs.classList.remove('active');
      makkahHotelInput.removeAttribute('required');
      madinahHotelInput.removeAttribute('required');
    }
  });

  // Load Custom + Core Packages
  function getPackages() {
    const custom = JSON.parse(localStorage.getItem('ozotrips_custom_packages')) || [];
    return [...tours, ...custom];
  }

  function saveCustomPackages(customList) {
    localStorage.setItem('ozotrips_custom_packages', JSON.stringify(customList));
  }

  // Render Table List
  function renderTable() {
    const all = getPackages();
    listBody.innerHTML = all.map(pkg => {
      const isCustom = pkg.id > 11; // IDs 1 to 11 are static default tours
      return `
        <tr>
          <td>
            <div style="font-weight: 700; color: var(--text-primary);">${pkg.title}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">
              ${pkg.category === 'Umrah' ? `🕋 Makkah: ${pkg.makkahHotel} (${pkg.makkahDistance}) | Madinah: ${pkg.madinahHotel} (${pkg.madinahDistance})` : ''}
            </div>
          </td>
          <td>
            <span class="badge-admin ${pkg.category === 'Umrah' ? 'badge-umrah' : 'badge-general'}">
              ${pkg.category}
            </span>
          </td>
          <td style="font-weight: 600; color: var(--color-primary);">${pkg.currency || '$'}${pkg.price}</td>
          <td>🕒 ${pkg.duration}</td>
          <td>
            ${isCustom ? 
              `<button class="btn btn-accent" style="padding: 6px 12px; font-size: 0.8rem; border-radius: 4px;" onclick="deletePackage(${pkg.id})">Delete</button>` : 
              `<span style="color: var(--text-muted); font-size: 0.8rem; font-style: italic;">Locked</span>`
            }
          </td>
        </tr>
      `;
    }).join('');
  }

  // Add/Modify Package Form Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const custom = JSON.parse(localStorage.getItem('ozotrips_custom_packages')) || [];
    const isUmrah = categorySelect.value === 'Umrah';
    
    // Auto-configure presets if Umrah is selected
    let inclusionsList = ["Boutique Lodgings", "Professional Guides", "Private Commute"];
    let exclusionsList = ["Personal shopping charges"];
    if (isUmrah) {
      const presetKey = presetSelect.value;
      inclusionsList = UMRAH_PRESETS[presetKey].inclusions;
      exclusionsList = UMRAH_PRESETS[presetKey].exclusions;
    }

    const newPkg = {
      id: Date.now(), // Generate a unique ID
      title: titleInput.value,
      type: typeSelect.value,
      category: categorySelect.value,
      image: imageInput.value,
      duration: durationInput.value,
      rating: 5.0,
      reviews: 1,
      price: parseInt(priceInput.value),
      currency: "$",
      description: descInput.value,
      inclusions: inclusionsList,
      exclusions: exclusionsList,
      highlights: isUmrah ? [`Makkah: ${makkahHotelInput.value}`, `Madinah: ${madinahHotelInput.value}`, "Full Pilgrimage Guidance"] : ["Hotel Transfers", "Meals included", "Sightseeing tours"]
    };

    if (isUmrah) {
      newPkg.makkahHotel = makkahHotelInput.value;
      newPkg.makkahDistance = makkahDistSelect.value;
      newPkg.madinahHotel = madinahHotelInput.value;
      newPkg.madinahDistance = madinahDistSelect.value;
    }

    custom.push(newPkg);
    saveCustomPackages(custom);
    
    // Reset form
    form.reset();
    umrahPresetGroup.style.display = 'none';
    umrahHotelInputs.classList.remove('active');
    
    renderTable();
    alert("New package saved successfully!");
  });

  // Global delete handler
  window.deletePackage = (id) => {
    if (confirm("Are you sure you want to delete this custom package?")) {
      let custom = JSON.parse(localStorage.getItem('ozotrips_custom_packages')) || [];
      custom = custom.filter(pkg => pkg.id !== id);
      saveCustomPackages(custom);
      renderTable();
    }
  };

  // Initial table render
  renderTable();
});
