document.addEventListener('DOMContentLoaded', function () {

  var navLinks = document.querySelectorAll('#mainnav ul a');
  var panel = document.querySelector('.panel');
  var menuWrap = document.getElementById('menuWrap');
  var menuBtn = document.getElementById('menuBtn');

  function headerHeight() {
    return window.innerWidth > 880 ? 20 : 60;
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      navLinks.forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');

      var target = document.querySelector(link.getAttribute('href'));
      if (target) {
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight();
        window.scrollTo({ top: top, behavior: 'smooth' });
      }

      // スマホ表示ではメニューを閉じる
      if (window.innerWidth < 880 && panel) {
        panel.style.display = 'none';
        if (menuBtn) menuBtn.classList.remove('close');
      }
    });
  });

  // ハンバーガーメニューの開閉
  if (menuWrap && panel) {
    menuWrap.addEventListener('click', function () {
      var isOpen = window.getComputedStyle(panel).display !== 'none';
      panel.style.display = isOpen ? 'none' : 'block';
      if (menuBtn) menuBtn.classList.toggle('close');
    });
  }

});
