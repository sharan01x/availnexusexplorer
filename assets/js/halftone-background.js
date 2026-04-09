/* ============================================================
   Halftone Flow Background
   Animated dot-grid effect matching the Avail design system.
   Throttled to 15 FPS with dual-noise layering.
   ============================================================ */

(function () {
  'use strict';

  // ---- Simplex Noise ----
  var GRAD3 = new Float32Array([
    1,1,0, -1,1,0, 1,-1,0, -1,-1,0,
    1,0,1, -1,0,1, 1,0,-1, -1,0,-1,
    0,1,1, 0,-1,1, 0,1,-1, 0,-1,-1,
  ]);
  var F2 = 0.5 * (Math.sqrt(3) - 1);
  var G2 = (3 - Math.sqrt(3)) / 6;

  function SimplexNoise(seed) {
    seed = seed || Math.random() * 10000;
    var p = new Uint8Array(256);
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    for (var i = 0; i < 256; i++) p[i] = i;
    var n, q;
    for (var i = 255; i > 0; i--) {
      seed = (seed * 16807) % 2147483647;
      n = seed % (i + 1);
      q = p[i]; p[i] = p[n]; p[n] = q;
    }
    for (var i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  SimplexNoise.prototype.noise2D = function (x, y) {
    var perm = this.perm, permMod12 = this.permMod12;
    var s = (x + y) * F2;
    var i = Math.floor(x + s);
    var j = Math.floor(y + s);
    var t = (i + j) * G2;
    var x0 = x - (i - t);
    var y0 = y - (j - t);
    var i1 = x0 > y0 ? 1 : 0;
    var j1 = x0 > y0 ? 0 : 1;
    var x1 = x0 - i1 + G2;
    var y1 = y0 - j1 + G2;
    var x2 = x0 - 1 + 2 * G2;
    var y2 = y0 - 1 + 2 * G2;
    var ii = i & 255;
    var jj = j & 255;
    var n0, n1, n2;
    var t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 < 0) { n0 = 0; }
    else { t0 *= t0; var gi0 = permMod12[ii + perm[jj]] * 3; n0 = t0 * t0 * (GRAD3[gi0] * x0 + GRAD3[gi0 + 1] * y0); }
    var t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 < 0) { n1 = 0; }
    else { t1 *= t1; var gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3; n1 = t1 * t1 * (GRAD3[gi1] * x1 + GRAD3[gi1 + 1] * y1); }
    var t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 < 0) { n2 = 0; }
    else { t2 *= t2; var gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3; n2 = t2 * t2 * (GRAD3[gi2] * x2 + GRAD3[gi2 + 1] * y2); }
    return 70 * (n0 + n1 + n2);
  };

  SimplexNoise.prototype.fbm = function (x, y, octaves, lacunarity, persistence) {
    octaves = octaves || 4;
    lacunarity = lacunarity || 2;
    persistence = persistence || 0.5;
    var value = 0, amplitude = 1, frequency = 1, maxValue = 0;
    for (var i = 0; i < octaves; i++) {
      value += amplitude * this.noise2D(x * frequency, y * frequency);
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }
    return value / maxValue;
  };

  // ---- Flow Renderer ----
  function renderFlow(ctx, c, time, p) {
    for (var idx = 0; idx < c.gridPositions.length; idx++) {
      var pos = c.gridPositions[idx];
      var n1 = c.noise.fbm(
        pos.x * p.scale + time * 0.5,
        pos.y * p.scale + time * 0.3,
        p.octaves, p.lacunarity, 0.5,
      );
      var n2 = c.noise.fbm(
        pos.x * p.scale * 1.5 - time * 0.4,
        pos.y * p.scale * 1.5 + time * 0.2,
        Math.max(1, p.octaves - 1), p.lacunarity, 0.5,
      );
      var combined = (n1 + n2 * 0.5) / 1.5;

      if (combined > p.threshold) {
        var intensity = Math.min(1, (combined - p.threshold) / (1 - p.threshold));
        var alpha = 0.3 + intensity * 0.7;
        ctx.fillStyle = c.getColor(intensity, alpha);
        ctx.fillRect(
          Math.round(pos.x - c.pixelSize / 2),
          Math.round(pos.y - c.pixelSize / 2),
          c.pixelSize, c.pixelSize,
        );
      }
    }
  }

  // ---- Configuration ----
  var BASE_PIXEL_SIZE = 2;
  var BASE_GAP = 4;
  var REFERENCE_WIDTH = 1440;
  var NOISE_SEED = 42;

  var FLOW_PARAMS = {
    scale: 0.008,
    speed: 0.001,
    threshold: 0.1,
    octaves: 5,
    lacunarity: 2,
  };

  var LIGHT_PALETTE = {
    bg: '#fffffe',
    start: { r: 219, g: 229, b: 255 },
    end: { r: 168, g: 193, b: 255 },
  };

  var DARK_PALETTE = {
    bg: '#141413',
    start: { r: 136, g: 136, b: 136 },
    end: { r: 100, g: 100, b: 100 },
  };

  // ---- Helpers ----
  function lerp(a, b, t) { return a + (b - a) * t; }

  function buildGrid(width, height, cellSize) {
    var positions = [];
    for (var y = cellSize / 2; y < height; y += cellSize) {
      for (var x = cellSize / 2; x < width; x += cellSize) {
        positions.push({ x: x, y: y });
      }
    }
    return positions;
  }

  function isDarkMode() {
    return document.documentElement.classList.contains('dark');
  }

  // ---- Main ----
  var canvas = document.querySelector('.inner-grid-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var noise = new SimplexNoise(NOISE_SEED);
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var gridPositions = [];
  var cWidth = 0;
  var cHeight = 0;
  var currentPixelSize = BASE_PIXEL_SIZE;
  var currentNoiseScale = FLOW_PARAMS.scale;
  var rafId;
  var time = 0;
  var lastTime;
  var palette = isDarkMode() ? DARK_PALETTE : LIGHT_PALETTE;

  function resize() {
    var parent = canvas.parentElement;
    if (!parent) return;
    var dpr = window.devicePixelRatio || 1;
    var w = parent.clientWidth;
    var h = parent.clientHeight;
    if (w === cWidth && h === cHeight) return;
    cWidth = w;
    cHeight = h;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var scaleFactor = Math.min(1, w / REFERENCE_WIDTH);
    currentPixelSize = Math.max(1, Math.round(BASE_PIXEL_SIZE * scaleFactor));
    var gap = Math.max(2, Math.round(BASE_GAP * scaleFactor));
    var cellSize = currentPixelSize + gap;
    currentNoiseScale = FLOW_PARAMS.scale * (REFERENCE_WIDTH / w);

    gridPositions = buildGrid(w, h, cellSize);
  }

  function renderFrame() {
    var c = {
      noise: noise,
      gridPositions: gridPositions,
      pixelSize: currentPixelSize,
      getColor: function (intensity, alpha) {
        var r = Math.round(lerp(palette.end.r, palette.start.r, intensity));
        var g = Math.round(lerp(palette.end.g, palette.start.g, intensity));
        var b = Math.round(lerp(palette.end.b, palette.start.b, intensity));
        return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
      },
    };

    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, cWidth, cHeight);
    renderFlow(ctx, c, time, {
      scale: currentNoiseScale,
      threshold: FLOW_PARAMS.threshold,
      octaves: FLOW_PARAMS.octaves,
      lacunarity: FLOW_PARAMS.lacunarity,
    });
  }

  var FRAME_INTERVAL = 1000 / 15;
  var accumulator = 0;

  function animate(now) {
    var dt = lastTime !== undefined ? now - lastTime : 16.67;
    lastTime = now;
    accumulator += dt;
    if (accumulator >= FRAME_INTERVAL) {
      time += FLOW_PARAMS.speed * accumulator;
      accumulator = 0;
      renderFrame();
    }
    rafId = requestAnimationFrame(animate);
  }

  var observer = new MutationObserver(function () {
    var nextPalette = isDarkMode() ? DARK_PALETTE : LIGHT_PALETTE;
    if (nextPalette !== palette) {
      palette = nextPalette;
      renderFrame();
    }
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  resize();
  window.addEventListener('resize', resize);

  if (prefersReducedMotion) {
    renderFrame();
  } else {
    rafId = requestAnimationFrame(animate);
  }
})();