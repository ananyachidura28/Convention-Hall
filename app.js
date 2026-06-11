/**
 * Common Logic for Function Hall Booking Application
 * Handles: Theme Toggle, Sticky Header, Mobile Nav, Auth Simulation, Notifications, and Scroll Transitions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Page Loader Fade Out
  initPageLoader();

  // Theme Toggle (Dark / Light Mode)
  initTheme();

  // Sticky Header scroll effect
  initStickyHeader();

  // Mobile Hamburger Navigation
  initMobileNav();

  // Back to Top Button
  initBackToTop();

  // Auth Simulation Model
  initAuthSimulation();

  // Scroll Reveal Animations
  initScrollReveal();
});

/* ==========================================================================
   Page Loader Helper
   ========================================================================== */
function initPageLoader() {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }, 400); // Small pause for smooth entry
  }
}

/* ==========================================================================
   Dark Mode Manager
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  // Check saved theme or system theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark-mode');
  }

  // Bind click event
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    showNotification(`Switched to ${isDark ? 'Dark' : 'Light'} Mode`, 'info');
  });
}

/* ==========================================================================
   Sticky Header
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Initial check
}

/* ==========================================================================
   Mobile Drawer Navigation
   ========================================================================== */
function initMobileNav() {
  const menuBtn = document.getElementById('menu-btn');
  const navMenu = document.getElementById('nav-menu');
  if (!menuBtn || !navMenu) return;

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menuBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close when clicking a link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Close when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
      menuBtn.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

/* ==========================================================================
   Back To Top Button
   ========================================================================== */
function initBackToTop() {
  // Create back to top button dynamically if it doesn't exist
  let backBtn = document.getElementById('back-to-top');
  if (!backBtn) {
    backBtn = document.createElement('div');
    backBtn.id = 'back-to-top';
    backBtn.className = 'back-to-top';
    backBtn.innerHTML = '▲';
    document.body.appendChild(backBtn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backBtn.classList.add('active');
    } else {
      backBtn.classList.remove('active');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   Toast Notification Engine
   ========================================================================== */
function showNotification(message, type = 'success') {
  // Create container if it doesn't exist
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Create toast
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Icon
  let icon = '🔔';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '❌';
  if (type === 'info') icon = 'ℹ️';

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  // Remove toast after duration
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
}

/* ==========================================================================
   Authentication Flow Simulator
   ========================================================================== */
function initAuthSimulation() {
  const authBtn = document.getElementById('auth-nav-btn');
  const authModal = document.getElementById('auth-modal');
  const modalClose = document.getElementById('auth-modal-close');
  
  // Tab toggling
  const loginTab = document.getElementById('tab-login');
  const registerTab = document.getElementById('tab-register');
  const loginForm = document.getElementById('form-login-wrapper');
  const registerForm = document.getElementById('form-register-wrapper');

  // Load active user session
  updateNavbarAuth();

  if (!authBtn || !authModal || !modalClose) return;

  // Open modal
  authBtn.addEventListener('click', (e) => {
    const user = getStoredUser();
    if (user) {
      // If logged in, click triggers Log Out
      clearUserSession();
      updateNavbarAuth();
      showNotification('Logged out successfully', 'success');
      // If we are on dashboard, redirect to home
      if (window.location.pathname.includes('dashboard.html')) {
        window.location.href = 'index.html';
      }
    } else {
      e.preventDefault();
      authModal.classList.add('active');
    }
  });

  // Close modal
  modalClose.addEventListener('click', () => {
    authModal.classList.remove('active');
  });

  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
      authModal.classList.remove('active');
    }
  });

  // Switch tabs
  if (loginTab && registerTab && loginForm && registerForm) {
    loginTab.addEventListener('click', () => {
      loginTab.classList.add('active');
      registerTab.classList.remove('active');
      loginForm.classList.add('active');
      registerForm.classList.remove('active');
    });

    registerTab.addEventListener('click', () => {
      registerTab.classList.add('active');
      loginTab.classList.remove('active');
      registerForm.classList.add('active');
      loginForm.classList.remove('active');
    });
  }

  // Handle Login Submission
  const submitLoginForm = document.getElementById('form-login');
  if (submitLoginForm) {
    submitLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const name = email.split('@')[0];
      
      const user = { name: name.charAt(0).toUpperCase() + name.slice(1), email: email };
      setUserSession(user);
      updateNavbarAuth();
      authModal.classList.remove('active');
      showNotification(`Welcome back, ${user.name}!`, 'success');
      
      // Reload page if dashboard is open
      if (window.location.pathname.includes('dashboard.html')) {
        window.location.reload();
      }
    });
  }

  // Handle Registration Submission
  const submitRegisterForm = document.getElementById('form-register');
  if (submitRegisterForm) {
    submitRegisterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      
      const user = { name: name, email: email };
      setUserSession(user);
      updateNavbarAuth();
      authModal.classList.remove('active');
      showNotification(`Account created! Welcome, ${user.name}`, 'success');
      
      // Reload page if dashboard is open
      if (window.location.pathname.includes('dashboard.html')) {
        window.location.reload();
      }
    });
  }
}

function updateNavbarAuth() {
  const authBtn = document.getElementById('auth-nav-btn');
  if (!authBtn) return;

  const user = getStoredUser();
  if (user) {
    authBtn.innerHTML = `Logout (${user.name})`;
    authBtn.classList.remove('btn-outline');
    authBtn.classList.add('btn-primary');
    
    // If we have dashboard link, make sure dashboard tabs are visible
    const dashLink = document.querySelector('a[href="dashboard.html"]');
    if (dashLink) {
      dashLink.style.display = 'block';
    }
  } else {
    authBtn.innerHTML = 'Login / Register';
    authBtn.classList.remove('btn-primary');
    authBtn.classList.add('btn-outline');
  }
}

/* ==========================================================================
   Scroll Reveal Observer
   ========================================================================== */
function initScrollReveal() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale');
  revealElements.forEach(el => observer.observe(el));
}
