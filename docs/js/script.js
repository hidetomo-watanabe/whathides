document.addEventListener('DOMContentLoaded', function () {

  // style.css のブレークポイント（max-width: 799px）と合わせる
  var MOBILE_MAX = 799;

  var menu = document.getElementById('menu');
  var menuBtn = document.getElementById('menuBtn');
  var panel = document.getElementById('navPanel');
  var mainnav = document.getElementById('mainnav');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('#mainnav ul a'));

  function isMobile() {
    return window.innerWidth <= MOBILE_MAX;
  }


  /* ハンバーガーメニューの開閉
  ------------------------------------------------------------*/
  function setMenu(open) {
    if (!menu || !panel) return;
    panel.classList.toggle('is-open', open);
    menu.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    if (menuBtn) menuBtn.classList.toggle('close', open);
  }

  if (menu && panel) {
    menu.addEventListener('click', function () {
      setMenu(!panel.classList.contains('is-open'));
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) {
        setMenu(false);
        menu.focus();
      }
    });

    // メニューの外をクリックしたら閉じる
    document.addEventListener('click', function (e) {
      if (!panel.classList.contains('is-open')) return;
      if (mainnav && mainnav.contains(e.target)) return;
      setMenu(false);
    });

    // 開いている間はフォーカスをメニュー内に閉じ込める
    // （順序は 開閉ボタン → パネル内のリンク）
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !panel.classList.contains('is-open')) return;

      var items = [menu].concat(Array.prototype.slice.call(panel.querySelectorAll('a')));
      var first = items[0];
      var last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // PC幅に戻ったときに開閉状態をリセットする
    window.addEventListener('resize', function () {
      if (!isMobile()) setMenu(false);
    });
  }

  // ページ内リンクはブラウザ標準の挙動に任せる（URLハッシュが更新され、
  // 共有・ブラウザバックが効く）。スムーススクロールと固定ヘッダー分の
  // オフセットは CSS の scroll-behavior / scroll-margin-top で処理する。
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (isMobile()) setMenu(false);
    });
  });


  /* スクロール位置に応じた現在地のハイライト
  ------------------------------------------------------------*/
  var linkBy;
  var sections = [];

  linkBy = {};
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href') || '';
    if (href.charAt(0) !== '#') return;
    var id = href.slice(1);
    linkBy[id] = link;
    var el = document.getElementById(id);
    if (el && el.tagName.toLowerCase() === 'section') sections.push(el);
  });

  function setActive(id) {
    navLinks.forEach(function (link) {
      var on = link === linkBy[id];
      link.classList.toggle('active', on);
      if (on) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  function updateActive() {
    if (!sections.length) return;

    var doc = document.documentElement;

    // ページ最下部では最後のセクションを現在地とする
    // （短いセクションが判定線に届かないケースの補正）
    if (window.pageYOffset + window.innerHeight >= doc.scrollHeight - 2) {
      setActive(sections[sections.length - 1].id);
      return;
    }

    var threshold = isMobile() ? 80 : 40;
    var current = 'top';
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= threshold) current = section.id;
    });
    setActive(current);
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      updateActive();
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateActive();

});
