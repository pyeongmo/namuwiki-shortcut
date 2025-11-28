
const observer = new MutationObserver(displayFootnotes);

function displayFootnotes() {
  observer.disconnect();

  document.querySelectorAll('.inline-footnote').forEach(el => el.remove());

  if (window.innerWidth < 1024) {
      observer.observe(document.body, { childList: true, subtree: true });
      return;
  }

  const footnoteLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('a[href^="#fn-"]');

  const contentMaxWidth = 1400;
  const rightEmptyWidth = 320;
  const leftPadding = 20;
  const rightPaddingMax = 80;
  const rightPaddingMin = 20;

  const contentWidth = Math.min(window.innerWidth, contentMaxWidth);

  const rightPadding = Math.min(rightPaddingMax, Math.max(rightPaddingMin, window.innerWidth - contentWidth));

  const contentRightEdge = (window.innerWidth / 2) + (contentWidth / 2) - rightEmptyWidth;

  const noteLeftPosition = contentRightEdge - leftPadding;

  const noteMaxWidth = window.innerWidth - noteLeftPosition - rightPadding;

  let lastFootnoteBottom = 0; 

  footnoteLinks.forEach(link => {
      try {
          const targetId = link.href.split('#')[1];
          if (!targetId) return;

          const targetElement = document.getElementById(targetId);
          if (!targetElement?.parentElement) return;

          const note = document.createElement('div');
          note.className = 'inline-footnote';

          const footnoteNumber = link.innerText;

          note.innerHTML = `<b>${footnoteNumber}</b> ${targetElement.parentElement.innerHTML}`;
          note.querySelectorAll('a[href^="#rfn-"]').forEach(a => a.remove());

          Object.assign(note.style, {
              position: 'absolute',
              left: `${noteLeftPosition}px`,
              maxWidth: `${noteMaxWidth}px`,
              visibility: 'hidden', 
              backgroundColor: 'white',
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '5px',
              fontSize: '14px',
              lineHeight: '1.6',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          });

          document.body.appendChild(note);

          let noteTop = link.getBoundingClientRect().top + window.scrollY;

          if (noteTop < lastFootnoteBottom) {
              noteTop = lastFootnoteBottom;
          }

          note.style.top = `${noteTop}px`;
          note.style.visibility = 'visible';
          
          lastFootnoteBottom = noteTop + note.offsetHeight + 10;

      } catch (e) {
          console.error('Error displaying footnote:', e);
      }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

window.addEventListener('load', displayFootnotes);
window.addEventListener('resize', displayFootnotes);

observer.observe(document.body, { childList: true, subtree: true });
