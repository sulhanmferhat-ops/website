// ── NAVİGASYON
var navbar = document.getElementById('navbar');
var navLinks = document.getElementById('navLinks');
var menuIcon = document.getElementById('menuIcon');

window.addEventListener('scroll', function () {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function toggleMenu() {
  navLinks.classList.toggle('open');
  menuIcon.classList.toggle('fa-bars');
  menuIcon.classList.toggle('fa-times');
}
function closeMenu() {
  navLinks.classList.remove('open');
  menuIcon.classList.remove('fa-times');
  menuIcon.classList.add('fa-bars');
}

// ── SCROLL REVEAL
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry, i) {
    if (entry.isIntersecting) {
      setTimeout(function () { entry.target.classList.add('visible'); }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

// ── SAYAÇ
var counterObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    var el = entry.target;
    var target = parseInt(el.getAttribute('data-target'));
    var count = 0;
    var increment = target / (2000 / 16);
    var timer = setInterval(function () {
      count += increment;
      if (count >= target) { el.textContent = target; clearInterval(timer); }
      else { el.textContent = Math.ceil(count); }
    }, 16);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(function (c) { counterObserver.observe(c); });

// ── PARTİKÜL
var canvas = document.getElementById('particle-canvas');
var ctx = canvas.getContext('2d');
var particles = [];
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
function createParticles() {
  particles = Array.from({ length: 70 }, function () {
    return {
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5, dx: (Math.random() - 0.5) * 0.4, dy: (Math.random() - 0.5) * 0.4
    };
  });
}
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(function (p) {
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(212,175,55,0.12)'; ctx.fill();
  });
  requestAnimationFrame(animateParticles);
}
resize(); createParticles(); animateParticles();
window.addEventListener('resize', function () { resize(); createParticles(); });

// ── GALERİ
function getPhotos() {
  if (typeof GALLERY_IMAGES === 'undefined') return [];
  return GALLERY_IMAGES;
}

function renderGalleryPreview() {
  var container = document.getElementById('galleryPreview');
  if (!container) return;
  var photos = getPhotos().slice(0, 6);
  container.innerHTML = photos.map(function (p) {
    return '<div class="gp-item" onclick="openGalleryModal()">' +
      '<img src="' + p.src + '" alt="' + p.label + '" loading="lazy" />' +
      '<div class="gp-overlay"><div class="gp-label">' + p.label + '</div></div>' +
      '</div>';
  }).join('');
}

// ── GALERİ MODAL
var lbIndex = 0;
var lbPhotos = [];

function openGalleryModal() {
  lbPhotos = getPhotos();
  var modal = document.getElementById('galleryModal');
  var body = document.getElementById('gmBody');
  document.getElementById('gm-count').textContent = '(' + lbPhotos.length + ' fotoğraf)';

  body.innerHTML = '<div class="gm-grid">' + lbPhotos.map(function (p, i) {
    return '<div class="gm-item" onclick="openLightbox(' + i + ')">' +
      '<img src="' + p.src + '" alt="' + p.label + '" loading="lazy" />' +
      '<div class="gm-item-label">' + p.label + '</div>' +
      '</div>';
  }).join('') + '</div>';

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeGalleryModal() {
  document.getElementById('galleryModal').classList.remove('open');
  closeLightbox();
  document.body.style.overflow = '';
}

// ── LIGHTBOX
function openLightbox(index) {
  lbIndex = index;
  document.getElementById('lightbox').classList.add('open');
  renderLightbox();
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}
function renderLightbox() {
  var photo = lbPhotos[lbIndex];
  document.getElementById('lbImg').src = photo.src;
  document.getElementById('lbLabel').textContent = photo.label;
  document.getElementById('lbCounter').textContent = (lbIndex + 1) + ' / ' + lbPhotos.length;
}
function lbPrev() { lbIndex = (lbIndex - 1 + lbPhotos.length) % lbPhotos.length; renderLightbox(); }
function lbNext() { lbIndex = (lbIndex + 1) % lbPhotos.length; renderLightbox(); }

document.addEventListener('keydown', function (e) {
  var lb = document.getElementById('lightbox');
  var modal = document.getElementById('galleryModal');
  if (e.key === 'Escape') {
    if (lb.classList.contains('open')) closeLightbox();
    else if (modal.classList.contains('open')) closeGalleryModal();
  }
  if (lb.classList.contains('open')) {
    if (e.key === 'ArrowLeft') lbPrev();
    if (e.key === 'ArrowRight') lbNext();
  }
});

// ── BAŞLAT
renderGalleryPreview();