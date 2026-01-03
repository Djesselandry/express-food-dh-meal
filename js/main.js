// ============================================
// INITIALISATION - Tout dans DOMContentLoaded
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  
  // ============================================
  // NAVBAR SCROLL EFFECT
  // ============================================
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    });
  }

  // ============================================
  // SLIDER FUNCTIONALITY
  // ============================================
  const slides = document.querySelectorAll('.slide');
  const indicators = document.querySelectorAll('.indicator');
  let index = 0;
  let autoSlideInterval;

  if (slides.length > 0) {
    function showSlide(n) {
      slides.forEach(slide => slide.classList.remove('active'));
      indicators.forEach(indicator => indicator.classList.remove('active'));
      
      if (slides[n]) {
        slides[n].classList.add('active');
        if (indicators[n]) indicators[n].classList.add('active');
        index = n;
        
        // Réinitialiser les animations reveal pour le slide actif
        const slideContent = slides[n].querySelector('.slide-content');
        if (slideContent) {
          const reveals = slideContent.querySelectorAll('.reveal');
          reveals.forEach((el, i) => {
            el.classList.remove('active');
            setTimeout(() => {
              el.classList.add('active');
            }, 100 * (i + 1));
          });
        }
      }
    }

    function nextSlide() {
      index = (index + 1) % slides.length;
      showSlide(index);
    }

    function startAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, 6000);
    }

    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }

    // Initialiser le premier slide avec animations
    showSlide(0);
    setTimeout(() => {
      const firstSlideContent = slides[0].querySelector('.slide-content');
      if (firstSlideContent) {
        const firstReveals = firstSlideContent.querySelectorAll('.reveal');
        firstReveals.forEach((el, i) => {
          setTimeout(() => {
            el.classList.add('active');
          }, 200 * (i + 1));
        });
      }
    }, 300);

    // Démarrer le slider automatique
    startAutoSlide();

    // Gérer les clics sur les indicateurs
    indicators.forEach((indicator, i) => {
      indicator.addEventListener('click', () => {
        stopAutoSlide();
        showSlide(i);
        startAutoSlide();
      });
    });

    // Pause au survol
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('mouseenter', stopAutoSlide);
      hero.addEventListener('mouseleave', startAutoSlide);

      // ============================================
      // SWIPE FUNCTIONALITY FOR MOBILE
      // ============================================
      let startX = 0;
      let endX = 0;
      let isSwiping = false;

      hero.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
        stopAutoSlide();
      }, { passive: true });

      hero.addEventListener('touchmove', (e) => {
        if (isSwiping) {
          endX = e.touches[0].clientX;
        }
      }, { passive: true });

      hero.addEventListener('touchend', (e) => {
        if (isSwiping) {
          endX = e.changedTouches[0].clientX;
          handleSwipe();
          isSwiping = false;
          startAutoSlide();
        }
      }, { passive: true });

      function handleSwipe() {
        const diff = startX - endX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
          if (diff > 0) {
            nextSlide(); // Swipe left, next slide
          } else {
            index = (index - 1 + slides.length) % slides.length;
            showSlide(index); // Swipe right, previous slide
          }
        }
      }
    }
  }

  // ============================================
  // MOBILE MENU (BURGER)
  // ============================================
  const burger = document.getElementById('burger');
  const navLinks = document.querySelector('.nav-links');

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      burger.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Fermer le menu au clic sur un lien
    const navLinksItems = document.querySelectorAll('.nav-links a');
    navLinksItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        burger.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Fermer le menu au clic en dehors
    document.addEventListener('click', (e) => {
      if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        burger.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================
  // SCROLL ANIMATIONS (REVEAL)
  // ============================================
  const reveals = document.querySelectorAll('.reveal');

  if (reveals.length > 0) {
    // Observer pour les animations au scroll (plus performant)
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observer tous les éléments reveal
    reveals.forEach(el => {
      revealObserver.observe(el);
    });

    // Activer les éléments déjà visibles
    reveals.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('active');
      }
    });
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || !href) return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const offsetTop = target.offsetTop - 80; // Compenser la navbar fixe
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // NAVBAR ACTIVE LINK
  // ============================================
  const navLinkElements = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinkElements.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  window.addEventListener('scroll', debounce(updateActiveNav, 10));
  updateActiveNav(); // Initial call

  // ============================================
  // PARALLAX EFFECT (OPTIONNEL - SUBTIL)
  // ============================================
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      if (scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    });
  }

  // ============================================
  // MICRO-INTERACTIONS
  // ============================================

  // Animation au survol des cartes de menu
  const menuCards = document.querySelectorAll('.menu-card');
  menuCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Animation des boutons de contact
  const contactButtons = document.querySelectorAll('.call-btn, .whatsapp-btn');
  contactButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      // Créer un effet de ripple
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Ajouter le style ripple dynamiquement
  const style = document.createElement('style');
  style.textContent = `
    .call-btn, .whatsapp-btn {
      position: relative;
      overflow: hidden;
    }
    
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      pointer-events: none;
    }
    
    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // ============================================
  // STATISTICS ANIMATION
  // ============================================
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateStats() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'));
      if (isNaN(target)) return;
      
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
      let current = 0;
      
      const updateStat = () => {
        current += increment;
        if (current < target) {
          stat.textContent = Math.floor(current);
          requestAnimationFrame(updateStat);
        } else {
          stat.textContent = target;
        }
      };
      
      // Observer pour déclencher l'animation quand visible
      const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            updateStat();
            statObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      const statItem = stat.closest('.stat-item');
      if (statItem) {
        statObserver.observe(statItem);
      }
    });
  }

  if (statNumbers.length > 0) {
    animateStats();
  }

  // ============================================
  // LAZY LOADING DES IMAGES (OPTIONNEL)
  // ============================================
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });
    
    // Observer toutes les images avec data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  console.log('Express Food DH Meal - Site initialisé avec succès!');
});
