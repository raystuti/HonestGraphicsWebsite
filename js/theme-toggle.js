(function () {
  const SUN_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"></circle><path d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"></path></svg>';
  const MOON_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.3 13.7A8.8 8.8 0 1 1 10.3 3.7a7.4 7.4 0 1 0 10 10z"></path></svg>';

  function initThemeToggle(options) {
    const opts = options || {};
    const html = document.documentElement;
    const storageKey = opts.storageKey || 'hg-theme';
    const defaultTheme = opts.defaultTheme || 'dark';
    const buttonId = opts.buttonId || 'themeBtn';
    const labelId = opts.labelId || 'themeLabel';

    const btn = document.getElementById(buttonId);
    const label = document.getElementById(labelId);

    if (!btn || !label) return false;

    const applyTheme = function (theme) {
      html.setAttribute('data-theme', theme);
      label.innerHTML = theme === 'dark' ? MOON_ICON : SUN_ICON;
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    };

    const savedTheme = localStorage.getItem(storageKey);
    const initialTheme = savedTheme || defaultTheme;
    applyTheme(initialTheme);

    btn.addEventListener('click', function () {
      const nextTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      localStorage.setItem(storageKey, nextTheme);
    });

    return true;
  }

  window.HGThemeToggle = {
    init: initThemeToggle
  };
})();
