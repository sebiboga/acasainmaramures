document.addEventListener('DOMContentLoaded', () => {

  // Mobile menu
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // Cookie banner
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieModal = document.getElementById('cookie-modal');
  if (cookieBanner) {
    if (!localStorage.getItem('cookiesConsent')) {
      cookieBanner.classList.add('show');
    }
    document.querySelectorAll('.btn-accept').forEach(btn => {
      btn.addEventListener('click', () => {
        localStorage.setItem('cookiesConsent', 'all');
        cookieBanner.classList.remove('show');
        cookieModal.classList.remove('open');
      });
    });
    document.querySelectorAll('.btn-settings').forEach(btn => {
      btn.addEventListener('click', () => {
        cookieModal.classList.add('open');
      });
    });
    document.querySelector('.btn-save')?.addEventListener('click', () => {
      localStorage.setItem('cookiesConsent', 'saved');
      cookieBanner.classList.remove('show');
      cookieModal.classList.remove('open');
    });
    document.querySelectorAll('.btn-reject').forEach(btn => {
      btn.addEventListener('click', () => {
        localStorage.setItem('cookiesConsent', 'rejected');
        cookieBanner.classList.remove('show');
        cookieModal.classList.remove('open');
      });
    });
  }

  // Cookie modal close on backdrop click
  cookieModal?.addEventListener('click', (e) => {
    if (e.target === cookieModal) cookieModal.classList.remove('open');
  });

  // Cookie toggles
  document.querySelectorAll('.toggle').forEach(toggle => {
    if (!toggle.closest('.cookie-option')?.querySelector('h4')?.textContent.includes('Funcționale')) {
      toggle.addEventListener('click', () => toggle.classList.toggle('active'));
    }
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  let currentImgIdx = 0;
  const galleryImages = [];

  document.querySelectorAll('.gallery-item')?.forEach((item, idx) => {
    const img = item.querySelector('img');
    if (img) {
      galleryImages.push(img.src);
      item.addEventListener('click', () => {
        currentImgIdx = idx;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    }
  });

  function updateLightboxImg() {
    if (galleryImages[currentImgIdx]) {
      lightboxImg.src = galleryImages[currentImgIdx];
    }
  }

  document.querySelector('.lightbox-close')?.addEventListener('click', () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  });

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  document.querySelector('.lightbox-nav.prev')?.addEventListener('click', (e) => {
    e.stopPropagation();
    currentImgIdx = (currentImgIdx - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImg();
  });

  document.querySelector('.lightbox-nav.next')?.addEventListener('click', (e) => {
    e.stopPropagation();
    currentImgIdx = (currentImgIdx + 1) % galleryImages.length;
    updateLightboxImg();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
    if (e.key === 'ArrowLeft') {
      currentImgIdx = (currentImgIdx - 1 + galleryImages.length) % galleryImages.length;
      updateLightboxImg();
    }
    if (e.key === 'ArrowRight') {
      currentImgIdx = (currentImgIdx + 1) % galleryImages.length;
      updateLightboxImg();
    }
  });

  // Contact form
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    if (!data.name || !data.email || !data.message) {
      alert('Vă rugăm să completați toate câmpurile obligatorii!');
      return;
    }
    const mailto = `mailto:acasainmaramures@gmail.com?subject=Contact de la ${encodeURIComponent(data.name)}&body=${encodeURIComponent('Nume: ' + data.name + '\nEmail: ' + data.email + '\nTelefon: ' + (data.phone || '') + '\n\nMesaj:\n' + data.message)}`;
    window.location.href = mailto;
    contactForm.reset();
    alert('Formular trimis cu succes. Mulțumim!');
  });

  // Back to top
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Booking widget — set min dates
  const today = new Date().toISOString().split('T')[0];
  const dateInputs = document.querySelectorAll('.bw-group input[type="date"]');
  const checkinInputs = document.querySelectorAll('.bw-form input[name="checkin"]');
  const checkoutInputs = document.querySelectorAll('.bw-form input[name="checkout"]');

  checkinInputs.forEach(inp => {
    inp.setAttribute('min', today);
    inp.addEventListener('change', function () {
      const checkout = this.closest('.bw-form').querySelector('input[name="checkout"]');
      if (checkout) {
        checkout.setAttribute('min', this.value);
        if (checkout.value && checkout.value <= this.value) {
          const next = new Date(this.value);
          next.setDate(next.getDate() + 1);
          checkout.value = next.toISOString().split('T')[0];
        }
      }
    });
  });

  checkoutInputs.forEach(inp => {
    inp.addEventListener('change', function () {
      const checkin = this.closest('.bw-form').querySelector('input[name="checkin"]');
      if (checkin && this.value && checkin.value && this.value <= checkin.value) {
        const next = new Date(checkin.value);
        next.setDate(next.getDate() + 1);
        this.value = next.toISOString().split('T')[0];
      }
    });
  });

  // Scroll animations (Intersection Observer)
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .1, rootMargin: '0px 0px -50px 0px' });
    fadeEls.forEach(el => observer.observe(el));
  }

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
});
