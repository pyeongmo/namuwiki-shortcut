document.addEventListener('keydown', (event) => {
  if (event.key === '/') {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
          return;
      }
      const searchInput: HTMLInputElement | null = document.querySelector('input[type="search"], input[name="q"]');
      if (searchInput) {
        searchInput.focus();
        event.preventDefault();
    }
}
});