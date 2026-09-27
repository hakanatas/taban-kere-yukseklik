/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 7. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: 'Ölçüt: 1 cm³ birim küp', en: 'The unit: a 1 cm³ cube',
      note: 'Bu kutunun hacmi ne kadar? Ölçmek için bir ölçüt seçelim: ayrıtı 1 santimetre olan birim küp. Hacmi 1 santimetreküp.' },
    { scene: 2, start: 10.8, end: 20.8, tr: 'Birim küpleri sayalım', en: 'Count the unit cubes',
      note: 'Kutuyu birim küplerle dolduralım ve tek tek sayalım. Kutuya 60 birim küp sığdı.' },
    { scene: 2, start: 21.0, end: 27.8, tr: 'Hacim 60 cm³', en: 'The volume is 60 cm³',
      note: 'Kutunun hacmi 60 santimetreküp. Ama tek tek saymak uzun sürdü. Daha hızlı sayabilir miyiz?' },
    { scene: 3, start: 28.8, end: 38.4, tr: 'Kat kat sayalım', en: 'Count layer by layer',
      note: 'Önce tabandaki katı dolduralım: 5 sıra, 3 sıra, 5 çarpı 3, 15 küp. Üst üste 4 kat var.' },
    { scene: 3, start: 38.6, end: 45.8, tr: '4 × 15 = 60', en: '4 × 15 = 60',
      note: '4 çarpı 15, 60. Aynı sonuç, çok daha hızlı. 15 taban alanı, 4 yükseklik.' },
    { scene: 4, start: 46.8, end: 55.8, tr: 'Dilim dilim sayalım', en: 'Count slice by slice',
      note: 'Başka bir yol: önden dilimler. Her dilimde 5 çarpı 4, 20 küp. 3 dilim var: 3 çarpı 20, 60.' },
    { scene: 4, start: 56.0, end: 63.8, tr: '5 · 3 · 4 = 60', en: '5 · 3 · 4 = 60',
      note: 'Ayrıtlar 5, 3 ve 4 santimetre. Küp sayısı ayrıt uzunluklarının çarpımına eşit: 5 çarpı 3 çarpı 4, 60 santimetreküp.' },
    { scene: 5, start: 64.8, end: 72.8, tr: 'Taban alanı × yükseklik', en: 'Base area × height',
      note: 'Yeni bir kutu: 6, 2 ve 3 santimetre. Taban alanı 6 çarpı 2, 12 santimetrekare. Yükseklik 3 santimetre.' },
    { scene: 5, start: 73.0, end: 79.8, tr: '12 × 3 = 36 cm³', en: '12 × 3 = 36 cm³',
      note: 'Taban alanı kadar küp, yükseklik kadar kat. Hacim 12 çarpı 3, 36 santimetreküp.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Birim küpleri akıllıca say', en: 'Count unit cubes cleverly',
      note: 'Aklında kalsın: hacmi birim küplerle ölçeriz ve onları kat kat sayabiliriz.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'Hacim = taban alanı × yükseklik', en: 'Volume = base area × height',
      note: 'Dikdörtgenler prizmasının hacmi, taban alanı ile yüksekliğin çarpımıdır!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
