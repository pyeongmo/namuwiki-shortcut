document.addEventListener('keydown', (event) => {
  // '/' 키를 누르면 검색창에 포커스를 줍니다.
  if (event.key === '/') {
      // 다른 입력 필드에 포커스가 있는 경우는 무시합니다.
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
          return;
      }
      const searchInput = document.querySelector('input[type="search"], input[name="q"]');
      if (searchInput) {
          searchInput.focus();
          event.preventDefault();
      }
  }
});

// 각주를 오른쪽에 표시하는 함수
function displayFootnotes() {
  // 이전에 생성된 각주 요소를 모두 삭제합니다.
  document.querySelectorAll('.inline-footnote').forEach(el => el.remove());

  // 브라우저 너비가 1024px 미만이면 각주를 표시하지 않습니다.
  if (window.innerWidth < 1024) {
      return;
  }

  // 본문에 있는 각주 링크만 찾습니다 (href가 #fn-으로 시작).
  const footnoteLinks = document.querySelectorAll('a[href^="#fn-"]');

  // 각주를 배치할 위치와 너비를 계산합니다.
  // 본문은 최대 1400px 너비를 가지며 중앙 정렬됩니다.
  // 각주는 본문 오른쪽의 여유 공간을 활용합니다.
  const contentMaxWidth = 1400;
  const rightEmptyWidth = 320;
  const leftPadding = 20;
  const rightPaddingMax = 80;
  const rightPaddingMin = 20;

  // 실제 본문 너비를 계산합니다 (창 너비와 최대 너비 중 작은 값).
  const contentWidth = Math.min(window.innerWidth, contentMaxWidth);

  const rightPadding = Math.min(rightPaddingMax, Math.max(rightPaddingMin, window.innerWidth - contentWidth));

  // 본문 컨테이너의 오른쪽 끝 좌표를 동적으로 계산합니다.
  const contentRightEdge = (window.innerWidth / 2) + (contentWidth / 2) - rightEmptyWidth;

  // 각주의 왼쪽 시작 위치를 본문 오른쪽 끝으로 설정합니다.
  const noteLeftPosition = contentRightEdge - leftPadding;

  // 각주의 최대 너비는 시작 위치부터 창 오른쪽 끝까지의 공간으로 설정합니다.
  const noteMaxWidth = window.innerWidth - noteLeftPosition - rightPadding;

  footnoteLinks.forEach(link => {
      try {
          const targetId = link.href.split('#')[1]; // e.g., "fn-2"
          if (!targetId) return;

          const footnoteTargetElement = document.getElementById(targetId);

          if (footnoteTargetElement && footnoteTargetElement.parentElement) {
              const contentHolder = footnoteTargetElement.parentElement;
              const clonedContentHolder = contentHolder.cloneNode(true);

              const anchorSpan = clonedContentHolder.querySelector(`#${targetId}`);
              if (anchorSpan) anchorSpan.remove();

              const backLinkId = 'r' + targetId;
              const backLink = clonedContentHolder.querySelector(`a[href="#${backLinkId}"]`);
              if (backLink) backLink.remove();

              const contentHtml = clonedContentHolder.innerHTML.trim();

              const noteDiv = document.createElement('div');
              noteDiv.className = 'inline-footnote';
              noteDiv.innerHTML = `<sup>${link.innerText}</sup> ${contentHtml}`;

              // 스타일을 적용합니다.
              noteDiv.style.position = 'absolute';

              const linkRect = link.getBoundingClientRect();
              noteDiv.style.top = `${window.scrollY + linkRect.top}px`;
              noteDiv.style.left = `${noteLeftPosition}px`; // 계산된 왼쪽 위치 적용
              noteDiv.style.maxWidth = `${noteMaxWidth}px`; // 계산된 최대 너비 적용

              noteDiv.style.fontSize = '12px';
              noteDiv.style.color = '#373a3c';
              noteDiv.style.padding = '4px 8px';
              noteDiv.style.backgroundColor = '#f7f7f7';
              noteDiv.style.border = '1px solid #e1e1e1';
              noteDiv.style.borderRadius = '4px';
              noteDiv.style.zIndex = '1000';
              noteDiv.style.pointerEvents = 'auto';

              document.body.appendChild(noteDiv);
          }
      } catch (e) {
          console.error("Error processing footnote:", e);
      }
  });
}

// 페이지 로드, 창 크기 조절, 내용 변경 시 각주 표시 함수를 실행합니다.
const observer = new MutationObserver(() => {
  setTimeout(displayFootnotes, 500);
});

window.addEventListener('resize', displayFootnotes);

const targetNode = document.getElementById('app');
if (targetNode) {
  observer.observe(targetNode, { childList: true, subtree: true });
}
