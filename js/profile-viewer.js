(function () {
  var PDF_PATH = '../assets/HONEST PROFILE26.pdf';
  var WORKER_PATH = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  var params = new URLSearchParams(window.location.search);
  var from = params.get('from') || '';
  var requestedPage = Number(params.get('page')) || 1;

  var backBtn = document.getElementById('backBtn');
  var prevArrow = document.getElementById('prevArrow');
  var nextArrow = document.getElementById('nextArrow');
  var loader = document.getElementById('bookLoader');
  var pagesRoot = document.getElementById('pdfPages');
  var flipbookRoot = document.getElementById('flipbook');
  var pageZoneLeft = document.getElementById('pageZoneLeft');
  var pageZoneRight = document.getElementById('pageZoneRight');
  var progressFill = document.getElementById('progressFill');
  var bookHost = document.getElementById('bookHost');
  var coverStart = document.getElementById('coverStart');
  var coverImage = document.getElementById('coverImage');
  var coverEnd = document.getElementById('coverEnd');
  var coverEndImage = document.getElementById('coverEndImage');

  var pdfDoc = null;
  var totalPages = 0;
  var pageFlip = null;
  var mode = 'front-overlay';
  var pendingOpen = false;
  var canvasByPdfPage = new Map();

  function fallbackHref() {
    if (from === 'about') return 'honest-graphics.html#about';
    if (from === 'footer') return 'honest-graphics.html#contact';
    return 'honest-graphics.html#home';
  }

  function setLoader(text) {
    if (loader) loader.textContent = text;
  }

  function showLoader(text) {
    if (loader) {
      if (text) loader.textContent = text;
      loader.style.display = 'flex';
    }
  }

  function hideLoader() {
    if (loader) loader.style.display = 'none';
  }

  function setProgress(pageNumber) {
    if (!progressFill || !totalPages) return;
    var clamped = Math.max(1, Math.min(totalPages, pageNumber));
    progressFill.style.width = ((clamped / totalPages) * 100).toFixed(2) + '%';
  }

  function maxFlipIndex() {
    if (!pageFlip) return 0;
    return Math.max(0, pageFlip.getPageCount() - 1);
  }

  function currentIndex() {
    if (!pageFlip) return 0;
    return Math.max(0, Math.min(pageFlip.getCurrentPageIndex(), maxFlipIndex()));
  }

  function updateProgress() {
    if (!pageFlip || !totalPages) return;

    if (mode === 'front-overlay') {
      setProgress(1);
      return;
    }

    if (mode === 'back-overlay') {
      setProgress(totalPages);
      return;
    }

    setProgress(currentIndex() + 1);
  }

  function updateArrowState() {
    if (!pageFlip) {
      prevArrow.disabled = true;
      nextArrow.disabled = true;
      return;
    }

    if (mode === 'front-overlay') {
      prevArrow.disabled = true;
      nextArrow.disabled = false;
      return;
    }

    if (mode === 'back-overlay') {
      prevArrow.disabled = false;
      nextArrow.disabled = true;
      return;
    }

    prevArrow.disabled = false;
    nextArrow.disabled = false;
  }

  function applyModeClasses() {
    bookHost.classList.toggle('is-open', mode === 'book');
    bookHost.classList.toggle('is-back-cover', mode === 'back-overlay');
  }

  function setMode(nextMode) {
    mode = nextMode;
    applyModeClasses();
    updateProgress();
    updateArrowState();
  }

  function showFrontOverlay() {
    setMode('front-overlay');
  }

  function showBackOverlay() {
    setMode('back-overlay');
  }

  function openBookAtIndex(targetIndex) {
    if (!pageFlip) return;

    var clamped = Math.max(0, Math.min(maxFlipIndex(), targetIndex));
    setMode('book');
    pageFlip.turnToPage(clamped);
    updateProgress();
    updateArrowState();
  }

  function openFromFront() {
    if (!pageFlip) return;

    if (maxFlipIndex() <= 0) {
      openBookAtIndex(0);
      return;
    }

    openBookAtIndex(0);
    pageFlip.flipNext();
  }

  async function renderPdfPageToCanvas(pageNum, canvas, maxScale) {
    var page = await pdfDoc.getPage(pageNum);
    var viewport = page.getViewport({ scale: 1 });
    var targetHeight = 1000;
    var scale = targetHeight / viewport.height;

    if (!Number.isFinite(scale) || scale <= 0) scale = 1.2;

    var scaledViewport = page.getViewport({ scale: Math.min(scale, maxScale || 1.7) });
    canvas.width = Math.floor(scaledViewport.width);
    canvas.height = Math.floor(scaledViewport.height);

    var ctx = canvas.getContext('2d', { alpha: true });
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport: scaledViewport
    }).promise;
  }

  async function renderPdfPageToDataUrl(pageNum) {
    var canvas = document.createElement('canvas');
    await renderPdfPageToCanvas(pageNum, canvas, 1.9);
    return canvas.toDataURL('image/png');
  }

  function createPageShells() {
    canvasByPdfPage.clear();
    pagesRoot.innerHTML = '';

    for (var pdfPage = 1; pdfPage <= totalPages; pdfPage += 1) {
      var pageEl = document.createElement('div');
      pageEl.className = 'flip-page';

      var canvas = document.createElement('canvas');
      canvas.className = 'flip-canvas';

      pageEl.appendChild(canvas);
      pagesRoot.appendChild(pageEl);
      canvasByPdfPage.set(pdfPage, canvas);
    }
  }

  async function renderCoverImages() {
    var front = await renderPdfPageToDataUrl(1);
    coverImage.src = front;
    hideLoader();

    var back = await renderPdfPageToDataUrl(totalPages);
    coverEndImage.src = back;
  }

  async function renderPagesInBackground() {
    var order = [];

    for (var p = 1; p <= totalPages; p += 1) {
      order.push(p);
    }

    var startPage = Math.max(1, Math.min(totalPages, requestedPage));
    order.sort(function (a, b) {
      return Math.abs(a - startPage) - Math.abs(b - startPage);
    });

    for (var i = 0; i < order.length; i += 1) {
      var pageNum = order[i];
      var canvas = canvasByPdfPage.get(pageNum);
      if (!canvas) continue;
      try {
        await renderPdfPageToCanvas(pageNum, canvas, 1.65);
      } catch (error) {
        console.error('Failed to render page', pageNum, error);
      }
    }
  }

  function initFlipbook() {
    if (!window.St || !window.St.PageFlip) {
      showLoader('Flipbook library failed to load');
      prevArrow.disabled = true;
      nextArrow.disabled = true;
      return;
    }

    pageFlip = new window.St.PageFlip(flipbookRoot, {
      width: 900,
      height: 1273,
      minWidth: 300,
      maxWidth: 980,
      minHeight: 420,
      maxHeight: 1385,
      size: 'stretch',
      maxShadowOpacity: 0.28,
      showCover: true,
      mobileScrollSupport: false,
      drawShadow: true,
      flippingTime: 680,
      usePortrait: true,
      startZIndex: 10,
      autoSize: true,
      clickEventForward: true,
      swipeDistance: 24,
      useMouseEvents: true
    });

    var pages = pagesRoot.querySelectorAll('.flip-page');
    pageFlip.loadFromHTML(pages);

    pageFlip.on('flip', function () {
      if (mode === 'book') {
        updateProgress();
        updateArrowState();
      }
    });

    pageFlip.on('changeOrientation', function () {
      if (mode === 'book') {
        updateProgress();
        updateArrowState();
      }
    });

    if (requestedPage >= totalPages) {
      showBackOverlay();
      pageFlip.turnToPage(maxFlipIndex());
    } else if (requestedPage > 1) {
      openBookAtIndex(requestedPage - 1);
    } else if (pendingOpen) {
      openFromFront();
      pendingOpen = false;
    } else {
      showFrontOverlay();
      pageFlip.turnToPage(0);
    }

    updateProgress();
    updateArrowState();
  }

  function goNext() {
    if (!pageFlip) return;

    if (mode === 'front-overlay') {
      openFromFront();
      return;
    }

    if (mode === 'back-overlay') {
      return;
    }

    var idx = currentIndex();
    if (idx >= maxFlipIndex()) {
      showBackOverlay();
      return;
    }

    pageFlip.flipNext();
  }

  function goPrev() {
    if (!pageFlip) return;

    if (mode === 'front-overlay') {
      return;
    }

    if (mode === 'back-overlay') {
      openBookAtIndex(maxFlipIndex());
      return;
    }

    var idx = currentIndex();
    if (idx <= 0) {
      showFrontOverlay();
      return;
    }

    pageFlip.flipPrev();
  }

  function bindControls() {
    backBtn.addEventListener('click', function () {
      if (window.history.length > 1) {
        window.history.back();
        return;
      }
      window.location.href = fallbackHref();
    });

    prevArrow.addEventListener('click', goPrev);
    nextArrow.addEventListener('click', goNext);

    pageZoneLeft.addEventListener('click', goPrev);
    pageZoneRight.addEventListener('click', goNext);

    coverStart.addEventListener('click', function () {
      if (!pageFlip) {
        pendingOpen = true;
        showLoader('Finalizing brochure...');
        return;
      }
      openFromFront();
    });

    coverEnd.addEventListener('click', function () {
      if (!pageFlip) return;
      openBookAtIndex(Math.max(0, maxFlipIndex() - 1));
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight') {
        goNext();
      } else if (event.key === 'ArrowLeft') {
        goPrev();
      }
    });
  }

  async function init() {
    bindControls();

    if (!window.pdfjsLib) {
      showLoader('PDF library failed to load');
      prevArrow.disabled = true;
      nextArrow.disabled = true;
      return;
    }

    window.pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_PATH;

    try {
      setLoader('Loading profile...');
      pdfDoc = await window.pdfjsLib.getDocument(PDF_PATH).promise;
      totalPages = pdfDoc.numPages;

      createPageShells();
      initFlipbook();

      await renderCoverImages();
      renderPagesInBackground();
    } catch (error) {
      console.error(error);
      showLoader('Unable to load brochure');
      prevArrow.disabled = true;
      nextArrow.disabled = true;
    }
  }

  init();
})();