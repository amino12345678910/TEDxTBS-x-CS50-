// ================= NAVBAR =================
const nav = document.getElementById("mainNav");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
});

// Close the mobile Bootstrap menu after clicking a navigation link.
document.querySelectorAll("#navMenu .nav-link, #navMenu .register-nav").forEach(link => {
  link.addEventListener("click", () => {
    const menu = document.getElementById("navMenu");
    if (menu.classList.contains("show")) {
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
    const sectionTop = section.offsetTop - 130;
    if (window.scrollY >= sectionTop) current = section.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
});

// ================= COUNTDOWN =================
// Replace this date with your real event date.
const eventDate = new Date("October 12, 2026 09:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = eventDate - now;

  if (distance <= 0) {
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ================= NOTIFY BUTTON =================
const notifyBtn = document.getElementById("notifyBtn");
const notifyMessage = document.getElementById("notifyMessage");

notifyBtn.addEventListener("click", () => {
  notifyMessage.textContent = "Thanks! Registration notifications will be available soon.";
  notifyBtn.textContent = "YOU'RE ON THE LIST ✓";
  notifyBtn.disabled = true;
});
