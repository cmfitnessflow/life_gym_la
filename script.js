const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const navLinks = document.querySelectorAll(".nav-menu a");
const revealItems = document.querySelectorAll(".reveal");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const faqItems = document.querySelectorAll(".faq-item");
const sections = document.querySelectorAll("main section[id]");

function setHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
}

function closeMenu() {
  navMenu.classList.remove("is-open");
  header.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
}

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  header.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

faqItems.forEach((item) => {
  const button = item.querySelector("button");
  const icon = button.querySelector("span:last-child");

  button.addEventListener("click", () => {
    const isOpen = item.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
    icon.textContent = isOpen ? "−" : "+";
  });
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  function updateParallax() {
    const scrollY = window.scrollY;
    parallaxItems.forEach((item) => {
      const speed = item.classList.contains("hero-media") ? 0.08 : 0.05;
      item.style.setProperty("--parallax-y", `${scrollY * speed}px`);
    });
  }

  updateParallax();
  window.addEventListener("scroll", updateParallax, { passive: true });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-40% 0px -54% 0px" }
);

sections.forEach((section) => navObserver.observe(section));
