/* SAHNE 1 — KUTU VE BİRİM KÜP (0–10 s)  Hacmi ölçmek için ölçüt.
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, lerp, inOut } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang, Ink = LI.Ink;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });
  const amber = (a) => `rgba(${LI.AMBER_RGB},${a})`;
  const fr = (n, d, h) => F().fr(n, d, h);
  const neg = (s) => s.replace('-', '−');
  const label = (v) => (v < 0 ? neg(String(v)) : String(v));

  /* ---- boxes and equal objects: cabinet projection, x right, y back, z up ---- */
  const Pj = (O, c, x, y, z) => [O[0] + x * c + y * c * 0.5, O[1] - z * c - y * c * 0.5];
  function poly(ctx, P, a, fill, seed, w = 3) {
    ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
    ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fill();
    fill.forEach((f) => { if (f) { ctx.fillStyle = f; ctx.fill(); } });
    Ink.path(ctx, P.concat([P[0]]), { w, alpha: a * 0.9, seed, taper: [0, 0] });
  }
  /** a solid block x..x+dx, y..y+dy, z..z+dz */
  function block(ctx, O, c, x, y, z, dx, dy, dz, a, h, seed) {
    if (a <= 0) return;
    const P = (i, j, k) => Pj(O, c, x + i * dx, y + j * dy, z + k * dz), H = h > 0 ? amber(a * 0.6 * h) : null;
    poly(ctx, [P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)], a, [amber(a * 0.2), H], seed, 2.5);
    poly(ctx, [P(1, 0, 0), P(1, 1, 0), P(1, 1, 1), P(1, 0, 1)], a, [`rgba(${LI.INK_RGB},${a * 0.14})`, H], seed + 1, 2.5);
    poly(ctx, [P(0, 0, 0), P(1, 0, 0), P(1, 0, 1), P(0, 0, 1)], a, [`rgba(${LI.INK_RGB},${a * 0.04})`, H], seed + 2, 2.5);
  }
  function ball(ctx, O, c, x, y, z, a, seed) {
    if (a <= 0) return; const C = Pj(O, c, x + 0.5, y + 0.5, z + 0.5), r = c * 0.47;
    ctx.beginPath(); ctx.arc(C[0], C[1], r, 0, 7);
    ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fill();
    const g = ctx.createRadialGradient(C[0] - r * 0.35, C[1] - r * 0.35, r * 0.1, C[0], C[1], r);
    g.addColorStop(0, amber(a * 0.12)); g.addColorStop(1, amber(a * 0.45)); ctx.fillStyle = g; ctx.fill();
    const P = []; for (let i = 0; i <= 28; i++) P.push([C[0] + r * Math.cos(i / 28 * 6.2832), C[1] + r * Math.sin(i / 28 * 6.2832)]);
    Ink.path(ctx, P, { w: 2.5, alpha: a * 0.9, seed, taper: [0, 0] });
  }
  /** items [{x,y,z,dx,dy,dz}] in painter's order, each with a fill index i */
  function fillList(L, W, H, dx = 1) {
    const out = [];
    for (let z = 0; z < H; z++) for (let y = W - 1; y >= 0; y--) for (let x = 0; x < L; x += dx) out.push({ x, y, z, dx, dy: 1, dz: 1 });
    out.forEach((q, i) => (q.i = i));
    return out.slice().sort((p, q) => q.y - p.y || p.x - q.x || p.z - q.z);
  }
  const shown = (t, t0, dt, n) => Math.max(0, Math.min(n, Math.floor((t - t0) / dt + 0.4)));
  /** an open glass box: back walls first, then the contents, then the front edges */
  function container(ctx, O, c, L, W, H, a, seed, draw) {
    if (a <= 0) return;
    const P = (x, y, z) => Pj(O, c, x, y, z), ink = `rgba(${LI.INK_RGB},${a * 0.05})`;
    poly(ctx, [P(0, W, 0), P(L, W, 0), P(L, W, H), P(0, W, H)], a * 0.8, [ink], seed, 2);
    poly(ctx, [P(0, 0, 0), P(0, W, 0), P(0, W, H), P(0, 0, H)], a * 0.8, [ink], seed + 1, 2);
    poly(ctx, [P(0, 0, 0), P(L, 0, 0), P(L, W, 0), P(0, W, 0)], a * 0.8, [ink], seed + 2, 2);
    if (draw) draw();
    [[[0, 0, 0], [L, 0, 0]], [[L, 0, 0], [L, 0, H]], [[L, 0, H], [0, 0, H]], [[0, 0, H], [0, 0, 0]], [[L, 0, 0], [L, W, 0]], [[L, W, 0], [L, W, H]], [[L, W, H], [L, 0, H]], [[0, W, H], [L, W, H]], [[0, 0, H], [0, W, H]]]
      .forEach(([p, q], i) => Ink.path(ctx, [P(...p), P(...q)], { w: 3, alpha: a * 0.85, seed: seed + 10 + i, taper: [0, 0] }));
  }
  function fillBox(ctx, O, c, L, W, H, t, t0, dt, a, seed, kind = 'cube', hot = 0) {
    const dx = kind === 'brick' ? 2 : 1, items = fillList(L, W, H, dx);
    container(ctx, O, c, L, W, H, a, seed, () => items.forEach((q) => {
      const k = seg(t, t0 + q.i * dt, t0 + q.i * dt + 0.35); if (k <= 0) return;
      const dz = (1 - inOut(k)) * (H + 1 - q.z);
      if (kind === 'ball') ball(ctx, O, c, q.x, q.y, q.z + dz, a * k, seed + 100 + q.i * 3);
      else block(ctx, O, c, q.x, q.y, q.z + dz, q.dx, 1, 1, a * k, hot, seed + 100 + q.i * 3);
    }));
    return items.length;
  }
  function tag(ctx, env, O, c, L, text, a, hot) {
    if (a <= 0) return; const s = KD.L(env).G.s;
    F().T(ctx, text, O[0] + L * c / 2, O[1] + s * 0.95, { size: s * 0.66, alpha: a, halo: true, color: hot ? A.amber : undefined });
  }
  /** cubes of an L × W × H prism; when(q) gives each cube's arrival time (Infinity = never) */
  function cubes(L, W, H) {
    const out = [];
    for (let z = 0; z < H; z++) for (let y = W - 1; y >= 0; y--) for (let x = 0; x < L; x++) out.push({ x, y, z });
    return out.sort((p, q) => q.y - p.y || p.x - q.x || p.z - q.z);
  }
  function fillT(ctx, O, c, B, t, a, when, hot, seed) {
    let n = 0;
    container(ctx, O, c, B[0], B[1], B[2], a, seed, () => cubes(...B).forEach((q, i) => {
      const t0 = when(q); if (!(t >= t0)) return; n++;
      const k = seg(t, t0, t0 + 0.3);
      block(ctx, O, c, q.x, q.y, q.z + (1 - inOut(k)) * 1.2, 1, 1, 1, a * k, hot ? hot(q) : 0, seed + 100 + i * 3);
    }));
    return n;
  }
  function edges(ctx, env, O, c, B, a, labels) {
    if (a <= 0) return; const s = KD.L(env).G.s, o = { size: s * 0.7, alpha: a, halo: true, color: A.amber };
    const m = (p, q) => { const P = Pj(O, c, ...p), Q = Pj(O, c, ...q); return [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2]; };
    const [L, W, H] = B;
    let q = m([0, 0, 0], [L, 0, 0]); F().T(ctx, labels[0], q[0], q[1] + 36, o);
    q = m([L, 0, 0], [L, W, 0]); F().T(ctx, labels[1], q[0] + 50, q[1] + 12, o);
    q = m([L, W, 0], [L, W, H]); F().T(ctx, labels[2], q[0] + 48, q[1], o);
  }
  function tally(ctx, env, t, rows) {
    const T = KD.L(env).TL;
    rows.forEach(([t0, t1, txt, hot], i) => { const al = win(t, t0, t1) * END(t); if (al > 0) F().T(ctx, txt, T.x, T.y[i], { size: T.s, alpha: al, halo: true, color: hot ? A.amber : undefined }); });
  }

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'Bu kutunun hacmi ne kadar?'],
      [10.6, 27.8, 'Birim küplerle dolduralım ve sayalım'],
      [28.4, 45.8, 'Daha hızlı bir yol: kat kat sayalım'],
      [46.4, 63.8, 'Başka bir yol: dilim dilim sayalım'],
      [64.4, 79.8, 'Hacim = taban alanı × yükseklik'],
    ]);
  }

  function figure(ctx, env, t) {
    const L = KD.L(env), a = END(t), c = L.ST.c, O = [L.P1.x, L.P1.y], B = [5, 3, 4], s = L.G.s;
    const box = (a0, when, hot, seed) => fillT(ctx, O, c, B, t, a0, when, hot, seed);
    // S1: the empty box and the unit cube
    const a1 = win(t, 4.6, 10.2) * a;
    if (a1 > 0) {
      container(ctx, O, c, 5, 3, 4, a1 * seg(t, 4.8, 5.4), 40000);
      const u = a1 * seg(t, 6.6, 7.2), U = [L.U.x, L.U.y];
      if (u > 0) { block(ctx, U, c, 0, 0, 0, 1, 1, 1, u, 0.6, 40500); F().T(ctx, '1 cm³', U[0] + c * 0.75, U[1] + s * 0.95, { size: s * 0.7, alpha: u, halo: true, color: A.amber }); F().T(ctx, '1 cm', U[0] + c / 2, U[1] - c * 1.9, { size: s * 0.5, alpha: u * 0.8, halo: true }); }
    }
    // S2: one by one, then faster: 60 cubes
    const a2 = win(t, 10.8, 27.8) * a;
    if (a2 > 0) {
      const ord = new Map(); let k = 0;
      for (let z = 0; z < 4; z++) for (let y = 2; y >= 0; y--) for (let x = 0; x < 5; x++) ord.set(`${x},${y},${z}`, k++);
      const when = (q) => { const i = ord.get(`${q.x},${q.y},${q.z}`); return i < 5 ? 11.4 + i * 0.5 : 13.9 + (i - 5) * 0.11; };
      const n = box(a2, when, null, 41000);
      tag(ctx, env, O, c, 5, `${n} birim küp`, a2 * seg(t, 11.4, 11.8), t > 21.0);
    }
    // S3: layer by layer
    const a3 = win(t, 28.8, 45.8) * a;
    if (a3 > 0) {
      const lt = [0, 34.0, 35.2, 36.4];
      const when = (q) => (q.z === 0 ? 29.4 + (2 - q.y) * 0.9 + q.x * 0.08 : lt[q.z] + (q.x + q.y) * 0.03);
      box(a3, when, (q) => (q.z === 0 ? win(t, 32.0, 34.0) : q.z === 1 ? win(t, 34.0, 35.0) : q.z === 2 ? win(t, 35.2, 36.2) : q.z === 3 ? win(t, 36.4, 37.4) : 0), 42000);
      tally(ctx, env, t, [[32.4, 45.8, '1 kat: 5 × 3 = 15'], [34.2, 45.8, '2 kat: 15 + 15 = 30'], [35.4, 45.8, '3 kat: 45'], [36.6, 45.8, '4 kat: 4 × 15 = 60', true]]);
    }
    // S4: slice by slice, then the edges
    const a4 = win(t, 46.8, 63.8) * a;
    if (a4 > 0) {
      const st = [50.8, 49.6, 47.4];
      box(a4, (q) => st[q.y] + (q.y === 2 ? q.x * 0.3 + q.z * 0.06 : (q.x + q.z) * 0.03), (q) => (q.y === 0 ? win(t, 50.8, 52.2) : 0), 43000);
      tally(ctx, env, t, [[49.0, 63.8, '1 dilim: 5 × 4 = 20'], [51.2, 63.8, '3 dilim: 3 × 20 = 60'], [53.4, 63.8, 'Ayrıtlar: 5, 3, 4'], [55.4, 63.8, '5 · 3 · 4 = 60', true]]);
      edges(ctx, env, O, c, B, a4 * seg(t, 53.4, 53.8), ['5 cm', '3 cm', '4 cm']);
    }
    // S5: base area × height with a new prism
    const a5 = win(t, 64.8, 79.8) * a;
    if (a5 > 0) {
      const B2 = [6, 2, 3];
      fillT(ctx, O, c, B2, t, a5, (q) => (q.z === 0 ? 65.6 + q.x * 0.1 + (1 - q.y) * 0.3 : 68.6 + (q.z - 1) * 1.2 + (q.x + q.y) * 0.03), (q) => (q.z === 0 ? win(t, 66.6, 68.4) : 0), 44000);
      edges(ctx, env, O, c, B2, a5 * seg(t, 65.4, 65.8), ['6 cm', '2 cm', '3 cm']);
      tally(ctx, env, t, [[66.8, 79.8, 'Taban alanı: 6 × 2 = 12 cm²'], [70.4, 79.8, 'Yükseklik: 3 cm'], [72.0, 79.8, 'Hacim: 12 × 3 = 36 cm³', true]]);
    }
  }

  function words(ctx, env, t) {
    const W = KD.L(env).W;
    exprs(ctx, t, at(W, 0), [[6.6, 10.2, 'Ölçüt: ayrıtı 1 cm olan birim küp, 1 cm³'],
      [11.4, 20.8, 'Birim küpleri tek tek sayalım'], [21.0, 27.8, 'Kutuya 60 birim küp sığdı: hacmi 60 cm³'],
      [29.4, 45.8, 'Bir katta 5 × 3 = 15 küp, 4 kat var'],
      [47.4, 63.8, 'Önden dilimler: her dilimde 5 × 4 = 20 küp, 3 dilim'],
      [65.4, 79.8, 'Yeni kutu: 6 cm, 2 cm, 3 cm']]);
    exprs(ctx, t, at(W, 1), [[22.6, 27.8, 'Ama tek tek saymak uzun sürdü'], [38.6, 45.8, '4 × 15 = 60: aynı sonuç, daha hızlı'],
      [56.0, 63.8, 'Küp sayısı = ayrıt uzunluklarının çarpımı'], [73.0, 79.8, 'Taban alanı kadar küp, yükseklik kadar kat']]);
    exprs(ctx, t, at(W, 2), [[24.4, 27.8, 'Daha hızlı sayabilir miyiz?', true], [41.4, 45.8, '15 = taban alanı, 4 = yükseklik', true],
      [59.0, 63.8, 'Hacim = 5 · 3 · 4 = 60 cm³', true], [75.4, 79.8, 'Hacim = taban alanı × yükseklik', true]]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Ölçüt: 1 cm³ birim küp', 80.6], ['Kat kat: 15 + 15 + 15 + 15 = 60', 81.6], ['Ayrıtlar: 5 · 3 · 4 = 60', 82.6], ['Hacim = taban alanı × yükseklik', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.1 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); figure(ctx, env, t); words(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'A box and a unit cube', nameTr: 'Kutu ve birim küp', concept: '1 cm³', conceptTr: '1 cm³', render });
})(window.LI = window.LI || {});
