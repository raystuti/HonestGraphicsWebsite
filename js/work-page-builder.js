(function () {
  const root = document.getElementById('workPageRoot');
  const key = document.body.dataset.workPage;
  const pages = window.HG_WORK_PAGES || {};
  const page = pages[key];

  if (!root) return;

  if (!page) {
    root.innerHTML = '<main class="page-main"><section><h1 class="section-title">Page Not Found</h1><p class="section-note">This work page configuration is missing.</p><a class="footer-back" href="honest-graphics.html#services">Back to Proof In Practice</a></section></main>';
    return;
  }

  document.title = page.title;
  document.body.style.setProperty('--hero-image', "url('" + page.heroImage + "')");

  const renderLogoWall = function (items) {
    if (!items || !items.length) return '';
    let markup = '<div class="logo-wall">';
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      markup += '<div class="logo-card"><img src="' + item.src + '" alt="' + item.alt + '"/></div>';
    }
    markup += '</div>';
    return markup;
  };

  const renderGallery = function (items) {
    let markup = '<div class="gallery">';
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      markup += '<a class="gallery-item" href="' + item.src + '" target="_blank" rel="noopener noreferrer">';
      markup += '<img src="' + item.src + '" alt="' + item.alt + '"/>';
      if (item.tag) {
        markup += '<span class="gallery-tag">' + item.tag + '</span>';
      }
      markup += '</a>';
    }
    markup += '</div>';
    return markup;
  };

  root.innerHTML = '' +
    '<nav>' +
      '<a href="honest-graphics.html#home" class="nav-logo" aria-label="Honest Graphics Home">' +
        '<span class="logo-plate">' +
          '<img src="../assets/honest-logo-clean-light.png" alt="Honest Graphics logo" class="logo-img"/>' +
        '</span>' +
      '</a>' +
      '<ul class="nav-center">' +
        '<li><a href="honest-graphics.html#services">Work</a></li>' +
        '<li><a href="honest-graphics.html#clients">Clients</a></li>' +
        '<li><a href="honest-graphics.html#about">About</a></li>' +
        '<li><a href="honest-graphics.html#contact">Contact</a></li>' +
      '</ul>' +
      '<div class="nav-right">' +
        '<a href="tel:+919081590808" class="nav-cta nav-call" aria-label="Call Honest Graphics">' +
          '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
            '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.78.65 2.62a2 2 0 0 1-.45 2.11L8.1 9.67a16 16 0 0 0 6.23 6.23l1.22-1.21a2 2 0 0 1 2.11-.45c.84.31 1.72.53 2.62.65A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<path d="M15.5 4.5a5 5 0 0 1 4 4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>' +
            '<path d="M15.5 8a2 2 0 0 1 1.5 1.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>' +
          '</svg>' +
          '<span>Call Us</span>' +
        '</a>' +
      '</div>' +
    '</nav>' +

    '<header class="page-hero">' +
      '<div class="page-hero-inner">' +
        '<p class="eyebrow">Proof In Practice</p>' +
        '<h1 class="page-title">' + page.pageTitle + '</h1>' +
        '<p class="page-sub">' + page.pageSub + '</p>' +
      '</div>' +
    '</header>' +

    '<main class="page-main">' +
      '<section>' +
        '<div class="section-head">' +
          '<h2 class="section-title">' + page.sectionTitle + '</h2>' +
          '<p class="section-note">' + page.sectionNote + '</p>' +
        '</div>' +
        renderLogoWall(page.logoWall) +
        renderGallery(page.gallery) +
        '<a class="footer-back" href="' + page.backHref + '">' + page.backLabel + '</a>' +
      '</section>' +
    '</main>';
})();
