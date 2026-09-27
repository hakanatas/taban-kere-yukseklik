/* SAHNE 4 — DİLİM DİLİM (46–64 s) */
(function (LI) {
  'use strict';
  const KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 4, start: 46, end: 64, name: "Slice by slice", nameTr: "Dilim dilim", concept: "5 · 3 · 4 = 60", conceptTr: "5 · 3 · 4 = 60", render });
})(window.LI = window.LI || {});
