(function () {
  if (!window.HGThemeToggle) return;
  window.HGThemeToggle.init({
    buttonId: 'themeBtn',
    labelId: 'themeLabel',
    storageKey: 'hg-theme',
    defaultTheme: 'dark'
  });
})();
