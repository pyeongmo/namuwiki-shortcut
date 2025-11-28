document.addEventListener('keydown', (event) => {
  if (event.key === '/') {
    const searchInput = document.querySelector('input[type="search"], input[name="q"]');
    if (searchInput) {
      searchInput.focus();
      event.preventDefault(); 
    }
  }
});