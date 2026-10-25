/* Zarh Wellness Lounge — interactions */

(function () {
  "use strict";

  // Year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  // Treatment tabs
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".tab-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      tabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      panels.forEach((panel) => {
        if (panel.id === "panel-" + target) {
          panel.hidden = false;
          panel.classList.add("active");
        } else {
          panel.hidden = true;
          panel.classList.remove("active");
        }
      });
    });
  });

  // WhatsApp booking buttons
  const WA_NUMBER = "27744319112";

  document.querySelectorAll(".book-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const service = btn.dataset.service || "a treatment";
      const price = btn.dataset.price || "";
      const priceText = price ? ` (${price})` : "";
      const message = `Hello Zarh Wellness Lounge, I would like to enquire about your ${service}${priceText}. Please let me know the available appointment times.`;
      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  });

  // Gallery lightbox
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.querySelector(".lightbox-close");

  if (lightbox && lightboxImg) {
    document.querySelectorAll(".gallery-item").forEach((item) => {
      item.addEventListener("click", () => {
        const src = item.dataset.src;
        const alt = item.dataset.alt || "";
        if (src) {
          lightboxImg.src = src;
          lightboxImg.alt = alt;
          lightbox.hidden = false;
          document.body.style.overflow = "hidden";
        }
      });
    });

    function closeLightbox() {
      lightbox.hidden = true;
      lightboxImg.src = "";
      document.body.style.overflow = "";
    }

    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }
})();
