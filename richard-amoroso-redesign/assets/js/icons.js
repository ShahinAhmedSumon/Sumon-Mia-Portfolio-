/* Inline SVG sprite — keeps markup clean and avoids any external icon font.
   Use: <svg class="ic"><use href="#i-arrow"></use></svg>  */
(function () {
  var S = [
    ['i-arrow', '<path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'],
    ['i-arrow-up', '<path d="M12 20V5M6 11l6-6 6 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'],
    ['i-arrow-diag', '<path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'],
    ['i-double', '<path d="M6 12h9M11 7l5 5-5 5M17 7l4 5-4 5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>'],
    ['i-caret', '<path d="M6 9.5 12 15l6-5.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'],
    ['i-search', '<circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'],
    ['i-menu', '<path d="M4 8h16M4 16h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'],
    ['i-close', '<path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'],
    ['i-star', '<path d="M12 3.4l2.5 5.4 5.9.7-4.4 4 1.2 5.8L12 16.4 6.8 19.3 8 13.5l-4.4-4 5.9-.7z" fill="currentColor"/>'],
    ['i-check', '<path d="M4.5 12.5 9 17l10.5-10.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'],
    ['i-play', '<path d="M8 5.6v12.8L19 12z" fill="currentColor"/>'],
    ['i-pause', '<path d="M9 5v14M15 5v14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'],
    ['i-mail', '<rect x="3" y="5.5" width="18" height="13" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="m3.6 6.6 8.4 6.2 8.4-6.2" fill="none" stroke="currentColor" stroke-width="1.4"/>'],
    ['i-phone', '<path d="M6 3.8h3l1.4 3.6-2 1.4a10.6 10.6 0 0 0 4.8 4.8l1.4-2 3.6 1.4v3a1.8 1.8 0 0 1-2 1.8C10.4 17.2 6.8 13.6 4.2 5.8A1.8 1.8 0 0 1 6 3.8Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>'],
    ['i-pin', '<path d="M12 21c4.2-4.6 6.3-7.8 6.3-10.3A6.3 6.3 0 0 0 5.7 10.7C5.7 13.2 7.8 16.4 12 21Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="12" cy="10.4" r="2.3" fill="none" stroke="currentColor" stroke-width="1.4"/>'],
    ['i-clock', '<circle cx="12" cy="12" r="8.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M12 7.4V12l3.4 2.1" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>'],
    ['i-youtube', '<rect x="2.6" y="5.6" width="18.8" height="12.8" rx="3.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M10.4 9.4 15 12l-4.6 2.6z" fill="currentColor"/>'],
    ['i-facebook', '<path d="M14.6 21v-7.2h2.6l.4-3.1h-3V8.7c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.3H9.2v3.1h2.2V21z" fill="currentColor"/>'],
    ['i-instagram', '<rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="17" cy="7" r="1.1" fill="currentColor"/>'],
    ['i-linkedin', '<path d="M4.4 9.4h3.2V20H4.4zM6 4a1.9 1.9 0 1 1 0 3.8A1.9 1.9 0 0 1 6 4Zm5 5.4h3v1.5c.6-1 1.7-1.8 3.3-1.8 2.6 0 3.5 1.7 3.5 4.5V20h-3.2v-5.5c0-1.4-.5-2.2-1.6-2.2s-2 .8-2 2.3V20h-3z" fill="currentColor"/>'],
    ['i-apple', '<path d="M15.8 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.9-1.5-.1-2.9.8-3.7.8s-1.9-.8-3.1-.8C6 7.2 4.4 8.9 4.4 12.3c0 3.4 2.2 7 3.9 7 .8 0 1.6-.7 2.7-.7s1.8.7 2.9.7 3.1-2.1 3.4-4.2c-1.6-.6-2.4-1.6-2.4-2.5ZM13.5 5.5c.6-.8 1-1.8.9-2.9-.9.1-2 .6-2.6 1.4-.6.7-1 1.7-.9 2.8 1 .1 2-.5 2.6-1.3Z" fill="currentColor"/>'],
    ['i-spotify', '<circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M7.6 9.6c3-.8 6-.6 8.6.8M8.2 12.3c2.4-.6 4.8-.4 6.9.7M8.8 14.8c1.9-.5 3.8-.3 5.5.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>'],
    ['i-download', '<path d="M12 4v10m0 0 4-4m-4 4-4-4M5 18.5h14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>'],
    ['i-quote', '<path d="M9.5 6.5C6.8 7.7 5.4 9.8 5.4 12.8v4.7h5.2v-5.2H8c0-1.7.6-2.9 1.9-3.6Zm9 0c-2.7 1.2-4.1 3.3-4.1 6.3v4.7h5.2v-5.2H17c0-1.7.6-2.9 1.9-3.6Z" fill="currentColor"/>'],
    ['i-scroll', '<path d="M12 4v13m0 0 4.2-4.2M12 17l-4.2-4.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 20.5h12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>'],
    ['i-fhole', '<path d="M13.8 2.6c-1.8 2.4-2.6 4.4-2.4 6.1.2 1.5 1.2 2 1.1 3.1-.1 1-1.1 1.5-2.2 2.7-1.1 1.2-1.7 2.5-1.7 3.9 0 2 1.1 3.4 2.7 4.9.9.9 1.6 1.9 1.9 3.2m.3-24c1.3 1.5 2 3 2 4.6 0 1.4-.5 2.4-1.4 3.3" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>'],
    ['i-metronome', '<path d="M9.4 20.4h5.2L12.9 4h-1.8Z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M11 13.4 15.6 6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M8.2 20.4h7.6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>'],
    ['i-book', '<path d="M4 5.2h5.4c1.4 0 2.6 1 2.6 2.3v11c0-1.3-1.2-2.3-2.6-2.3H4Zm16 0h-5.4c-1.4 0-2.6 1-2.6 2.3v11c0-1.3 1.2-2.3 2.6-2.3H20Z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>'],
    ['i-video', '<rect x="3" y="6" width="12.6" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="m16.6 12.8 4.2 2.8V8.4l-4.2 2.8z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>'],
    ['i-users', '<circle cx="9" cy="8.6" r="3.2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M3.6 19.4c.4-2.9 2.6-4.6 5.4-4.6s5 1.7 5.4 4.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M16.2 6.2a3.2 3.2 0 0 1 0 5.6M17.6 15.4c1.8.5 3 1.9 3.3 4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>']
  ];
  var markup = '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true"><defs>' +
    S.map(function (i) { return '<symbol id="' + i[0] + '" viewBox="0 0 24 24">' + i[1] + '</symbol>'; }).join('') +
    '</defs></svg>';

  /* Loaded in <head>: write the sprite during parsing so every <use href="#i-...">
     resolves at first paint (and still works from file://). */
  if (!document.body) { document.write(markup); }
  else { document.body.insertAdjacentHTML('afterbegin', markup); }
  return;

  var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden');
  s.setAttribute('aria-hidden', 'true');
  s.innerHTML = '<defs>' + S.map(function (i) {
    return '<symbol id="' + i[0] + '" viewBox="0 0 24 24">' + i[1] + '</symbol>';
  }).join('') + '</defs>';
  document.addEventListener('DOMContentLoaded', function () {
    document.body.insertBefore(s, document.body.firstChild);
  });
  if (document.readyState !== 'loading') {
    setTimeout(function () { if (!s.parentNode) document.body.insertBefore(s, document.body.firstChild); }, 0);
  }
})();

/* helper class for sprite icons, injected into the stylesheet at runtime as a
   safety net for pages that load design.css before this script */
var st = document.createElement('style');
st.textContent = '.ic{width:1em;height:1em;flex:none}';
document.head.appendChild(st);
