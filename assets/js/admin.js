/* ============================================================
   admin.js — Site Dashboard logic
   GitHub token login → edit content → save via GitHub API
   ============================================================ */
(function () {
  "use strict";

  /* ---- Config ---- */
  var REPO_OWNER = "ShahinAhmedSumon";
  var REPO_NAME  = "Sumon-Mia-Portfolio-";
  var CONTENT_PATH = "content.json";
  var BRANCH = "main";

  /* ---- State ---- */
  var token   = null;
  var content = null;  /* parsed content.json */
  var contentSha = null; /* blob sha for update */
  var editingProjectIdx  = -1;
  var editingFaqIdx      = -1;

  /* ---- DOM refs (filled after DOMContentLoaded) ---- */
  var els = {};

  /* ================================================================
     INIT
  ================================================================ */
  document.addEventListener("DOMContentLoaded", function () {
    els = {
      loginScreen:  document.getElementById("loginScreen"),
      dashboard:    document.getElementById("dashboard"),
      tokenInput:   document.getElementById("tokenInput"),
      loginBtn:     document.getElementById("loginBtn"),
      loginError:   document.getElementById("loginError"),
      logoutBtn:    document.getElementById("logoutBtn"),

      /* Nav */
      navItems:     document.querySelectorAll(".nav-item[data-tab]"),

      /* Save */
      saveBtn:      document.getElementById("saveBtn"),
      saveStatus:   document.getElementById("saveStatus"),
      saveStatusText: document.getElementById("saveStatusText"),

      /* Overview */
      ovProjects:   document.getElementById("ovProjects"),
      ovFaqs:       document.getElementById("ovFaqs"),
      ovFeatured:   document.getElementById("ovFeatured"),
      ovTheme:      document.getElementById("ovTheme"),

      /* Hero */
      heroAvailable: document.getElementById("heroAvailable"),
      heroHeadline1: document.getElementById("heroHeadline1"),
      heroHeadline2: document.getElementById("heroHeadline2"),
      heroIntro:     document.getElementById("heroIntro"),
      heroCta1:      document.getElementById("heroCta1"),
      heroCta2:      document.getElementById("heroCta2"),
      heroRoles:     document.getElementById("heroRoles"),

      /* About */
      aboutTagline:  document.getElementById("aboutTagline"),
      aboutHeadline: document.getElementById("aboutHeadline"),
      aboutBio1:     document.getElementById("aboutBio1"),
      aboutBio2:     document.getElementById("aboutBio2"),
      aboutLocation: document.getElementById("aboutLocation"),
      aboutEmail:    document.getElementById("aboutEmail"),
      statYears:     document.getElementById("statYears"),
      statProjects:  document.getElementById("statProjects"),
      statClients:   document.getElementById("statClients"),
      statSat:       document.getElementById("statSat"),

      /* Contact */
      contactEmail:    document.getElementById("contactEmail"),
      contactLocation: document.getElementById("contactLocation"),
      contactResponse: document.getElementById("contactResponse"),
      contactAvail:    document.getElementById("contactAvail"),

      /* Projects */
      projectList:   document.getElementById("projectList"),
      addProjectBtn: document.getElementById("addProjectBtn"),

      /* FAQ */
      faqList:   document.getElementById("faqList"),
      addFaqBtn: document.getElementById("addFaqBtn"),

      /* Theme */
      themeAccent:  document.getElementById("themeAccent"),
      themeBg:      document.getElementById("themeBg"),
      themeLogoMark:document.getElementById("themeLogoMark"),
      themeLogoText:document.getElementById("themeLogoText"),
      themePreview: document.getElementById("themePreview"),
      logoPreview:  document.getElementById("logoPreview"),

      /* Image uploads (Theme tab) */
      profileFile:       document.getElementById("profileFile"),
      profilePreview:    document.getElementById("profilePreview"),
      profileUploadBtn:  document.getElementById("profileUploadBtn"),
      profileRemoveBtn:  document.getElementById("profileRemoveBtn"),

      logoFile:       document.getElementById("logoFile"),
      logoImgPreview: document.getElementById("logoImgPreview"),
      logoUploadBtn:  document.getElementById("logoUploadBtn"),
      logoRemoveBtn:  document.getElementById("logoRemoveBtn"),

      faviconFile:       document.getElementById("faviconFile"),
      faviconPreview:    document.getElementById("faviconPreview"),
      faviconUploadBtn:  document.getElementById("faviconUploadBtn"),
      faviconRemoveBtn:  document.getElementById("faviconRemoveBtn"),

      /* Modals */
      projectModal:      document.getElementById("projectModal"),
      projectModalTitle: document.getElementById("projectModalTitle"),
      pName:    document.getElementById("pName"),
      pDomain:  document.getElementById("pDomain"),
      pUrl:     document.getElementById("pUrl"),
      pCat:     document.getElementById("pCat"),
      pFeatured:document.getElementById("pFeatured"),
      pDesc:    document.getElementById("pDesc"),
      projectModalSave:   document.getElementById("projectModalSave"),
      projectModalCancel: document.getElementById("projectModalCancel"),
      projectModalDelete: document.getElementById("projectModalDelete"),

      faqModal:      document.getElementById("faqModal"),
      faqModalTitle: document.getElementById("faqModalTitle"),
      faqQ:     document.getElementById("faqQ"),
      faqA:     document.getElementById("faqA"),
      faqModalSave:   document.getElementById("faqModalSave"),
      faqModalCancel: document.getElementById("faqModalCancel"),
      faqModalDelete: document.getElementById("faqModalDelete"),

      toastContainer: document.getElementById("toastContainer"),
    };

    /* Restore token from sessionStorage */
    var saved = sessionStorage.getItem("admin_token");
    if (saved) {
      token = saved;
      loadAndShowDashboard();
    }

    /* Login */
    els.loginBtn.addEventListener("click", doLogin);
    els.tokenInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") doLogin();
    });

    /* Logout */
    els.logoutBtn.addEventListener("click", function () {
      token = null;
      sessionStorage.removeItem("admin_token");
      els.dashboard.classList.remove("visible");
      els.loginScreen.style.display = "flex";
    });

    /* Nav tabs */
    els.navItems.forEach(function (item) {
      item.addEventListener("click", function () {
        switchTab(item.dataset.tab);
      });
    });

    /* Save */
    els.saveBtn.addEventListener("click", saveContent);

    /* Theme live preview */
    [els.themeAccent, els.themeBg, els.themeLogoMark, els.themeLogoText].forEach(function (el) {
      if (el) el.addEventListener("input", updateThemePreview);
    });

    /* Image uploads (Theme tab) */
    setupImageUpload({
      key: "profilePhoto",
      fileInput: els.profileFile,
      preview: els.profilePreview,
      uploadBtn: els.profileUploadBtn,
      removeBtn: els.profileRemoveBtn,
      maxDim: 512,
      mime: "image/jpeg",
      quality: 0.85,
      placeholder: "👤"
    });
    setupImageUpload({
      key: "logoImage",
      fileInput: els.logoFile,
      preview: els.logoImgPreview,
      uploadBtn: els.logoUploadBtn,
      removeBtn: els.logoRemoveBtn,
      maxDim: 256,
      mime: "image/png",
      quality: 1,
      placeholder: "🏷"
    });
    setupImageUpload({
      key: "faviconImage",
      fileInput: els.faviconFile,
      preview: els.faviconPreview,
      uploadBtn: els.faviconUploadBtn,
      removeBtn: els.faviconRemoveBtn,
      maxDim: 64,
      mime: "image/png",
      quality: 1,
      placeholder: "★"
    });

    /* Project modal */
    els.projectModalSave.addEventListener("click", saveProjectModal);
    els.projectModalCancel.addEventListener("click", function () { closeModal(els.projectModal); });
    els.projectModalDelete.addEventListener("click", deleteProject);
    els.addProjectBtn.addEventListener("click", function () { openProjectModal(-1); });

    /* FAQ modal */
    els.faqModalSave.addEventListener("click", saveFaqModal);
    els.faqModalCancel.addEventListener("click", function () { closeModal(els.faqModal); });
    els.faqModalDelete.addEventListener("click", deleteFaq);
    els.addFaqBtn.addEventListener("click", function () { openFaqModal(-1); });

    /* Close modal on overlay click */
    [els.projectModal, els.faqModal].forEach(function (overlay) {
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) closeModal(overlay);
      });
    });
  });

  /* ================================================================
     AUTH
  ================================================================ */
  function doLogin() {
    var t = els.tokenInput.value.trim();
    if (!t) { showLoginError("Please enter your GitHub token."); return; }
    els.loginBtn.disabled = true;
    els.loginBtn.textContent = "Verifying…";
    verifyToken(t)
      .then(function (ok) {
        if (ok) {
          token = t;
          sessionStorage.setItem("admin_token", t);
          els.loginError.classList.remove("visible");
          loadAndShowDashboard();
        } else {
          showLoginError("Invalid token or insufficient permissions. Make sure it has repo scope.");
        }
      })
      .catch(function () {
        showLoginError("Network error. Check your connection.");
      })
      .finally(function () {
        els.loginBtn.disabled = false;
        els.loginBtn.textContent = "Sign In →";
      });
  }

  function verifyToken(t) {
    return fetch("https://api.github.com/repos/" + REPO_OWNER + "/" + REPO_NAME, {
      headers: { Authorization: "token " + t, Accept: "application/vnd.github.v3+json" }
    }).then(function (r) { return r.ok; });
  }

  function showLoginError(msg) {
    els.loginError.textContent = msg;
    els.loginError.classList.add("visible");
  }

  /* ================================================================
     LOAD
  ================================================================ */
  function loadAndShowDashboard() {
    els.loginScreen.style.display = "none";
    fetchContentJson()
      .then(function (data) {
        content = data.content;
        contentSha = data.sha;
        populateForm();
        els.dashboard.classList.add("visible");
        switchTab("overview");
      })
      .catch(function (err) {
        alert("Could not load content.json: " + err.message);
        token = null;
        sessionStorage.removeItem("admin_token");
        els.loginScreen.style.display = "flex";
      });
  }

  function fetchContentJson() {
    return fetch("https://api.github.com/repos/" + REPO_OWNER + "/" + REPO_NAME +
                 "/contents/" + CONTENT_PATH + "?ref=" + BRANCH +
                 "&t=" + Date.now(), {
      headers: { Authorization: "token " + token, Accept: "application/vnd.github.v3+json" }
    })
    .then(function (r) {
      if (!r.ok) throw new Error("GitHub API " + r.status);
      return r.json();
    })
    .then(function (file) {
      var decoded = atob(file.content.replace(/\n/g, ""));
      return { content: JSON.parse(decoded), sha: file.sha };
    });
  }

  /* ================================================================
     POPULATE FORM
  ================================================================ */
  function populateForm() {
    var c = content;

    /* Overview stats */
    if (els.ovProjects) els.ovProjects.textContent = (c.projects || []).length;
    if (els.ovFaqs)     els.ovFaqs.textContent     = (c.faq || []).length;
    if (els.ovFeatured) els.ovFeatured.textContent  = (c.projects || []).filter(function (p) { return p.featured; }).length;
    if (els.ovTheme)    els.ovTheme.textContent     = c.theme ? c.theme.accentColor : "—";

    /* Hero */
    if (c.hero) {
      _val(els.heroAvailable, c.hero.available);
      _val(els.heroHeadline1, c.hero.headline1);
      _val(els.heroHeadline2, c.hero.headline2);
      _val(els.heroIntro,     c.hero.intro);
      _val(els.heroCta1,      c.hero.cta1);
      _val(els.heroCta2,      c.hero.cta2);
      if (els.heroRoles && c.hero.typingRoles) {
        els.heroRoles.value = c.hero.typingRoles.join("\n");
      }
    }

    /* About */
    if (c.about) {
      _val(els.aboutTagline,  c.about.tagline);
      _val(els.aboutHeadline, c.about.headline);
      _val(els.aboutBio1,     c.about.bio1);
      _val(els.aboutBio2,     c.about.bio2);
      _val(els.aboutLocation, c.about.location);
      _val(els.aboutEmail,    c.about.email);
      if (c.about.stats) {
        _val(els.statYears,    c.about.stats.yearsExp);
        _val(els.statProjects, c.about.stats.projects);
        _val(els.statClients,  c.about.stats.clients);
        _val(els.statSat,      c.about.stats.satisfaction);
      }
    }

    /* Contact */
    if (c.contact) {
      _val(els.contactEmail,    c.contact.email);
      _val(els.contactLocation, c.contact.location);
      _val(els.contactResponse, c.contact.responseTime);
      _val(els.contactAvail,    c.contact.availability);
    }

    /* Theme */
    if (c.theme) {
      _val(els.themeAccent,   c.theme.accentColor);
      _val(els.themeBg,       c.theme.bgColor);
      _val(els.themeLogoMark, c.theme.logoMark);
      _val(els.themeLogoText, c.theme.logoText);
      updateThemePreview();
    }

    /* Image upload previews */
    refreshUploadPreviews();

    /* Projects */
    renderProjectList();

    /* FAQ */
    renderFaqList();
  }

  function _val(el, v) {
    if (el && v !== undefined && v !== null) el.value = v;
  }

  /* ================================================================
     PROJECT LIST
  ================================================================ */
  function renderProjectList() {
    if (!els.projectList) return;
    var projects = content.projects || [];
    els.projectList.innerHTML = "";
    projects.forEach(function (p, i) {
      var item = document.createElement("div");
      item.className = "project-item";
      item.innerHTML =
        '<div class="project-item-body">' +
          '<div class="project-item-name">' + escHtml(p.name) + "</div>" +
          '<div class="project-item-domain">' + escHtml(p.domain) + "</div>" +
        "</div>" +
        (p.featured ? '<span class="featured-badge">Featured</span>' : "") +
        '<div class="project-item-actions">' +
          '<button class="btn-icon edit-proj" data-i="' + i + '">✏ Edit</button>' +
        "</div>";
      els.projectList.appendChild(item);
    });

    els.projectList.querySelectorAll(".edit-proj").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openProjectModal(parseInt(btn.dataset.i, 10));
      });
    });
  }

  function openProjectModal(idx) {
    editingProjectIdx = idx;
    var p = idx >= 0 ? content.projects[idx] : {};
    els.projectModalTitle.textContent = idx >= 0 ? "Edit Project" : "Add Project";
    _val(els.pName,     p.name     || "");
    _val(els.pDomain,   p.domain   || "");
    _val(els.pUrl,      p.url      || "");
    _val(els.pCat,      p.cat      || "business");
    _val(els.pDesc,     p.desc     || "");
    els.pFeatured.checked = !!p.featured;
    els.projectModalDelete.style.display = idx >= 0 ? "inline-flex" : "none";
    openModal(els.projectModal);
  }

  function saveProjectModal() {
    var p = {
      name:     els.pName.value.trim(),
      domain:   els.pDomain.value.trim(),
      url:      els.pUrl.value.trim(),
      cat:      els.pCat.value,
      featured: els.pFeatured.checked,
      desc:     els.pDesc.value.trim()
    };
    if (!p.name || !p.domain || !p.url) {
      toast("Name, domain and URL are required.", "warn"); return;
    }
    if (!content.projects) content.projects = [];
    if (editingProjectIdx >= 0) {
      content.projects[editingProjectIdx] = p;
    } else {
      content.projects.push(p);
    }
    renderProjectList();
    closeModal(els.projectModal);
    markUnsaved();
  }

  function deleteProject() {
    if (editingProjectIdx < 0) return;
    if (!confirm("Delete this project?")) return;
    content.projects.splice(editingProjectIdx, 1);
    renderProjectList();
    closeModal(els.projectModal);
    markUnsaved();
  }

  /* ================================================================
     FAQ LIST
  ================================================================ */
  function renderFaqList() {
    if (!els.faqList) return;
    var faqs = content.faq || [];
    els.faqList.innerHTML = "";
    faqs.forEach(function (f, i) {
      var item = document.createElement("div");
      item.className = "faq-item-admin";
      item.innerHTML =
        '<div class="faq-item-admin-q">' +
          '<span>' + escHtml(f.q) + "</span>" +
          '<button class="btn-icon edit-faq" data-i="' + i + '">✏ Edit</button>' +
        "</div>" +
        '<div class="faq-item-admin-a">' + escHtml(f.a.substring(0, 100)) + (f.a.length > 100 ? "…" : "") + "</div>";
      els.faqList.appendChild(item);
    });

    els.faqList.querySelectorAll(".edit-faq").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openFaqModal(parseInt(btn.dataset.i, 10));
      });
    });
  }

  function openFaqModal(idx) {
    editingFaqIdx = idx;
    var f = idx >= 0 ? content.faq[idx] : {};
    els.faqModalTitle.textContent = idx >= 0 ? "Edit FAQ" : "Add FAQ";
    _val(els.faqQ, f.q || "");
    _val(els.faqA, f.a || "");
    els.faqModalDelete.style.display = idx >= 0 ? "inline-flex" : "none";
    openModal(els.faqModal);
  }

  function saveFaqModal() {
    var q = els.faqQ.value.trim();
    var a = els.faqA.value.trim();
    if (!q || !a) { toast("Question and answer are required.", "warn"); return; }
    if (!content.faq) content.faq = [];
    var entry = { q: q, a: a };
    if (editingFaqIdx >= 0) {
      content.faq[editingFaqIdx] = entry;
    } else {
      content.faq.push(entry);
    }
    renderFaqList();
    closeModal(els.faqModal);
    markUnsaved();
  }

  function deleteFaq() {
    if (editingFaqIdx < 0) return;
    if (!confirm("Delete this FAQ item?")) return;
    content.faq.splice(editingFaqIdx, 1);
    renderFaqList();
    closeModal(els.faqModal);
    markUnsaved();
  }

  /* ================================================================
     THEME PREVIEW
  ================================================================ */
  function updateThemePreview() {
    if (!els.themePreview) return;
    var bg     = els.themeBg     ? els.themeBg.value     : "#080a12";
    var accent = els.themeAccent ? els.themeAccent.value : "#7c8cff";
    var mark   = els.themeLogoMark ? els.themeLogoMark.value : "A";
    var text   = els.themeLogoText ? els.themeLogoText.value : "Ahmed Sumon";
    els.themePreview.style.background = bg;
    els.themePreview.style.color      = accent;
    els.themePreview.textContent      = mark + ". " + text;
  }

  /* ================================================================
     IMAGE UPLOADS (Theme tab)
     Each widget reads a local file, downscales it on a canvas and
     stores the result as a data URI inside content.theme[key].
  ================================================================ */
  var uploadWidgets = [];

  function setupImageUpload(cfg) {
    if (!cfg.fileInput || !cfg.preview) return;
    cfg.label = cfg.uploadBtn.textContent.trim();
    uploadWidgets.push(cfg);

    cfg.uploadBtn.addEventListener("click", function () {
      cfg.fileInput.value = "";
      cfg.fileInput.click();
    });

    cfg.fileInput.addEventListener("change", function () {
      var file = cfg.fileInput.files && cfg.fileInput.files[0];
      if (!file) return;
      if (!/^image\//.test(file.type)) {
        toast("Please choose an image file (PNG, JPG, WebP…).", "warn");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast("Image is too large — please pick one under 2 MB.", "warn");
        return;
      }
      readAndScale(file, cfg.maxDim, cfg.mime, cfg.quality)
        .then(function (dataUri) {
          if (!content.theme) content.theme = {};
          content.theme[cfg.key] = dataUri;
          renderUploadPreview(cfg);
          markUnsaved();
          toast("Image ready — click Save Changes to publish it.", "success");
        })
        .catch(function () {
          toast("Could not read that image file.", "error");
        });
    });

    cfg.removeBtn.addEventListener("click", function () {
      if (!content.theme || !content.theme[cfg.key]) return;
      if (!confirm("Remove this image?")) return;
      content.theme[cfg.key] = "";
      renderUploadPreview(cfg);
      markUnsaved();
    });

    renderUploadPreview(cfg);
  }

  /* Read a File, downscale so the longest edge is <= maxDim,
     and return a data URI in the target format. */
  function readAndScale(file, maxDim, mime, quality) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onerror = reject;
      reader.onload = function () {
        var img = new Image();
        img.onerror = reject;
        img.onload = function () {
          var w = img.naturalWidth  || img.width;
          var h = img.naturalHeight || img.height;
          var scale = Math.min(1, maxDim / Math.max(w, h));
          var cw = Math.max(1, Math.round(w * scale));
          var ch = Math.max(1, Math.round(h * scale));
          var canvas = document.createElement("canvas");
          canvas.width  = cw;
          canvas.height = ch;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, cw, ch);
          try {
            resolve(canvas.toDataURL(mime, quality));
          } catch (e) {
            reject(e);
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function renderUploadPreview(cfg) {
    var value = content && content.theme ? (content.theme[cfg.key] || "") : "";
    if (value) {
      cfg.preview.innerHTML = "";
      var img = document.createElement("img");
      img.src = value;
      img.alt = cfg.key;
      cfg.preview.appendChild(img);
      cfg.preview.classList.add("has-image");
      cfg.uploadBtn.textContent = "Replace";
      cfg.removeBtn.style.display = "inline-flex";
    } else {
      cfg.preview.innerHTML = '<span class="upload-placeholder">' + (cfg.placeholder || "🖼") + "</span>";
      cfg.preview.classList.remove("has-image");
      cfg.uploadBtn.textContent = cfg.label;
      cfg.removeBtn.style.display = "none";
    }
  }

  function refreshUploadPreviews() {
    uploadWidgets.forEach(renderUploadPreview);
  }

  /* ================================================================
     COLLECT FORM → content object
  ================================================================ */
  function collectForm() {
    var c = JSON.parse(JSON.stringify(content)); /* deep clone */

    /* Hero */
    if (!c.hero) c.hero = {};
    c.hero.available  = _get(els.heroAvailable);
    c.hero.headline1  = _get(els.heroHeadline1);
    c.hero.headline2  = _get(els.heroHeadline2);
    c.hero.intro      = _get(els.heroIntro);
    c.hero.cta1       = _get(els.heroCta1);
    c.hero.cta2       = _get(els.heroCta2);
    if (els.heroRoles) {
      c.hero.typingRoles = els.heroRoles.value
        .split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
    }

    /* About */
    if (!c.about) c.about = {};
    c.about.tagline  = _get(els.aboutTagline);
    c.about.headline = _get(els.aboutHeadline);
    c.about.bio1     = _get(els.aboutBio1);
    c.about.bio2     = _get(els.aboutBio2);
    c.about.location = _get(els.aboutLocation);
    c.about.email    = _get(els.aboutEmail);
    if (!c.about.stats) c.about.stats = {};
    c.about.stats.yearsExp     = parseInt(_get(els.statYears), 10)    || 0;
    c.about.stats.projects     = parseInt(_get(els.statProjects), 10) || 0;
    c.about.stats.clients      = parseInt(_get(els.statClients), 10)  || 0;
    c.about.stats.satisfaction = parseInt(_get(els.statSat), 10)      || 0;

    /* Contact */
    if (!c.contact) c.contact = {};
    c.contact.email        = _get(els.contactEmail);
    c.contact.location     = _get(els.contactLocation);
    c.contact.responseTime = _get(els.contactResponse);
    c.contact.availability = _get(els.contactAvail);

    /* Theme */
    if (!c.theme) c.theme = {};
    c.theme.accentColor = _get(els.themeAccent);
    c.theme.bgColor     = _get(els.themeBg);
    c.theme.logoMark    = _get(els.themeLogoMark);
    c.theme.logoText    = _get(els.themeLogoText);

    /* Images (data URIs edited in-place via upload widgets) */
    c.theme.profilePhoto  = (c.theme.profilePhoto  || "");
    c.theme.logoImage     = (c.theme.logoImage     || "");
    c.theme.faviconImage  = (c.theme.faviconImage  || "");

    /* projects & faq already updated in-place */
    return c;
  }

  function _get(el) {
    return el ? el.value.trim() : "";
  }

  /* ================================================================
     SAVE TO GITHUB
  ================================================================ */
  function saveContent() {
    var updated = collectForm();
    var json    = JSON.stringify(updated, null, 2);
    var encoded = btoa(unescape(encodeURIComponent(json)));

    setStatus("saving", "Saving…");
    els.saveBtn.disabled = true;

    fetch("https://api.github.com/repos/" + REPO_OWNER + "/" + REPO_NAME +
          "/contents/" + CONTENT_PATH, {
      method: "PUT",
      headers: {
        Authorization: "token " + token,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "dashboard: update content.json via admin panel",
        content: encoded,
        sha:     contentSha,
        branch:  BRANCH
      })
    })
    .then(function (r) {
      if (!r.ok) return r.json().then(function (e) { throw new Error(e.message || r.status); });
      return r.json();
    })
    .then(function (res) {
      contentSha = res.content.sha;
      content = updated;
      setStatus("saved", "Saved ✓ — Pages rebuilding…");
      toast("Saved! GitHub Pages is rebuilding your site.", "success");
      populateForm();
    })
    .catch(function (err) {
      setStatus("error", "Error: " + err.message);
      toast("Save failed: " + err.message, "error");
    })
    .finally(function () {
      els.saveBtn.disabled = false;
    });
  }

  function markUnsaved() {
    setStatus("", "Unsaved changes");
  }

  function setStatus(type, msg) {
    var s = els.saveStatus;
    if (!s) return;
    s.className = "save-status " + type;
    if (els.saveStatusText) els.saveStatusText.textContent = msg;
  }

  /* ================================================================
     MODALS
  ================================================================ */
  function openModal(overlay) {
    overlay.classList.add("visible");
  }
  function closeModal(overlay) {
    overlay.classList.remove("visible");
  }

  /* ================================================================
     TABS
  ================================================================ */
  function switchTab(tab) {
    els.navItems.forEach(function (item) {
      item.classList.toggle("active", item.dataset.tab === tab);
    });
    document.querySelectorAll(".tab-section").forEach(function (sec) {
      sec.classList.toggle("active", sec.dataset.tab === tab);
    });
  }

  /* ================================================================
     TOAST
  ================================================================ */
  function toast(msg, type) {
    var t = document.createElement("div");
    t.className = "toast " + (type || "");
    t.textContent = msg;
    els.toastContainer.appendChild(t);
    setTimeout(function () {
      t.classList.add("out");
      setTimeout(function () { t.remove(); }, 300);
    }, 3000);
  }

  /* ================================================================
     HELPERS
  ================================================================ */
  function escHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

})();
