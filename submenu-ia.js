/**
 * Submenu IA — v3
 * Archivo: js/submenu-ia.js
 *
 * - Desktop: hover puro via CSS, sin JS
 * - Mobile:  click en botón "IA ˅" abre/cierra accordion
 *
 * Añadir antes de </body>:
 * <script src="js/submenu-ia.js"></script>
 */
(function () {
  'use strict';

  /* ---- Mobile: accordion toggle ---- */
  var mobileToggles = document.querySelectorAll('.has-sub-toggle-mobile');

  mobileToggles.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var parent = this.closest('.has-sub-parent-mobile');
      var isOpen = parent.classList.contains('is-open');

      parent.classList.toggle('is-open');
      this.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ---- Click fuera cierra mobile ---- */
  document.addEventListener('click', function (e) {
    var openMobile = document.querySelectorAll('.has-sub-parent-mobile.is-open');
    openMobile.forEach(function (item) {
      if (!item.contains(e.target)) {
        item.classList.remove('is-open');
        var btn = item.querySelector('.has-sub-toggle-mobile');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  });
})();