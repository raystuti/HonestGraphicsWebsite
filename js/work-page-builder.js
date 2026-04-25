(function () {
  const siteConfig = window.HG_SITE_CONFIG || {};
  const navConfig = siteConfig.nav || {};
  const contactConfig = siteConfig.contact || {};

  const navLinks = navConfig.links || [
    { label: 'Work', href: 'honest-graphics.html#services' },
    { label: 'Clients', href: 'honest-graphics.html#clients' },
    { label: 'About', href: 'honest-graphics.html#about' },
    { label: 'Contact', href: 'honest-graphics.html#contact' }
  ];
  const navHomeHref = navConfig.homeHref || 'honest-graphics.html#home';
  const callPrimaryTel = contactConfig.callPrimaryTel || '+919081590808';
  const workSectionHref = (navLinks[0] && navLinks[0].href) || 'honest-graphics.html#services';

  const root = document.getElementById('workPageRoot');
  const key = document.body.dataset.workPage;
  const pages = window.HG_WORK_PAGES || {};
  const page = pages[key];

  if (!root) return;

  if (!page) {
    root.innerHTML = '<main class="page-main"><section><h1 class="section-title">Page Not Found</h1><p class="section-note">This work page configuration is missing.</p><a class="footer-back" href="' + workSectionHref + '">Back to Proof In Practice</a></section></main>';
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
    if (!items || !items.length) return '';
    let markup = '<div class="gallery">';
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      markup += '<a class="gallery-item" href="' + item.src + '" target="_blank" rel="noopener noreferrer">';
      markup += '<img src="' + item.src + '" alt="' + item.alt + '" onerror="this.parentElement.remove()"/>';
      if (item.tag) {
        markup += '<span class="gallery-tag">' + item.tag + '</span>';
      }
      markup += '</a>';
    }
    markup += '</div>';
    return markup;
  };

  const renderSectionHead = function (title, note) {
    if (!title && !note) return '';
    let markup = '<div class="section-head">';
    if (title) markup += '<h2 class="section-title">' + title + '</h2>';
    if (note) markup += '<p class="section-note">' + note + '</p>';
    markup += '</div>';
    return markup;
  };

  const renderNavLinks = function () {
    let markup = '';
    for (let i = 0; i < navLinks.length; i += 1) {
      markup += '<li><a href="' + navLinks[i].href + '">' + navLinks[i].label + '</a></li>';
    }
    return markup;
  };

  root.innerHTML = '' +
    '<nav>' +
      '<a href="' + navHomeHref + '" class="nav-logo" aria-label="Honest Graphics Home">' +
        '<span class="logo-plate">' +
          '<img src="../assets/honest-logo-clean-light.png" alt="Honest Graphics logo" class="logo-img"/>' +
        '</span>' +
      '</a>' +
      '<ul class="nav-center">' +
        renderNavLinks() +
      '</ul>' +
      '<div class="nav-right">' +
        '<a href="tel:' + callPrimaryTel + '" class="nav-cta nav-call" aria-label="Call Honest Graphics">' +
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
        renderSectionHead(
          key === 'identity-design' ? '' : page.sectionTitle,
          key === 'identity-design' ? '' : page.sectionNote
        ) +
        renderLogoWall(page.logoWall) +
        renderGallery(page.gallery) +
        '<a class="footer-back" href="' + page.backHref + '">' + page.backLabel + '</a>' +
      '</section>' +
    '</main>';
})();
