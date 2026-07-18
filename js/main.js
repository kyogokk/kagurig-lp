// Kagu Rig LP — イントロ / スライドショー / スクロール演出

(() => {
  const intro = document.getElementById('intro');
  const header = document.getElementById('header');
  const slides = document.querySelectorAll('.hero__slide');
  const current = document.getElementById('slideCurrent');
  const total = document.getElementById('slideTotal');
  const bar = document.getElementById('slideBar');

  const SLIDE_INTERVAL = 3200; // 写真の切り替え間隔(ms)
  let index = 0;
  let timer = null;

  const pad = (n) => String(n + 1).padStart(2, '0');
  total.textContent = pad(slides.length - 1);

  // --- スライドショー ---
  const runBar = () => {
    bar.classList.remove('is-run');
    void bar.offsetWidth; // アニメーション再始動
    bar.classList.add('is-run');
  };

  const next = () => {
    slides[index].classList.remove('is-active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('is-active');
    current.textContent = pad(index);
    runBar();
  };

  const startSlideshow = () => {
    runBar();
    timer = setInterval(next, SLIDE_INTERVAL);
  };

  // --- イントロ終了 → ヒーロー表示 ---
  const finishIntro = () => {
    if (intro.classList.contains('is-leaving')) return;
    intro.classList.add('is-leaving');
    document.body.classList.add('is-ready');
    startSlideshow();
    setTimeout(() => intro.classList.add('is-done'), 1000);
  };

  // ロゴのアニメーション（0.3s delay + 2.2s）を見せてから退場
  setTimeout(finishIntro, 3000);
  intro.addEventListener('click', finishIntro); // クリックでスキップ

  // --- ヘッダー：ヒーローを抜けたら白背景に ---
  const viewH = () => document.documentElement.clientHeight || window.innerHeight;
  const hero = document.querySelector('.hero');
  const onScroll = () => {
    header.classList.toggle('is-solid', window.scrollY > viewH() * 0.85);
    hero.classList.toggle('is-passed', window.scrollY > viewH() * 0.45);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 実際にスクロールした後だけ、上下2行のフェード順を反転させる
  // （初回ロード時の上→下カスケードは変えず、スクロール操作後のみ適用）
  window.addEventListener('scroll', () => {
    document.body.classList.add('was-scrolled');
  }, { once: true, passive: true });

  // --- スクロール出現 ---
  const reveals = [...document.querySelectorAll('.reveal')];
  const checkReveals = () => {
    reveals.forEach((el) => {
      if (!el.classList.contains('is-on') &&
          el.getBoundingClientRect().top < viewH() * 0.82) {
        el.classList.add('is-on');
      }
    });
  };
  window.addEventListener('scroll', checkReveals, { passive: true });
  checkReveals();
})();
