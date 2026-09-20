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

// ================= BENTO & BOARD CARDS SPOTLIGHT INTERACTION =================
// Dynamic cursor-following radiant crimson spotlight
document.querySelectorAll(".bento-card, .board-member-card, .speaker-teaser-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  });
});

// ================= BOARD MEMBERS THEATRICAL SPOTLIGHT =================
const boardCards = document.querySelectorAll(".board-member-card");
const rolePills = document.querySelectorAll(".role-pill");
const spotlightBeam = document.getElementById("spotlightBeam");

function aimSpotlightAtCard(card, index) {
  if (!card || !spotlightBeam) return;

  // Update active states
  boardCards.forEach(c => c.classList.remove("active"));
  card.classList.add("active");

  rolePills.forEach(p => p.classList.remove("active"));
  if (rolePills[index]) rolePills[index].classList.add("active");

  // Calculate position relative to board section
  const section = document.querySelector(".board-members-section");
  if (section) {
    const cardRect = card.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    const cardCenter = cardRect.left + (cardRect.width / 2) - sectionRect.left;
    spotlightBeam.style.left = `${cardCenter}px`;
    spotlightBeam.style.opacity = "0.92";
  }
}

// Hover/click on board member cards
boardCards.forEach((card, index) => {
  card.addEventListener("mouseenter", () => aimSpotlightAtCard(card, index));
  card.addEventListener("click", () => aimSpotlightAtCard(card, index));
});

// Click on role pills
rolePills.forEach((pill, index) => {
  pill.addEventListener("click", () => {
    if (boardCards[index]) {
      aimSpotlightAtCard(boardCards[index], index);
      boardCards[index].scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
});

// Align initial spotlight
setTimeout(() => {
  if (boardCards[0]) aimSpotlightAtCard(boardCards[0], 0);
}, 300);

window.addEventListener("resize", () => {
  const activeCard = document.querySelector(".board-member-card.active") || boardCards[0];
  if (activeCard) {
    const index = parseInt(activeCard.getAttribute("data-index") || "0", 10);
    aimSpotlightAtCard(activeCard, index);
  }
});

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
