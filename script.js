/* Zarh Wellness Lounge — interactions + Booking Assistant */

(function () {
  "use strict";

  const WA = "27744319112";

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    mainNav.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  const navLinks = document.querySelectorAll("[data-nav]");
  const sections = ["home", "treatments", "combos", "about", "gallery", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    let current = "";
    sections.forEach((sec) => {
      if (sec.offsetTop <= scrollY) current = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      document.querySelectorAll(".tab").forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      document.querySelectorAll(".tab-panel").forEach((panel) => {
        const match = panel.id === "panel-" + target;
        panel.hidden = !match;
        panel.classList.toggle("active", match);
      });
    });
  });

  document.querySelectorAll(".book-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      openAssistant({
        service: btn.dataset.service || "",
        duration: btn.dataset.duration || "",
        price: btn.dataset.price || "",
      });
    });
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  if (lightbox && lightboxImg) {
    document.querySelectorAll(".gallery-item").forEach((item) => {
      item.addEventListener("click", () => {
        lightboxImg.src = item.dataset.src || "";
        lightboxImg.alt = item.dataset.alt || "";
        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
      });
    });
    function closeLightbox() {
      lightbox.hidden = true;
      lightboxImg.src = "";
      document.body.style.overflow = "";
    }
    document.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

  const backTop = document.getElementById("backTop");
  if (backTop) {
    window.addEventListener("scroll", () => {
      backTop.classList.toggle("visible", window.scrollY > 500);
    }, { passive: true });
    backTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const TREATMENTS = {
    massage: [
      { name: "Back & Neck Massage", duration: "45 minutes", price: "R160" },
      { name: "Full Body Swedish Massage", duration: "1 hour", price: "R250" },
      { name: "Full Body Swedish Massage", duration: "1 hour 30 minutes", price: "R300" },
      { name: "Full Body Deep Tissue Massage", duration: "1 hour", price: "R350" },
      { name: "Full Body Deep Tissue Massage", duration: "1 hour 30 minutes", price: "R450" },
      { name: "Foot Massage", duration: "30 minutes", price: "R120" },
    ],
    facial: [
      { name: "Facial Treatment", duration: "", price: "R200" },
      { name: "Skin Analysis", duration: "", price: "R100" },
    ],
    combo: [
      { name: "Combo: Back & Neck Massage + Facial", duration: "45 min massage + facial", price: "R300" },
      { name: "Combo: Full Body Swedish Massage + Facial", duration: "1 hour massage + facial", price: "R400" },
    ],
  };

  const assistant = document.getElementById("assistant");
  const assistantBody = document.getElementById("assistantBody");
  const assistantFooter = document.getElementById("assistantFooter");
  const progressBar = document.getElementById("progressBar");

  let state = { step: 0, category: null, service: null, duration: null, price: null, date: "", time: "", name: "" };
  const TOTAL_STEPS = 5;

  function openAssistant(prefill) {
    state = {
      step: prefill && prefill.service ? 2 : 0,
      category: null,
      service: prefill?.service || null,
      duration: prefill?.duration || null,
      price: prefill?.price || null,
      date: "",
      time: "",
      name: "",
    };
    if (prefill?.service) {
      if (prefill.service.toLowerCase().includes("combo")) state.category = "combo";
      else if (prefill.service.toLowerCase().includes("facial") || prefill.service.toLowerCase().includes("skin")) state.category = "facial";
      else state.category = "massage";
    }
    assistant.hidden = false;
    document.body.style.overflow = "hidden";
    renderStep();
  }

  function closeAssistant() {
    assistant.hidden = true;
    document.body.style.overflow = "";
  }

  ["openAssistantHeader", "openAssistantHero", "openAssistantAbout", "openAssistantContact", "openAssistantCard", "openAssistantFloat"]
    .forEach((id) => {
      document.getElementById(id)?.addEventListener("click", () => openAssistant());
    });

  document.getElementById("assistantClose")?.addEventListener("click", closeAssistant);
  document.getElementById("assistantBackdrop")?.addEventListener("click", closeAssistant);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !assistant.hidden) closeAssistant();
  });

  function setProgress() {
    if (progressBar) progressBar.style.width = (((state.step + 1) / TOTAL_STEPS) * 100) + "%";
  }

  function renderStep() {
    setProgress();
    assistantBody.innerHTML = "";
    assistantFooter.innerHTML = "";
    if (state.step === 0) renderCategory();
    else if (state.step === 1) renderTreatment();
    else if (state.step === 2) renderDateTime();
    else if (state.step === 3) renderName();
    else if (state.step === 4) renderSummary();
  }

  function renderCategory() {
    assistantBody.innerHTML = '<h3 class="step-title">What are you looking for?</h3><p class="step-desc">Choose a category to see available treatments and prices.</p><div class="option-list"><button type="button" class="option-btn" data-cat="massage"><span>Massage Treatments<span class="opt-meta">Back & neck, Swedish, deep tissue, foot</span></span></button><button type="button" class="option-btn" data-cat="facial"><span>Facial Treatments<span class="opt-meta">Facial + free skin analysis option</span></span></button><button type="button" class="option-btn" data-cat="combo"><span>Combo Deals<span class="opt-meta">Massage + facial packages</span></span></button></div>';
    assistantBody.querySelectorAll("[data-cat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.category = btn.dataset.cat;
        state.service = null; state.duration = null; state.price = null;
        state.step = 1;
        renderStep();
      });
    });
    assistantFooter.innerHTML = '<button type="button" class="btn btn-ghost" id="assistCancel">Cancel</button>';
    document.getElementById("assistCancel")?.addEventListener("click", closeAssistant);
  }

  function renderTreatment() {
    const list = TREATMENTS[state.category] || [];
    const title = state.category === "massage" ? "Choose a massage" : state.category === "facial" ? "Choose a facial treatment" : "Choose a combo package";
    let html = '<h3 class="step-title">' + title + '</h3><p class="step-desc">Select the treatment you would like to enquire about.</p><div class="option-list">';
    list.forEach((t, i) => {
      const meta = t.duration ? '<span class="opt-meta">' + t.duration + '</span>' : '';
      html += '<button type="button" class="option-btn" data-idx="' + i + '"><span>' + t.name + meta + '</span><span class="opt-price">' + t.price + '</span></button>';
    });
    html += '</div>';
    if (state.category === "facial") html += '<p class="step-desc" style="margin-top:16px"><strong>Note:</strong> Skin Analysis is free when booked with a Facial Treatment.</p>';
    assistantBody.innerHTML = html;
    assistantBody.querySelectorAll("[data-idx]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const t = list[Number(btn.dataset.idx)];
        state.service = t.name; state.duration = t.duration; state.price = t.price;
        state.step = 2;
        renderStep();
      });
    });
    assistantFooter.innerHTML = '<button type="button" class="btn btn-ghost" id="assistBack">Back</button>';
    document.getElementById("assistBack")?.addEventListener("click", () => { state.step = 0; renderStep(); });
  }

  function renderDateTime() {
    const today = new Date().toISOString().split("T")[0];
    assistantBody.innerHTML = '<h3 class="step-title">Preferred date & time</h3><p class="step-desc">Tell us when you would like to visit. This is a preference only — we will confirm availability.</p><div class="field-group"><label for="prefDate">Preferred date</label><input type="date" id="prefDate" min="' + today + '" value="' + state.date + '"></div><div class="field-group"><label for="prefTime">Preferred time</label><select id="prefTime"><option value="">Select a time</option><option value="Morning (before 12:00)">Morning (before 12:00)</option><option value="Afternoon (12:00 – 16:00)">Afternoon (12:00 – 16:00)</option><option value="Late afternoon (after 16:00)">Late afternoon (after 16:00)</option><option value="Flexible / any time">Flexible / any time</option></select></div><p class="field-hint">You can leave these blank if you are flexible.</p>';
    const timeInput = document.getElementById("prefTime");
    if (state.time) timeInput.value = state.time;
    assistantFooter.innerHTML = '<button type="button" class="btn btn-ghost" id="assistBack">Back</button><button type="button" class="btn btn-primary" id="assistNext">Continue</button>';
    document.getElementById("assistBack")?.addEventListener("click", () => { state.step = 1; renderStep(); });
    document.getElementById("assistNext")?.addEventListener("click", () => {
      state.date = document.getElementById("prefDate")?.value || "";
      state.time = document.getElementById("prefTime")?.value || "";
      state.step = 3;
      renderStep();
    });
  }

  function renderName() {
    assistantBody.innerHTML = '<h3 class="step-title">Your name (optional)</h3><p class="step-desc">Adding your name helps us reply more personally. You can skip this step.</p><div class="field-group"><label for="custName">Name</label><input type="text" id="custName" placeholder="Your name" maxlength="60" value="' + (state.name || '') + '" autocomplete="name"></div>';
    assistantFooter.innerHTML = '<button type="button" class="btn btn-ghost" id="assistBack">Back</button><button type="button" class="btn btn-primary" id="assistNext">Review booking</button>';
    document.getElementById("assistBack")?.addEventListener("click", () => { state.step = 2; renderStep(); });
    document.getElementById("assistNext")?.addEventListener("click", () => {
      state.name = (document.getElementById("custName")?.value || "").trim();
      state.step = 4;
      renderStep();
    });
  }

  function renderSummary() {
    const dateDisplay = state.date ? new Date(state.date + "T12:00:00").toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "Not specified";
    const timeDisplay = state.time || "Not specified";
    const nameDisplay = state.name || "Not provided";
    const durationRow = state.duration ? '<div class="summary-row"><span>Duration</span><span>' + escapeHtml(state.duration) + '</span></div>' : '';
    assistantBody.innerHTML = '<h3 class="step-title">Review your enquiry</h3><p class="step-desc">Check the details below, then send to WhatsApp. We will confirm availability with you.</p><div class="summary-card"><h3>Booking summary</h3><div class="summary-row"><span>Treatment</span><span>' + escapeHtml(state.service) + '</span></div>' + durationRow + '<div class="summary-row"><span>Price</span><strong>' + escapeHtml(state.price) + '</strong></div><div class="summary-row"><span>Preferred date</span><span>' + escapeHtml(dateDisplay) + '</span></div><div class="summary-row"><span>Preferred time</span><span>' + escapeHtml(timeDisplay) + '</span></div><div class="summary-row"><span>Name</span><span>' + escapeHtml(nameDisplay) + '</span></div></div><div class="notice">This sends a booking enquiry only. Your appointment is confirmed only when Zarh Wellness Lounge replies on WhatsApp.</div>';
    assistantFooter.innerHTML = '<button type="button" class="btn btn-ghost" id="assistBack">Edit</button><button type="button" class="btn btn-primary" id="assistSend">Send on WhatsApp</button>';
    document.getElementById("assistBack")?.addEventListener("click", () => { state.step = 3; renderStep(); });
    document.getElementById("assistSend")?.addEventListener("click", sendToWhatsApp);
  }

  function sendToWhatsApp() {
    const lines = ["Hello Zarh Wellness Lounge! I would like to enquire about booking.", ""];
    if (state.name) lines.push("Name: " + state.name);
    lines.push("Treatment: " + state.service);
    if (state.duration) lines.push("Duration: " + state.duration);
    lines.push("Price: " + state.price);
    if (state.date) {
      const d = new Date(state.date + "T12:00:00").toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      lines.push("Preferred date: " + d);
    } else {
      lines.push("Preferred date: Flexible");
    }
    lines.push("Preferred time: " + (state.time || "Flexible"));
    lines.push("");
    lines.push("Please let me know if this appointment is available. Thank you.");
    const url = "https://wa.me/" + WA + "?text=" + encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener,noreferrer");
    closeAssistant();
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }
})();
