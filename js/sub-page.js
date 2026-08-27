document.documentElement.classList.toggle(
  'is-embedded',
  window.self !== window.top
);
