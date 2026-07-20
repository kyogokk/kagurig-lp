// Kagu Rig LP — イントロ / スライドショー / スクロール演出

(() => {
  const intro = document.getElementById('intro');
  const header = document.getElementById('header');
  const slides = document.querySelectorAll('.hero__slide');
  const current = document.getElementById('slideCurrent');
  const total = document.getElementById('slideTotal');
  const bar = document.getElementById('slideBar');

  // ヒーローを持たないページ（story.html等）では出現アニメーションのみ動かす
  const hasHero = !!(intro && slides.length && current && total && bar);

  const SLIDE_INTERVAL = 3200; // 写真の切り替え間隔(ms)
  let index = 0;
  let timer = null;

  const pad = (n) => String(n + 1).padStart(2, '0');
  if (hasHero) total.textContent = pad(slides.length - 1);

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

  const viewH = () => document.documentElement.clientHeight || window.innerHeight;
  const hero = document.querySelector('.hero');

  if (hasHero) {
    // ロゴのアニメーション（0.3s delay + 2.2s）を見せてから退場
    setTimeout(finishIntro, 3000);
    intro.addEventListener('click', finishIntro); // クリックでスキップ

    // --- ヘッダー：ヒーローを抜けたら白背景に ---
    const onScroll = () => {
      header.classList.toggle('is-solid', window.scrollY > viewH() * 0.85);
      hero.classList.toggle('is-passed', window.scrollY > viewH() * 0.45);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

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

  // --- ページ内アンカーのスクロール ---
  // scrollIntoView を使う（この構成では window.scrollTo/scrollY が不安定なため）。
  // ヘッダーぶんのオフセットは CSS の [id]{scroll-margin-top} で確保。
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const hash = a.getAttribute('href');
    if (hash.length < 2) return; // 単なる "#" は無視
    a.addEventListener('click', (e) => {
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      // behavior:'smooth' は環境により無反応になるため instant で確実にジャンプ
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
      history.pushState(null, '', hash);
    });
  });

  // 直リンク／別ページ（story.html等）からの #hash 着地時も位置を補正する。
  if (location.hash.length > 1) {
    const target = document.querySelector(location.hash);
    if (target) {
      const jump = () => target.scrollIntoView({ block: 'start' });
      requestAnimationFrame(jump);
      window.addEventListener('load', jump, { once: true });
    }
  }
})();
