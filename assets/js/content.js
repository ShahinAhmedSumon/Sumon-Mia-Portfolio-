/* ============================================================
   content.js — Load content.json and expose as window.__CONTENT__
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
      if (c.theme.logoMark) {
        var marks = document.querySelectorAll(".logo-mark");
        marks.forEach(function (m) {
          var dot = m.querySelector(".logo-dot");
          var dotHtml = dot ? dot.outerHTML : "";
          m.textContent = c.theme.logoMark;
          if (dotHtml) m.insertAdjacentHTML("beforeend", dotHtml);
        });
      }
      if (c.theme.logoText) {
        var texts = document.querySelectorAll(".logo-text");
        texts.forEach(function (t) {
          t.innerHTML = c.theme.logoText.replace(" ", "&nbsp;");
        });
      }
      /* Logo image — replaces the text logo mark when set */
      if (c.theme.logoImage) {
        var markEl = document.querySelector(".logo .logo-mark");
        if (markEl) {
          var logoImg = document.createElement("img");
          logoImg.src = c.theme.logoImage;
          logoImg.alt = (c.theme.logoText || "Logo");
          logoImg.className = "logo-img";
          markEl.innerHTML = "";
          markEl.appendChild(logoImg);
        }
      }
      /* Favicon — swaps the browser-tab icon when set */
      if (c.theme.faviconImage) {
        var fav = document.querySelector("link[rel='icon']");
        if (!fav) {
          fav = document.createElement("link");
          fav.rel = "icon";
          document.head.appendChild(fav);
        }
        fav.href = c.theme.faviconImage;
      }
      /* Profile photo — replaces the About card monogram when set */
      if (c.theme.profilePhoto) {
        var mono = document.querySelector(".about-monogram");
        if (mono) {
          var photo = document.createElement("img");
          photo.src = c.theme.profilePhoto;
          photo.alt = (c.meta && c.meta.author) ? c.meta.author : "Profile photo";
          photo.className = "about-photo";
          mono.innerHTML = "";
          mono.appendChild(photo);
        }
      }
    }

    /* Dispatch event so main.js can use updated content */
    document.dispatchEvent(new CustomEvent("contentLoaded", { detail: c }));
  }

  function _setText(selector, value) {
    if (!value) return;
    var el = document.querySelector(selector);
    if (el) el.textContent = value;
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
