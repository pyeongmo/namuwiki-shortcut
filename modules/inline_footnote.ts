const debouncedDisplayFootnotes = debounce(displayFootnotes, 200);

const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
        if (entry.target === document.body) {
            debouncedDisplayFootnotes();
        }
    }
});

resizeObserver.observe(document.body);
injectDarkModeStyles();

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

            updateFootnoteStyle($noteDiv);

            Object.assign($noteDiv.style, {
                left: `${noteLeftPosition}px`,
                maxWidth: `${noteMaxWidth}px`,
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

function isDarkMode(): boolean {
    return document.body.classList.contains('theseed-dark-mode');
}

function setupFootnoteBackground(leftPosition: number = 0) {
    const footnoteBackgroundId = 'footnote-bg';
    let $div = document.getElementById(footnoteBackgroundId);

    if (!$div) {
        $div = document.createElement('div');
        $div.id = footnoteBackgroundId;
        document.body.prepend($div);
    }

    $div.style.left = `${leftPosition}px`;

    return $div;
}

function updateFootnoteStyle($noteDiv: HTMLDivElement) {
    if (isDarkMode()) {
        Object.assign($noteDiv.style, {
            backgroundColor: '#333',
            color: '#f5f5f5',
            border: '1px solid #555',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.5)',
        });
    } else {
        Object.assign($noteDiv.style, {
            backgroundColor: 'white',
            color: 'black',
            border: '1px solid #ccc',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        });
    }
}

function injectDarkModeStyles() {
    const styleId = 'dark-mode-styles';
    // 이미 삽입된 스타일이 있으면 중복 삽입 방지
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        body.theseed-dark-mode .inline-footnote {
            background-color: #333;
            color: #f5f5f5;
            border: 1px solid #555;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
        }

        body.theseed-dark-mode #footnote-bg {
            background-color: #000;
        }

        .inline-footnote {
            position: absolute;
            z-index: 2;
            visibility: hidden;
            padding: 10px;
            border-radius: 5px;
            font-size: 14px;
            line-height: 1.6;
            background-color: white;
            color: black;
            border: 1px solid #ccc;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        #footnote-bg {
            position: fixed;
            z-index: 1;
            background-color: #f5f5f5;
            width: 50%;
            height: calc(100vh - 100px);
            bottom: 0;
        }
    `;
    document.head.appendChild(style);
}
