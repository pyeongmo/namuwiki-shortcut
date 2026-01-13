const debouncedDisplayFootnotes = debounce(displayFootnotes, 200);

const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
        if (entry.target === document.body) {
            debouncedDisplayFootnotes();
        }
    }
});

resizeObserver.observe(document.body);

function displayFootnotes() {
    document.querySelectorAll('.inline-footnote').forEach(el => el.remove());

    if (window.innerWidth < 1024) {
        setupFootnoteBackground(window.innerWidth);
        return;
    }

    const $footnoteAnchors: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('a[href^="#fn-"]');

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

    setupFootnoteBackground(noteLeftPosition - 10);

    let lastFootnoteBottom = 0;

    $footnoteAnchors.forEach($a => {
        try {
            const targetId = $a.href.split('#')[1];
            if (!targetId) return;

            const targetElement = document.getElementById(targetId);
            if (!targetElement?.parentElement) return;

            const $noteDiv = document.createElement('div');
            $noteDiv.className = 'inline-footnote';

            const footnoteNumber = $a.innerText;

            $noteDiv.innerHTML = `<b>${footnoteNumber}</b> ${targetElement.parentElement.innerHTML}`;
            $noteDiv.querySelectorAll('a[href^="#rfn-"]').forEach(a => a.remove());

            Object.assign($noteDiv.style, {
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
                zIndex: 2,
            });

            document.body.appendChild($noteDiv);

            let noteTop = $a.getBoundingClientRect().top + window.scrollY;

            if (noteTop < lastFootnoteBottom) {
                noteTop = lastFootnoteBottom;
            }

            $noteDiv.style.top = `${noteTop}px`;
            $noteDiv.style.visibility = 'visible';

            lastFootnoteBottom = noteTop + $noteDiv.offsetHeight + 10;

        } catch (e) {
            console.error('Error displaying footnote:', e);
        }
    });
}

function debounce(func: (...args: any[]) => void, wait: number) {
    let timeout: number | null = null;
    return (...args: any[]) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => func(...args), wait);
    };
}

function setupFootnoteBackground(leftPosition: number = 0) {
    const footnoteBackgroundId = 'footnote-bg';
    let $div = document.getElementById(footnoteBackgroundId);

    if (!$div) {
        $div = document.createElement('div');
        $div.id = footnoteBackgroundId;

        Object.assign($div.style, {
            position: 'fixed',
            width: '50%',
            height: 'calc(100vh - 100px)',
            bottom: 0,
            backgroundColor: '#f5f5f5',
            zIndex: 1,
        });

        document.body.prepend($div);
    }
    $div.style.left = `${leftPosition}px`;

    return $div;
}
