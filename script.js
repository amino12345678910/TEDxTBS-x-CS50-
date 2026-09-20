// ================= NAVBAR DYNAMICS =================
const navWrapper = document.querySelector(".navbar-wrapper");
const nav = document.getElementById("mainNav");

function handleNavScroll() {
  const isScrolled = window.scrollY > 30;
  if (navWrapper) navWrapper.classList.toggle("scrolled", isScrolled);
  if (nav) nav.classList.toggle("scrolled", isScrolled);
}

window.addEventListener("scroll", handleNavScroll, { passive: true });
handleNavScroll();

// Close the mobile Bootstrap menu after clicking a navigation link
document.querySelectorAll("#navMenu .nav-link, #navMenu .register-nav-modern, #navMenu .register-nav").forEach(link => {
  link.addEventListener("click", () => {
    const menu = document.getElementById("navMenu");
    if (menu && menu.classList.contains("show")) {
      bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }
  });
});

// ================= ACTIVE NAV LINK =================
const sections = document.querySelectorAll("section[id], header[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "home";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 140;
    if (window.scrollY >= sectionTop) current = section.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}, { passive: true });

// ================= HERO VIDEO AUTOPLAY =================
const heroVideo = document.getElementById("heroVideo");

if (heroVideo) {
  // Ensure video autoplays safely
  const startAutoplay = () => {
    heroVideo.play().catch(() => {
      // If browser prevents autoplay until first interaction
      document.addEventListener("click", () => heroVideo.play(), { once: true });
      document.addEventListener("touchstart", () => heroVideo.play(), { once: true });
    });
  };
  startAutoplay();
}

// ================= COUNTDOWN & HERO METRICS =================
// Official Event Date: December 12, 2026
const eventDate = new Date("December 12, 2026 09:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = eventDate - now;

  const heroLiveDaysEl = document.getElementById("heroLiveDays");
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (distance <= 0) {
    if (daysEl) daysEl.textContent = "00";
    if (hoursEl) hoursEl.textContent = "00";
    if (minutesEl) minutesEl.textContent = "00";
    if (secondsEl) secondsEl.textContent = "00";
    if (heroLiveDaysEl) heroLiveDaysEl.textContent = "LIVE";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
  if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
  if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
  if (heroLiveDaysEl) heroLiveDaysEl.textContent = String(days);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ================= BENTO & CARDS SPOTLIGHT INTERACTION =================
// Dynamic cursor-following radiant crimson spotlight
document.querySelectorAll(".bento-card, .board-3d-card, .speakers-monolith-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  });
});

// ================= $15K 3D EXECUTIVE PODIUM CONTROLLER =================
const cylinder = document.getElementById("carouselCylinder");
const stageCards = document.querySelectorAll(".board-3d-card");
const dialTabs = document.querySelectorAll(".dial-role-tab");
const dialSlider = document.getElementById("dialSlider");
const prevBtn = document.getElementById("stagePrevBtn");
const nextBtn = document.getElementById("stageNextBtn");
const stageViewport = document.getElementById("carouselViewport");

if (cylinder && stageCards.length > 0) {
  const totalCards = stageCards.length;
  const stepAngle = 360 / totalCards; // 72 deg
  let currentStep = 0;
  let isThrottled = false;

  function updateSliderPosition(activeTab) {
    if (!dialSlider || !activeTab) return;
    dialSlider.style.left = `${activeTab.offsetLeft}px`;
    dialSlider.style.width = `${activeTab.offsetWidth}px`;

    // Auto scroll tab on mobile screens if needed
    const rail = document.getElementById("dialRail");
    if (rail && rail.scrollWidth > rail.clientWidth) {
      const scrollTarget = activeTab.offsetLeft - (rail.clientWidth / 2) + (activeTab.offsetWidth / 2);
      rail.scrollTo({ left: scrollTarget, behavior: "smooth" });
    }
  }

  function getActiveIndex() {
    return ((currentStep % totalCards) + totalCards) % totalCards;
  }

  function rotateStage() {
    const rotationAngle = -currentStep * stepAngle;
    cylinder.style.transform = `rotateY(${rotationAngle}deg)`;

    const activeIndex = getActiveIndex();

    // Update active classes on cards
    stageCards.forEach((card, index) => {
      const isActive = index === activeIndex;
      card.classList.toggle("active", isActive);
      // Reset any manual tilt on inactive cards
      if (!isActive) {
        card.style.transform = "";
      }
    });

    // Update role tabs
    dialTabs.forEach((tab, index) => {
      const isActive = index === activeIndex;
      tab.classList.toggle("active", isActive);
      if (isActive) {
        updateSliderPosition(tab);
      }
    });
  }

  function nextMember() {
    currentStep++;
    rotateStage();
  }

  function prevMember() {
    currentStep--;
    rotateStage();
  }

  function goToIndex(targetIndex) {
    const activeIndex = getActiveIndex();
    let diff = (targetIndex - activeIndex) % totalCards;
    if (diff > totalCards / 2) diff -= totalCards;
    if (diff < -totalCards / 2) diff += totalCards;

    currentStep += diff;
    rotateStage();
  }

  // Navigation Arrow clicks
  if (prevBtn) prevBtn.addEventListener("click", prevMember);
  if (nextBtn) nextBtn.addEventListener("click", nextMember);

  // Dial Tabs clicks
  dialTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => goToIndex(index));
  });

  // Clicking flanking cards rotates them to center
  stageCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      if (!card.classList.contains("active")) {
        goToIndex(index);
      }
    });
  });

  // Keyboard navigation when hovering or focusing stage
  window.addEventListener("keydown", (e) => {
    const stageRect = stageViewport ? stageViewport.getBoundingClientRect() : null;
    if (!stageRect) return;
    const isVisible = stageRect.top < window.innerHeight && stageRect.bottom > 0;
    if (!isVisible) return;

    if (e.key === "ArrowLeft") {
      prevMember();
    } else if (e.key === "ArrowRight") {
      nextMember();
    }
  });

  // Mouse wheel rotation over viewport
  if (stageViewport) {
    stageViewport.addEventListener("wheel", (e) => {
      // If user is scrolling over the 3D stage, smooth-cycle members
      if (Math.abs(e.deltaY) > 20 || Math.abs(e.deltaX) > 20) {
        if (isThrottled) return;
        isThrottled = true;

        if (e.deltaY > 0 || e.deltaX > 0) {
          nextMember();
        } else {
          prevMember();
        }

        setTimeout(() => {
          isThrottled = false;
        }, 550);
      }
    }, { passive: true });

    // Touch swipe / Mouse drag gestures
    let startX = 0;
    let isDragging = false;

    stageViewport.addEventListener("pointerdown", (e) => {
      startX = e.clientX;
      isDragging = true;
    });

    stageViewport.addEventListener("pointerup", (e) => {
      if (!isDragging) return;
      isDragging = false;
      const deltaX = e.clientX - startX;
      if (Math.abs(deltaX) > 40) {
        if (deltaX < 0) {
          nextMember();
        } else {
          prevMember();
        }
      }
    });

    stageViewport.addEventListener("pointercancel", () => {
      isDragging = false;
    });
  }

  // Active card 3D holographic tilt parallax on mouse move
  stageCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      if (!card.classList.contains("active")) return;
      const rect = card.getBoundingClientRect();
      const xNorm = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const yNorm = (e.clientY - rect.top) / rect.height - 0.5;
      const cardAngle = card.style.getPropertyValue("--card-angle") || "0deg";
      const tiltX = -yNorm * 12; // deg
      const tiltY = xNorm * 14; // deg

      card.style.transform = `rotateY(${cardAngle}) translateZ(var(--card-radius, 380px)) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      if (card.classList.contains("active")) {
        card.style.transform = "";
      }
    });
  });

  // Initial stage alignment & slider position
  window.addEventListener("load", () => {
    rotateStage();
  });
  setTimeout(rotateStage, 150);

  window.addEventListener("resize", () => {
    const activeTab = dialTabs[getActiveIndex()];
    if (activeTab) updateSliderPosition(activeTab);
  });
}

// ================= NOTIFY BUTTON =================
const notifyBtn = document.getElementById("notifyBtn");
const notifyMessage = document.getElementById("notifyMessage");

if (notifyBtn && notifyMessage) {
  notifyBtn.addEventListener("click", () => {
    notifyMessage.textContent = "Thanks! Registration notifications will be available soon.";
    notifyBtn.textContent = "YOU'RE ON THE LIST ✓";
    notifyBtn.disabled = true;
  });
}
