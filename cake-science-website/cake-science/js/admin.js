/* ===========================
   CAKE SCIENCE — ADMIN JS
   =========================== */

// ========================
// AUTH
// ========================
const ADMIN_USER = 'cakescience';
const ADMIN_PASS = 'baking2025';

function doLogin() {
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value;
  const err = document.getElementById('loginError');
  
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    sessionStorage.setItem('cs_admin', '1');
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
    initAdmin();
  } else {
    err.classList.remove('hidden');
    setTimeout(() => err.classList.add('hidden'), 3000);
  }
}

function doLogout() {
  sessionStorage.removeItem('cs_admin');
  document.getElementById('adminPanel').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
}

// Check session on load
window.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('cs_admin') === '1') {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
    initAdmin();
  }
  
  // Enter key login
  document.getElementById('loginPass').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });
  document.getElementById('loginUser').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });
});

// ========================
// NAVIGATION
// ========================
function initAdmin() {
  loadContentEditor();
  loadDashboard();
  loadAdminGallery();
  loadOffersAdmin();
  loadReviewsAdmin();
  loadBannerField();
}

document.querySelectorAll('.sidebar-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const sec = link.dataset.section;
    
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    document.querySelectorAll('.admin-section').forEach(s => {
      s.classList.remove('active');
      s.classList.add('hidden');
    });
    
    const target = document.getElementById(`sec-${sec}`);
    if (target) {
      target.classList.remove('hidden');
      target.classList.add('active');
    }
    
    document.getElementById('adminPageTitle').textContent = link.textContent.trim().replace(/^.*?\s/, '');
    
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      document.getElementById('adminSidebar').classList.remove('open');
    }
  });
});

function toggleSidebar() {
  document.getElementById('adminSidebar').classList.toggle('open');
}

// ========================
// DASHBOARD
// ========================
function loadDashboard() {
  const gallery = JSON.parse(localStorage.getItem('cs_gallery') || '[]');
  const reviews = JSON.parse(localStorage.getItem('cs_reviews') || '[]');
  const offers = JSON.parse(localStorage.getItem('cs_offers') || '[]');
  
  document.getElementById('dGallery').textContent = gallery.length;
  document.getElementById('dReviews').textContent = reviews.length;
  document.getElementById('dOffers').textContent = offers.length;
}

// ========================
// IMAGE UPLOADS
// ========================
function handleUpload(type, input) {
  const file = input.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = e => {
    const data = e.target.result;
    const content = JSON.parse(localStorage.getItem('cs_content') || '{}');
    
    if (type === 'hero') {
      content.heroBg = data;
      const prev = document.getElementById('prev-hero');
      prev.src = data;
      prev.classList.add('show');
    } else if (type === 'about') {
      content.aboutImg = data;
      const prev = document.getElementById('prev-about');
      prev.src = data;
      prev.classList.add('show');
    }
    
    localStorage.setItem('cs_content', JSON.stringify(content));
    showToast(`✅ ${type === 'hero' ? 'Hero' : 'About'} image updated!`);
    loadDashboard();
  };
  reader.readAsDataURL(file);
}

// Setup drag and drop
document.querySelectorAll('.drop-zone').forEach(zone => {
  zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.style.borderColor = 'var(--pink-400)';
    zone.style.background = 'var(--pink-50)';
  });
  zone.addEventListener('dragleave', () => {
    zone.style.borderColor = '';
    zone.style.background = '';
  });
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.style.borderColor = '';
    zone.style.background = '';
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    
    const target = zone.dataset.target;
    if (target) {
      const fakeInput = { files: [file] };
      handleUpload(target, fakeInput);
    }
  });
});

// ========================
// GALLERY MANAGER
// ========================
function handleGalleryUpload(input) {
  const files = Array.from(input.files);
  const category = document.getElementById('gal-category').value;
  const caption = document.getElementById('gal-caption').value;
  
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const gallery = JSON.parse(localStorage.getItem('cs_gallery') || '[]');
      gallery.push({
        id: Date.now() + Math.random(),
        src: e.target.result,
        caption: caption || file.name.replace(/\.[^/.]+$/, ''),
        category
      });
      localStorage.setItem('cs_gallery', JSON.stringify(gallery));
      loadAdminGallery();
      loadDashboard();
      showToast('✅ Image added to gallery!');
    };
    reader.readAsDataURL(file);
  });
  
  input.value = '';
  document.getElementById('gal-caption').value = '';
}

function loadAdminGallery() {
  const gallery = JSON.parse(localStorage.getItem('cs_gallery') || '[]');
  const grid = document.getElementById('adminGalleryGrid');
  
  if (gallery.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-light);font-size:14px;padding:16px;">No gallery images yet. Upload some above!</p>';
    return;
  }
  
  grid.innerHTML = '';
  
  gallery.forEach(img => {
    const item = document.createElement('div');
    item.className = 'mgr-item';
    item.innerHTML = `
      <span class="cat-badge">${img.category}</span>
      <img src="${img.src}" alt="${img.caption}" onerror="this.style.display='none'" />
      <div class="mgr-info">${img.caption}</div>
      <button class="mgr-delete" onclick="deleteGalleryItem(${JSON.stringify(img.id)})">✕</button>
    `;
    grid.appendChild(item);
  });
}

function deleteGalleryItem(id) {
  if (!confirm('Delete this image?')) return;
  let gallery = JSON.parse(localStorage.getItem('cs_gallery') || '[]');
  gallery = gallery.filter(i => i.id != id);
  localStorage.setItem('cs_gallery', JSON.stringify(gallery));
  loadAdminGallery();
  loadDashboard();
  showToast('🗑️ Image deleted');
}

// ========================
// CONTENT EDITOR
// ========================
function loadContentEditor() {
  const c = JSON.parse(localStorage.getItem('cs_content') || '{}');
  
  // Set existing or placeholder values
  document.getElementById('ed-heroTag').value = c.heroTag || '🌸 Premium Baking Classes · Andaman';
  document.getElementById('ed-heroTitle').value = c.heroTitle || 'Master the Art<br/><em>of Cake Science</em>';
  document.getElementById('ed-heroSubtitle').value = c.heroSubtitle || 'Discover the magic of baking in the beautiful Andaman Islands.';
  document.getElementById('ed-aboutTitle').value = c.aboutTitle || 'Where Passion Meets Precision';
  document.getElementById('ed-aboutText').value = c.aboutText || '<p>Welcome to <strong>Cake Science</strong> — Andaman\'s most loved baking studio!</p>';
  document.getElementById('ed-address').value = c.contactAddress || 'Phongy Chang, DAG Colony, Sri Vijaya Puram,<br/>Andaman and Nicobar Islands – 744101';
  document.getElementById('ed-phone').value = c.contactPhone || '09933223123';
  document.getElementById('ed-whatsapp').value = c.contactWhatsapp || '919933223123';
  document.getElementById('ed-hours').value = c.contactHours || 'Mon – Sat: 9:00 AM – 6:00 PM';
  
  // Load current image previews
  if (c.heroBg) {
    const p = document.getElementById('prev-hero');
    p.src = c.heroBg;
    p.classList.add('show');
  }
  if (c.aboutImg) {
    const p = document.getElementById('prev-about');
    p.src = c.aboutImg;
    p.classList.add('show');
  }
}

function saveContent() {
  const c = JSON.parse(localStorage.getItem('cs_content') || '{}');
  
  c.heroTag = document.getElementById('ed-heroTag').value;
  c.heroTitle = document.getElementById('ed-heroTitle').value;
  c.heroSubtitle = document.getElementById('ed-heroSubtitle').value;
  c.aboutTitle = document.getElementById('ed-aboutTitle').value;
  c.aboutText = document.getElementById('ed-aboutText').value;
  c.contactAddress = document.getElementById('ed-address').value;
  c.contactPhone = document.getElementById('ed-phone').value;
  c.contactWhatsapp = document.getElementById('ed-whatsapp').value;
  c.contactHours = document.getElementById('ed-hours').value;
  
  localStorage.setItem('cs_content', JSON.stringify(c));
  
  const msg = document.getElementById('contentSaved');
  msg.classList.remove('hidden');
  setTimeout(() => msg.classList.add('hidden'), 3000);
  
  showToast('✅ Content saved successfully!');
}

// ========================
// OFFERS MANAGER
// ========================
function addOffer() {
  const title = document.getElementById('of-title').value.trim();
  if (!title) { alert('Please enter an offer title'); return; }
  
  const offers = JSON.parse(localStorage.getItem('cs_offers') || '[]');
  offers.push({
    id: Date.now(),
    title,
    desc: document.getElementById('of-desc').value,
    badge: document.getElementById('of-badge').value,
    expiry: document.getElementById('of-expiry').value,
    active: true
  });
  
  localStorage.setItem('cs_offers', JSON.stringify(offers));
  
  document.getElementById('of-title').value = '';
  document.getElementById('of-desc').value = '';
  document.getElementById('of-badge').value = '';
  document.getElementById('of-expiry').value = '';
  
  loadOffersAdmin();
  loadDashboard();
  showToast('✅ Offer added!');
}

function loadOffersAdmin() {
  const offers = JSON.parse(localStorage.getItem('cs_offers') || '[]');
  const list = document.getElementById('offersAdminList');
  
  if (offers.length === 0) {
    list.innerHTML = '<p style="color:var(--text-light);font-size:14px;padding:8px;">No offers yet.</p>';
    return;
  }
  
  list.innerHTML = '';
  offers.forEach(offer => {
    const item = document.createElement('div');
    item.className = 'offer-admin-item';
    item.innerHTML = `
      <div class="oai-info">
        <strong>${offer.title}</strong>
        <p>${offer.desc || ''} ${offer.expiry ? `· Expires: ${offer.expiry}` : ''}</p>
      </div>
      <div class="oai-actions">
        <button class="toggle-btn ${offer.active ? 'active' : 'inactive'}" onclick="toggleOffer(${offer.id})">
          ${offer.active ? '✓ Active' : '✗ Inactive'}
        </button>
        <button class="delete-btn" onclick="deleteOffer(${offer.id})">Delete</button>
      </div>
    `;
    list.appendChild(item);
  });
}

function toggleOffer(id) {
  const offers = JSON.parse(localStorage.getItem('cs_offers') || '[]');
  const idx = offers.findIndex(o => o.id === id);
  if (idx > -1) {
    offers[idx].active = !offers[idx].active;
    localStorage.setItem('cs_offers', JSON.stringify(offers));
    loadOffersAdmin();
    showToast(`Offer ${offers[idx].active ? 'activated' : 'deactivated'}`);
  }
}

function deleteOffer(id) {
  if (!confirm('Delete this offer?')) return;
  let offers = JSON.parse(localStorage.getItem('cs_offers') || '[]');
  offers = offers.filter(o => o.id !== id);
  localStorage.setItem('cs_offers', JSON.stringify(offers));
  loadOffersAdmin();
  loadDashboard();
  showToast('🗑️ Offer deleted');
}

function saveBannerOffer() {
  const text = document.getElementById('bannerOfferText').value.trim();
  if (!text) { alert('Enter banner text'); return; }
  localStorage.setItem('cs_banner', text);
  showToast('✅ Banner saved! Visible on homepage.');
}

function clearBannerOffer() {
  localStorage.removeItem('cs_banner');
  document.getElementById('bannerOfferText').value = '';
  showToast('🗑️ Banner cleared');
}

function loadBannerField() {
  const b = localStorage.getItem('cs_banner');
  if (b) document.getElementById('bannerOfferText').value = b;
}

// ========================
// REVIEWS MANAGER
// ========================
function addReview() {
  const name = document.getElementById('rv-name').value.trim();
  const text = document.getElementById('rv-text').value.trim();
  if (!name || !text) { alert('Please fill in name and review text'); return; }
  
  const reviews = JSON.parse(localStorage.getItem('cs_reviews') || '[]');
  reviews.unshift({
    id: Date.now(),
    name,
    stars: parseInt(document.getElementById('rv-stars').value),
    text,
    label: 'Student'
  });
  
  localStorage.setItem('cs_reviews', JSON.stringify(reviews));
  
  document.getElementById('rv-name').value = '';
  document.getElementById('rv-text').value = '';
  
  loadReviewsAdmin();
  loadDashboard();
  showToast('✅ Review added!');
}

function loadReviewsAdmin() {
  const stored = localStorage.getItem('cs_reviews');
  const DEFAULT = [
    { id: 1, name: 'Priya Sharma', stars: 5, text: 'Absolutely loved the classes!', label: 'Student' },
    { id: 2, name: 'Ravi Kumar', stars: 5, text: 'Best decision I made this year!', label: 'Student' },
  ];
  const reviews = stored ? JSON.parse(stored) : DEFAULT;
  const list = document.getElementById('reviewsAdminList');
  
  if (reviews.length === 0) {
    list.innerHTML = '<p style="color:var(--text-light);font-size:14px;padding:8px;">No reviews yet.</p>';
    return;
  }
  
  list.innerHTML = '';
  reviews.forEach(rv => {
    const item = document.createElement('div');
    item.className = 'review-admin-item';
    item.innerHTML = `
      <div class="rai-info">
        <strong>${rv.name}</strong>
        <div class="rai-stars">${'⭐'.repeat(rv.stars)}</div>
        <p>"${rv.text.substring(0, 100)}${rv.text.length > 100 ? '...' : ''}"</p>
      </div>
      <div class="rai-actions">
        <button class="delete-btn" onclick="deleteReview(${rv.id})">Delete</button>
      </div>
    `;
    list.appendChild(item);
  });
}

function deleteReview(id) {
  if (!confirm('Delete this review?')) return;
  const stored = localStorage.getItem('cs_reviews');
  const DEFAULT_REVIEWS = [
    { id: 1, name: 'Priya Sharma', stars: 5, text: 'Absolutely loved the classes! The instructor is so patient and knowledgeable.', label: 'Fondant Class Student' },
    { id: 2, name: 'Ravi Kumar', stars: 5, text: 'Best decision I made this year!', label: 'Advanced Baking Student' },
  ];
  let reviews = stored ? JSON.parse(stored) : DEFAULT_REVIEWS;
  reviews = reviews.filter(r => r.id !== id);
  localStorage.setItem('cs_reviews', JSON.stringify(reviews));
  loadReviewsAdmin();
  loadDashboard();
  showToast('🗑️ Review deleted');
}

// ========================
// TOAST NOTIFICATION
// ========================
function showToast(msg) {
  const existing = document.querySelector('.admin-toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = 'admin-toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px;
    background: linear-gradient(135deg, var(--pink-500), var(--rose));
    color: white; padding: 14px 24px; border-radius: 12px;
    font-size: 14px; font-weight: 600; z-index: 9999;
    box-shadow: 0 8px 32px rgba(235,47,150,0.4);
    animation: slideToast 0.4s ease;
  `;
  
  const style = document.createElement('style');
  style.textContent = '@keyframes slideToast { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }';
  document.head.appendChild(style);
  
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
