/* old hash links (#/work/luna-care, #/about, #/contact …) become real
         URLs (/work/luna-care/, /about/, /#contact) before anything renders */
(function () {
  try {
    const h = location.hash;
    if (!/^#\//.test(h) || !/^\/(index\.html)?$/.test(location.pathname)) { return; }
    const r = h.slice(1).replace(/\/+$/, '');
    const to = !r
      ? '/'
      : /^\/(services|contact)$/.test(r)
        ? '/#' + r.slice(1)
        : r + '/';
    history.replaceState(null, '', to);
  } catch (e) {}
})();
/* ===== Cookies y Google Analytics =====
   ┌─ LO ÚNICO QUE HAY QUE TOCAR ESTÁ ACÁ ABAJO ─────────────────────────────┐
   │ GA_ID : ID de medición de Google Analytics 4 (G-XXXXXXXXXX). Es el que   │
   │         está activo: mide apenas se activa, sin configurar nada más.    │
   │ GTM_ID: contenedor de Google Tag Manager. Si algún día querés medir     │
   │         desde Tag Manager, poné ahí el ID (GTM-XXXXXXX) y vaciá GA_ID:  │
   │         manda GTM y las etiquetas se configuran en tagmanager.google.com │
   └─────────────────────────────────────────────────────────────────────────┘
   NADA de Google se carga hasta que la persona ACEPTA en el aviso de cookies:
   sin consentimiento no se instala ninguna cookie ni se hace ningún pedido a
   Google (lo que pide Google: "informar a los usuarios y darles la oportunidad
   de otorgar o negar su consentimiento" — support.google.com/analytics/
   answer/6004245). Si rechaza o cierra el aviso, no se carga nada y la decisión
   se recuerda: el aviso no vuelve a aparecer. */
var GTM_ID = '';
var GA_ID = 'G-9GJH42X2J8';

var CONSENT_KEY = 'ja-consent';

function jaConsentState () {
  try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
}
function jaConsentStore (value) {
  try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
}
/* `gtag` sólo empuja cosas a dataLayer (no hace ningún pedido de red) */
function jaGtag () {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }
  window.gtag.apply(null, arguments);
}
/* Consent mode v2: por defecto TODO negado. La publicidad queda siempre negada
   (este sitio no hace publicidad); sólo se habilita "analytics" al aceptar. */
jaGtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
});
function jaConsentUpdate (granted) {
  jaGtag('consent', 'update', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
  });
}
/* Carga Google Tag Manager (o gtag.js) — sólo se llama con consentimiento */
function jaLoadTags () {
  if (window.__jaTags) { return true; }
  window.__jaTags = true;
  if (GTM_ID && /^GTM-[A-Z0-9]+$/.test(GTM_ID)) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var gtm = document.createElement('script');
    gtm.async = true;
    gtm.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(gtm);
    return true;
  }
  if (GA_ID && /^G-[A-Z0-9]+$/.test(GA_ID)) {
    var ga = document.createElement('script');
    ga.async = true;
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(ga);
    jaGtag('js', new Date());
    /* send_page_view:false porque el router avisa cada ruta por su cuenta
       (window.jaTrack), así no se cuentan dos veces */
    jaGtag('config', GA_ID, { send_page_view: false });
    return true;
  }
  return false;
}
/* El router llama a esto en cada cambio de ruta: el sitio es de una sola página
   y sin esto Analytics vería únicamente la primera pantalla. */
window.jaTrack = function (path, title) {
  if (jaConsentState() !== 'granted') { return; }
  var location_ = window.location.origin + path;
  if (GTM_ID) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'page_view',
      page_location: location_,
      page_path: path,
      page_title: title,
    });
  } else if (GA_ID) {
    jaGtag('event', 'page_view', {
      page_location: location_,
      page_path: path,
      page_title: title,
    });
  }
};

/* ---- el aviso de cookies ----
   Se muestra UNA sola vez (si ya aceptó, rechazó o lo cerró, no vuelve nunca) y
   recién con el primer scroll, para no tapar la animación de la home. */
function jaBannerEl () { return document.getElementById('cookies'); }
function jaBannerWire () {
  var el = jaBannerEl();
  if (!el || el.getAttribute('data-wired')) { return; }
  el.setAttribute('data-wired', '1');
  el.querySelectorAll('[data-cookies]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      jaCookieDecision(btn.getAttribute('data-cookies'));
    });
  });
  var x = el.querySelector('[data-cookies-close]');
  if (x) { x.addEventListener('click', function () { jaCookieDecision('dismissed'); }); }
}
function jaBannerShow () {
  var el = jaBannerEl();
  if (!el) { return; }
  jaBannerWire();
  el.hidden = false;
}
function jaBannerHide () {
  var el = jaBannerEl();
  if (el) { el.hidden = true; }
}
/* 'granted' | 'denied' | 'dismissed' — los tres se recuerdan */
function jaCookieDecision (state) {
  jaConsentStore(state);
  if (state === 'granted') { jaLoadTags(); }
  jaConsentUpdate(state === 'granted');
  jaBannerHide();
}
(function () {
  var state = jaConsentState();
  if (state === 'granted') { jaLoadTags(); jaConsentUpdate(true); }
  var init = function () {
    /* el botón "Cookie settings" del pie (y cualquier otro) reabre el aviso */
    document.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target.closest('[data-cookies-open]') : null;
      if (!t) { return; }
      e.preventDefault();
      jaBannerShow();
    });
    if (state) { return; } /* ya eligió: el aviso no aparece más */
    var shown = false;
    var reveal = function () {
      if (shown) { return; }
      shown = true;
      jaBannerShow();
    };
    /* si la página ya viene scrolleada (deep link a #contact) aparece enseguida */
    if (window.scrollY > 4) { reveal(); }
    /* primer gesto de la persona: scroll, rueda del mouse o toque en el celular */
    ['scroll', 'wheel', 'touchstart'].forEach(function (ev) {
      addEventListener(ev, reveal, { once: true, passive: true });
    });
  };
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();

/* loader plays once per browser session, and never on a deep link */
(function () {
  try {
    const deep = !/^\/(index\.html)?$/.test(location.pathname);
    const seen = sessionStorage.getItem('ja-loader-seen') === '1';
    sessionStorage.setItem('ja-loader-seen', '1');
    if (deep || seen) { document.documentElement.classList.add('no-loader'); }
  } catch (e) {}
})();
/* last-resort net: if main.js never boots (script error, 404, very slow
   disk) drop the loader so the page can never stay trapped behind it */
(function () {
  window.addEventListener('load', function () {
    setTimeout(function () {
      if (document.documentElement.classList.contains('-booted')) { return; }
      const l = document.getElementById('loader');
      if (l && l.parentNode) { l.remove(); }
    }, 5000);
  });
})();
