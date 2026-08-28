/* ============================================================
   Sumon Mia - Portfolio interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Portfolio data (fallback - overridden by content.json) ---------- */
  const projects = [
    { name: "Serve Flow Automation", domain: "serveflowautomation.com", url: "https://serveflowautomation.com/", cat: "business", featured: true,  desc: "Business and automation services website built for a professional service provider." },
    { name: "Quality Core Fence",    domain: "qualitycorefence.com",    url: "https://qualitycorefence.com/",    cat: "services", featured: true,  desc: "Company website for a fencing and outdoor services business." },
    { name: "Fan District",          domain: "fandistrict.dk",          url: "https://fandistrict.dk/da/",       cat: "ecommerce", featured: false, desc: "eCommerce store built around a fan community and merchandise." },
    { name: "Casa Neat Cleaners",    domain: "casaneatcleaners.com",    url: "https://casaneatcleaners.com/",    cat: "services", featured: false, desc: "Professional cleaning services website with a clean, trustworthy feel." },
    { name: "Cityscape Design LLC",  domain: "cityescapedesignllc.com", url: "https://cityescapedesignllc.com/", cat: "creative", featured: false, desc: "Design studio portfolio and services website." },
    { name: "Blue Ocean LLC",        domain: "blueoceanllc.com",        url: "https://blueoceanllc.com/",        cat: "business", featured: false, desc: "Corporate business website for an established company." },
    { name: "Katie Hawkins Artist",  domain: "katiehawkinsartist.co.uk",url: "https://katiehawkinsartist.co.uk/",cat: "creative", featured: false, desc: "Artist portfolio website showcasing work in a clean gallery layout." },
    { name: "Ascendia Academy",      domain: "ascendiaacademy.co.uk",   url: "https://ascendiaacademy.co.uk/",   cat: "education", featured: false, desc: "Education and academy website built to present courses and programmes." },
    { name: "Vey Lab",               domain: "vey-lab.com",             url: "https://vey-lab.com/",             cat: "niche", featured: false, desc: "Specialized lab and supplement website with a scientific feel." },
    { name: "MG Groep",              domain: "mggroep.org",             url: "https://www.mggroep.org/",         cat: "corporate", featured: false, desc: "Corporate group website for a multi-brand organisation." },
    { name: "Revive Compounds",      domain: "revivecompounds.com",     url: "https://revivecompounds.com/",     cat: "niche", featured: true,  desc: "Supplement and compounds eCommerce website with a premium finish." },
    { name: "David Miller Art",      domain: "davidmiller.art",         url: "https://davidmiller.art/",         cat: "creative", featured: false, desc: "Artist portfolio website presenting a body of creative work." },
    { name: "Access Proof",          domain: "accessproof.nl",          url: "https://www.accessproof.nl/",      cat: "services", featured: false, desc: "Specialized service provider website with clear messaging." },
    { name: "Johanna K",             domain: "johanna-k.com",           url: "https://johanna-k.com/",           cat: "creative", featured: false, desc: "Personal and creative portfolio website." },
    { name: "Med Growth Media",      domain: "medgrowthmedia.com",      url: "https://medgrowthmedia.com/",      cat: "niche", featured: false, desc: "Healthcare marketing and media website." },
    { name: "Caprium",               domain: "caprium.de",              url: "https://caprium.de/",              cat: "corporate", featured: false, desc: "Corporate website with a modern, business-focused design." },
    { name: "Vibrant Accountants",   domain: "vibrantaccountants.com",  url: "https://vibrantaccountants.com/",  cat: "services", featured: false, desc: "Accounting and professional services website." },
    { name: "Golden Age Serenity",   domain: "goldenageserenity.com",   url: "https://goldenageserenity.com/",   cat: "niche", featured: false, desc: "Senior care and healthcare services website." },
    { name: "Haydar",                domain: "haydar.ch",               url: "https://haydar.ch/",               cat: "creative", featured: false, desc: "Personal brand and portfolio website." },
    { name: "Hanna Berger",          domain: "hannaberger.com",         url: "https://hannaberger.com/",         cat: "creative", featured: false, desc: "Personal and creative portfolio website." },
    { name: "Wereld van Tuut",       domain: "wereldvantuut.nl",        url: "https://wereldvantuut.nl/",        cat: "creative", featured: false, desc: "Creative website for a Dutch brand and community." }
  ];

  const catLabels = {
    business: "Business", ecommerce: "eCommerce", services: "Services",
    corporate: "Corporate", creative: "Creative", education: "Education", niche: "Specialized"
  };

  const workGrid = document.getElementById("workGrid");

  function renderProjects(filter) {
    const list = projects.filter(function (p) {
      return filter === "all" || p.cat === filter;
    });

    workGrid.innerHTML = "";
    list.forEach(function (p, i) {
      const card = document.createElement("a");
      card.className = "work-card" + (p.featured ? " featured" : "");
      card.href = p.url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.style.animationDelay = (i * 0.05) + "s";
      card.setAttribute("data-cat", p.cat);

      card.innerHTML =
        '<div class="work-top">' +
          '<span class="work-cat">' + catLabels[p.cat] + "</span>" +
          '<span class="work-arrow">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg>' +
          "</span>" +
        "</div>" +
        '<h3 class="work-name">' + p.name + "</h3>" +
        '<p class="work-desc">' + p.desc + "</p>" +
        '<span class="work-domain">' + p.domain + "</span>";

      workGrid.appendChild(card);
    });
  }

  /* ---------- Portfolio filters ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      renderProjects(btn.dataset.filter);
    });
  });

  /* ---------- Typing effect ---------- */
  const roles = ["Web Developer", "WordPress Specialist", "Shopify Developer", "SEO Specialist"];
  const typingEl = document.getElementById("typingText");
  let roleIdx = 0, charIdx = 0, deleting = false;

  function typeLoop() {
    const current = roles[roleIdx];
    if (!deleting) {
      charIdx++;
      typingEl.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) { deleting = true; setTimeout(typeLoop, 1900); return; }
      setTimeout(typeLoop, 70);
    } else {
      charIdx--;
      typingEl.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(typeLoop, 350);
        return;
      }
      setTimeout(typeLoop, 38);
    }
  }
  if (typingEl) typeLoop();

  /* ---------- Custom cursor ---------- */
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (dot && ring && window.matchMedia("(hover: hover)").matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px"; dot.style.top = my + "px";
    });
    function animateRing() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = "a, button, .work-card, .service-card, .faq-q, .cap-item, input, select, textarea";
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest(hoverTargets)) ring.classList.add("is-hover");
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest(hoverTargets)) ring.classList.remove("is-hover");
    });
  }

  /* ---------- Nav scroll state + progress + back-to-top ---------- */
  const nav = document.getElementById("nav");
  const progress = document.getElementById("scrollProgress");
  const backTop = document.getElementById("backTop");

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 24);
    backTop.classList.toggle("is-visible", y > 600);

    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Mobile menu ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  function closeMenu() {
    navLinks.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  navToggle.addEventListener("click", function () {
    const open = navLinks.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  navLinks.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  /* Safety: auto-close the mobile menu when returning to desktop width
     (otherwise body scroll stays locked) and on Escape */
  const desktopMQ = window.matchMedia("(min-width: 769px)");
  function onDesktop(e) { if (e.matches) closeMenu(); }
  if (desktopMQ.addEventListener) desktopMQ.addEventListener("change", onDesktop);
  else if (desktopMQ.addListener) desktopMQ.addListener(onDesktop);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navLinks.classList.contains("is-open")) closeMenu();
  });

  /* ---------- Active nav link ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-links .nav-link");
  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
        });
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(function (s) { sectionObserver.observe(s); });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");
  const revealObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ---------- Counters ---------- */
  const counters = document.querySelectorAll("[data-counter]");
  const counterObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.counter, 10);
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(function (c) { counterObserver.observe(c); });

  /* ---------- Skill bars ---------- */
  const skillBars = document.querySelectorAll(".skill-bar span");
  const skillObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width;
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  skillBars.forEach(function (b) { skillObserver.observe(b); });

  /* ---------- FAQ accordion ---------- */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    q.addEventListener("click", function () {
      const isOpen = item.classList.contains("is-open");
      faqItems.forEach(function (other) {
        other.classList.remove("is-open");
        other.querySelector(".faq-a").style.maxHeight = null;
        other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("is-open");
        a.style.maxHeight = a.scrollHeight + "px";
        q.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Contact form (opens email client) ---------- */
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("fName").value.trim();
    const email = document.getElementById("fEmail").value.trim();
    const type = document.getElementById("fType").value;
    const msg = document.getElementById("fMsg").value.trim();

    if (!name || !email || !msg) {
      form.classList.add("shake");
      setTimeout(function () { form.classList.remove("shake"); }, 500);
      return;
    }

    const subject = encodeURIComponent("Project inquiry - " + type);
    const body = encodeURIComponent(
      "Hi Sumon,\n\n" +
      "My name: " + name + "\n" +
      "My email: " + email + "\n" +
      "Project type: " + type + "\n\n" +
      msg + "\n"
    );
    window.location.href = "mailto:ahmedsumonshahin645@gmail.com?subject=" + subject + "&body=" + body;
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Keep an open FAQ answer fully visible when the viewport is resized */
  window.addEventListener("resize", function () {
    const openAnswer = document.querySelector(".faq-item.is-open .faq-a");
    if (openAnswer) openAnswer.style.maxHeight = openAnswer.scrollHeight + "px";
  });

  /* ---------- Initial render ---------- */
  /* If content.json loaded via content.js, use its project list */
  function initRender() {
    if (window.__CONTENT__ && window.__CONTENT__.projects && window.__CONTENT__.projects.length) {
      /* Replace the static array with content.json data */
      projects.length = 0;
      window.__CONTENT__.projects.forEach(function (p) { projects.push(p); });
    }
    renderProjects("all");
  }

  /* content.js may load asynchronously; wait for it if needed */
  if (window.__CONTENT__ !== undefined) {
    initRender();
  } else {
    document.addEventListener("contentLoaded", initRender, { once: true });
    /* Safety: also render immediately so the page isn't blank if content.js fails */
    setTimeout(function () {
      if (!document.querySelector(".work-card")) initRender();
    }, 2000);
  }
})();

/* ==========================================================================
   Bug Squash - live mini game inside the build log section
   ========================================================================== */
(function () {
  "use strict";

  var root = document.getElementById("bugSquash");
  if (!root) return;

  var board = document.getElementById("gameBoard");
  var overlay = document.getElementById("gameOverlay");
  var overlayTitle = document.getElementById("gameOverlayTitle");
  var overlayMsg = document.getElementById("gameOverlayMsg");
  var startBtn = document.getElementById("gameStartBtn");
  var integrityBar = document.getElementById("gameIntegrity");
  var integrityWrap = integrityBar ? integrityBar.closest(".game-integrity") : null;
  var integrityLabel = document.getElementById("gameIntegrityLabel");
  var scoreEl = document.getElementById("gameScore");
  var comboEl = document.getElementById("gameCombo");
  var bestEl = document.getElementById("gameBest");
  if (!board || !overlay || !startBtn) return;

  var SLOTS = 12;
  var BEST_KEY = "as-buildlog-best";

  var slots = [];
  var running = false;
  var paused = false;
  var visible = false;
  var score = 0;
  var combo = 0;
  var integrity = 100;
  var best = 0;
  var spawnTimer = null;
  var activeBugs = {}; /* slotIndex -> { timeout } */

  try { best = parseInt(window.localStorage.getItem(BEST_KEY), 10) || 0; } catch (e) { best = 0; }

  /* ---------- Build the board ---------- */
  for (var i = 0; i < SLOTS; i++) {
    var slot = document.createElement("button");
    slot.type = "button";
    slot.className = "game-slot";
    slot.setAttribute("aria-label", "Build slot " + (i + 1));
    slot.dataset.index = String(i);
    slot.addEventListener("click", onSlotClick);
    board.appendChild(slot);
    slots.push(slot);
  }

  renderHud();

  /* ---------- HUD ---------- */
  function renderHud() {
    if (scoreEl) scoreEl.textContent = String(score);
    if (comboEl) comboEl.textContent = "x" + (combo > 0 ? combo : 1);
    if (bestEl) bestEl.textContent = String(best);
    if (integrityBar) integrityBar.style.width = Math.max(0, integrity) + "%";
    if (integrityLabel) integrityLabel.textContent = "build integrity " + Math.max(0, integrity) + "%";
    if (integrityWrap) {
      integrityWrap.classList.toggle("is-warn", integrity <= 60 && integrity > 30);
      integrityWrap.classList.toggle("is-danger", integrity <= 30);
    }
  }

  /* ---------- Spawning ---------- */
  function spawnDelay() {
    /* Gets faster as the score climbs */
    var base = 950 - score * 32;
    if (base < 340) base = 340;
    return base + Math.random() * 260;
  }

  function bugLifetime() {
    var life = 1500 - score * 38;
    if (life < 620) life = 620;
    return life;
  }

  function freeSlots() {
    var free = [];
    for (var i = 0; i < slots.length; i++) {
      if (!activeBugs[i] && !slots[i].classList.contains("is-splat")) free.push(i);
    }
    return free;
  }

  function scheduleSpawn() {
    clearTimeout(spawnTimer);
    if (!running || paused) return;
    spawnTimer = setTimeout(function () {
      spawnBug();
      scheduleSpawn();
    }, spawnDelay());
  }

  function spawnBug() {
    if (!running || paused) return;
    var free = freeSlots();
    if (!free.length) return;
    var idx = free[Math.floor(Math.random() * free.length)];
    var slot = slots[idx];
    slot.classList.add("has-bug");
    slot.innerHTML = '<span aria-hidden="true">🐛</span>';
    activeBugs[idx] = {
      timeout: setTimeout(function () { missBug(idx); }, bugLifetime())
    };
  }

  function clearSlot(idx) {
    var bug = activeBugs[idx];
    if (bug) { clearTimeout(bug.timeout); delete activeBugs[idx]; }
    var slot = slots[idx];
    slot.classList.remove("has-bug");
    slot.innerHTML = "";
  }

  /* ---------- Interactions ---------- */
  function onSlotClick(e) {
    var idx = parseInt(e.currentTarget.dataset.index, 10);
    if (!running || paused || !activeBugs[idx]) return;
    squashBug(idx);
  }

  function squashBug(idx) {
    var slot = slots[idx];
    clearTimeout(activeBugs[idx].timeout);
    delete activeBugs[idx];

    slot.classList.remove("has-bug");
    slot.classList.add("is-splat");
    slot.innerHTML = '<span aria-hidden="true">💥</span>';
    setTimeout(function () {
      slot.classList.remove("is-splat");
      slot.innerHTML = "";
    }, 340);

    score += 1;
    combo += 1;
    if (score > best) {
      best = score;
      try { window.localStorage.setItem(BEST_KEY, String(best)); } catch (err) {}
    }
    renderHud();
    scheduleSpawn(); /* re-time so the pace tracks the new score */
  }

  function missBug(idx) {
    if (!running) return;
    var slot = slots[idx];
    clearSlot(idx);
    slot.classList.add("is-miss");
    setTimeout(function () { slot.classList.remove("is-miss"); }, 420);

    combo = 0;
    integrity -= 10;
    board.classList.add("is-shake");
    setTimeout(function () { board.classList.remove("is-shake"); }, 340);
    renderHud();

    if (integrity <= 0) {
      integrity = 0;
      renderHud();
      crash();
    }
  }

  /* ---------- Game state ---------- */
  function resetBoard() {
    Object.keys(activeBugs).forEach(function (k) { clearSlot(parseInt(k, 10)); });
    activeBugs = {};
    slots.forEach(function (s) {
      s.classList.remove("has-bug", "is-splat", "is-miss");
      s.innerHTML = "";
    });
  }

  function startGame() {
    resetBoard();
    score = 0;
    combo = 0;
    integrity = 100;
    running = true;
    paused = false;
    renderHud();
    overlay.classList.add("is-hidden");
    scheduleSpawn();
  }

  function crash() {
    running = false;
    clearTimeout(spawnTimer);
    resetBoard();
    if (overlayTitle) overlayTitle.textContent = "Build crashed";
    if (overlayMsg) {
      overlayMsg.textContent = "Too many bugs shipped. You squashed " + score +
        (score === 1 ? " bug" : " bugs") + " - best so far is " + best + ".";
    }
    startBtn.textContent = "↻ rebuild & retry";
    overlay.classList.remove("is-hidden");
  }

  function pauseGame() {
    if (!running || paused) return;
    paused = true;
    clearTimeout(spawnTimer);
    Object.keys(activeBugs).forEach(function (k) { clearSlot(parseInt(k, 10)); });
    activeBugs = {};
  }

  function resumeGame() {
    if (!running || !paused) return;
    paused = false;
    scheduleSpawn();
  }

  startBtn.addEventListener("click", startGame);

  /* ---------- Auto pause when off-screen or on a hidden tab ---------- */
  function syncActivity() {
    if (!running) return;
    if (visible && !document.hidden) resumeGame();
    else pauseGame();
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible = entry.isIntersecting;
        syncActivity();
      });
    }, { threshold: 0.25 });
    io.observe(root);
  } else {
    visible = true;
  }

  document.addEventListener("visibilitychange", syncActivity);
})();
