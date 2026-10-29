/* ZeRo Graphics — site configuration and interactions.
   Update the values in SITE_CONFIG before publishing. */
const SITE_CONFIG = {
  whatsappNumber: "94XXXXXXXXX", // Replace with international number, digits only. Example format: 94771234567
  email: "hello@yourdomain.com",
  socials: {
    instagram: "https://instagram.com/yourusername",
    facebook: "https://facebook.com/yourpage",
    behance: "https://behance.net/yourusername"
  },
  stats: { projects: 0, clients: 0, years: 0 } // Replace with genuine numbers
};

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const loader = $(".page-loader");
  window.addEventListener("load", () => setTimeout(() => loader?.classList.add("loaded"), 450));
  setTimeout(() => loader?.classList.add("loaded"), 1800);

  // Icons: gracefully continue if the icon CDN is unavailable.
  if (window.lucide) window.lucide.createIcons();

  // Current year and contact destinations.
  $("#year").textContent = new Date().getFullYear();
  const validWhatsApp = /^\d{8,15}$/.test(SITE_CONFIG.whatsappNumber) && !SITE_CONFIG.whatsappNumber.includes("X");
  const makeWhatsAppUrl = message => `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  $$(".whatsapp-link").forEach(link => {
    const message = link.dataset.message || "Hi ZeRo Graphics! I'm interested in your graphic design services. Can you share more details?";
    link.href = validWhatsApp ? makeWhatsAppUrl(message) : "#contact";
    link.target = validWhatsApp ? "_blank" : "_self";
    link.rel = validWhatsApp ? "noopener noreferrer" : "";
    link.addEventListener("click", event => {
      if (!validWhatsApp) {
        event.preventDefault();
        $("#formFeedback") && ($("#formFeedback").textContent = "Please add your WhatsApp number in script.js before using WhatsApp links.");
        if (link.classList.contains("floating-whatsapp")) {
          $("#contact").scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });
  $$(".email-link").forEach(link => {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(SITE_CONFIG.email) && !SITE_CONFIG.email.includes("yourdomain");
    link.href = validEmail ? `mailto:${SITE_CONFIG.email}` : "#contact";
    link.addEventListener("click", event => {
      if (!validEmail) {
        event.preventDefault();
        $("#formFeedback").textContent = "Replace the email placeholder in script.js before publishing.";
      }
    });
  });
  $$(".social-link").forEach(link => {
    const url = SITE_CONFIG.socials[link.dataset.social];
    const valid = url && !url.includes("yourusername") && !url.includes("yourpage");
    link.href = valid ? url : "#contact";
    link.target = valid ? "_blank" : "_self";
    link.rel = valid ? "noopener noreferrer" : "";
    link.addEventListener("click", event => {
      if (!valid) {
        event.preventDefault();
        $("#formFeedback").textContent = `Add your ${link.dataset.social} URL in script.js before publishing.`;
      }
    });
  });

  // Sticky navigation + active section marker.
  const header = $(".site-header");
  const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
  const sections = $$("main section[id]");
  const navLinks = $$(".nav-link");
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    }), { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Mobile menu with accessible state and Escape support.
  const menuToggle = $(".menu-toggle"), nav = $(".nav-links");
  function closeMenu() {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
  }
  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    nav.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
  });
  $$(".nav-links a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => { if (event.key === "Escape") { closeMenu(); closeLightbox(); } });

  // Reveal-on-scroll. Reduced-motion users see content immediately.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) revealItems.forEach(item => item.classList.add("in-view"));
  else {
    const revealObserver = new IntersectionObserver((entries, observer) => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("in-view"); observer.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach(item => revealObserver.observe(item));
  }

  // Editable stats; zero values are intentional placeholders, not claimed achievements.
  const statEls = $$(".stats strong");
  const statValues = [SITE_CONFIG.stats.projects, SITE_CONFIG.stats.clients, SITE_CONFIG.stats.years];
  statEls.forEach((el, i) => { el.dataset.target = String(Math.max(0, Number(statValues[i]) || 0)); el.textContent = String(Math.max(0, Number(statValues[i]) || 0)).padStart(2, "0"); });
  if (!reduceMotion && "IntersectionObserver" in window) {
    const statObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target, target = Number(el.dataset.target);
        const start = performance.now(), duration = 900;
        function tick(now) {
          const progress = Math.min(1, (now - start) / duration);
          el.textContent = String(Math.round(target * (1 - Math.pow(1 - progress, 3)))).padStart(2, "0");
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick); statObserver.unobserve(el);
      }
    }), { threshold: .7 });
    statEls.forEach(el => statObserver.observe(el));
  }

  // Portfolio filters.
  const filterButtons = $$(".filter-btn"), projectCards = $$(".project-card");
  filterButtons.forEach(button => button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle("active", item === button));
    projectCards.forEach((card, index) => {
      const show = filter === "all" || card.dataset.category === filter;
      if (show) {
        card.classList.remove("hidden");
        if (!reduceMotion) { card.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 280, delay: index * 20, easing: "ease-out" }); }
      } else card.classList.add("hidden");
    });
  }));

  // Accessible portfolio lightbox, keyboard close, and previous/next navigation.
  const lightbox = $("#lightbox"), lbImage = $("#lightboxImage"), lbTitle = $("#lightboxTitle"), lbCategory = $("#lightboxCategory");
  let activeProject = 0, previouslyFocused = null;
  const visibleProjects = () => projectCards.filter(card => !card.classList.contains("hidden"));
  function showProject(card) {
    activeProject = projectCards.indexOf(card);
    lbImage.src = card.dataset.image;
    lbImage.alt = `${card.dataset.title} — ${card.dataset.categoryLabel} demo preview`;
    lbTitle.textContent = card.dataset.title;
    lbCategory.textContent = card.dataset.categoryLabel.toUpperCase();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $(".lightbox-close").focus();
  }
  function closeLightbox() {
    if (!lightbox.classList.contains("open")) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lbImage.src = "";
    previouslyFocused?.focus();
  }
  function stepProject(direction) {
    const visible = visibleProjects();
    if (!visible.length) return;
    const current = visible.indexOf(projectCards[activeProject]);
    const next = (current + direction + visible.length) % visible.length;
    showProject(visible[next]);
  }
  $$(".project-open").forEach((button, index) => button.addEventListener("click", () => { previouslyFocused = button; showProject(projectCards[index]); }));
  $(".lightbox-close").addEventListener("click", closeLightbox);
  $(".lightbox-prev").addEventListener("click", () => stepProject(-1));
  $(".lightbox-next").addEventListener("click", () => stepProject(1));
  lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("open")) return;
    if (event.key === "ArrowLeft") stepProject(-1);
    if (event.key === "ArrowRight") stepProject(1);
    if (event.key === "Tab") {
      const focusables = $$(".lightbox button");
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  // Demo testimonials: replace these with real client feedback and permission.
  const testimonials = [
    { quote: "“The right design can make a good idea feel impossible to ignore.”", name: "Your future client", role: "Client testimonial placeholder" },
    { quote: "“A thoughtful visual identity gives every part of a brand a clearer voice.”", name: "Add a client name", role: "Replace with real client role" },
    { quote: "“Great creative work starts with listening, then making every detail count.”", name: "Add a client name", role: "Replace with genuine feedback" }
  ];
  let quoteIndex = 0;
  function renderQuote() {
    const item = testimonials[quoteIndex];
    $("#quoteText").textContent = item.quote;
    $("#quoteName").textContent = item.name;
    $("#quoteRole").textContent = item.role;
    $("#quoteCount").innerHTML = `${String(quoteIndex + 1).padStart(2, "0")} <i>/</i> ${String(testimonials.length).padStart(2, "0")}`;
  }
  $("#prevQuote").addEventListener("click", () => { quoteIndex = (quoteIndex - 1 + testimonials.length) % testimonials.length; renderQuote(); });
  $("#nextQuote").addEventListener("click", () => { quoteIndex = (quoteIndex + 1) % testimonials.length; renderQuote(); });

  // Inquiry form validation: builds a message, then opens WhatsApp only when configured.
  const form = $("#inquiryForm");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const name = $("#name").value.trim(), service = $("#service").value, budget = $("#budget").value, details = $("#details").value.trim();
    $("#nameError").textContent = name.length < 2 ? "Please enter your name (at least 2 characters)." : "";
    $("#serviceError").textContent = !service ? "Please choose a service." : "";
    $("#detailsError").textContent = details.length < 10 ? "Please add at least 10 characters about your project." : "";
    const valid = name.length >= 2 && Boolean(service) && details.length >= 10;
    const feedback = $("#formFeedback");
    if (!valid) { feedback.textContent = "Please check the highlighted fields and try again."; return; }
    const message = `Hi ZeRo Graphics! I'd like to discuss a project.\nName: ${name}\nService: ${service}\nBudget: ${budget || "Not specified"}\nProject details: ${details}`;
    if (validWhatsApp) {
      feedback.textContent = "Your inquiry is ready. Opening WhatsApp in a new tab…";
      window.open(makeWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    } else {
      feedback.textContent = "Validation successful. To send this inquiry, add your WhatsApp number in script.js. A live website form also needs a backend or form service.";
      const mailto = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(`ZeRo Graphics inquiry — ${service}`)}&body=${encodeURIComponent(message)}`;
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(SITE_CONFIG.email) && !SITE_CONFIG.email.includes("yourdomain");
      if (validEmail) feedback.innerHTML = `Validation successful. <a href="${mailto}" style="color:var(--lime);text-decoration:underline">Send by email instead</a>.`;
    }
  });

  // Small pointer response on primary buttons (desktop only, skipped for reduced motion).
  if (!reduceMotion && matchMedia("(pointer:fine)").matches) {
    $$(".magnetic").forEach(button => {
      button.addEventListener("pointermove", event => {
        const rect = button.getBoundingClientRect(), x = event.clientX - rect.left - rect.width / 2, y = event.clientY - rect.top - rect.height / 2;
        button.style.transform = `translate(${x * .07}px, ${y * .1}px)`;
      });
      button.addEventListener("pointerleave", () => { button.style.transform = ""; });
    });
  }
});