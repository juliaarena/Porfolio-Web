
/* pixel trail: cells of the site's pixel grid (half the strip cell)
         light up where the pointer passes and fade out in ~0.6 s */
(function () {
  try {
    if (matchMedia('(hover: none), (pointer: coarse)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cv = document.getElementById('pxtrail');
    const ctx = cv && cv.getContext('2d');
    if (!ctx) return;
    const LIFE = 600; /* ms */
    const ORANGE = 0.07; /* share of cells that light orange */
    let size = 40; let dpr = 1; let w = 0; let h = 0;
    const cells = new Map(); /* "c,r" -> { c, r, t, o } */
    function resize () {
      dpr = Math.min(2, devicePixelRatio || 1);
      w = innerWidth;
      h = innerHeight;
      size = w / Math.max(20, Math.round(w / 40)); /* matches the strips' grid, halved */
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    addEventListener('resize', resize);
    let last = null; let raf = 0;
    /* is the page under this point light (the grey sections)? then ink, not light */
    function onLight (x, y) {
      let el = document.elementFromPoint(x, y);
      while (el && el !== document.documentElement) {
        const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
        if (m && (m.length < 4 || +m[3] > 0.5)) { return (+m[0] * 0.299 + +m[1] * 0.587 + +m[2] * 0.114) / 255 > 0.5; }
        el = el.parentElement;
      }
      return false;
    }
    let lightBg = false; let lastCheck = 0;
    function light (x, y, now) {
      const c = Math.floor(x / size); const r = Math.floor(y / size); const k = c + ',' + r;
      const cell = cells.get(k);
      if (cell) cell.t = now;
      else cells.set(k, { c, r, t: now, o: Math.random() < ORANGE, l: lightBg });
    }
    addEventListener('pointermove', (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      const now = performance.now();
      if (now - lastCheck > 80) {
        lightBg = onLight(e.clientX, e.clientY);
        lastCheck = now;
      }
      if (last) {
        /* fill the cells between two events so fast moves leave no gaps */
        const dx = e.clientX - last.x; const dy = e.clientY - last.y;
        const steps = Math.ceil(Math.hypot(dx, dy) / (size / 2));
        for (let i = 1; i <= steps; i++) { light(last.x + (dx * i) / steps, last.y + (dy * i) / steps, now); }
      } else light(e.clientX, e.clientY, now);
      last = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(draw);
    }, { passive: true });
    addEventListener('pointerout', (e) => { if (!e.relatedTarget) last = null; });
    function draw (now) {
      ctx.clearRect(0, 0, w, h);
      for (const [k, cell] of cells) {
        const a = 1 - (now - cell.t) / LIFE;
        if (a <= 0) { cells.delete(k); continue; }
        ctx.fillStyle = cell.o
          ? `rgba(125,51,255,${(a * (cell.l ? 0.9 : 0.55)).toFixed(3)})`
          : cell.l
            ? `rgba(12,12,12,${(a * 0.09).toFixed(3)})`
            : `rgba(216,216,212,${(a * 0.07).toFixed(3)})`;
        ctx.fillRect(cell.c * size, cell.r * size, size, size);
      }
      raf = cells.size ? requestAnimationFrame(draw) : 0;
    }
  } catch (err) {
    console.warn('pixel trail disabled:', err);
  }
})();
