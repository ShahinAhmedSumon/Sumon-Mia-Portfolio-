/* =======================================================================
   AMOROSO VIOLIN STUDIO — interactions
   ======================================================================= */
(function () {
  'use strict';
  var d = document, w = window;
  var reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var on = function (el, ev, fn, opt) { if (el) el.addEventListener(ev, fn, opt || false); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  on(d, 'DOMContentLoaded', init);

  function init() {
    headerState();
    mobileMenu();
    reveal();
    progress();
    marquee();
    accordions();
    modals();
    forms();
    counters();
    players();
    waves();
    backToTop();
    anchorOffset();
    yearStamp();
  }

  /* ---- sticky header state ---- */
  function headerState() {
    var hdr = d.getElementById('hdr');
    if (!hdr) return;
    var tick = function () { hdr.classList.toggle('is-stuck', w.scrollY > 24); };
    tick();
    on(w, 'scroll', tick, { passive: true });
  }

  /* ---- full-screen mobile menu ---- */
  function mobileMenu() {
    var burger = d.getElementById('burger');
    var nav = d.getElementById('nav');
    if (!burger || !nav) return;
    var toggle = function (open) {
      d.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      d.body.classList.toggle('no-scroll', open);
    };
    on(burger, 'click', function () { toggle(!d.body.classList.contains('menu-open')); });
    $$('a', nav).forEach(function (a) { on(a, 'click', function () { toggle(false); }); });
    on(d, 'keydown', function (e) { if (e.key === 'Escape') toggle(false); });
    on(w, 'resize', function () { if (w.innerWidth > 1120) toggle(false); });
  }

  /* ---- scroll reveal ---- */
  function reveal() {
    var items = $$('[data-reveal]');
    if (!items.length) return;
    if (!('IntersectionObserver' in w) || reduce) {
      items.forEach(function (i) { i.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(function (i) { io.observe(i); });
  }

  /* ---- reading progress ---- */
  function progress() {
    var bar = d.getElementById('progressBar');
    if (!bar) return;
    var raf = 0;
    var tick = function () {
      raf = 0;
      var max = d.documentElement.scrollHeight - w.innerHeight;
      bar.style.width = (max > 0 ? Math.min(1, w.scrollY / max) * 100 : 0) + '%';
    };
    on(w, 'scroll', function () { if (!raf) raf = w.requestAnimationFrame(tick); }, { passive: true });
    tick();
  }

  /* ---- seamless loops: duplicate track content ---- */
  function marquee() {
    $$('.loop').forEach(function (row) {
      if (row.dataset.dup) return;
      row.dataset.dup = '1';
      row.innerHTML += row.innerHTML;
    });
  }

  /* ---- accordions ---- */
  function accordions() {
    $$('.acc-item').forEach(function (item) {
      var btn = $('.acc-btn', item)[0];
      var panel = $('.acc-panel', item)[0];
      if (!btn || !panel) return;
      var setH = function () { panel.style.maxHeight = item.classList.contains('is-open') ? panel.scrollHeight + 'px' : '0px'; };
      on(btn, 'click', function () {
        var open = item.classList.contains('is-open');
        $$('.acc-item', btn.closest('.acc')).forEach(function (o) {
          o.classList.remove('is-open');
          var b = $('.acc-btn', o)[0], p = $('.acc-panel', o)[0];
          if (b) b.setAttribute('aria-expanded', 'false');
          if (p) p.style.maxHeight = '0px';
        });
        if (!open) { item.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); }
        setH();
      });
      on(w, 'resize', setH);
      if (item.classList.contains('is-open')) setH();
    });
  }

  /* ---- modals (lead magnet, search, etc.) ---- */
  function modals() {
    var openers = $$('[data-modal]');
    if (!openers.length) return;
    var lastFocus = null;
    var closeAll = function () {
      $$('.modal').forEach(function (m) { m.classList.remove('is-open'); });
      d.body.classList.remove('no-scroll');
      if (lastFocus) lastFocus.focus();
    };
    openers.forEach(function (b) {
      on(b, 'click', function (e) {
        e.preventDefault();
        var m = d.getElementById(b.getAttribute('data-modal'));
        if (!m) return;
        lastFocus = b;
        d.body.classList.add('no-scroll');
        m.classList.add('is-open');
        var f = $('input, textarea, button', m)[0];
        if (f) setTimeout(function () { f.focus(); }, 60);
      });
    });
    $$('.modal').forEach(function (m) {
      $$('[data-close]', m).forEach(function (x) { on(x, 'click', closeAll); });
      on(m, 'click', function (e) { if (e.target === m || e.target.hasAttribute('data-close')) closeAll(); });
    });
    on(d, 'keydown', function (e) { if (e.key === 'Escape') closeAll(); });
  }

  /* ---- demo forms (no backend) ---- */
  function forms() {
    $$('form[data-demo]').forEach(function (f) {
      on(f, 'submit', function (e) {
        e.preventDefault();
        var btn = $('button[type=submit]', f)[0] || $('button', f)[0];
        var ok = d.createElement('p');
        ok.className = 'form-ok';
        ok.style.cssText = 'font-size:.86rem;color:#2F7D4F;letter-spacing:.02em;display:flex;gap:.5rem;align-items:center';
        ok.innerHTML = '<svg class="ic" style="width:1rem;height:1rem" aria-hidden="true"><use href="#i-check"></use></svg> Thank you — this is a design mockup, so nothing was actually sent.';
        if (f.querySelector('.form-ok')) f.querySelector('.form-ok').remove();
        f.appendChild(ok);
        if (btn) {
          var t = btn.innerHTML;
          btn.innerHTML = 'Received ✓';
          btn.disabled = true;
          setTimeout(function () { btn.innerHTML = t; btn.disabled = false; }, 2600);
        }
        f.reset && setTimeout(function () { /* keep the confirmation, clear fields */ }, 0);
      });
    });
  }

  /* ---- animated counters ---- */
  function counters() {
    var els = $$('[data-count]');
    if (!els.length || reduce || !('IntersectionObserver' in w)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target, target = parseFloat(el.getAttribute('data-count')), suffix = el.getAttribute('data-suffix') || '';
        var t0 = null, dur = 1300;
        var step = function (ts) {
          if (!t0) t0 = ts;
          var p = Math.min(1, (ts - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix;
          if (p < 1) w.requestAnimationFrame(step);
        };
        w.requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- decorative audio players (mockup only) ---- */
  function players() {
    $$('.player').forEach(function (p) {
      var btn = $('.pp', p)[0];
      if (!btn) return;
      on(btn, 'click', function () {
        var playing = p.classList.toggle('is-play');
        btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
        btn.innerHTML = '<svg class="ic" aria-hidden="true"><use href="#i-' + (playing ? 'pause' : 'play') + '"></use></svg>';
        $$('.player').forEach(function (o) {
          if (o !== p && o.classList.contains('is-play')) {
            o.classList.remove('is-play');
            var b = $('.pp', o)[0];
            if (b) b.innerHTML = '<svg class="ic" aria-hidden="true"><use href="#i-play"></use></svg>';
            $$('.wave i', o).forEach(function (s) { s.style.animation = ''; });
          }
        });
        $$('.wave i', p).forEach(function (bar, i) {
          bar.style.animation = playing ? 'bounce 1.1s ease-in-out ' + (i % 7) * 0.08 + 's infinite' : '';
        });
      });
    });
    var st = d.createElement('style');
    st.textContent = '@keyframes bounce{0%,100%{transform:scaleY(.35)}50%{transform:scaleY(1)}}' +
      '.player .wave i{transform-origin:bottom}.player.is-play .pp{background:var(--amber)}';
    d.head.appendChild(st);
  }

  /* ---- generate waveform bars so markup stays short ---- */
  function waves() {
    $$('.wave[data-bars]').forEach(function (el) {
      var n = parseInt(el.getAttribute('data-bars'), 10) || 40;
      var html = '';
      for (var i = 0; i < n; i++) {
        var h = 18 + Math.round(Math.abs(Math.sin(i * 0.9) * 62) + (i % 5) * 4);
        html += '<i style="height:' + Math.min(100, h) + '%"></i>';
      }
      el.innerHTML = html;
    });
  }

  /* ---- back to top ---- */
  function backToTop() {
    var b = d.getElementById('toTop');
    if (!b) return;
    var tick = function () { b.classList.toggle('is-on', w.scrollY > w.innerHeight * 0.9); };
    tick();
    on(w, 'scroll', tick, { passive: true });
    on(b, 'click', function () { w.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  }

  /* ---- smooth anchors that clear the sticky header ---- */
  function anchorOffset() {
    $$('a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute('href');
      if (!id || id.length < 2 || a.hasAttribute('data-modal')) return;
      on(a, 'click', function (e) {
        var t = d.getElementById(id.slice(1));
        if (!t) return;
        e.preventDefault();
        var top = t.getBoundingClientRect().top + w.scrollY - 82;
        w.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  }

  function yearStamp() {
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }
})();
