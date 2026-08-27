/* ============================================================
   content.js - Load content.json and expose as window.__CONTENT__
   Falls back gracefully if content.json is unavailable.
   ============================================================ */
(function () {
  "use strict";

  var CONTENT_URL = (function () {
    /* Resolve relative to this script's own location so it works
       whether the site is served from root or a sub-path (GitHub Pages). */
    var scripts = document.querySelectorAll("script[src]");
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].src.indexOf("content.js") !== -1) {
        return scripts[i].src.replace("assets/js/content.js", "content.json");
      }
    }
    return "content.json";
  })();

  function applyContent(c) {
    window.__CONTENT__ = c;

    /* ---- Meta ---- */
    if (c.meta) {
      if (c.meta.title)       document.title = c.meta.title;
      if (c.meta.description) {
        var dm = document.querySelector("meta[name='description']");
        if (dm) dm.content = c.meta.description;
      }
    }

    /* ---- Site info (edited via the Site Info tab in the dashboard) ---- */
    if (c.siteTitle) {
      document.title = c.siteTitle;
      var ogTitle = document.querySelector("meta[property='og:title']");
      if (ogTitle) ogTitle.content = c.siteTitle;
    }
    if (c.siteTagline) {
      var roleEl = document.querySelector(".about-role");
      if (roleEl) roleEl.textContent = c.siteTagline;
    }

    /* ---- Hero ---- */
    if (c.hero) {
      var h = c.hero;
      _setText(".hero-available", h.available);
      var lines = document.querySelectorAll(".hero-line");
      if (lines[0] && h.headline1) lines[0].textContent = h.headline1;
      if (lines[1] && h.headline2) lines[1].textContent = h.headline2;
      if (h.intro) {
        var sub = document.querySelector(".hero-sub");
        if (sub) sub.innerHTML = h.intro;
      }
    }

    /* ---- Theme ---- */
    if (c.theme) {
      if (c.theme.accentColor) {
        document.documentElement.style.setProperty("--accent", c.theme.accentColor);
      }
      if (c.theme.bgColor) {
        document.documentElement.style.setProperty("--bg", c.theme.bgColor);
      }
      /* Logo image - overrides the default picture logo (navbar + footer) when set */
      if (c.theme.logoImage) {
        var logos = document.querySelectorAll(".logo .logo-img");
        logos.forEach(function (img) {
          img.src = c.theme.logoImage;
          img.alt = "Ahmed Sumon";
        });
      }
      /* Favicon - swaps the browser-tab icon when set */
      if (c.theme.faviconImage) {
        var fav = document.querySelector("link[rel='icon']");
        if (!fav) {
          fav = document.createElement("link");
          fav.rel = "icon";
          document.head.appendChild(fav);
        }
        fav.href = c.theme.faviconImage;
      }
      /* Profile photo - replaces the About card monogram when set */
      if (c.theme.profilePhoto) {
        var mono = document.querySelector(".about-monogram");
        if (mono) {
          var photo = document.createElement("img");
          photo.src = c.theme.profilePhoto;
          photo.alt = (c.meta && c.meta.author) ? c.meta.author : "Profile photo";
          photo.className = "about-photo";
          mono.innerHTML = "";
          mono.classList.add("has-photo"); /* bigger photo frame */
          mono.appendChild(photo);
        }
      }
    }

    /* ---- Social links (footer + mobile menu) ---- */
    (function () {
      var social = c.social || {};
      var rows = [document.querySelector(".footer-social"), document.querySelector(".nav-social")];
      var fbHref = socialUrl(social.facebook, false);
      var waHref = socialUrl(social.whatsapp, true);
      rows.forEach(function (row) {
        if (!row) return;
        var fbIcon = row.querySelector('.social-icon[data-social="facebook"]');
        var waIcon = row.querySelector('.social-icon[data-social="whatsapp"]');
        if (fbIcon) {
          if (fbHref) { fbIcon.href = fbHref; fbIcon.style.display = ""; }
          else fbIcon.style.display = "none";
        }
        if (waIcon) {
          if (waHref) { waIcon.href = waHref; waIcon.style.display = ""; }
          else waIcon.style.display = "none";
        }
        /* Hide the whole row when neither link is set */
        row.style.display = (fbHref || waHref) ? "" : "none";
      });
    })();

    /* Dispatch event so main.js can use updated content */
    document.dispatchEvent(new CustomEvent("contentLoaded", { detail: c }));
  }

  function _setText(selector, value) {
    if (!value) return;
    var el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  /* Normalise a stored social value into a usable href.
     whatsapp=true turns a raw number (01867-473337 / 8801867473337)
     into a wa.me link; full URLs pass through untouched. */
  function socialUrl(value, whatsapp) {
    if (value === undefined || value === null) return "";
    var v = String(value).trim();
    if (!v) return "";
    if (/^https?:\/\//i.test(v)) return v;
    if (whatsapp) {
      var digits = v.replace(/\D/g, "");
      return digits ? "https://wa.me/" + digits : "";
    }
    return "https://" + v;
  }

  /* Fetch content.json */
  fetch(CONTENT_URL + "?_=" + Date.now())
    .then(function (r) {
      if (!r.ok) throw new Error("content.json " + r.status);
      return r.json();
    })
    .then(function (data) {
      applyContent(data);
    })
    .catch(function (err) {
      console.warn("[content.js] Could not load content.json:", err.message);
      /* Still set an empty object so callers can safely check window.__CONTENT__ */
      window.__CONTENT__ = null;
      document.dispatchEvent(new CustomEvent("contentLoaded", { detail: null }));
    });
})();
