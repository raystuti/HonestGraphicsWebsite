(function () {
  var siteConfig = window.HG_SITE_CONFIG || {};
  var contactConfig = siteConfig.contact || {};
  var navConfig = siteConfig.nav || {};

  var backBtn = document.getElementById('backBtn');
  var shell = document.querySelector('.work-shell');
  var stage = document.querySelector('.work-stage');
  var slug = shell ? shell.getAttribute('data-work-page') : '';

  var WORK_PAGE_MAP = {
    'work-identity-design': {
      title: 'Identity Design',
      subtitle: 'Brand systems, applications, and identity-led visual language.',
      folderPath: '../assets/work/Identity Design',
      files: ['1.png', '2.png', '3.jpg', '4.png', '5.png', '6.jpg']
    },
    'work-brochure-design': {
      title: 'Brochure Design',
      subtitle: 'Editorial and sales-led layouts designed for clarity and conversion.',
      folderPath: '../assets/work/Brochure',
      files: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg']
    },
    'work-social-media-design': {
      title: 'Social Media Design',
      subtitle: 'Campaign-ready social creatives built for consistency and recall.',
      folderPath: '../assets/work/Social Media',
      files: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg']
    },
    'work-outdoor-design': {
      title: 'Outdoor Design',
      subtitle: 'Large-format visuals engineered for distance and high visibility.',
      folderPath: '../assets/work/Outdoor',
      files: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg']
    },
    'work-packaging-design': {
      title: 'Event & Exhibition Branding',
      subtitle: 'Event collateral and environment graphics with brand continuity.',
      folderPath: '../assets/work/Event Collateral',
      files: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg']
    },
    'work-logo-design': {
      title: 'Logo Design',
      subtitle: 'Dedicated logo showcase will be added here as soon as assets are ready.',
      folderPath: '',
      files: []
    }
  };

  var lightboxState = {
    open: false,
    items: [],
    index: 0,
    root: null,
    image: null,
    prev: null,
    next: null,
    close: null
  };

  function syncNavTargets() {
    var navLinks = navConfig.links || [];
    var callPrimaryTel = contactConfig.callPrimaryTel || '+919081590808';
    var navCall = document.querySelector('.viewer-nav .nav-call');
    if (navCall) navCall.setAttribute('href', 'tel:' + callPrimaryTel);

    var navAnchors = document.querySelectorAll('.viewer-nav .nav-center a');
    navAnchors.forEach(function (anchor, index) {
      if (!navLinks[index]) return;
      anchor.textContent = navLinks[index].label;
      anchor.setAttribute('href', navLinks[index].href);
    });
  }

  function bindBackButton() {
    if (!backBtn) return;
    backBtn.addEventListener('click', function () {
      if (window.history.length > 1) {
        window.history.back();
        return;
      }
      window.location.href = 'honest-graphics.html#services';
    });
  }

  function createEmptyState(text) {
    var empty = document.createElement('div');
    empty.className = 'work-empty';
    empty.textContent = text;
    return empty;
  }

  function updateLightboxImage() {
    if (!lightboxState.items.length || !lightboxState.image) return;

    lightboxState.image.src = lightboxState.items[lightboxState.index];
    lightboxState.prev.disabled = lightboxState.index <= 0;
    lightboxState.next.disabled = lightboxState.index >= lightboxState.items.length - 1;
  }

  function closeLightbox() {
    if (!lightboxState.root) return;
    lightboxState.root.classList.remove('is-open');
    lightboxState.open = false;
  }

  function openLightboxAt(index) {
    if (!lightboxState.root || !lightboxState.items.length) return;

    lightboxState.index = Math.max(0, Math.min(lightboxState.items.length - 1, index));
    updateLightboxImage();
    lightboxState.root.classList.add('is-open');
    lightboxState.open = true;
  }

  function buildLightbox(urls) {
    var root = document.createElement('div');
    root.className = 'lightbox';
    root.setAttribute('aria-hidden', 'true');

    var close = document.createElement('button');
    close.className = 'lightbox-close';
    close.type = 'button';
    close.setAttribute('aria-label', 'Close');
    close.textContent = '×';

    var prev = document.createElement('button');
    prev.className = 'lightbox-prev';
    prev.type = 'button';
    prev.setAttribute('aria-label', 'Previous image');
    prev.textContent = '‹';

    var next = document.createElement('button');
    next.className = 'lightbox-next';
    next.type = 'button';
    next.setAttribute('aria-label', 'Next image');
    next.textContent = '›';

    var image = document.createElement('img');
    image.className = 'lightbox-img';
    image.alt = 'Work preview';

    root.appendChild(close);
    root.appendChild(prev);
    root.appendChild(next);
    root.appendChild(image);

    lightboxState.root = root;
    lightboxState.image = image;
    lightboxState.prev = prev;
    lightboxState.next = next;
    lightboxState.close = close;
    lightboxState.items = urls;

    close.addEventListener('click', closeLightbox);
    prev.addEventListener('click', function () {
      if (lightboxState.index <= 0) return;
      lightboxState.index -= 1;
      updateLightboxImage();
    });
    next.addEventListener('click', function () {
      if (lightboxState.index >= lightboxState.items.length - 1) return;
      lightboxState.index += 1;
      updateLightboxImage();
    });

    root.addEventListener('click', function (event) {
      if (event.target === root) closeLightbox();
    });

    document.addEventListener('keydown', function (event) {
      if (!lightboxState.open) return;
      if (event.key === 'Escape') {
        closeLightbox();
      } else if (event.key === 'ArrowLeft') {
        if (lightboxState.index > 0) {
          lightboxState.index -= 1;
          updateLightboxImage();
        }
      } else if (event.key === 'ArrowRight') {
        if (lightboxState.index < lightboxState.items.length - 1) {
          lightboxState.index += 1;
          updateLightboxImage();
        }
      }
    });

    document.body.appendChild(root);
  }

  function buildGrid(config) {
    var urls = config.files.map(function (file) {
      return config.folderPath + '/' + file;
    });

    if (!urls.length) {
      stage.appendChild(createEmptyState('Logo Design content is not uploaded yet.'));
      return;
    }

    var grid = document.createElement('div');
    grid.className = 'work-grid';

    var loadedCount = 0;
    var failedCount = 0;
    var successfulUrls = [];
    var finalized = false;

    function finalizeAttempt() {
      if (finalized) return;
      var total = urls.length;
      if (loadedCount + failedCount < total) return;
      finalized = true;
      if (loadedCount === 0) {
        grid.remove();
        stage.appendChild(createEmptyState('No work items were found for this page yet.'));
        return;
      }
      buildLightbox(successfulUrls);
    }

    urls.forEach(function (url, index) {
      var tile = document.createElement('button');
      tile.className = 'work-tile';
      tile.type = 'button';
      tile.setAttribute('aria-label', 'Open preview ' + (index + 1));

      var image = document.createElement('img');
      image.loading = 'lazy';
      image.decoding = 'async';
      image.src = url;
      image.alt = config.title + ' work preview ' + (index + 1);

      image.addEventListener('load', function () {
        successfulUrls.push(url);
        tile.setAttribute('data-lightbox-index', String(successfulUrls.length - 1));
        loadedCount += 1;
        finalizeAttempt();
      });

      image.addEventListener('error', function () {
        failedCount += 1;
        tile.remove();
        finalizeAttempt();
      });

      tile.addEventListener('click', function () {
        if (!lightboxState.items.length) return;
        var lightboxIndex = Number(tile.getAttribute('data-lightbox-index'));
        if (!Number.isFinite(lightboxIndex)) return;
        openLightboxAt(lightboxIndex);
      });

      tile.appendChild(image);
      grid.appendChild(tile);
    });

    stage.appendChild(grid);
  }

  function renderPage() {
    if (!stage) return;

    var config = WORK_PAGE_MAP[slug];
    if (!config) {
      stage.appendChild(createEmptyState('This work page is not configured yet.'));
      return;
    }

    buildGrid(config);
  }

  function init() {
    syncNavTargets();
    bindBackButton();
    renderPage();
  }

  init();
})();
