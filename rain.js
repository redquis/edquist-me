/* Matrix rain background. Exposes window.rain for the `matrix` command. */
(function () {
  const canvas = document.getElementById("rain");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const GLYPHS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789<>[]{}/\|=+*#$@&%";
  const FONT_SIZE = 16;

  let cols = 0, drops = [], speeds = [], w = 0, h = 0, dpr = 1;
  let level = 1;          // 0 = off, 1 = ambient, 2 = full storm
  let raf = null, last = 0;

  function color() {
    return getComputedStyle(document.documentElement).getPropertyValue("--fg").trim() || "#4af626";
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / FONT_SIZE);
    drops = Array.from({ length: cols }, () => Math.random() * -60);
    speeds = Array.from({ length: cols }, () => 0.35 + Math.random() * 0.55);
    ctx.clearRect(0, 0, w, h);
  }

  function frame(t) {
    raf = requestAnimationFrame(frame);
    // Cap to ~30fps; the effect reads the same and costs half the battery.
    if (t - last < 33) return;
    last = t;

    ctx.fillStyle = "rgba(5, 7, 5, 0.09)";
    ctx.fillRect(0, 0, w, h);
    ctx.font = FONT_SIZE + "px " + getComputedStyle(document.body).fontFamily;
    ctx.textBaseline = "top";

    const c = color();
    const density = level === 2 ? 1 : 0.4;
    const headAlpha = level === 2 ? 0.95 : 0.5;
    const tailAlpha = level === 2 ? 0.38 : 0.16;

    for (let i = 0; i < cols; i++) {
      if (Math.random() > density) continue;
      const x = i * FONT_SIZE;
      const y = drops[i] * FONT_SIZE;
      const ch = GLYPHS[(Math.random() * GLYPHS.length) | 0];

      ctx.globalAlpha = tailAlpha;
      ctx.fillStyle = c;
      ctx.fillText(ch, x, y);

      ctx.globalAlpha = headAlpha;
      ctx.fillStyle = "#dfffd2";
      ctx.fillText(ch, x, y);

      drops[i] += speeds[i] * (level === 2 ? 2.2 : 1);
      if (y > h && Math.random() > 0.975) drops[i] = Math.random() * -20;
    }
    ctx.globalAlpha = 1;
  }

  function start() { if (!raf && !reduced) raf = requestAnimationFrame(frame); }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } ctx.clearRect(0, 0, w, h); }

  window.rain = {
    get level() { return level; },
    set(n) {
      level = Math.max(0, Math.min(2, n | 0));
      // Storm stays well under 1 so terminal text on top of it is still readable.
      canvas.style.opacity = level === 2 ? "0.6" : level === 1 ? "0.5" : "0";
      if (level === 0) stop(); else start();
      return level;
    },
    cycle() { return this.set((level + 1) % 3); }
  };

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop(); else if (level > 0) start();
  });

  resize();
  if (reduced) canvas.style.opacity = "0"; else start();
})();
