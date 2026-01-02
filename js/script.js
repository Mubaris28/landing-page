(() => {
  "use strict";

  const BRAND = {
    name: "RH Real Estate",
    short: "RH",
    tagline: "FIND YOUR DREAM HOME TODAY",
    location: "123 Main Street, City, State 12345",
  };

  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  const hasGSAP = typeof window.gsap !== "undefined";
  const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";

  // Apply Branding
  function applyBrand() {
    document.querySelectorAll("[data-brand-text]").forEach((el) => (el.textContent = BRAND.name));
    document.querySelectorAll("[data-brand-short]").forEach((el) => (el.textContent = BRAND.short));

    const taglineEl = document.querySelector("[data-brand-tagline]");
    if (taglineEl) taglineEl.textContent = BRAND.tagline;

    const locEl = document.querySelector("[data-brand-location]");
    if (locEl) locEl.textContent = BRAND.location;

    const yearEl = document.querySelector("[data-year]");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  // Enhanced Mobile Menu
  function initMobileMenu() {
    const menuRoot = document.getElementById("mobileMenu");
    const menuBtn = document.getElementById("menuBtn");
    const menuCloseBtn = document.getElementById("menuCloseBtn");
    const panel = menuRoot?.querySelector("[data-menu-panel]");
    const backdrop = menuRoot?.querySelector("[data-menu-backdrop]");
    const menuLinks = menuRoot?.querySelectorAll("[data-menu-link]") || [];

    let menuOpen = false;

    const lockScroll = (lock) => {
      document.documentElement.style.overflow = lock ? "hidden" : "";
      document.body.style.overflow = lock ? "hidden" : "";
    };

    const setMenuA11y = (open) => {
      menuBtn?.setAttribute("aria-expanded", String(open));
      menuRoot?.setAttribute("aria-hidden", String(!open));
    };

    const openMenu = () => {
      if (!menuRoot || !panel || !backdrop || menuOpen) return;
      menuOpen = true;
      setMenuA11y(true);
      lockScroll(true);
      menuRoot.style.pointerEvents = "auto";

      if (!prefersReducedMotion && hasGSAP) {
        window.gsap.to(backdrop, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
        window.gsap.to(panel, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
          overwrite: true,
        });
      } else {
        backdrop.style.opacity = "1";
        panel.style.opacity = "1";
        panel.style.transform = "translateY(0)";
      }
    };

    const closeMenu = () => {
      if (!menuRoot || !panel || !backdrop || !menuOpen) return;
      menuOpen = false;
      setMenuA11y(false);
      lockScroll(false);

      if (!prefersReducedMotion && hasGSAP) {
        window.gsap.to(backdrop, {
          opacity: 0,
          duration: 0.25,
          ease: "power2.out",
        });
        window.gsap.to(panel, {
          opacity: 0,
          y: -32,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            menuRoot.style.pointerEvents = "none";
          },
        });
      } else {
        backdrop.style.opacity = "0";
        panel.style.opacity = "0";
        panel.style.transform = "translateY(-32px)";
        menuRoot.style.pointerEvents = "none";
      }
    };

    menuBtn?.addEventListener("click", openMenu);
    menuCloseBtn?.addEventListener("click", closeMenu);
    backdrop?.addEventListener("click", closeMenu);
    menuLinks.forEach((a) => a.addEventListener("click", closeMenu));
    
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menuOpen) closeMenu();
    });
  }

  // Enhanced Navbar Scroll Effect
  function initNavbarScroll() {
    const nav = document.getElementById("navbar");
    if (!nav) return;

    let lastScroll = 0;
    const onScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > 100) {
        nav.classList.add("bg-black/95", "backdrop-blur-md", "shadow-xl");
        nav.style.paddingTop = "0.75rem";
        nav.style.paddingBottom = "0.75rem";
      } else {
        nav.classList.remove("bg-black/95", "backdrop-blur-md", "shadow-xl");
        nav.style.paddingTop = "";
        nav.style.paddingBottom = "";
      }

      lastScroll = currentScroll;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Fallback Animation
  function showFallback() {
    const loader = document.querySelector(".loader");
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => loader.remove(), 500);
    }
    document.querySelectorAll(".reveal-on-load").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  // Enhanced Animations
  function initAnimations() {
    if (prefersReducedMotion || !hasGSAP) {
      showFallback();
      return;
    }

    if (hasScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      
      // Optimize ScrollTrigger performance
      window.ScrollTrigger.config({
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
        limitCallbacks: true,
      });
    }

    // Enhanced Loader Animation
    const loaderText = document.querySelector(".loader-text");
    const loaderLine = document.querySelector(".loader-line");
    const loader = document.querySelector(".loader");

    if (loaderText && loaderLine && loader) {
      const tl = window.gsap.timeline();

      tl.to(loaderText, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
      })
        .to(
          loaderLine,
          {
            width: "200px",
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .to(loader, {
          y: "-100%",
          duration: 1,
          delay: 0.5,
          ease: "power4.inOut",
        })
        .to(
          ".reveal-on-load",
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: "power3.out",
          },
          "-=0.8"
        );
    }

    if (!hasScrollTrigger) return;

    // Enhanced Section Reveals - Optimized for performance
    document.querySelectorAll('[data-reveal="left"]').forEach((el) => {
      window.gsap.set(el, { willChange: "transform, opacity" });
      window.gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        x: -80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        onComplete: () => window.gsap.set(el, { willChange: "auto" }),
      });
    });

    document.querySelectorAll('[data-reveal="right"]').forEach((el) => {
      window.gsap.set(el, { willChange: "transform, opacity" });
      window.gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        x: 80,
        opacity: 0,
        duration: 1.2,
        delay: 0.2,
        ease: "power3.out",
        onComplete: () => window.gsap.set(el, { willChange: "auto" }),
      });
    });

    // Enhanced Property Cards Animation - Optimized
    document.querySelectorAll(".property-card").forEach((card) => {
      window.gsap.set(card, { willChange: "transform" });
      window.gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => window.gsap.set(card, { willChange: "auto" }),
      });
    });

    // Enhanced Agent Cards Animation - Optimized
    document.querySelectorAll(".agent-card").forEach((card) => {
      window.gsap.set(card, { willChange: "transform" });
      window.gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => window.gsap.set(card, { willChange: "auto" }),
      });
    });

    // Enhanced Hero Parallax - Optimized for smooth scrolling
    const heroImg = document.querySelector(".hero-img");
    if (heroImg) {
      window.gsap.set(heroImg, { willChange: "transform" });
      window.gsap.to(heroImg, {
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: 2,
          invalidateOnRefresh: true,
        },
        y: 100,
        scale: 1.1,
        ease: "none",
        force3D: true,
      });
    }

    // Enhanced Floating Shapes - Optimized, disabled on mobile for performance
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      document.querySelectorAll(".floating-shape").forEach((shape, index) => {
        window.gsap.set(shape, { willChange: "transform" });
        window.gsap.to(shape, {
          scrollTrigger: {
            trigger: "#home",
            start: "top top",
            end: "bottom top",
            scrub: 2.5,
            invalidateOnRefresh: true,
          },
          y: (index + 1) * 40,
          x: (index % 2 === 0 ? 1 : -1) * 25,
          rotation: (index + 1) * 8,
          ease: "none",
          force3D: true,
        });
      });
    }

    // Enhanced Count-up Stats
    document.querySelectorAll("[data-count]").forEach((el) => {
      const end = Number(el.getAttribute("data-count") || "0");
      const obj = { val: 0 };

      window.gsap.to(obj, {
        val: end,
        duration: 2,
        ease: "power2.out",
        snap: { val: 1 },
        onUpdate: () => {
          el.textContent = String(Math.round(obj.val));
        },
        scrollTrigger: {
          trigger: el.closest("section"),
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    });
  }

  // Smooth Scroll for Anchor Links - Optimized native smooth scroll
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#" || href === "#home") {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          return;
        }

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = 80;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  }

  // Property Search Functionality
  function initPropertySearch() {
    // Find search button by text content or class
    const buttons = document.querySelectorAll('button');
    const searchButton = Array.from(buttons).find(btn => 
      btn.textContent.trim().toLowerCase().includes('search')
    );
    
    if (searchButton) {
      searchButton.addEventListener("click", function(e) {
        e.preventDefault();
        // Scroll to properties section
        const propertiesSection = document.getElementById('properties');
        if (propertiesSection) {
          const offset = 80;
          const targetPosition = propertiesSection.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    }

    // Add smooth scroll to Browse Properties button
    const browseButton = Array.from(buttons).find(btn => 
      btn.textContent.trim().toLowerCase().includes('browse properties')
    );
    
    if (browseButton) {
      browseButton.addEventListener("click", function(e) {
        e.preventDefault();
        const propertiesSection = document.getElementById('properties');
        if (propertiesSection) {
          const offset = 80;
          const targetPosition = propertiesSection.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    }
  }

  // Verify Images Load - Clean and simple
  function verifyImages() {
    // Force all images to be visible immediately
    const allImages = document.querySelectorAll('img[src*="images/"]');
    allImages.forEach((img) => {
      // Remove any inline styles that might hide images
      img.style.removeProperty('opacity');
      img.style.removeProperty('visibility');
      img.style.removeProperty('display');
      
      // Set visibility using CSS classes only
      img.classList.add('force-visible');
      
      // Image load handlers
      img.onload = function() {
        this.classList.add('force-visible');
      };
      
      img.onerror = function() {
        console.warn('Image failed to load:', this.src);
      };
    });
  }

  // Initialize Everything
  function initializeApp() {
    // Apply branding first
    applyBrand();
    
    // CRITICAL: Verify images FIRST before anything else
    verifyImages();
    
    // Force image visibility immediately
    document.querySelectorAll('.property-card img, .agent-card img, #portfolio img').forEach(img => {
      img.style.setProperty('opacity', '1', 'important');
      img.style.setProperty('visibility', 'visible', 'important');
      img.style.setProperty('display', 'block', 'important');
    });
    
    // Initialize core functionality
    initMobileMenu();
    initNavbarScroll();
    initSmoothScroll();
    initPropertySearch();

    // Remove loading class
    document.body.classList.remove("loading");

    // Initialize animations with error handling
    try {
      // Wait a bit for GSAP to be fully loaded
      if (typeof window.gsap !== "undefined") {
        initAnimations();
        
        // After animations initialize, ensure images stay visible
        setTimeout(() => {
          document.querySelectorAll('.property-card img, .agent-card img, #portfolio img').forEach(img => {
            img.style.setProperty('opacity', '1', 'important');
            img.style.setProperty('visibility', 'visible', 'important');
          });
        }, 100);
      } else {
        console.warn("GSAP not loaded, using fallback animations");
        showFallback();
      }
    } catch (error) {
      console.error("Animation error:", error);
      showFallback();
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", function() {
      // Small delay to ensure GSAP is loaded
      setTimeout(initializeApp, 100);
    });
  } else {
    // DOM is already ready
    setTimeout(initializeApp, 100);
  }

  // Handle Page Visibility
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      // Pause animations if needed
    } else {
      // Resume animations if needed
    }
  });

  // Handle Window Resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Recalculate any size-dependent animations if needed
      if (hasScrollTrigger && window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    }, 250);
  });
})();
