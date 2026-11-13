
/* ==========================================================
   DATA — featured:true = homepage split showcase (3)
   ========================================================== */
const SITE = window.SITE || {};
const PROFILE = SITE.profile || {};
const PROJECTS = SITE.projects || [];
const FEATURED = PROJECTS.filter((p) => p.featured);
const pad2 = (n) => String(n).padStart(2, '0');
/* project titles are arrays; tolerate a plain string too */
const titleArr = (t) => (Array.isArray(t) ? t : [String(t)]);
/* what the case page itself is called. `p.name` is the listing name used by the
   work index, the home showcase and the structured data; `p.title` is the case
   page's own title, and the two can differ on purpose. */
const caseName = (p) => titleArr(p.title).join(' ') || p.name;
/* long titles get a smaller type size so they hold one line where they can */
const fitClass = (t) => {
  const n = Math.max(...titleArr(t).map((x) => String(x).length));
  return n > 21 ? ' -fit2' : n > 14 ? ' -fit' : '';
};
const SERVICES = SITE.services || [];
const PRINCIPLES = SITE.principles || [];

/* ==========================================================
   ENGINE
   ========================================================== */
(function () {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof gsap !== 'undefined';
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const animOn = hasGSAP && !reduced;
  const desk = innerWidth > 820;

  /* the crawler copy from build.mjs; the real page renders below */
  const prerender = document.getElementById('prerender');
  if (prerender) prerender.remove();

  /* ---- hydrate static markup from content.js (images, email, socials) ---- */
  function hydrateStatic () {
    const P = PROFILE;
    (P.heroChips || []).forEach((src, i) => {
      const img = document.querySelectorAll('#heroH1 [data-chip] img')[i];
      if (img && src) img.src = src;
    });
    const ph = document.getElementById('portraitImg');
    if (ph && P.portrait) ph.src = P.portrait;
    if (P.email) {
      document
        .querySelectorAll('[data-mail]')
        .forEach((a) => (a.href = 'mailto:' + P.email));
      document
        .querySelectorAll('[data-mail-text]')
        .forEach((a) => (a.textContent = P.email));
    }
    if (P.domain) {
      document.querySelectorAll('[data-domain]').forEach((a) => {
        a.textContent = P.domain;
        a.href = 'https://' + P.domain;
      });
    }
    const soc = P.socials || {};
    document.querySelectorAll('[data-social]').forEach((a) => {
      const k = a.getAttribute('data-social');
      if (soc[k] && soc[k] !== '#') a.href = soc[k];
    });
  }
  hydrateStatic();


  /* project counts come from SITE.projects */
  document
    .querySelectorAll('[data-n-featured]')
    .forEach((el) => (el.textContent = pad2(FEATURED.length)));
  document
    .querySelectorAll('[data-n-all]')
    .forEach((el) => (el.textContent = pad2(PROJECTS.length)));

  if (animOn) {
    gsap.set('#heroH1 .line > span', { yPercent: 115 });
    gsap.set('[data-chip]', { scaleX: 0 });
    gsap.set('.hero__meta,.hero__row', { opacity: 0 });
  }

  /* smooth scroll */
  let lenis = null;
  if (!reduced && typeof Lenis !== 'undefined') {
    try {
      lenis = new Lenis({ lerp: 0.08 });
      const raf = (t) => {
        lenis.raf(t);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
      if (hasGSAP) lenis.on('scroll', ScrollTrigger.update);
    } catch (e) {
      lenis = null;
    }
  }
  /* Both the native scroll AND Lenis are reset: Lenis keeps its own cached
     scroll position, so a native restore (reload / deep link) leaves it thinking
     it is already at the top and it would never move. */
  const toTop = () => {
    scrollTo(0, 0);
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(0, { immediate: true });
    }
  };
  /* Every page must open at its own top — with the title. The browser's default
     ("auto") restores the scroll position of the URL being loaded, so reloading
     or re-opening a case dropped you straight back at the gallery. */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  /* A case / work / about page always opens at its own top. Two things fight
     that: the browser re-applies its restored scroll position AFTER we render,
     and Lenis keeps its own cached position and scrolls back to it on its next
     frame. So re-assert the top for a moment. It stops the instant the user
     scrolls, so it never fights them. */
  function openAtTop (ms) {
    const until = performance.now() + (ms || 2500);
    let stop = false;
    const cancel = () => { stop = true; };
    addEventListener('wheel', cancel, { passive: true, once: true });
    addEventListener('touchstart', cancel, { passive: true, once: true });
    addEventListener('keydown', cancel, { once: true });
    (function tick () {
      if (stop || performance.now() > until) return;
      if (scrollY > 1) toTop();
      requestAnimationFrame(tick);
    })();
  }
  const scrollToEl = (el) => {
    if (!el) return;
    if (!lenis) return el.scrollIntoView({ behavior: 'smooth' });
    /* the page may just have grown (pins built): measure first */
    lenis.resize();
    lenis.scrollTo(el);
  };

  /* ==========================================================
     PIXEL SYSTEM — self-driven. No ScrollTrigger dependency.
     Strips register themselves; one rAF loop reads live rects,
     so pinning / layout shifts / CDN failures can't kill it.
     ========================================================== */
  const STRIPS = [];
  function buildPixelStrip (el) {
    el.innerHTML = '';
    const cols = Math.max(10, Math.round(innerWidth / 80));
    const rows = 6;
    el.style.gridTemplateColumns = `repeat(${cols},1fr)`;
    el.style.gridTemplateRows = `repeat(${rows},1fr)`;
    const up = el.dataset.pxt !== 'down';
    const cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = document.createElement('i');
        const bias = up ? (rows - 1 - r) / rows : r / rows;
        i._t = Math.min(0.98, bias * 0.68 + Math.random() * 0.44);
        i._on = false;
        el.appendChild(i);
        cells.push(i);
      }
    }
    if (reduced) {
      cells.forEach((c) => (c.style.opacity = 1));
      return;
    }
    STRIPS.push({ el, cells, last: -1 });
  }
  (function pixelLoop () {
    const vh = innerHeight;
    for (let s = STRIPS.length - 1; s >= 0; s--) {
      const strip = STRIPS[s];
      if (!document.contains(strip.el)) {
        STRIPS.splice(s, 1);
        continue;
      }
      if (strip.el.offsetParent === null) continue; /* hidden page */
      const r = strip.el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) continue;
      let p = (vh * 0.96 - r.top) / (vh * 0.66 + r.height);
      p = Math.max(0, Math.min(1, p));
      if (Math.abs(p - strip.last) < 0.008) continue;
      strip.last = p;
      for (const c of strip.cells) {
        const on = p > c._t;
        if (on !== c._on) {
          c._on = on;
          c.style.opacity = on ? 1 : 0;
        }
      }
    }
    requestAnimationFrame(pixelLoop);
  })();

  /* generic pixel-cell stagger (menu / fallbacks) — gsap-free */
  function staggerCells (cells, on, total = 420) {
    const order = [...cells].sort(() => Math.random() - 0.5);
    order.forEach((c, i) =>
      setTimeout(
        () => {
          c.style.opacity = on ? 1 : 0;
        },
        (i / order.length) * total,
      ),
    );
  }

  /* ---- circle cursor: ring states, per-target labels ---- */
  const cursor = document.getElementById('cursor');
  const cursorLbl = document.getElementById('cursorLbl');
  if (fine && !reduced) {
    let mx = innerWidth / 2;
    let my = innerHeight / 2;
    let cx = mx;
    let cy = my;
    addEventListener(
      'mousemove',
      (e) => {
        mx = e.clientX;
        my = e.clientY;
      },
      { passive: true },
    );
    (function loop () {
      cx += (mx - cx) * 0.22;
      cy += (my - cy) * 0.22;
      cursor.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
  }
  function bindCursor (scope) {
    if (!fine || reduced) return;
    /* big case targets: large labelled ring */
    scope.querySelectorAll('.wfull,.mslide,.wirow').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorLbl.textContent = 'Read case';
        cursor.classList.add('-case');
      });
      el.addEventListener('mouseleave', () =>
        cursor.classList.remove('-case'),
      );
    });
    scope.querySelectorAll('.lt__media').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorLbl.textContent = 'Read';
        cursor.classList.add('-case');
      });
      el.addEventListener('mouseleave', () => cursor.classList.remove('-case'));
    });
    scope.querySelectorAll('.case__next,.pnext__a').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorLbl.textContent = 'Next up';
        cursor.classList.add('-case');
      });
      el.addEventListener('mouseleave', () =>
        cursor.classList.remove('-case'),
      );
    });
    /* cualquier elemento puede pedir su propia etiqueta con data-cur="…": se usa
       en los íconos de las apps de Luna ("Visit app"). Misma estética que las
       demás: el aro grande con el texto adentro. */
    scope.querySelectorAll('[data-cur]').forEach((el) => {
      const label = el.getAttribute('data-cur');
      el.addEventListener('mouseenter', () => {
        cursorLbl.textContent = label;
        cursor.classList.add('-case');
      });
      el.addEventListener('mouseleave', () =>
        cursor.classList.remove('-case'),
      );
    });
    /* everything else interactive: hollow ring */
    scope
      .querySelectorAll(
        'a:not(.wfull):not(.mslide):not(.case__next):not(.wirow):not(.pnext__a):not([data-cur]),button:not([data-cur])',
      )
      .forEach((el) => {
        el.addEventListener('mouseenter', () =>
          cursor.classList.add('-ring'),
        );
        el.addEventListener('mouseleave', () =>
          cursor.classList.remove('-ring'),
        );
      });
  }

  /* El chip de "Big impact" de la página de work: se inclina siguiendo el mouse
     (rotateX/rotateY con un poco de escala) y vuelve a su lugar al salir. Sólo con
     mouse fino y sin "reduced motion": en táctil no hay hover que seguir, y sin
     perspectiva (la del CSS, en `.windex__row`) no se leería como 3D. */
  function bindImpactChip (scope) {
    const chip = scope.querySelector('#impactChip');
    if (!chip || !fine || reduced) return;
    chip.addEventListener('mousemove', (e) => {
      const r = chip.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      chip.style.transform = `translateY(-4px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) scale(1.035)`;
    });
    chip.addEventListener('mouseleave', () => {
      chip.style.transform = '';
    });
  }

  /* ---- magnets ---- */
  function bindMagnets (scope) {
    if (!fine || !animOn) return;
    scope.querySelectorAll('[data-magnet]').forEach((el) => {
      if (el._mag) return;
      el._mag = true;
      const k = +el.dataset.magnet || 0.25;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - (r.left + r.width / 2)) * k,
          y: (e.clientY - (r.top + r.height / 2)) * k,
          duration: 0.5,
          ease: 'power3.out',
        });
      });
      el.addEventListener('mouseleave', () =>
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1,.4)',
        }),
      );
    });
  }

  /* ---- word splitter ---- */
  function splitWords (el) {
    /* recurse so words INSIDE <b>/<em> also become individual .w spans —
       otherwise a long bold phrase is one unbreakable unit and blows a gap. */
    const build = (node) => {
      const out = [];
      node.childNodes.forEach((ch) => {
        if (ch.nodeType === 3) {
          ch.textContent.split(/(\s+)/).forEach((part) => {
            if (part === '') return;
            if (/^\s+$/.test(part)) {
              out.push(document.createTextNode(' '));
              return;
            }
            const w = document.createElement('span');
            w.className = 'w';
            w.textContent = part;
            out.push(w);
          });
        } else if (ch.nodeType === 1) {
          const clone = ch.cloneNode(false);
          build(ch).forEach((n) => clone.appendChild(n));
          out.push(clone);
        }
      });
      return out;
    };
    const kids = build(el);
    el.innerHTML = '';
    kids.forEach((n) => el.appendChild(n));
    return el.querySelectorAll('.w');
  }

  /* ---- blinds ---- */
  function buildBlinds (el) {
    const n = 7;
    for (let i = 0; i < n; i++) { el.appendChild(document.createElement('i')); }
    if (!animOn) {
      el.remove();
      return;
    }
    gsap.to(el.querySelectorAll('i'), {
      scaleY: 0,
      transformOrigin: (i) => (i % 2 ? 'top' : 'bottom'),
      duration: 0.9,
      ease: 'power4.inOut',
      stagger: 0.06,
      delay: 0.15,
      onComplete () {
        el.remove();
      },
    });
  }

  /* ==========================================================
     WORK: split columns. Both columns contain the FULL
     composition (image + title spanning 100vw), clipped to
     their half. Left counter-scrolls against right → the
     title tears in half at the seam mid-transition.
     ========================================================== */
  const wshow = document.getElementById('wshow');
  const showCur = document.getElementById('showCur');
  const N = FEATURED.length;

  /* ---- chips de premios (Luna Care) ----
     Misma píldora que usa el sitio (borde, texto en versalitas, mucho tracking),
     pero más grande y en dorado / plateado, para que los dos premios salten a la
     vista. El trofeo es un SVG simple que hereda el color del chip (currentColor):
     el dorado lleva trofeo dorado y el plateado, plateado, siempre a la izquierda
     del texto. Con `compact` se achica para la portada. */
  const TROPHY =
    '<svg class="awd__ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    /* copa */
    '<path d="M8 3.6h8v5a4 4 0 0 1-8 0v-5Z"/>' +
    /* asas */
    '<path d="M8 5.1H5.6a.6.6 0 0 0-.6.6V7a3.4 3.4 0 0 0 3.4 3.4"/>' +
    '<path d="M16 5.1h2.4a.6.6 0 0 1 .6.6V7a3.4 3.4 0 0 1-3.4 3.4"/>' +
    /* pie */
    '<path d="M12 12.6v2.6"/>' +
    '<path d="M10.1 15.2h3.8l.7 3.3a.6.6 0 0 1-.6.8H10a.6.6 0 0 1-.6-.8l.7-3.3Z"/>' +
    /* base */
    '<path d="M8.6 20.4h6.8"/>' +
    '</svg>';

  function awardsHTML (p, compact) {
    if (!Array.isArray(p.awards) || !p.awards.length) return '';
    const items = p.awards
      .map((a) => {
        const txt = `<span class="awd__txt">${a.label}</span>`;
        const cls = `awd -${a.tier || 'gold'}`;
        /* En la portada el destacado entero YA es un link, así que adentro va como
           elemento (links anidados son HTML inválido): quien hace clic entra al
           caso y ahí están los links de verdad, con el cursor "SEE TROPHYS". */
        return compact
          ? `<span class="${cls}">${TROPHY}${txt}</span>`
          : `<a class="${cls}" href="${a.href}" target="_blank" rel="noopener" data-cur="SEE TROPHYS">${TROPHY}${txt}</a>`;
      })
      .join('');
    return `<span class="awds${compact ? ' -mini' : ''}">${items}</span>`;
  }

  function fullHTML (p, i) {
    return `<a class="wfull" data-pid="${p.id}" href="/work/${p.id}/" aria-label="${p.name} — open case study">
      <img src="${p.imgs[0]}" alt="${p.name} — ${p.category} case study cover, designed by Julia Arena" loading="${i ? 'lazy' : 'eager'}">
      <span class="wfull__ui">
        ${awardsHTML(p, true)}
        <span class="wfull__tags">${p.tags.map((t) => t).join('<i>·</i>')}</span>
        <span class="wfull__name">${titleArr(p.title).join('<br>')}</span>
      </span>
    </a>`;
  }
  let trackL = null;
  let trackR = null;
  if (desk) {
    const colL = document.createElement('div');
    colL.className = 'wcol -l';
    const colR = document.createElement('div');
    colR.className = 'wcol -r';
    trackL = document.createElement('div');
    trackL.className = 'wtrack';
    trackR = document.createElement('div');
    trackR.className = 'wtrack';
    trackL.style.height = trackR.style.height = N * 100 + '%';
    /* left: natural order · right: reversed order */
    FEATURED.forEach((p, i) => {
      const c = document.createElement('div');
      c.className = 'wcell';
      c.style.height = 100 / N + '%';
      c.innerHTML = fullHTML(p, i);
      trackL.appendChild(c);
    });
    [...FEATURED].reverse().forEach((p) => {
      const i = FEATURED.indexOf(p);
      const c = document.createElement('div');
      c.className = 'wcell';
      c.style.height = 100 / N + '%';
      c.innerHTML = fullHTML(p, i);
      trackR.appendChild(c);
    });
    colL.appendChild(trackL);
    colR.appendChild(trackR);
    wshow.appendChild(colL);
    wshow.appendChild(colR);
    /* the two halves only line up if the composition is exactly as wide as the
       showcase itself. 100vw includes the scrollbar, so on browsers with a
       classic scrollbar the halves drifted apart and ate a slice at the seam. */
    const sizeComposition = () => {
      const w = wshow.clientWidth || document.documentElement.clientWidth;
      if (w) wshow.style.setProperty('--wfull-w', w + 'px');
    };
    sizeComposition();
    addEventListener('resize', sizeComposition);
    /* hover on one half lights BOTH halves of the same project */
    if (fine) {
      wshow.addEventListener('mouseover', (e) => {
        const f = e.target.closest('.wfull');
        if (!f) return;
        wshow
          .querySelectorAll('.wfull.-hov')
          .forEach((x) => x.classList.remove('-hov'));
        wshow
          .querySelectorAll(`.wfull[data-pid="${f.dataset.pid}"]`)
          .forEach((x) => x.classList.add('-hov'));
      });
      wshow.addEventListener('mouseleave', () => {
        wshow
          .querySelectorAll('.wfull.-hov')
          .forEach((x) => x.classList.remove('-hov'));
      });
    }
  }
  /* ALWAYS build mobile cards too — CSS shows them under 820px, so a phone
     visitor (or a narrowed desktop) is never left with an empty showcase. */
  {
    const ms = document.getElementById('mslides');
    FEATURED.forEach((p, i) => {
      const a = document.createElement('a');
      a.className = 'mslide';
      a.href = '/work/' + p.id + '/';
      a.setAttribute('aria-label', `${p.name} — open case study`);
      a.innerHTML = `<img src="${p.imgs[0]}" alt="${p.name} — ${p.category} case study cover, designed by Julia Arena" loading="lazy">
        <span class="mslide__ui">
          <span class="mslide__top">
            <span class="lbl -plain num">${pad2(i + 1)} / ${pad2(N)}</span>
            <span class="mslide__tags">${p.tags.slice(0, 2).join(' · ')}</span>
          </span>
          <span class="mslide__foot">
            ${awardsHTML(p, true)}
            <span class="mslide__name">${p.name}</span>
            <span class="mslide__cta">Read case <b>↗</b></span>
          </span>
        </span>`;
      ms.appendChild(a);
    });
  }

  /* ---- services ---- */
  const srvList = document.getElementById('srvList');
  SERVICES.forEach((s, i) => {
    const d = document.createElement('div');
    d.className = 'srv';
    d.innerHTML = `
      <button class="srv__head" aria-expanded="false">
        <span class="srv__idx num">0${i + 1}</span>
        <span class="srv__name">${s.name}</span>
        <span class="srv__count">${s.count}</span>
        <span class="srv__plus" aria-hidden="true"></span>
      </button>
      <div class="srv__body"><div class="srv__inner">
        <p>${s.desc}</p>
        <div class="srv__chips">${s.chips.map((c) => `<span>${c}</span>`).join('')}</div>
      </div></div>`;
    srvList.appendChild(d);
  });
  function toggleSrv (srv, open) {
    const body = srv.querySelector('.srv__body');
    srv.classList.toggle('-open', open);
    srv.querySelector('.srv__head').setAttribute('aria-expanded', open);
    if (animOn) {
      gsap.to(body, {
        height: open ? 'auto' : 0,
        duration: 0.6,
        ease: 'power3.inOut',
        onComplete: () => ScrollTrigger.refresh(),
      });
    } else body.style.height = open ? 'auto' : '0px';
  }
  /* One behaviour for both accordions ("What I do" on the home, "Principles" on
     About). Desktop keeps its hover-to-open. Touch devices cannot lean on the
     browser's synthetic click: if the finger drifts a handful of pixels the
     browser reads the gesture as a scroll, fires pointercancel and never sends a
     click, so the panel simply never opened. We resolve the tap on touchend. */
  const TAP_SLOP = 18; /* px of finger travel that still counts as a tap */
  function bindAccordion (list) {
    let start = null;
    let fromTouch = false;

    function toggle (srv) {
      const isOpen = srv.classList.contains('-open');
      list.querySelectorAll('.srv.-open').forEach((o) => {
        if (o !== srv) toggleSrv(o, false);
      });
      toggleSrv(srv, !isOpen);
    }

    list.addEventListener('click', (e) => {
      /* already handled on touchend — swallow the duplicate */
      if (fromTouch) {
        fromTouch = false;
        return;
      }
      const head = e.target.closest('.srv__head');
      if (!head) return;
      toggle(head.parentElement);
    });

    list.addEventListener(
      'touchstart',
      (e) => {
        fromTouch = false;
        const head = e.target.closest('.srv__head');
        const t = e.changedTouches[0];
        start =
          head && t
            ? { srv: head.parentElement, x: t.clientX, y: t.clientY }
            : null;
      },
      { passive: true },
    );

    list.addEventListener(
      'touchend',
      (e) => {
        const s = start;
        const t = e.changedTouches[0];
        start = null;
        if (!s || !t) return;
        const travel = Math.max(
          Math.abs(t.clientX - s.x),
          Math.abs(t.clientY - s.y),
        );
        if (travel > TAP_SLOP) return; /* that was a scroll, not a tap */
        fromTouch = true; /* the browser may still fire a click — ignore it */
        toggle(s.srv);
      },
      { passive: true },
    );

    if (fine) {
      list.addEventListener('mouseover', (e) => {
        /* a tap on a hybrid device also fires mouseover — skip those */
        if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) {
          return;
        }
        const srv = e.target.closest('.srv');
        if (!srv || srv.classList.contains('-open')) return;
        list.querySelectorAll('.srv.-open').forEach((o) => toggleSrv(o, false));
        toggleSrv(srv, true);
      });
    }
  }
  bindAccordion(srvList);


  /* ---- menu (pixel bg guaranteed) ---- */
  const menu = document.getElementById('menu');
  const menuPx = document.getElementById('menuPx');
  const menuInner = document.getElementById('menuInner');
  const burger = document.getElementById('burger');
  let menuCells = [];
  let menuOpen = false;
  let menuHideTimer = null;
  function buildMenuPx () {
    menuPx.innerHTML = '';
    menuCells = [];
    const cols = Math.max(8, Math.round(innerWidth / 110));
    const rows = Math.max(5, Math.round(innerHeight / 110));
    menuPx.style.gridTemplateColumns = `repeat(${cols},1fr)`;
    menuPx.style.gridTemplateRows = `repeat(${rows},1fr)`;
    for (let k = 0; k < cols * rows; k++) {
      const i = document.createElement('i');
      menuPx.appendChild(i);
      menuCells.push(i);
    }
  }
  buildMenuPx();
  addEventListener('resize', buildMenuPx);
  function setMenu (open) {
    if (open === menuOpen) return;
    menuOpen = open;
    clearTimeout(menuHideTimer);
    burger.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    if (open && lenis) lenis.stop();
    if (!open && lenis) lenis.start();
    if (open) {
      document.body.classList.add('-menu'); /* show, then pixels in */
      staggerCells(menuCells, true, 420);
      if (animOn) {
        try {
          gsap.fromTo(
            menuInner,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.4,
              delay: 0.25,
              ease: 'power2.out',
            },
          );
          gsap.fromTo(
            '.menu__nav a',
            { y: 34, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.06,
              duration: 0.55,
              delay: 0.3,
              ease: 'power3.out',
            },
          );
          gsap.fromTo(
            '.menu__aside .grp',
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.06,
              duration: 0.45,
              delay: 0.4,
              ease: 'power3.out',
            },
          );
        } catch (e) {
          menuInner.style.opacity = 1;
        }
      } else menuInner.style.opacity = 1;
    } else {
      /* content out first, THEN pixels dissolve, THEN hide */
      if (animOn) {
        try {
          gsap.to(menuInner, {
            opacity: 0,
            duration: 0.2,
            ease: 'power2.in',
          });
        } catch (e) {
          menuInner.style.opacity = 0;
        }
      } else menuInner.style.opacity = 0;
      setTimeout(() => staggerCells(menuCells, false, 340), 160);
      menuHideTimer = setTimeout(() => {
        document.body.classList.remove('-menu');
      }, 560);
    }
  }
  burger.addEventListener('click', () => setMenu(!menuOpen));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });
  menu
    .querySelectorAll('[data-close]')
    .forEach((a) => a.addEventListener('click', () => setMenu(false)));
  /* (el logo también cierra el menú: los links [data-close] al instante, y el
     logo del header desde el handler global de navegación, que es el que cubre
     todos los caminos) */

  /* ---- pages ---- */
  let ctx = null;
  const pageHome = document.getElementById('page-home');
  const pageWork = document.getElementById('page-work');
  const pageAbout = document.getElementById('page-about');
  const pageCase = document.getElementById('page-case');
  const page404 = document.getElementById('page-404');
  const pages = [
    pageHome,
    pageWork,
    pageAbout,
    pageCase,
    page404,
  ];
  function activate (page) {
    pages.forEach((p) => p.classList.toggle('-active', p === page));
    document.body.classList.remove('-light-head');
    /* the old page's mouseleave never fires: drop its cursor state */
    cursor.classList.remove('-ring', '-case');

    document.body.classList.toggle('-case', page === pageCase);
  }

  function animateHome () {
    if (ctx) ctx.revert();
    document.querySelectorAll('#page-home .pxt').forEach(buildPixelStrip);
    if (!animOn) return;
    try {
      ctx = gsap.context(() => {
        gsap.utils.toArray('#heroH1 .line').forEach((line) => {
          gsap.to(line, {
            xPercent: +line.dataset.drift,
            ease: 'none',
            scrollTrigger: {
              trigger: '.hero',
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        });

        document.querySelectorAll('.mani [data-words]').forEach((p) => {
          if (!p.querySelector('.w')) splitWords(p);
          gsap.to(p.querySelectorAll('.w'), {
            opacity: 1,
            ease: 'none',
            stagger: 0.06,
            scrollTrigger: {
              trigger: p,
              start: 'top 82%',
              end: 'bottom 45%',
              scrub: true,
            },
          });
        });

        /* split-column showcase */
        if (desk && trackL) {
          const step =
                  100 / N; /* yPercent per slide, relative to track */
          gsap.set(trackR, {
            yPercent: -step * (N - 1),
          }); /* right starts on project 01 */
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: '#wshow',
              start: 'top top',
              end: '+=' + N * 100 + '%',
              pin: true,
              scrub: 0.6,
              onUpdate (self) {
                const i = Math.min(
                  N - 1,
                  Math.floor(self.progress * (N - 1) + 0.5),
                );
                showCur.textContent = pad2(i + 1);
              },
            },
          });
          for (let i = 0; i < N - 1; i++) {
            tl.to({}, { duration: 0.55 })
              .to(trackL, {
                yPercent: -step * (i + 1),
                duration: 1,
                ease: 'power3.inOut',
              })
              .to(
                trackR,
                {
                  yPercent: -step * (N - 1 - (i + 1)),
                  duration: 1,
                  ease: 'power3.inOut',
                },
                '<',
              );
          }
          tl.to({}, { duration: 0.55 });
        }

        gsap.from('.services__intro', {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: { trigger: '.services', start: 'top 75%' },
        });
        gsap.from('.srv', {
          y: 40,
          opacity: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '#srvList', start: 'top 85%' },
        });

        gsap.from('#aboutH2 .line > span', {
          yPercent: 115,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.1,
          scrollTrigger: { trigger: '.about', start: 'top 72%' },
        });
        gsap.from('.about__portraitWrap', {
          clipPath: 'inset(100% 0 0 0)',
          duration: 1.1,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: '.about__portraitWrap',
            start: 'top 88%',
          },
        });
        gsap.fromTo(
          '#portraitImg',
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: '.about__portraitWrap',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
        document
          .querySelectorAll('.about__right [data-words]')
          .forEach((p) => {
            if (!p.querySelector('.w')) splitWords(p);
            gsap.to(p.querySelectorAll('.w'), {
              opacity: 1,
              ease: 'none',
              stagger: 0.03,
              scrollTrigger: {
                trigger: p,
                start: 'top 88%',
                end: 'bottom 55%',
                scrub: true,
              },
            });
          });
        gsap.utils.toArray('[data-count]').forEach((el) => {
          const end = +el.dataset.count;
          const suf = el.dataset.suffix || '';
          const o = { n: 0 };
          ScrollTrigger.create({
            trigger: el,
            start: 'top 90%',
            once: true,
            onEnter: () =>
              gsap.to(o, {
                n: end,
                duration: 1.4,
                ease: 'power2.out',
                onUpdate: () => (el.textContent = Math.round(o.n) + suf),
              }),
          });
        });


        gsap.to('#footLogo', {
          yPercent: -24,
          ease: 'none',
          scrollTrigger: {
            trigger: '.foot',
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
          },
        });
      }, pageHome);
    } catch (e) {
      console.warn('home anim', e);
    }
    bindMagnets(pageHome);
    if (hasGSAP) ScrollTrigger.refresh();
  }

  function heroIn () {
    if (!animOn) return;
    gsap.to('#heroH1 .line > span', {
      yPercent: 0,
      duration: 1.2,
      ease: 'power4.out',
      stagger: 0.09,
    });
    gsap.to('[data-chip]', {
      scaleX: 1,
      duration: 0.9,
      ease: 'power4.out',
      delay: 0.7,
      stagger: 0.15,
    });
    gsap.to('.hero__meta,.hero__row', {
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      delay: 0.35,
      stagger: 0.1,
    });
  }
  function heroInstant () {
    if (!animOn) return;
    gsap.set('#heroH1 .line > span', { yPercent: 0 });
    gsap.set('[data-chip]', { scaleX: 1 });
    gsap.set('.hero__meta,.hero__row', { opacity: 1 });
  }

  /* ---- WORK INDEX ---- */
  function renderWork () {
    document.title = 'Work — Julia Arena';
    setMeta({
      title: document.title,
      description: 'Selected work by Julia Arena — product designer for B2B SaaS, climate tech, healthtech and AI. Energy marketplaces, enterprise platforms, AI products and apps.',
      keywords: 'Julia Arena, product design portfolio, selected work, B2B SaaS, climate tech, sustainability, energy, healthtech, AI product design, design systems, UX, UI',
      robots: META_DOC.robots,
      path: '/work/',
    });
    pageWork.innerHTML = `
      <section class="windex">
        <div class="windex__head">
          <span class="lbl">All Work</span>
          <div class="windex__row">
            <h1>A few things<br><span class="o">I’ve made.</span></h1>
            <!-- el chip de "Big impact" cierra la fila del titular, pegado al margen
                 derecho (el layout está en .windex__row y el tilt en bindImpactChip) -->
            <div class="impact-chip" id="impactChip">
              <svg class="chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2Z"/>
              </svg>
              <span>Including this porfolio:<br>design and coded by me ;)</span>
            </div>
          </div>
        </div>
        <div id="wiList">
          ${PROJECTS.map(
    (p, i) => `
            <a class="wirow" href="/work/${p.id}/">
              <span class="wirow__idx num">${pad2(i + 1)}</span>
              <span class="wirow__name">${p.name}</span>
              <span class="wirow__cat">${p.category || p.tags[0]}</span>
              <span class="wirow__year num">${p.year}</span>
            </a>`,
  ).join('')}
        </div>
        <div class="windex__cta">
          <a class="btnAll" href="/#contact">Got a project? <b>Talk</b></a>
        </div>
      </section>`;
    bindCursor(pageWork);
    bindMagnets(pageWork);
    bindImpactChip(pageWork);
    if (ctx) ctx.revert();
    if (animOn) {
      try {
        ctx = gsap.context(() => {
          gsap.from('.windex__head h1', {
            y: 70,
            opacity: 0,
            duration: 1,
            ease: 'power4.out',
            delay: 0.1,
          });
          gsap.from('.wirow', {
            y: 44,
            opacity: 0,
            stagger: 0.08,
            duration: 0.85,
            ease: 'power3.out',
            delay: 0.2,
          });
        }, pageWork);
      } catch (e) {
        console.warn('work anim', e);
      }
      ScrollTrigger.refresh();
    }
  }

  /* ---- ABOUT PAGE ---- */
  function renderAbout () {
    document.title = 'About — Julia Arena';
    setMeta({
      title: document.title,
      description: 'About Julia Arena — a product designer based in Buenos Aires, working remotely with teams in Latin America, the US and Europe on B2B SaaS, climate tech, healthtech and AI products.',
      keywords: 'Julia Arena, about, product designer, Buenos Aires, Argentina, Latin America, remote, B2B SaaS, climate tech, healthtech, AI product design, lead product designer',
      robots: META_DOC.robots,
      path: '/about/',
    });
    pageAbout.innerHTML = `
      <section class="ahero">
        <div>
          <span class="lbl">About — Julia Arena</span>
          <h1>
            <span class="line"><span>It starts with</span></span>
            <span class="line"><span><span class="o" style="font-style:normal">curiosity</span>.</span></span>
          </h1>
          <p class="ahero__intro">I’ve spent seven years exploring the space between how things work and how they feel. I’m drawn to the <b>details others overlook</b>, the ideas worth exploring, and the challenge of <b>making complex things feel simple</b>. Here’s the thinking behind my work.</p>
        </div>
        <div class="ahero__right">
          <div class="about__portraitWrap" data-magnet="0.1">
            <figure class="about__portrait">
              <img id="aPortrait" src="${PROFILE.portrait || ''}" alt="Portrait of Julia Arena, Product Designer">
            </figure>
            <span class="badge" aria-hidden="true">
              <svg viewBox="0 0 112 112">
                <circle class="bg" cx="56" cy="56" r="56"></circle>
                <defs><path id="cir2" d="M56,56 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"></path></defs>
                <text><textPath href="#cir2">Open for select projects — 2026 —</textPath></text>
              </svg>
            </span>
          </div>
        </div>
      </section>

      <div class="mq" aria-hidden="true"><div class="mq__in">
        <b>Interfaces THAT <span class="o">INSPIRE</span> PEOPLE</b><b class="-ghost">Systems</b><b>Motion</b><b class="-ghost">Type</b><b>Detail</b><b class="-ghost">·</b>
        <b>Interfaces THAT <span class="o">INSPIRE</span> PEOPLE</b><b class="-ghost">Systems</b><b>Motion</b><b class="-ghost">Type</b><b>Detail</b><b class="-ghost">·</b>
      </div></div>
      <div class="mq -rev" aria-hidden="true"><div class="mq__in">
        <b class="-ghost">Buenos Aires</b><b>7 years</b><b class="-ghost">Calm surface</b><b><span class="o">Obsessive</span> underneath</b><b class="-ghost">·</b>
        <b class="-ghost">Buenos Aires</b><b>7 years</b><b class="-ghost">Calm surface</b><b><span class="o">Obsessive</span> underneath</b><b class="-ghost">·</b>
      </div></div>

      <section class="abio section">
        <span class="lbl">The story</span>
        <div class="abio__grid">
          <h2>Good design<br><span class="o">is never just</span> surface.</h2>
          <div class="abio__copy">
            <p data-words>Over the past <b>seven years</b>, I’ve worked across digital products, marketing, and visual design — from building a B2B platform for Schneider Electric to shaping brands and creating experiences for different industries. It’s taught me how to balance bold ideas with real-world needs, and <b>how to make design work for both people and business</b>.</p>
            <p data-words>What I bring goes beyond the screens. It’s the thinking behind them: understanding the problem, connecting user needs with business goals, and <b>turning complex requirements into experiences that feel clear, intuitive, and purposeful</b>.</p>
            <p data-words>And honestly, I’m a bit obsessed with this stuff. New tools, clever interactions, motion that makes sense, and finding ways to bring ideas to life. Off the clock, I’m usually experimenting with a side project or exploring what’s possible with AI and code. Design is more than my job — <b>it’s something I genuinely love doing</b>.</p>
            <div class="dossier">
              <div><small>Base</small><b>Buenos Aires, Argentina</b></div>
              <div><small>Experience</small><b>7+ years</b></div>
              <div><small>Focus</small><b>UI · UX · Product Design</b></div>
              <div><small>Sectors</small><b>SaaS · Technology · Energy · E-commerce · Digital Platforms</b></div>
              <div><small>Availability</small><b><span class="o">●</span> Open</b></div>
              <div><small>perfectionism</small><b>By default</b></div>
            </div>
          </div>
        </div>
      </section>

      <div class="pxt -toGrey" data-pxt="up" aria-hidden="true"></div>

      <section class="services">
        <div class="section">
          <span class="lbl">Principles</span>
          <h2 class="services__intro">How I think about design.</h2>
          <div id="prinList"></div>
          <div class="stats">
            <div><b class="num" data-count="7" data-suffix="+">0</b><small>Years in design</small></div>
            <div><b class="num" data-count="20" data-suffix="+">0</b><small>Projects shipped</small></div>
            <div><b class="num" data-count="100" data-suffix="%">0</b><small>Detail obsessed</small></div>
          </div>
        </div>
</section>

      <div class="pxt -toBlack" data-pxt="down" aria-hidden="true"></div>
            </div>


      <section class="acta">
        <span class="lbl">Like what you see?</span>
        <a class="foot__cta" data-mail href="mailto:juliaarena@hotmail.com" data-magnet="0.06">
          <span class="acta__roll roll"><span class="roll__in">
            <span class="roll__a">LET'S <span class="o">TALK</span></span>
            <span class="roll__b">LET'S TALK</span>
          </span></span>
        </a>
        <div class="acta__links">
          <a class="btnAll" href="/work/">See the work <b>${pad2(PROJECTS.length)}</b></a>
          <a class="btnAll" href="mailto:${PROFILE.email}">${PROFILE.email} <b>&#8599;</b></a>
        </div>
      </section>`;

    /* principles accordion (same pattern as services) */
    const prinList = pageAbout.querySelector('#prinList');
    PRINCIPLES.forEach((s2, i) => {
      const d = document.createElement('div');
      d.className = 'srv';
      d.innerHTML = `
        <button class="srv__head" aria-expanded="false">
          <span class="srv__idx num">0${i + 1}</span>
          <span class="srv__name">${s2.name}</span>
          <span class="srv__count">${s2.count}</span>
          <span class="srv__plus" aria-hidden="true"></span>
        </button>
        <div class="srv__body"><div class="srv__inner">
          <p>${s2.desc}</p>
          <div class="srv__chips">${s2.chips.map((c) => `<span>${c}</span>`).join('')}</div>
        </div></div>`;
      prinList.appendChild(d);
    });
    bindAccordion(prinList);

    bindCursor(pageAbout);
    bindMagnets(pageAbout);
    pageAbout.querySelectorAll('.pxt').forEach(buildPixelStrip);

    if (ctx) ctx.revert();
    if (animOn) {
      try {
        ctx = gsap.context(() => {
          gsap.from('.ahero h1 .line > span', {
            yPercent: 115,
            duration: 1.05,
            ease: 'power4.out',
            stagger: 0.09,
            delay: 0.15,
          });
          gsap.from('.ahero__intro,.ahero .lbl', {
            opacity: 0,
            y: 24,
            duration: 0.9,
            ease: 'power3.out',
            delay: 0.4,
            stagger: 0.08,
          });
          gsap.from('.ahero__right .about__portraitWrap', {
            clipPath: 'inset(100% 0 0 0)',
            duration: 1.1,
            ease: 'power4.inOut',
            delay: 0.3,
          });
          gsap.fromTo(
            '#aPortrait',
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: '.ahero__right',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          );
          pageAbout
            .querySelectorAll('.abio [data-words]')
            .forEach((p) => {
              if (!p.querySelector('.w')) splitWords(p);
              gsap.to(p.querySelectorAll('.w'), {
                opacity: 1,
                ease: 'none',
                stagger: 0.03,
                scrollTrigger: {
                  trigger: p,
                  start: 'top 88%',
                  end: 'bottom 55%',
                  scrub: true,
                },
              });
            });
          gsap.from('.dossier div', {
            y: 26,
            opacity: 0,
            stagger: 0.06,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.dossier', start: 'top 90%' },
          });
          gsap.from('#prinList .srv', {
            y: 40,
            opacity: 0,
            stagger: 0.08,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: '#prinList', start: 'top 85%' },
          });
          gsap.utils.toArray('#page-about [data-count]').forEach((el) => {
            const end = +el.dataset.count;
            const suf = el.dataset.suffix || '';
            const o = { n: 0 };
            ScrollTrigger.create({
              trigger: el,
              start: 'top 90%',
              once: true,
              onEnter: () =>
                gsap.to(o, {
                  n: end,
                  duration: 1.4,
                  ease: 'power2.out',
                  onUpdate: () =>
                    (el.textContent = Math.round(o.n) + suf),
                }),
            });
          });
          gsap.from('.acta', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.acta', start: 'top 85%' },
          });
        }, pageAbout);
      } catch (e) {
        console.warn('about anim', e);
      }
      ScrollTrigger.refresh();
    }
  }

  /* ==========================================================
     REVEALS — fail-safe. Content is visible by default (CSS sets no
     hidden states). A reveal only hides something that is still below
     the fold, right before it waits for it, and plays it when it comes
     in (IntersectionObserver, not ScrollTrigger: nothing to refresh,
     nothing to fire-and-forget). A watchdog settles anything in or above
     the viewport that is not fully shown: on scroll, resize,
     visibilitychange, pageshow and 2.5 s after each render; a reveal
     that started but has not landed after 2.6 s is set to its end state.
     ========================================================== */
  const RV = new Set();
  let rvIO = null;
  const rvBelow = (el) => {
    const b = el.getBoundingClientRect();
    return b.top > innerHeight * 0.96;
  };
  function rvStart (it) {
    if (it.t) return;
    it.t = performance.now();
    if (rvIO) rvIO.unobserve(it.el);
    try {
      it.play(() => rvDone(it));
    } catch (e) {
      rvDone(it, true);
    }
  }
  function rvDone (it, force) {
    if (!RV.has(it)) return;
    RV.delete(it);
    if (rvIO) rvIO.unobserve(it.el);
    if (force) it.settle();
  }
  /* spec: { hide(), play(done), settle() }; returns true if it was hidden */
  function reveal (el, spec, trigger) {
    if (!el) return false;
    const watch = trigger || el;
    const below = rvBelow(watch);
    /* in view already: shown as it is, unless it asks to play as a load moment */
    if (!animOn || (!below && !spec.inView)) {
      spec.settle();
      return false;
    }
    spec.hide();
    const it = Object.assign(spec.ref || {}, { el: watch, t: 0 }, spec);
    RV.add(it);
    if (!below) {
      rvStart(it);
      return true;
    }
    if (!rvIO && 'IntersectionObserver' in window) {
      rvIO = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (!e.isIntersecting) return;
            RV.forEach((x) => x.el === e.target && rvStart(x));
          }),
        { rootMargin: '0px 0px -6% 0px' },
      );
    }
    if (rvIO) rvIO.observe(watch);
    return true;
  }
  /* the common case: from some vars back to the element's own CSS */
  const RV_END = { opacity: 1, x: 0, y: 0, xPercent: 0, yPercent: 0, scale: 1, scaleX: 1, scaleY: 1, clipPath: 'inset(0% 0% 0% 0%)' };
  const rvGroup = { t: 0, n: 0 };
  function rvFrom (el, from, opt = {}) {
    const els = el && el.length !== undefined ? [...el] : [el];
    if (!els.length || !els[0]) return false;
    const keys = Object.keys(from);
    const to = {};
    keys.forEach((k) => (to[k] = RV_END[k]));
    const clear = keys.join(',');
    const it = {};
    return reveal(
      els[0],
      {
        ref: it,
        hide: () => gsap.set(els, from),
        play: (done) => {
          /* things that come in on the same frame go one after another */
          const now = performance.now();
          if (now - rvGroup.t > 60) rvGroup.n = 0;
          rvGroup.t = now;
          const delay = (opt.delay || 0) + Math.min(0.4, rvGroup.n++ * 0.06);
          /* the watchdog lands it if it has not by the time it should have */
          it.max = (delay + (opt.duration || 0.9) + (opt.stagger || 0) * (els.length - 1)) * 1000 + 400;
          gsap.to(els, { ...to, duration: opt.duration || 0.9, ease: opt.ease || 'power3.out', stagger: opt.stagger || 0, delay, overwrite: true, clearProps: clear, onComplete: done });
        },
        settle: () => {
          gsap.killTweensOf(els);
          gsap.set(els, { clearProps: clear });
        },
      },
      opt.trigger,
    );
  }
  /* load-time tweens (no scroll): land them if frames stall */
  function rvGuard (targets, props, ms = 2600) {
    const els = typeof targets === 'string' ? [...document.querySelectorAll(targets)] : [...targets];
    setTimeout(() => {
      els.forEach((e) => {
        if (!document.contains(e)) return;
        gsap.killTweensOf(e);
        gsap.set(e, { clearProps: props });
      });
    }, ms);
  }
  function rvCheck () {
    const now = performance.now();
    RV.forEach((it) => {
      if (!document.contains(it.el)) return RV.delete(it);
      if (it.t) {
        if (now - it.t > (it.max || 2600)) rvDone(it, true);
        return;
      }
      const b = it.el.getBoundingClientRect();
      if (b.bottom < 0) rvDone(it, true); /* passed without being seen: just show it */
      else if (b.top < innerHeight) rvStart(it);
    });
  }
  let rvLast = 0;
  addEventListener(
    'scroll',
    () => {
      if (!RV.size) return;
      const now = performance.now();
      if (now - rvLast < 90) return;
      rvLast = now;
      rvCheck();
    },
    { passive: true },
  );
  addEventListener('resize', rvCheck);
  addEventListener('pageshow', rvCheck);
  document.addEventListener('visibilitychange', rvCheck);
  setInterval(() => RV.size && rvCheck(), 1200);
  const rvAfterRender = () => {
    setTimeout(rvCheck, 2500);
    /* ScrollTrigger (parallax, header colour) measures again once fonts and images are in */
    if (hasGSAP) {
      requestAnimationFrame(() => ScrollTrigger.refresh());
      if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
  };
  addEventListener('load', () => hasGSAP && ScrollTrigger.refresh());

  /* ---- barrel gallery: scroll-driven 3D carousel + detail view ----
     The drum turns as the page scrolls (dragging also works, with inertia); it
     never moves on its own. Card size, drum radius and perspective are all
     derived from the barrel's rendered width and recomputed on resize, so the
     drum always spans the full screen and keeps its shape at any size. The
     container is measured after layout so the drum is never clipped.
     Only rendered for projects that carry a `gallery` array. */
  let barrelAbort = null;
  /* el prefetch de las fotos del detalle corre una sola vez por visita */
  let barrelPrefetched = false;
  function initBarrelGallery (scope, items) {
    const root = scope.querySelector('[data-barrel]');
    const detail = scope.querySelector('[data-barrel-detail]');
    if (!root || !detail || !items || !items.length) return;
    if (barrelAbort) barrelAbort.abort();
    barrelAbort = new AbortController();
    const { signal } = barrelAbort;

    const stage = root.querySelector('[data-barrel-stage]');
    const cards = [];
    items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'barrel__card';
      if (item.shape === 'circle') card.classList.add('-circle');
      if (item.shape === 'rect') card.classList.add('-rect');
      const img = document.createElement('img');
      /* the drum only ever shows a piece at card size (~330px wide), so it loads
         the light `-thumb.webp` that ships next to the full shot. The full file
         is still what the detail panel opens (and what its watermarked twin
         hands to "Open image in a new tab"), so nothing about the piece is lost
         — the page just no longer pulls ~6MB of full-size canvases to draw a
         row of small cards. */
      img.alt = `${item.title} — ${item.code || 'painting'}, hand-painted artwork by Julia Arena`;
      /* OJO con el orden: `loading` va ANTES de `src`. Si se asigna el src
         primero (y la imagen todavía no está en el documento) el navegador la
         deja diferida y el tambor se queda vacío un buen rato. */
      img.loading = 'eager';
      img.src = item.thumb || (item.shots && item.shots[0]) || item.src;
      img.draggable = false;
      card.appendChild(img);
      /* The invisible twin that hands the browser's own "Open image in a new tab"
         a watermarked copy (see the note on the panel twin below). It stays EMPTY
         until someone actually right-clicks: an <img> holding a big bitmap costs
         decode memory and compositing on every frame, and eight of those made the
         drum stutter while dragging. The blob is prepared ahead of time — a blob
         no element points at is never decoded, so preparing is cheap — and never
         while the drum is being dragged, because the canvas work is what shows up
         as jank. */
      const twin = document.createElement('img');
      twin.className = 'barrel__card-wm';
      twin.alt = '';
      twin.setAttribute('aria-hidden', 'true');
      card.appendChild(twin);
      const prepare = () => {
        if (dragging || twin.dataset.wm) return;
        watermarkedURL(img.src).then((url) => { if (url) twin.dataset.wm = url; });
      };
      card.addEventListener('pointerenter', prepare, { signal, once: true });
      card.addEventListener('contextmenu', () => {
        if (twin.dataset.wm) twin.src = twin.dataset.wm;
        else if (!twin.src) {
          /* not prepared yet: start it and hand over the clean file meanwhile, so
             the menu always has a usable image */
          watermarkedURL(img.src).then((url) => { if (url) twin.src = url; });
          twin.src = img.src;
        }
      }, { signal });
      if (typeof requestIdleCallback === 'function') requestIdleCallback(prepare);
      else setTimeout(prepare, 2500);
      card.addEventListener('click', () => {
        /* touch already opened this on pointerup (see release) */
        if (justTapped) {
          justTapped = false;
          return;
        }
        if (moved > slop) return; /* that was a spin, not a tap */
        open(item, card);
      }, { signal });
      stage.appendChild(card);
      cards.push(card);
    });

    /* Prefetch: las fotos COMPLETAS del detalle se bajan apenas la página queda
       libre. Así, cuando alguien abre una pieza o pasa de una a otra, la imagen
       ya está en la caché y aparece al instante (antes se bajaba en ese momento
       y se veía el hueco un par de segundos). Corre una sola vez por visita. */
    if (!barrelPrefetched) {
      barrelPrefetched = true;
      const prefetch = () => items.forEach((item) => {
        (item.shots || [item.src]).forEach((src) => {
          if (!src) return;
          const im = new Image();
          im.decoding = 'async';
          im.src = src;
        });
      });
      const later = () => {
        setTimeout(() => {
          if (typeof requestIdleCallback === 'function') requestIdleCallback(prefetch, { timeout: 2500 });
          else prefetch();
        }, 900);
      };
      if (document.readyState === 'complete') setTimeout(later, 600);
      else addEventListener('load', () => setTimeout(later, 600), { once: true });
    }

    const angleStep = 360 / items.length;
    /* Tune here:
       drum/card  – drum radius and card width, as fractions of the barrel width
       depth      – perspective distance, as a multiple of the drum radius
       tilt       – degrees. MUST stay negative: that is what puts the eye above
                    the drum. A positive angle flips it to a view from below.
                    The smaller the angle, the less the pieces behind rise above
                    the front one (at -5 they peek only ~12px).
       turn       – how many degrees the drum rotates across one screen of scroll
       drag       – degrees per pixel dragged, and how fast the flick decays */
    const TUNE = {
      drum: 0.36, card: 0.16, /* desktop */
      /* From tablet down this is a touch surface: bigger pieces and a bigger drum
         so the gallery is a real target instead of a strip you scroll past. */
      drumM: 0.5, cardM: 0.3,
      depth: 3.4, tilt: -5, turn: 75, drag: 0.28, decay: 0.94,
    };
    /* narrow = the touch tuning. The pointer query catches touch tablets and
       touch laptops that sit above the width breakpoint. */
    const narrow = () =>
      matchMedia('(max-width: 1024px), (pointer: coarse)').matches;
    let angle = 0;
    let target = 0;
    let scrollAngle = 0;
    let dragOffset = 0;
    let dragging = false;
    let lastX = 0;
    let moved = 0;
    let slop = 8;
    let justTapped = false;
    let velocity = 0;
    let raf = 0;

    /* the drum is drawn as a fraction of the barrel width so it spans the whole
       screen, but on very large displays that made the pieces gigantic: the two
       caps keep it reading like the laptop version instead */
    const CARD_MAX = 300;
    const DRUM_MAX = 1000;

    function layout () {
      const cw = root.clientWidth;
      if (!cw) return;
      const n = narrow();
      const w = Math.round(Math.min(cw * (n ? TUNE.cardM : TUNE.card), CARD_MAX));
      const radius = Math.round(Math.min(cw * (n ? TUNE.drumM : TUNE.drum), DRUM_MAX));
      stage.style.width = w + 'px';
      stage.style.height = Math.round(w * 1.4) + 'px';
      root.style.perspective = Math.round(radius * TUNE.depth) + 'px';
      cards.forEach((c, i) => {
        c.style.transform = `rotateY(${i * angleStep}deg) translateZ(${radius}px)`;
      });
      paint();
      fit();
    }
    /* The drum is taller below its centre than above (we look down on it), so a
       centred box leaves a dead band between the copy and the first row. Measure
       both sides, size the box, then pull it up by the difference with a negative
       margin — a plain layout move, so the drum itself is untouched. */
    function fit () {
      const box = root.getBoundingClientRect();
      const rs = cards.map((c) => c.getBoundingClientRect());
      const cy = box.top + box.height / 2;
      const up = cy - Math.min(...rs.map((r) => r.top));
      const down = Math.max(...rs.map((r) => r.bottom)) - cy;
      /* touch screens get a taller stage: the gallery needs room to be used, not
         just seen */
      const air = narrow() ? 110 : 56;
      const h = Math.ceil(2 * Math.max(up, down) + air);
      if (h > 200) root.style.height = h + 'px';
      root.style.marginTop = (up < down ? -Math.round(down - up) : 0) + 'px';
      root.style.marginBottom = (down < up ? -Math.round(up - down) : 0) + 'px';
    }
    function paint () {
      stage.style.transform = `rotateX(${TUNE.tilt}deg) rotateY(${angle}deg)`;
      /* pieces rotating away from the viewer fade back, which is what makes
         the drum read as round rather than as a flat fan */
      cards.forEach((c, i) => {
        const facing = Math.cos((((i * angleStep + angle) % 360) * Math.PI) / 180);
        c.style.setProperty('--face', (0.3 + 0.7 * ((facing + 1) / 2)).toFixed(3));
      });
    }
    /* the drum turns as the page scrolls — it never moves on its own */
    function fromScroll () {
      const box = root.getBoundingClientRect();
      const p = (innerHeight - box.top) / (innerHeight + box.height);
      scrollAngle = (p - 0.5) * TUNE.turn;
      kick();
    }

    /* one damped loop: the view eases toward its target, which is what makes
       every movement smooth instead of jumping. It parks itself once settled,
       so nothing ever drifts on its own. */
    function kick () {
      if (!raf) raf = requestAnimationFrame(frame);
    }
    function frame () {
      raf = 0;
      if (!dragging) {
        if (Math.abs(velocity) > 0.015) {
          dragOffset += velocity;
          velocity *= TUNE.decay;
        } else velocity = 0;
      }
      target = scrollAngle + dragOffset;
      angle += (target - angle) * (dragging ? 0.28 : 0.075);
      const settled = !dragging && velocity === 0 && Math.abs(target - angle) < 0.02;
      if (settled) angle = target;
      else kick();
      paint();
    }

    layout();
    fromScroll();
    if (document.fonts) document.fonts.ready.then(layout);
    addEventListener('resize', () => { layout(); fromScroll(); }, { signal });
    addEventListener('scroll', fromScroll, { passive: true, signal });
    signal.addEventListener('abort', () => { if (raf) cancelAnimationFrame(raf); raf = 0; });

    root.addEventListener('pointerdown', (e) => {
      dragging = true;
      moved = 0;
      /* a finger drifts far more than a mouse before lifting, so touch gets a
         wider slop — otherwise a normal tap reads as a spin and never opens */
      slop = e.pointerType === 'touch' ? 18 : 8;
      lastX = e.clientX;
      velocity = 0;
      kick();
    }, { signal });
    root.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      moved += Math.abs(dx);
      dragOffset += dx * TUNE.drag;
      velocity = dx * TUNE.drag;
      lastX = e.clientX;
    }, { signal });
    /* Touch fires pointerup before any click, and the browser drops the click
       completely once a finger has drifted past ~10px. So on touch we open from
       pointerup and swallow the click that may still follow. Same reasoning as
       the touch accordion elsewhere on the site. */
    function release (e) {
      if (!dragging) return;
      dragging = false;
      if (e && e.pointerType === 'touch' && moved <= slop) {
        const card = e.target && e.target.closest ? e.target.closest('.barrel__card') : null;
        const idx = card ? cards.indexOf(card) : -1;
        if (idx > -1) {
          justTapped = true;
          open(items[idx], card);
        }
      }
      kick();
    }
    /* release on the window so a drag ending outside the gallery still settles.
       No pointer capture: capturing retargets the card's click to the container,
       which stopped the detail view from ever opening. */
    addEventListener('pointerup', release, { signal });
    addEventListener('pointercancel', release, { signal });

    /* the site's custom cursor labels the pieces */
    if (fine) {
      cards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          cursorLbl.textContent = 'View';
          cursor.classList.add('-case');
        }, { signal });
        card.addEventListener('mouseleave', () => cursor.classList.remove('-case'), { signal });
      });
    }

    const $ = (sel) => detail.querySelector(sel);
    const cardBox = detail.querySelector('.barrel-detail__card');
    const backLink = document.getElementById('backBtn');
    let lastFrom = null;
    let curIdx = 0;
    let cardAnims = [];
    /* each piece has two shots in the panel: the dots switch between them and a
       timer flips them every three seconds while the panel is open — until you
       pick one by hand, which stops the cycle on the shot you chose */
    let shotIdx = 0;
    let shotTimer = 0;
    const SHOT_MS = 3000;

    /* The detail card travels out of the piece you clicked and, on the way back,
       lands exactly on it again. Driven with the Web Animations API rather than a
       CSS transition: a transition can't interpolate a transform that depends on
       var(), and this way the movement is one continuous, smooth motion. */
    function morphCard (fromEl, out) {
      if (!cardBox || typeof cardBox.animate !== 'function') return;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      /* drop the previous run first so we measure the resting box, not mid-flight */
      cardAnims.forEach((a) => a.cancel());
      cardAnims = [];
      const to = cardBox.getBoundingClientRect();
      const from = fromEl && fromEl.getBoundingClientRect();
      const dx = from ? (from.left + from.width / 2) - (to.left + to.width / 2) : 0;
      const dy = from ? (from.top + from.height / 2) - (to.top + to.height / 2) : 0;
      const s = from && to.width ? from.width / to.width : 0.92;
      const away = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${s.toFixed(3)})`;
      const home = 'translate(0, 0) scale(1)';
      const dur = out ? 620 : 760;
      cardAnims.push(
        cardBox.animate(
          out ? [{ transform: home }, { transform: away }] : [{ transform: away }, { transform: home }],
          { duration: dur, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' },
        ),
      );
      /* the fade rides on its own clock: it leads on the way in, and holds until
         the end on the way out so the piece stays visible while it flies back */
      cardAnims.push(
        cardBox.animate(
          out
            ? [{ opacity: 1, offset: 0 }, { opacity: 1, offset: 0.62 }, { opacity: 0, offset: 1 }]
            : [{ opacity: 0, offset: 0 }, { opacity: 1, offset: 0.45 }, { opacity: 1, offset: 1 }],
          { duration: dur, easing: 'ease', fill: 'both' },
        ),
      );
    }

    const shotsBox = detail.querySelector('.barrel-detail__shots');
    const dotsBox = detail.querySelector('.barrel-detail__dots');
    const shotsOf = () => [...detail.querySelectorAll('[data-detail-img]')];
    function setShot (i) {
      /* cycles through however many shots the piece has (2 or 3) */
      const n = shotsOf().length || 1;
      shotIdx = ((i % n) + n) % n;
      shotsOf().forEach((im, k) => im.classList.toggle('-on', k === shotIdx));
      detail.querySelectorAll('[data-detail-dot]').forEach((d, k) => {
        d.classList.toggle('-on', k === shotIdx);
        d.setAttribute('aria-current', k === shotIdx ? 'true' : 'false');
      });
      /* the twin follows the shot on screen, so what the browser would open in a
         new tab is always the painting you are looking at */
      markShot();
    }
    function startShots () {
      clearInterval(shotTimer);
      /* a single shot needs no cycling */
      if (shotsOf().length < 2) return;
      shotTimer = setInterval(() => setShot(shotIdx + 1), SHOT_MS);
    }
    function stopShots () {
      clearInterval(shotTimer);
      shotTimer = 0;
    }

    /* everything the panel shows for one piece. The number of shots varies per
       piece (1, 2 or 3) and the dots only exist when there is more than one.
       `body` is trusted markup from content.js so the <b> highlights show. */
    function fill (item) {
      const shots = item.shots || [item.src].filter(Boolean);
      const alt = `${item.title} — ${item.code || 'painting'}, hand-painted artwork by Julia Arena`;
      if (shotsBox) {
        shotsBox.innerHTML = shots
          .map((src, k) => `<img data-detail-img="${k}" src="${src}" alt="${alt}">`)
          .join('');
        /* The invisible twin: an <img> inside .barrel-detail__shots, so the shot
           rules already place it exactly over the shot and keep it at opacity 0
           (only `.-on` fades in). Its src is the watermarked copy — this is the
           element the right-click finds, so the browser's own "Open image in a
           new tab" hands over the marked painting while the panel keeps showing
           the clean file. */
        wmTwin = document.createElement('img');
        wmTwin.className = 'barrel-detail__wm';
        wmTwin.alt = '';
        wmTwin.setAttribute('aria-hidden', 'true');
        shotsBox.appendChild(wmTwin);
      }
      if (dotsBox) {
        dotsBox.innerHTML = shots.length > 1
          ? shots.map((s, k) => `<button type="button" class="barrel-detail__dot${k === 0 ? ' -on' : ''}" data-detail-dot="${k}" aria-label="Image ${k + 1} of ${shots.length}"></button>`).join('')
          : '';
        /* The dots are rebuilt for every piece, so they need the cursor ring
           here: bindCursor only ever sees the buttons that exist when the case is
           first rendered, which is why hovering a dot gave no feedback at all and
           the dot read as "not pressable". */
        if (fine && !reduced) {
          dotsBox.querySelectorAll('.barrel-detail__dot').forEach((d) => {
            d.addEventListener('mouseenter', () => cursor.classList.add('-ring'));
            d.addEventListener('mouseleave', () => cursor.classList.remove('-ring'));
          });
        }
      }
      /* circular and rectangular canvases keep their real shape */
      cardBox.classList.toggle('-circle', item.shape === 'circle');
      cardBox.classList.toggle('-rect', item.shape === 'rect');
      /* the frame ratio comes from the FIRST shot, so a portrait shot inside a
         landscape piece letterboxes instead of resizing the whole panel */
      cardBox.style.aspectRatio = '';
      if (item.shape === 'rect') {
        const first = shotsBox && shotsBox.querySelector('img');
        const setRatio = () => {
          if (first && first.naturalWidth && first.naturalHeight) {
            cardBox.style.aspectRatio = `${first.naturalWidth} / ${first.naturalHeight}`;
          }
        };
        if (first && first.complete) setRatio();
        else if (first) first.addEventListener('load', setRatio, { once: true });
      }
      $('[data-detail-code]').textContent = item.code;
      $('[data-detail-title]').textContent = item.title;
      const body = $('[data-detail-body]');
      if (body) body.innerHTML = item.body || SITE.galleryBody || '';
      setShot(0);
    }

    function open (item, fromEl) {
      fill(item);
      curIdx = items.indexOf(item);
      lastFrom = fromEl || null;
      /* start at the top: on phones the panel scrolls, so a previous visit may
         have left it part-way down */
      detail.scrollTop = 0;
      detail.classList.add('-on');
      detail.setAttribute('aria-hidden', 'false');
      morphCard(lastFrom, false);
      /* the two shots start cycling as soon as the panel is up */
      startShots();
      /* the button sits in the root stacking context, above this overlay */
      if (backLink) backLink.classList.add('-gone');
      if (lenis) lenis.stop();
      else document.body.style.overflow = 'hidden';
    }

    /* Arrows inside the panel move through the pieces without leaving it. The
       panel travels: image and copy slide out toward the direction you pressed,
       the content swaps while it is invisible, then everything arrives from the
       other side — with a slight 3D turn and a stagger on the copy. The drum is
       spun to match, so closing lands you on the piece you were viewing. */
    let stepping = false;
    function step (dir) {
      if (items.length < 2 || stepping) return;
      curIdx = (curIdx + dir + items.length) % items.length;
      /* spin the drum at the same time, on its own eased loop */
      dragOffset = -curIdx * angleStep - scrollAngle;
      kick();
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        fill(items[curIdx]);
        return;
      }
      stepping = true;
      /* drop anything still running so the two phases never fight */
      cardAnims.forEach((a) => a.cancel());
      cardAnims = [];
      const kids = [...detail.querySelectorAll('.barrel-detail__info > *:not(.barrel-detail__close)')];
      const OUT = 220;
      const IN = 500;
      const outEase = 'cubic-bezier(0.55, 0, 0.85, 0.4)';
      const inEase = 'cubic-bezier(0.22, 1, 0.36, 1)';
      if (cardBox) {
        cardAnims.push(cardBox.animate(
          [
            { transform: 'translateX(0) scale(1) rotateY(0deg)', opacity: 1 },
            { transform: `translateX(${-dir * 36}px) scale(0.96) rotateY(${-dir * 7}deg)`, opacity: 0 },
          ],
          { duration: OUT, easing: outEase, fill: 'both' },
        ));
      }
      kids.forEach((el) => {
        cardAnims.push(el.animate(
          [
            { opacity: 1, transform: 'translateX(0)' },
            { opacity: 0, transform: `translateX(${-dir * 20}px)` },
          ],
          { duration: OUT, easing: outEase, fill: 'both' },
        ));
      });
      /* wait for the outgoing phase, then swap and wait for the new shot to be
         decoded — the incoming phase never shows an empty frame */
      new Promise((r) => setTimeout(r, OUT)).then(() => {
        fill(items[curIdx]);
        /* the three second cycle restarts with the new piece */
        startShots();
        const first = shotsOf()[0];
        return first && first.decode ? first.decode().catch(() => {}) : Promise.resolve();
      }).then(() => {
        if (cardBox) {
          cardAnims.push(cardBox.animate(
            [
              { transform: `translateX(${dir * 36}px) scale(0.96) rotateY(${dir * 7}deg)`, opacity: 0 },
              { transform: 'translateX(0) scale(1) rotateY(0deg)', opacity: 1 },
            ],
            { duration: IN, easing: inEase, fill: 'both' },
          ));
        }
        kids.forEach((el, i) => {
          cardAnims.push(el.animate(
            [
              { opacity: 0, transform: `translateX(${dir * 20}px)` },
              { opacity: 1, transform: 'translateX(0)' },
            ],
            { duration: IN, delay: i * 60, easing: inEase, fill: 'both' },
          ));
        });
        /* unlock a little before the last line settles, so pressing again feels
           responsive instead of ignored */
        setTimeout(() => { stepping = false; }, IN * 0.7 + kids.length * 60);
      });
    }
    function close () {
      stopShots();
      morphCard(lastFrom, true);
      detail.classList.remove('-on');
      detail.setAttribute('aria-hidden', 'true');
      if (backLink) backLink.classList.remove('-gone');
      if (lenis) lenis.start();
      else document.body.style.overflow = '';
    }
    $('[data-detail-close]').addEventListener('click', close, { signal });
    /* delegated: the dots are rebuilt for every piece */
    detail.addEventListener('click', (e) => {
      const dot = e.target.closest('[data-detail-dot]');
      if (!dot) return;
      setShot(Number(dot.getAttribute('data-detail-dot')));
      /* Picking a shot by hand stops the three second cycle, so the photo you
         chose is the one that stays on screen (it used to flip on to the next
         one right after you pressed a dot). */
      stopShots();
    }, { signal });
    $('[data-detail-prev]').addEventListener('click', () => step(-1), { signal });
    $('[data-detail-next]').addEventListener('click', () => step(1), { signal });

    /* ---- the mark the browser hands over on "Open image in a new tab" ----
       The native right-click menu opens the URL sitting in the `src` of the image
       under the pointer, and a page gets no say in it: no event fires, no
       navigation can be intercepted. So the artwork itself is left alone, and
       every shot gets an INVISIBLE TWIN stacked exactly over it whose src is a
       watermarked copy of the same painting (see markShot, and the drum cards).
       The twin is what the right-click finds, so "Open image in a new tab",
       "Save image as" and "Copy image" all hand over the marked copy while the
       drum and the panel keep showing the clean file. The text lives in
       `profile.watermark` (content.js); empty it to hand over the untouched
       file. */

    /* Tiles the watermark across the copy on a diagonal. A dark pass under a
       light one keeps it readable over a near-black painting and over a white
       canvas alike. */
    function stampWatermark (ctx, w, h) {
      const text = String((SITE.profile && SITE.profile.watermark) || '').trim();
      if (!text) return;
      const size = Math.max(13, Math.round(Math.min(w, h) * 0.042));
      ctx.save();
      ctx.font = `600 ${size}px "Switzer","Inter","Helvetica Neue",Arial,sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const stepX = ctx.measureText(text).width + size * 2.4;
      const stepY = size * 5.5;
      const reach = Math.hypot(w, h) / 2 + stepX;
      ctx.translate(w / 2, h / 2);
      ctx.rotate(-Math.PI / 9); /* ≈ -20° */
      let row = 0;
      for (let y = -reach; y <= reach; y += stepY) {
        /* every other row is offset, so the marks never line up into columns */
        for (let x = -reach - (row % 2) * stepX / 2; x <= reach; x += stepX) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.34)';
          ctx.fillText(text, x + size * 0.06, y + size * 0.06);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillText(text, x, y);
        }
        row += 1;
      }
      ctx.restore();
    }

    /* One watermarked copy per file, as a blob URL, generated on demand and
       cached: the same painting is asked for every time a piece is opened, a dot
       is pressed or a drum card is hovered. Capped at 1800px so a huge scan
       cannot fill the tab's memory. Resolves to null when there is nothing to
       mark (no `profile.watermark`, a tainted canvas, no toBlob) — the caller
       then leaves the twin without a src and the browser simply hands over the
       clean file, exactly as before this feature existed. */
    const wmJobs = new Map();
    function watermarkedURL (src) {
      const text = String((SITE.profile && SITE.profile.watermark) || '').trim();
      if (!text || !src) return Promise.resolve(null);
      if (wmJobs.has(src)) return wmJobs.get(src);
      const job = new Promise((resolve) => {
        const source = new Image();
        source.onload = () => {
          let cv;
          try {
            const cap = 1800;
            const k = Math.min(1, cap / Math.max(source.naturalWidth, source.naturalHeight));
            const w = Math.max(1, Math.round(source.naturalWidth * k));
            const h = Math.max(1, Math.round(source.naturalHeight * k));
            cv = document.createElement('canvas');
            cv.width = w;
            cv.height = h;
            const ctx = cv.getContext('2d');
            ctx.drawImage(source, 0, 0, w, h);
            stampWatermark(ctx, w, h);
          } catch (err) {
            console.warn('[gallery] could not stamp the watermark', err);
            resolve(null);
            return;
          }
          const fallback = () => {
            try {
              resolve(cv.toDataURL('image/jpeg', 0.92));
            } catch (err) {
              resolve(null);
            }
          };
          if (!cv.toBlob) {
            fallback();
            return;
          }
          cv.toBlob((blob) => {
            if (blob) resolve(URL.createObjectURL(blob));
            else fallback();
          }, 'image/jpeg', 0.92);
        };
        source.onerror = () => resolve(null);
        source.src = src;
      });
      wmJobs.set(src, job);
      return job;
    }

    /* Prepares — and, on a right-click, hands over — the watermarked copy of the
       shot on screen. Called when the panel fills and on every dot press, so the
       copy always matches the painting you are looking at; but it only PREPARES.
       The blob is attached to the twin on the right-click itself, because an
       <img> holding a big bitmap costs decode memory and compositing on every
       frame (eight of them were what made the drum stutter while dragging). */
    let wmTwin = null;
    function markShot (attach) {
      const twin = wmTwin;
      if (!twin) return;
      const shots = shotsOf();
      const img = shots[shotIdx] || shots[0];
      if (!img) return;
      const src = img.currentSrc || img.src;
      if (attach && twin.src !== src) {
        if (twin.dataset.wm && twin.dataset.wmFor === src) twin.src = twin.dataset.wm;
        else if (!twin.src) twin.src = src;
      }
      watermarkedURL(src).then((url) => {
        if (!url || twin !== wmTwin || !twin.isConnected) return;
        twin.dataset.wm = url;
        twin.dataset.wmFor = src;
        if (attach && twin.dataset.wmFor === src && twin.src !== url) twin.src = url;
      });
    }
    detail.addEventListener('contextmenu', () => markShot(true), { signal });

    detail.addEventListener('click', (e) => {
      /* The dots sit OUTSIDE the card but belong to the piece. Leaving the figure
         out of this list is what used to throw you back to the gallery the moment
         you pressed a dot: the click reached this handler and closed the panel. */
      if (!e.target.closest('.barrel-detail__info') && !e.target.closest('.barrel-detail__figure') &&
          !e.target.closest('.barrel-detail__nav')) close();
    }, { signal });
    addEventListener('keydown', (e) => {
      if (!detail.classList.contains('-on')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    }, { signal });
  }

  /* ---- case renderer ---- */
  /* Debajo de "The outcome": una sola imagen a todo el ancho (lo de siempre), que es
     `outcomeImg` si el proyecto la define (Luna Care: el calendario del terapeuta) o
     si no `imgs[4]`. Un proyecto puede traer también `outcomeImgs` para mostrar una
     PILA de capturas en su lugar: ocupan el mismo ancho y llevan 10px de aire entre
     una y la siguiente, sin recortar ninguna. */
  function caseOutcomeHTML (p) {
    if (Array.isArray(p.outcomeImgs) && p.outcomeImgs.length) {
      return `<div class="case__stack">${p.outcomeImgs
        .map((src, i) => `<img src="${src}" alt="${p.name} — ${p.category} case study: results and outcome (${i + 1}) by Julia Arena" loading="lazy">`)
        .join('')}</div>`;
    }
    const src = p.outcomeImg || p.imgs[4];
    return src
      ? `<figure class="case__img full" data-prl><img src="${src}" alt="${p.name} — ${p.category} case study: the outcome, designed by Julia Arena" loading="lazy"></figure>`
      : '';
  }

  /* Las dos apps de Luna: cada pieza es un ícono cuadrado con su título debajo
     (el título va en el cuerpo del sitio pero en bold, alineado a la izquierda).
     `apps.shots` acepta `{ src, caption }` o una ruta suelta; sin `src` cae en el
     marco de espera, así el bloque sigue funcionando antes de tener las fotos. */
  function caseAppsHTML (p) {
    return (p.apps.shots || []).map((s, i) => {
      const src = typeof s === 'string' ? s : (s && s.src) || '';
      const cap = (typeof s === 'string' ? '' : (s && s.caption)) || '';
      const link = (typeof s === 'string' ? '' : (s && s.link)) || '';
      if (!src) {
        return `<figure class="case__img -ph"><span>Image ${i + 1}</span></figure>`;
      }
      const alt = cap || `${p.name} — app ${i + 1}`;
      const img = `<img src="${src}" alt="${alt}" loading="lazy">`;
      /* el link envuelve SOLO a la imagen: el título de abajo no es clickeable.
         `data-cur` hace que el cursor se agrande y diga "Visit app", igual que
         los trabajos con "Read case". */
      const inner = link ? `<a href="${link}" target="_blank" rel="noopener" data-cur="Visit app">${img}</a>` : img;
      return `<figure class="case__app">${inner}${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;
    }).join('');
  }

  function renderCase (p, idx) {
    const next = PROJECTS[(idx + 1) % PROJECTS.length];
    /* in the description the client reads well only when it is a company */
    const byClient = /^Personal/i.test(p.client) ? '' : ` for ${p.client.replace(/\.+$/, '')}`;
    /* Debajo de "The problem": si el proyecto trae `problemImgs` van una AL LADO de
       la otra, cada una entera con su proporción real (por eso quedan más chicas y
       sin recortes); si no, el par vertical de siempre (`.case__duo`). */
    const problemHTML =
      Array.isArray(p.problemImgs) && p.problemImgs.length
        ? `<div class="case__duo -nocrop">${p.problemImgs
          .map((src, i) => `<figure class="case__img"><img src="${src}" alt="${p.name} — ${p.category} case study: screens that frame the problem (${i + 1}) by Julia Arena" loading="lazy"></figure>`)
          .join('')}</div>`
        : `<div class="case__duo${p.duoNoCrop ? ' -nocrop' : ''}">
          <figure class="case__img"${p.duoNoCrop ? '' : ' data-prl'}><img src="${p.imgs[1]}" alt="${p.name} — ${p.category} case study: key interface screens by Julia Arena (1)" loading="lazy"></figure>
          <figure class="case__img"${p.duoNoCrop ? '' : ' data-prl'}><img src="${p.imgs[2]}" alt="${p.name} — ${p.category} case study: key interface screens by Julia Arena (2)" loading="lazy"></figure>
        </div>`;
    document.title = `${caseName(p)} — Julia Arena`;
    setMeta({
      title: document.title,
      description: `${p.name} — ${p.category}${byClient}. ${p.intro}`,
      keywords: [...new Set([...p.metaTags, ...p.tags, p.category, p.client, 'Julia Arena'])].join(', '),
      robots: META_DOC.robots,
      path: '/work/' + p.id + '/',
    });
    pageCase.innerHTML = `
      <article class="case">
        <div class="case__hero">
          <img src="${p.imgs[0]}" alt="${p.name} — ${p.category} case study by Julia Arena, hero image">
          <div class="blinds" data-blinds></div>
          <div class="case__idx num">${pad2(idx + 1)}</div>
          <h1 class="case__title${fitClass(p.title)}">${titleArr(p.title).map((t) => `<span class="line"><span>${t}</span></span>`).join('')}</h1>
        </div>
        <div class="case__meta${p.metaTags && p.metaTags.length ? ' -tags' : ''}">
          <div><small>Client</small><b>${p.client}</b></div>
          <div><small>Role</small><b>${p.role}</b></div>
          <div><small>Services</small><b>${p.services}</b></div>
          <div><small>Year</small><b class="num">${p.year}</b></div>
          ${
  p.metaTags && p.metaTags.length
    ? `<div class="case__metatags">${p.metaTags.map((t) => `<span class="case__tag">${t}</span>`).join('')}</div>`
    : ''
  }
        </div>
        <div class="case__intro">
          <span class="lbl">The brief</span>
          <div class="case__intro__body">
            <p>${p.intro}</p>
            ${awardsHTML(p)}
          </div>
        </div>
        ${
  p.gallery
    ? `<div class="barrel" data-barrel>
          <div class="barrel__stage" data-barrel-stage></div>
        </div>
        <div class="barrel-detail" data-barrel-detail aria-hidden="true" data-lenis-prevent>
          <div class="barrel-detail__figure">
            <div class="barrel-detail__card"><div class="barrel-detail__shots"></div></div>
            <div class="barrel-detail__dots"></div>
          </div>
          <div class="barrel-detail__info">
            <span class="barrel-detail__code num" data-detail-code></span>
            <h2 data-detail-title></h2>
            <p class="barrel-detail__body" data-detail-body></p>
            <button type="button" class="barrel-detail__close" data-detail-close>← Back to the gallery</button>
          </div>
          <div class="barrel-detail__nav">
            <button type="button" class="barrel-detail__arrow" data-detail-prev aria-label="Previous piece">←</button>
            <button type="button" class="barrel-detail__arrow" data-detail-next aria-label="Next piece">→</button>
          </div>
        </div>`
    : `<figure class="case__img full" data-prl><img src="${p.briefImg || p.imgs[3]}" alt="${p.name} — ${p.category} case study: product overview, designed by Julia Arena" loading="lazy"></figure>`
  }
        ${
  p.challenge
    ? `<div class="case__block">
          <h3>The <span class="o">problem</span></h3>
          <div><p>${p.challenge}</p></div>
        </div>`
    : ''
  }
        ${
  p.film
    ? `<figure class="case__img full case__film"><video src="${p.film.src}" poster="${p.film.poster}" muted loop playsinline preload="metadata" data-vid aria-label="${p.name} — product film"></video></figure>`
    : ''
  }
        ${
  p.challenge
    ? problemHTML
    : ''
  }
        ${
  p.apps
    ? `<div class="case__block">
          <h3>${p.apps.title.replace(/(\S+)$/, '<span class="o">$1</span>')}</h3>
          <div><p>${p.apps.body}</p></div>
        </div>
        <div class="case__apps">
          ${caseAppsHTML(p)}
        </div>`
    : ''
  }
        ${
  p.approach
    ? `<div class="case__block">
          <h3>The <span class="o">move</span></h3>
          <div><p>${p.approach}</p></div>
        </div>
        ${
  p.moveVideo
    ? `<figure class="case__vid"><video src="${p.moveVideo.src}"${p.moveVideo.poster ? ` poster="${p.moveVideo.poster}"` : ''} controls muted loop playsinline preload="metadata" data-vid aria-label="${p.name} — ${p.category} product walkthrough video by Julia Arena"></video></figure>`
    : `<figure class="case__img full" data-prl><img src="${p.imgs[3]}" alt="${p.name} — ${p.category} case study: product walkthrough detail by Julia Arena" loading="lazy"></figure>`
  }`
    : ''
  }
        ${
  p.moments
    ? `<div class="case__moments">
          ${p.moments.map((m) => `<figure><div class="case__img"><video src="${m.src}" poster="${m.poster}" muted loop playsinline preload="none" data-vid aria-label="${m.caption}"></video></div><figcaption class="lbl">${m.caption}</figcaption></figure>`).join('')}
        </div>`
    : ''
  }
        ${
  p.rounds
    ? `<div class="case__rounds">
          <div class="case__block">
            <h3>${p.rounds.title.replace(/(\S+)$/, '<span class="o">$1</span>')}</h3>
            <div><p>${p.rounds.text}</p></div>
          </div>
          <div class="case__strip">
            ${p.rounds.items.map((it) => `<figure><img src="${it[0]}" alt="${it[1]}" loading="lazy"><figcaption class="lbl">${it[1]}</figcaption></figure>`).join('')}
          </div>
        </div>`
    : ''
  }
        ${
  p.link
    ? `<div class="case__linkwrap">
          <a class="foot__cta case__link" href="${p.link.href}" target="_blank" rel="noopener" data-magnet="0.04">
            <span class="roll"><span class="roll__in">
              <span class="roll__a">${p.link.label} <span class="o">&#8599;</span></span>
              <span class="roll__b">${p.link.label} &#8599;</span>
            </span></span>
            <span class="lbl">${p.link.note}</span>
          </a>
        </div>`
    : ''
  }
        ${
  p.outcome
    ? `<div class="case__block">
          <h3>The <span class="o">outcome</span></h3>
          <div><p>${p.outcome}</p></div>
        </div>
        ${caseOutcomeHTML(p)}`
    : ''
  }
        ${
  p.takeaway
    ? `<div class="case__block">
          <h3>The <span class="o">takeaway</span></h3>
          <div><p>${p.takeaway}</p></div>
        </div>`
    : ''
  }
        ${
  p.stats
    ? `<div class="case__stats">
          ${p.stats.map((s) => `<div><b>${s[0]}</b><small>${s[1]}</small></div>`).join('')}
        </div>`
    : ''
  }
        <div class="pxt -toGrey" data-pxt="up" aria-hidden="true"></div>
        <a class="case__next" style="background:var(--grey);color:var(--black)" href="/work/${next.id}/">
          <small>Next project</small>
          <span class="nxt">${next.name} →</span>
        </a>
      </article>`;
    bindCursor(pageCase);
    bindMagnets(pageCase);
    /* The hero takes the EXACT shape of the cover, so the artwork is shown whole
       — full width, full height, nothing cropped and nothing stretched. The ratio
       is read from the image itself, so replacing a cover with a different format
       keeps working with no CSS change. (Phones keep the full-screen 88svh hero:
       the CSS only applies the ratio from 821px up.) */
    {
      const heroImg = pageCase.querySelector('.case__hero img');
      const heroBox = pageCase.querySelector('.case__hero');
      if (heroImg && heroBox) {
        const coverRatio = () => (heroImg.naturalWidth && heroImg.naturalHeight
          ? heroImg.naturalWidth / heroImg.naturalHeight
          : 16 / 9);
        /* The hero shows the cover at its own shape plus 15px, and never grows
           past the point where the small sheet under it (client / role /
           services / year) would fall off the screen: that sheet has to be
           readable the moment the page opens. Phones keep the full-screen
           statement (88% of the screen). */
        fitHero = () => {
          const meta = pageCase.querySelector('.case__meta');
          const metaH = meta ? meta.getBoundingClientRect().height : 0;
          const cap = Math.floor(window.innerHeight - metaH);
          const wide = window.matchMedia('(min-width: 821px)').matches;
          const want = wide
            ? Math.round(heroBox.clientWidth / coverRatio() + 15)
            : Math.round(window.innerHeight * 0.88);
          heroBox.style.height = Math.min(want, cap) + 'px';
        };
        if (heroImg.complete) fitHero();
        else heroImg.addEventListener('load', fitHero, { once: true });
        fitHero();
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitHero);
      }
    }
    if (p.gallery) initBarrelGallery(pageCase, p.gallery);
    pageCase.querySelectorAll('.pxt').forEach(buildPixelStrip);

    if (ctx) ctx.revert();
    if (animOn) {
      try {
        ctx = gsap.context(() => {
          buildBlinds(pageCase.querySelector('[data-blinds]'));
          gsap.from('.case__title .line > span', {
            yPercent: 115,
            duration: 1.05,
            ease: 'power4.out',
            stagger: 0.08,
            delay: 0.2,
          });
          gsap.from('.case__hero img', {
            scale: 1.22,
            duration: 1.6,
            ease: 'power3.out',
          });
          gsap.from('.case__meta div', {
            y: 26,
            opacity: 0,
            stagger: 0.06,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.35,
          });
          gsap.utils.toArray('[data-prl] img').forEach((img) => {
            gsap.fromTo(
              img,
              { yPercent: -9 },
              {
                yPercent: 9,
                ease: 'none',
                scrollTrigger: {
                  trigger: img.parentElement,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              },
            );
          });
          gsap.utils
            .toArray(
              '.case__block,.case__intro,.case__stats div,.case__moments figure,.case__strip figure,.case__link',
            )
            .forEach((el) => rvFrom(el, { y: 50, opacity: 0 }, { duration: 1 }));
          rvGuard(pageCase.querySelectorAll('.case__title .line > span, .case__hero img, .case__meta div'), 'transform,opacity');
          setTimeout(() => pageCase.querySelectorAll('.blinds').forEach((b) => b.remove()), 2800);
        }, pageCase);
      } catch (e) {
        console.warn('case anim', e);
      }
      ScrollTrigger.refresh();
    } else {
      const b = pageCase.querySelector('[data-blinds]');
      b && b.remove();
    }
    /* Las fotos del caso se piden YA, en segundo plano: así, cuando el usuario
       scrollea, la foto ya está puesta y no ve un hueco vacío. `loading="eager"`
       solo no alcanza: el navegador posterga las que están lejos de la pantalla.
       Pesan poco (están optimizadas), así que no demora la carga del caso. */
    pageCase.querySelectorAll('img').forEach((im) => {
      im.loading = 'eager';
      if (!im.getAttribute('src') || im.dataset.pf) return;
      im.dataset.pf = '1';
      const pre = new Image();
      pre.decoding = 'async';
      pre.src = im.getAttribute('src');
    });
    rvAfterRender();
    bindVideos(pageCase);
    watchBackBtn();
  }

  /* videos: muted, play only while in view. Without motion (reduced
           motion or no GSAP = animOn false): poster + native controls. */
  let vidIO = null;
  function bindVideos (scope) {
    if (vidIO) vidIO.disconnect();
    vidIO = null;
    const vids = scope.querySelectorAll('video[data-vid]');
    vids.forEach((v) => {
      v.muted = true;
      if (!animOn) v.controls = true;
    });
    /* Empieza a BUFFERIZAR 2,5 s después de que la página cargó, aunque el video
       todavía esté lejos: primero terminan las imágenes y el primer pintado del
       caso, y después el video. Sin esto, en un video largo el usuario llegaba a
       la sección y el reproductor tardaba en empezar. No se ve nada hasta que
       entra en pantalla: sólo se adelanta la descarga. */
    const warm = () => vids.forEach((v) => {
      if (v.preload === 'auto') return;
      /* si ya arrancó (el usuario llegó antes), no se toca */
      if (!v.paused || v.currentTime > 0) return;
      v.preload = 'auto';
      try { v.load(); } catch (e) { /* noop */ }
    });
    const warmLater = () => setTimeout(warm, 2500);
    if (document.readyState === 'complete') warmLater();
    else addEventListener('load', warmLater, { once: true });
    if (!animOn || !('IntersectionObserver' in window)) return;
    vidIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target;
          if (e.isIntersecting) {
            const pr = v.play();
            if (pr && pr.catch) pr.catch(() => {});
          } else v.pause();
        });
      },
      /* arranca un poco antes de entrar en pantalla (150px más abajo) y con un
         15% visible, para que ya esté corriendo cuando el usuario lo ve */
      { threshold: 0.15, rootMargin: '0px 0px 150px 0px' },
    );
    vids.forEach((v) => vidIO.observe(v));
  }

  /* "← All work" is fixed bottom-left; hide it while it would sit on
           the case meta row (short windows) so it never covers content */
  const backBtn = document.getElementById('backBtn');
  let backRaf = 0;
  function checkBack () {
    const meta = document.querySelector('.case__meta');
    if (!meta || !document.body.classList.contains('-case')) {
      backBtn.classList.remove('-clear');
      backBtn.classList.remove('-gone');
      return;
    }
    const m = meta.getBoundingClientRect();
    const b = backBtn.getBoundingClientRect();
    const hit = b.top < m.bottom + 30 && b.bottom > m.top - 30;
    backBtn.classList.toggle('-clear', hit);
  }
  function watchBackBtn () {
    cancelAnimationFrame(backRaf);
    /* a fresh case render never starts with the detail open */
    backBtn.classList.remove('-gone');
    const t0 = performance.now();
    (function tick () {
      checkBack();
      /* follow the meta row's entry animation, then stop */
      if (performance.now() - t0 < 2500) { backRaf = requestAnimationFrame(tick); }
    })();
  }
  addEventListener('scroll', checkBack, { passive: true });
  addEventListener('resize', checkBack);

  /* ---- pixel wipe ---- */
  const wipe = document.getElementById('wipe');
  const wipeLabel = document.getElementById('wipeLabel');
  let wipeCells = null;
  let busy = false;
  function buildWipe () {
    wipe.querySelectorAll('i').forEach((i) => i.remove());
    const cols = Math.max(8, Math.round(innerWidth / 110));
    const rows = Math.max(5, Math.round(innerHeight / 110));
    wipe.style.gridTemplateColumns = `repeat(${cols},1fr)`;
    wipe.style.gridTemplateRows = `repeat(${rows},1fr)`;
    wipeCells = [];
    for (let k = 0; k < cols * rows; k++) {
      const i = document.createElement('i');
      wipe.insertBefore(i, wipeLabel);
      wipeCells.push(i);
    }
  }
  buildWipe();
  addEventListener('resize', buildWipe);

  /* a back/forward press during a wipe re-routes once the wipe ends */
  let pendingRoute = false;
  function wipeDone () {
    busy = false;
    if (pendingRoute) {
      pendingRoute = false;
      route();
    }
  }
  function transitionTo (label, swap) {
    if (busy) {
      pendingRoute = true;
      return;
    }
    if (!animOn) {
      busy = true;
      staggerCells(wipeCells, true, 360);
      setTimeout(() => {
        swap();
        toTop();
        /* the swap grows the page and Lenis holds a cached position: keep the
           top pinned while it settles, so every project opens on its title */
        openAtTop(700);
      }, 420);
      setTimeout(() => {
        staggerCells(wipeCells, false, 320);
        wipeDone();
      }, 640);
      return;
    }
    busy = true;
    wipeLabel.textContent = label;
    gsap
      .timeline({ onComplete: wipeDone })
      .to(wipeCells, {
        opacity: 1,
        duration: 0.02,
        stagger: { amount: 0.45, from: 'random' },
      })
      .to(wipeLabel, { opacity: 1, duration: 0.18 }, '-=.2')
      .add(() => {
        swap();
        toTop();
        /* same as above: the browser and Lenis both try to restore a position */
        openAtTop(700);
      }, '+=.05')
      .to(wipeLabel, { opacity: 0, duration: 0.15 }, '+=.15')
      .to(wipeCells, {
        opacity: 0,
        duration: 0.02,
        stagger: { amount: 0.45, from: 'random' },
      });
  }

  function showHome () {
    setMeta({
      title: META_DOC.title,
      description: META_DOC.description,
      keywords: META_DOC.keywords,
      robots: META_DOC.robots,
      path: '/',
    });
    activate(pageHome);
    heroInstant();
    animateHome();
  }
  function showWork () {
    activate(pageWork);
    renderWork();
  }
  function showAbout () {
    activate(pageAbout);
    renderAbout();
  }
  function showCase (id) {
    const idx = PROJECTS.findIndex((p) => p.id === id);
    if (idx < 0) return showNotFound();
    curCase = id;
    activate(pageCase);
    renderCase(PROJECTS[idx], idx);
  }
  function showNotFound () {
    activate(page404);
    renderNotFound();
  }
  function renderNotFound () {
    document.title = 'Page not found — Julia Arena';
    setMeta({
      title: document.title,
      robots: 'noindex, follow',
      path: location.pathname,
    });
    page404.innerHTML = `
      <section class="windex">
        <div class="windex__head">
          <span class="lbl">404 — Page not found</span>
          <h1>Nothing <span class="o">here</span><br>to see.</h1>
        </div>
        <div class="windex__cta acta__links">
          <a class="btnAll" href="/">Back home <b>&rarr;</b></a>
          <a class="btnAll" href="/work/">All work <b>${pad2(PROJECTS.length)}</b></a>
        </div>
      </section>`;
    bindCursor(page404);
    bindMagnets(page404);
    if (ctx) ctx.revert();
    ctx = null;
  }

  /* ---- SEO: search engines run this JS, so every route keeps its own title,
           description, keywords and canonical in step with the URL. It is what
           makes each case study indexable on its own. Nothing visual changes. */
  const META_DOC = (() => {
    const g = (sel, attr) => { const el = document.querySelector(sel); return el ? el.getAttribute(attr) : ''; };
    return {
      title: 'Julia Arena — Product Designer',
      description: g('meta[name="description"]', 'content'),
      keywords: g('meta[name="keywords"]', 'content'),
      robots: g('meta[name="robots"]', 'content'),
    };
  })();
  function setMeta (o) {
    const m = (sel, attr, val) => {
      if (!val) { return; }
      const el = document.querySelector(sel);
      if (el) { el.setAttribute(attr, val); }
    };
    if (o.title) {
      document.title = o.title;
      m('meta[property="og:title"]', 'content', o.title);
      m('meta[name="twitter:title"]', 'content', o.title);
    }
    if (o.description) {
      m('meta[name="description"]', 'content', o.description);
      m('meta[property="og:description"]', 'content', o.description);
      m('meta[name="twitter:description"]', 'content', o.description);
    }
    if (o.keywords) { m('meta[name="keywords"]', 'content', o.keywords); }
    if (o.robots) { m('meta[name="robots"]', 'content', o.robots); }
    /* the canonical always describes this URL, on whatever domain it is served */
    const url = location.origin + (o.path || '/');
    m('link[rel="canonical"]', 'href', url);
    m('meta[property="og:url"]', 'content', url);
    /* Avisa a Google Analytics de la página nueva. El sitio es de una sola
       página: al cambiar de ruta no hay recarga, así que sin esto Analytics
       vería únicamente la primera pantalla. La función vive en js/boot.js y no
       hace nada si la persona no aceptó las cookies. */
    if (o.title && typeof window.jaTrack === 'function') {
      window.jaTrack((o.path || '/') + location.hash, o.title);
    }
  }

  /* ---- router: real URLs (/, /work/, /work/<id>/, /about/) on the
           History API ---- */
  let curCase = null;
  /* renderCase hands this over so the hero re-fits when the window changes */
  let fitHero = null;
  addEventListener('resize', () => { if (fitHero) fitHero(); });
  function parseRoute (path) {
    path = path.replace(/\/index\.html$/, '/');
    let m;
    if (path === '/') return { page: 'home' };
    if ((m = path.match(/^\/work\/([\w-]+)\/?$/))) { return { page: 'case', id: m[1] }; }
    if (/^\/work\/?$/.test(path)) return { page: 'work' };
    if (/^\/about\/?$/.test(path)) return { page: 'about' };
    return { page: '404' };
  }
  /* #services / #contact on the home page */
  const fragEl = (h) =>
    h && h.length > 1 ? document.getElementById(h.slice(1)) : null;

  function route () {
    const r = parseRoute(location.pathname);
    if (r.page === 'case') {
      if (pageCase.classList.contains('-active') && curCase === r.id) { return; }
      const p = PROJECTS.find((x) => x.id === r.id);
      /* the wipe is the arrival label, so it matches the case page, not the list */
      transitionTo(p ? caseName(p) : '', () => showCase(r.id));
    } else if (r.page === 'work') {
      if (!pageWork.classList.contains('-active')) { transitionTo('Work', showWork); }
    } else if (r.page === 'about') {
      if (!pageAbout.classList.contains('-active')) { transitionTo('About', showAbout); }
    } else if (r.page === '404') {
      if (!page404.classList.contains('-active')) { transitionTo('', showNotFound); }
    } else {
      const el = fragEl(location.hash);
      if (el) {
        if (!pageHome.classList.contains('-active')) {
          transitionTo('', () => {
            showHome();
            requestAnimationFrame(() => scrollToEl(el));
          });
        } else scrollToEl(el);
      } else if (!pageHome.classList.contains('-active')) { transitionTo('Home', showHome); }
    }
  }

  function go (href) {
    const u = new URL(href, location.href);
    const to = u.pathname + u.search + u.hash;
    if (to !== location.pathname + location.search + location.hash) { history.pushState(null, '', to); }
    route();
  }
  /* same-origin links to a page are handled here; new-tab clicks,
           downloads and files (images, og.jpg …) fall through to the browser */
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.hasAttribute('download')) return;
    if (a.target && a.target !== '_self') return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin) return;
    /* an old "#/work/x" style href still lands on the real URL */
    if (/^#\//.test(u.hash) && u.pathname === '/') {
      const r = u.hash.slice(1).replace(/\/+$/, '');
      u.hash = /^\/(services|contact)$/.test(r) ? r.slice(1) : '';
      if (!u.hash) u.pathname = r ? r + '/' : '/';
    }
    if (parseRoute(u.pathname).page === '404') return;
    e.preventDefault();
    if (busy) return;
    /* El menú hamburguesa se cierra SIEMPRE al navegar. El logo que se ve con el
       menú abierto es el del header (el panel se dibuja por debajo), y ese no es
       un link del menú, así que no llevaba `data-close` y el panel se quedaba en
       pantalla. Cerrándolo acá quedan cubiertos todos los caminos: logo del
       header, logo del menú, footer y cualquier link interno. */
    setMenu(false);
    /* el logo apunta a home: desde otra página el wipe se reproduce igual, pero
       estando YA en home no pasaba nada — así que se reproduce también, como si
       llegaras de nuevo (píxeles + etiqueta "Home") */
    if (
      parseRoute(u.pathname).page === 'home' &&
      !u.hash &&
      pageHome.classList.contains('-active')
    ) {
      transitionTo('Home', showHome);
      return;
    }
    go(u.href);
  });
  addEventListener('popstate', route);
  document.getElementById('backBtn').addEventListener('click', () => {
    if (!busy) go('/work/');
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.toTop')) return;
    lenis ? lenis.scrollTo(0) : scrollTo({ top: 0, behavior: 'smooth' });
  });


  const loader = document.getElementById('loader');
  const fill = document.getElementById('loaderFill');
  const pct = document.getElementById('pctNum');
  const lGrid = document.getElementById('loaderGrid');
  const r0 = parseRoute(location.pathname);
  const deep = r0.page !== 'home';

  let booted = false;
  let bootTimer = 0;

  function boot () {
    if (booted) return;
    booted = true;
    clearTimeout(bootTimer);
    document.documentElement.classList.add('-booted');
    if (loader && loader.parentNode) loader.remove();
    ready = true;
    try {
      if (r0.page === 'case') {
        showCase(r0.id);
      } else if (r0.page === 'work') {
        showWork();
      } else if (r0.page === 'about') {
        showAbout();
      } else if (r0.page === '404') {
        showNotFound();
      } else {
        animateHome();
        /* /#services, /#contact: glide there once the page is in */
        const el = fragEl(location.hash);
        if (el) requestAnimationFrame(() => scrollToEl(el));
      }
      /* belt and braces: a case / work / about page always starts at its top */
      if (r0.page !== 'home') openAtTop();
    } catch (e) {
      console.warn('boot', e);
      animateHome();
    }
    bindCursor(document);
    bindMagnets(document);
  }

  const skipLoader =
          document.documentElement.classList.contains('no-loader');
  /* hard safety net: a stalled/failed timeline must never trap the page */
  bootTimer = setTimeout(boot, 3500);
  if (skipLoader) {
    /* already seen this session, or a deep link: straight in */
    boot();
    if (animOn && !deep) heroIn();
  } else if (animOn) {
    try {
      const cols = Math.max(8, Math.round(innerWidth / 100));
      const rows = Math.max(5, Math.round(innerHeight / 100));
      lGrid.style.gridTemplateColumns = `repeat(${cols},1fr)`;
      lGrid.style.gridTemplateRows = `repeat(${rows},1fr)`;
      const cells = [];
      for (let k = 0; k < cols * rows; k++) {
        const i = document.createElement('i');
        lGrid.appendChild(i);
        cells.push(i);
      }
      const o = { n: 0 };
      gsap
        .timeline({ onComplete: boot })
        .to(o, {
          n: 100,
          duration: 1.9,
          ease: 'power3.inOut',
          onUpdate () {
            const n = Math.round(o.n);
            pct.textContent = n;
            fill.style.clipPath = `inset(${100 - n}% 0 0 0)`;
          },
        })
        .to('.loader__logo', {
          scale: 1.05,
          duration: 0.25,
          ease: 'power2.out',
        })
        .set(cells, { opacity: 1 })
        .set(loader, { background: 'transparent' })
        .set('.loader__logo,.loader__pct', { opacity: 0 })
        .add(() => {
          if (!deep) heroIn();
        })
        .to(
          cells,
          {
            opacity: 0,
            duration: 0.02,
            stagger: { amount: 0.7, from: 'random' },
          },
          '<.05',
        );
    } catch (e) {
      console.warn('loader', e);
      fill.style.clipPath = 'inset(0 0 0 0)';
      boot();
    }
  } else {
    fill.style.clipPath = 'inset(0 0 0 0)';
    boot();
  }
})();
