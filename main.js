/* ===========================
   CAKE SCIENCE — MAIN JS
   =========================== */

// ========================
// DEFAULT DATA
// ========================
const DEFAULT_GALLERY = [
  { id: 1, src: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600', caption: 'Floral Birthday Cake', category: 'cakes' },
  { id: 2, src: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600', caption: 'Chocolate Layer Cake', category: 'cakes' },
  { id: 3, src: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600', caption: 'Wedding Tier Cake', category: 'cakes' },
  { id: 4, src: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600', caption: 'Custom Design Class', category: 'services' },
  { id: 5, src: 'https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=600', caption: 'Fondant Workshop', category: 'services' },
  { id: 6, src: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600', caption: 'Fresh Baked Goods', category: 'products' },
  { id: 7, src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', caption: 'Macarons Collection', category: 'products' },
  { id: 8, src: 'https://images.unsplash.com/photo-1551404973-761c83cd8339?w=600', caption: 'Cupcake Bouquet', category: 'cakes' },
  { id: 9, src: 'https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=600', caption: 'Kids Baking Class', category: 'services' },
];

const DEFAULT_REVIEWS = [
  { id: 1, name: 'Priya Sharma', stars: 5, text: 'Absolutely loved the classes! The instructor is so patient and knowledgeable. My fondant cakes turned out beautiful. Highly recommend to everyone in Andaman!', label: 'Fondant Class Student' },
  { id: 2, name: 'Ravi Kumar', stars: 5, text: 'Best decision I made this year! Learned so many professional techniques. The small batch classes ensure personal attention. Worth every rupee!', label: 'Advanced Baking Student' },
  { id: 3, name: 'Meera Pillai', stars: 5, text: 'I started with zero baking knowledge and now I make stunning wedding cakes! The step-by-step approach is perfect for beginners. Thank you Cake Science!', label: 'Beginner Class Graduate' },
  { id: 4, name: 'Anil Fernandez', stars: 4, text: 'Great atmosphere, wonderful teacher. The curriculum is comprehensive and modern. Loved learning about baking science behind every recipe!', label: 'Weekend Batch Student' },
  { id: 5, name: 'Sunita Nair', stars: 5, text: 'Travelling from Port Blair was absolutely worth it. The studio is well-equipped, hygienic and the learning environment is amazing. 5 stars without question!', label: 'Port Blair Student' },
  { id: 6, name: 'Deepak Roy', stars: 5, text: 'Joined with my wife and we had a blast! The hands-on experience is fantastic. Now we bake professional-grade cakes at home for our kids. Love this place!', label: 'Couple Baking Batch' },
];

// ========================
// LOADER
// ========================
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    document.body.style.overflow = '';
  }, 2000);
  document.body.style.overflow = 'hidden';
});

// ========================
// NAVBAR SCROLL
// ========================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ========================
// SCROLL ANIMATIONS
// ========================
const animateObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-animate]').forEach(el => animateObserver.observe(el));

// Gallery staggered animation
const galleryObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.05 });

// ========================
// LOAD CONTENT FROM STORAGE
// ========================
function loadContent() {
  const c = JSON.parse(localStorage.getItem('cs_content') || '{}');
  
  if (c.heroTag) document.getElementById('heroTag').textContent = c.heroTag;
  if (c.heroTitle) document.getElementById('heroTitle').innerHTML = c.heroTitle;
  if (c.heroSubtitle) document.getElementById('heroSubtitle').textContent = c.heroSubtitle;
  if (c.heroBg) document.getElementById('heroBg').style.backgroundImage = `url('${c.heroBg}')`;
  
  if (c.aboutTitle) document.getElementById('aboutTitle').textContent = c.aboutTitle;
  if (c.aboutText) document.getElementById('aboutText').innerHTML = c.aboutText;
  if (c.aboutImg) {
    const img = document.getElementById('aboutImg');
    img.src = c.aboutImg;
  }
  
  if (c.contactAddress) document.getElementById('contactAddress').innerHTML = c.contactAddress;
  if (c.contactPhone) {
    const p = document.getElementById('contactPhone');
    p.textContent = c.contactPhone;
    p.href = `tel:${c.contactPhone}`;
  }
  if (c.contactWhatsapp) {
    const w = document.getElementById('contactWhatsapp');
    w.textContent = `+${c.contactWhatsapp}`;
    w.href = `https://wa.me/${c.contactWhatsapp}`;
  }
  if (c.contactHours) document.getElementById('contactHours').textContent = c.contactHours;
}

// ========================
// OFFER BANNER
// ========================
function loadOfferBanner() {
  const banner = localStorage.getItem('cs_banner');
  if (banner) {
    document.getElementById('offerBanner').classList.remove('hidden');
    document.getElementById('offerText').textContent = banner;
  }
}

// ========================
// GALLERY
// ========================
let galleryImages = [];
let currentFilter = 'all';
let lightboxIndex = 0;

function loadGallery() {
  const stored = localStorage.getItem('cs_gallery');
  galleryImages = stored ? JSON.parse(stored) : DEFAULT_GALLERY;
  renderGallery();
}

function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  const filtered = currentFilter === 'all' ? galleryImages : galleryImages.filter(i => i.category === currentFilter);
  
  grid.innerHTML = '';
  
  if (filtered.length === 0) {
    grid.innerHTML = '<div class="gallery-empty">🎂 No images in this category yet.</div>';
    return;
  }
  
  filtered.forEach((img, idx) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
      <img src="${img.src}" alt="${img.caption}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'" />
      <div class="gallery-item-overlay">
        <span class="gallery-item-caption">${img.caption || ''}</span>
      </div>
    `;
    item.addEventListener('click', () => openLightbox(idx, filtered));
    grid.appendChild(item);
    galleryObserver.observe(item);
  });
  
  // Trigger animations
  setTimeout(() => {
    grid.querySelectorAll('.gallery-item').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 80);
    });
  }, 100);
}

// Tab filtering
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.tab;
    renderGallery();
  });
});

// ========================
// LIGHTBOX
// ========================
let lbImages = [];

function openLightbox(idx, images) {
  lbImages = images;
  lightboxIndex = idx;
  updateLightbox();
  document.getElementById('lightbox').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function updateLightbox() {
  const img = lbImages[lightboxIndex];
  document.getElementById('lbImg').src = img.src;
  document.getElementById('lbCaption').textContent = img.caption || '';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.add('hidden');
  document.body.style.overflow = '';
}

function lbNav(dir) {
  lightboxIndex = (lightboxIndex + dir + lbImages.length) % lbImages.length;
  updateLightbox();
}

document.getElementById('lightbox').addEventListener('click', function(e) {
  if (e.target === this) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (document.getElementById('lightbox').classList.contains('hidden')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lbNav(-1);
  if (e.key === 'ArrowRight') lbNav(1);
});

// ========================
// REVIEWS CAROUSEL
// ========================
let reviewSlide = 0;
let reviewData = [];

function loadReviews() {
  const stored = localStorage.getItem('cs_reviews');
  reviewData = stored ? JSON.parse(stored) : DEFAULT_REVIEWS;
  renderReviews();
}

function renderReviews() {
  const track = document.getElementById('reviewsTrack');
  const dotsContainer = document.getElementById('carouselDots');
  
  track.innerHTML = '';
  dotsContainer.innerHTML = '';
  
  reviewData.forEach(r => {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <div class="review-stars">${'⭐'.repeat(r.stars)}</div>
      <p class="review-text">"${r.text}"</p>
      <div class="review-author">
        <div class="author-avatar">${r.name[0]}</div>
        <div>
          <div class="author-name">${r.name}</div>
          <div class="author-label">${r.label || 'Student'}</div>
        </div>
      </div>
    `;
    track.appendChild(card);
  });
  
  // Dots
  const totalSlides = Math.max(0, reviewData.length - 2);
  for (let i = 0; i <= totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
  
  reviewSlide = 0;
  updateCarousel();
  
  // Auto-advance
  setInterval(() => slideReview(1), 5000);
}

function updateCarousel() {
  const track = document.getElementById('reviewsTrack');
  const cardsPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  const cardWidth = track.parentElement.offsetWidth / cardsPerView;
  const maxSlide = Math.max(0, reviewData.length - cardsPerView);
  reviewSlide = Math.min(reviewSlide, maxSlide);
  track.style.transform = `translateX(-${reviewSlide * (cardWidth + 24)}px)`;
  
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === reviewSlide);
  });
}

function slideReview(dir) {
  const cardsPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  const maxSlide = Math.max(0, reviewData.length - cardsPerView);
  reviewSlide = (reviewSlide + dir + maxSlide + 1) % (maxSlide + 1);
  updateCarousel();
}

function goToSlide(i) {
  reviewSlide = i;
  updateCarousel();
}

window.addEventListener('resize', updateCarousel);

// ========================
// OFFERS
// ========================
function loadOffers() {
  const offers = JSON.parse(localStorage.getItem('cs_offers') || '[]');
  const active = offers.filter(o => o.active);
  const section = document.getElementById('offers');
  const grid = document.getElementById('offersGrid');
  
  if (active.length === 0) {
    section.classList.add('hidden');
    return;
  }
  
  section.classList.remove('hidden');
  grid.innerHTML = '';
  
  active.forEach(offer => {
    const card = document.createElement('div');
    card.className = 'offer-card';
    card.innerHTML = `
      ${offer.badge ? `<div class="offer-badge">${offer.badge}</div>` : ''}
      <div class="offer-title">${offer.title}</div>
      <div class="offer-desc">${offer.desc || ''}</div>
      ${offer.expiry ? `<div class="offer-expiry">Valid until: ${offer.expiry}</div>` : ''}
    `;
    grid.appendChild(card);
    animateObserver.observe(card);
  });
}

// ========================
// INIT
// ========================
loadContent();
loadOfferBanner();
loadGallery();
loadReviews();
loadOffers();

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
