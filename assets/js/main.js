(function () {
  var root = document.documentElement;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  // ---- Langue (FR par défaut, EN si le navigateur est en anglais) ----
  if (!store.get('lang')) {
    var nav = (navigator.language || 'fr').toLowerCase();
    root.lang = nav.indexOf('fr') === 0 ? 'fr' : 'en';
  }
  document.getElementById('langToggle').addEventListener('click', function () {
    root.lang = root.lang === 'fr' ? 'en' : 'fr';
    store.set('lang', root.lang);
  });

  // ---- Thème ----
  document.getElementById('themeToggle').addEventListener('click', function () {
    var current = root.dataset.theme ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    root.dataset.theme = current === 'dark' ? 'light' : 'dark';
    store.set('theme', root.dataset.theme);
  });

  // ---- Nav : bordure au scroll + lien actif ----
  var header = document.querySelector('.nav');
  window.addEventListener('scroll', function () {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }, { passive: true });

  var links = document.querySelectorAll('.nav__links a');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-current', a.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });

    // ---- Apparition au scroll ----
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); reveal.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(function (el) { reveal.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---- Filtres projets ----
  var chips = document.querySelectorAll('.filters .chip');
  var projects = document.querySelectorAll('.project');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.dataset.filter;
      chips.forEach(function (c) { c.classList.toggle('is-active', c === chip); });
      projects.forEach(function (p) {
        var show = f === 'all' || p.dataset.tags.split(' ').indexOf(f) !== -1;
        p.classList.toggle('is-hidden', !show);
        if (show) p.classList.add('is-visible');
      });
    });
  });

  // ---- E-mail assemblé côté client (limite le scraping) ----
  var mail = document.getElementById('mailLink');
  if (mail) {
    var addr = mail.dataset.u + '@' + mail.dataset.d;
    mail.href = 'mailto:' + addr;
    mail.querySelector('.mail-text').textContent = addr;
  }

  // ---- Bouton CV : affiché seulement si le PDF existe ----
  var cv = document.getElementById('cvLink');
  if (cv && window.fetch) {
    fetch(cv.getAttribute('href'), { method: 'HEAD' })
      .then(function (r) { if (r.ok) cv.hidden = false; })
      .catch(function () {});
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
