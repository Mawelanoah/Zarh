const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#main-nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuToggle.textContent = isOpen ? "×" : "☰";
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      menuToggle.textContent = "☰";
    });
  });
}

const whatsappNumber = "27744319112";
document.querySelectorAll(".book-service").forEach(button => {
  button.addEventListener("click", () => {
    const service = button.dataset.service || "a treatment";
    const message = `Hello Zarh Wellness Lounge, I would like to enquire about your ${service}. Please let me know the available booking times.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  });
});
