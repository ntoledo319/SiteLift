/**
 * SiteLift Main Interaction Script
 * Handles custom cursor, mobile menu, text animations, and scroll-based parallax.
 */

/**
 * Initializes the custom cursor logic.
 * @param {HTMLElement} cursor - The cursor element.
 */
export const initCursor = (cursor) => {
    if (!cursor) return;
    document.body?.classList.add('has-custom-cursor');
    let mouseX = 0,
        mouseY = 0;
    let cursorX = 0,
        cursorY = 0;

    document.addEventListener(
        'mousemove',
        (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        },
        { passive: true }
    );

    const animateCursor = () => {
        const easing = 0.15;
        cursorX += (mouseX - cursorX) * easing;
        cursorY += (mouseY - cursorY) * easing;

        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) ${
            cursor.classList.contains('is-hovering') ? 'scale(4)' : 'scale(1)'
        }`;

        if (!document.hidden) {
            requestAnimationFrame(animateCursor);
        }
    };
    animateCursor();
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) animateCursor();
    });

    const interactives = document.querySelectorAll(
        'a, button, .tier-card, .massive-cta, .menu-toggle'
    );
    interactives.forEach((el) => {
        el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
    });
};

/**
 * Initializes the mobile menu.
 * @param {HTMLElement} toggle - The toggle element.
 * @param {HTMLElement} links - The links container.
 * @param {HTMLElement} body - The body element.
 */
export const initMobileMenu = (toggle, links, body) => {
    if (!toggle || !links || !body) return;

    const setActive = (isActive) => {
        toggle.classList.toggle('is-active', isActive);
        links.classList.toggle('is-active', isActive);
        body.classList.toggle('menu-open', isActive);
        toggle.setAttribute('aria-expanded', String(isActive));
    };

    toggle.addEventListener('click', () => {
        setActive(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || toggle.getAttribute('aria-expanded') !== 'true') return;
        setActive(false);
        toggle.focus();
    });
};

/**
 * Deconstructs text into spans for staggered animations.
 */
export const splitTexts = () => {
    document.querySelectorAll('.reveal-text').forEach((el) => {
        const type = el.dataset.revealType;
        const content = el.innerText;
        el.innerHTML = '';

        if (type === 'chars') {
            const words = content.split(' ');
            words.forEach((word, wordIdx) => {
                const wordSpan = document.createElement('span');
                wordSpan.style.whiteSpace = 'nowrap';
                wordSpan.style.display = 'inline-block';

                word.split('').forEach((char, i) => {
                    const span = document.createElement('span');
                    span.innerText = char;
                    span.classList.add('char');
                    span.style.transitionDelay = `${(wordIdx * 5 + i) * 0.02}s`;
                    wordSpan.appendChild(span);
                });

                el.appendChild(wordSpan);
                if (wordIdx < words.length - 1) {
                    el.appendChild(document.createTextNode(' '));
                }
            });
        } else {
            content.split('\n').forEach((line, i) => {
                if (line.trim() === '') return;
                const lineDiv = document.createElement('div');
                lineDiv.classList.add('line-wrapper');
                lineDiv.style.overflow = 'hidden';

                const span = document.createElement('span');
                span.innerText = line;
                span.classList.add('word');
                span.style.transitionDelay = `${i * 0.15}s`;
                lineDiv.appendChild(span);
                el.appendChild(lineDiv);
            });
        }
    });
};

/**
 * Updates positions of parallax elements.
 * @param {number} scrollY - The current scroll position.
 */
export const updateParallax = (scrollY) => {
    // Logo Fragment Parallax
    const frags = document.querySelectorAll('.logo-fragment');
    frags.forEach((frag, i) => {
        const speed = (i + 1) * 0.08;
        const rotation = (i + 1) * 15 + scrollY * 0.02;
        frag.style.transform = `translate3d(0, ${scrollY * speed}px, 0) rotate(${rotation}deg)`;
    });

    // Parallax Images
    document.querySelectorAll('.parallax-img').forEach((img) => {
        const speed = parseFloat(img.dataset.speed) || 0.15;
        const parent = img.closest('section') || img.parentElement;
        const rect = parent.getBoundingClientRect();

        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const shift = (window.innerHeight - rect.top) * speed;
            img.style.transform = `translate3d(0, ${shift}px, 0) scale(1.15)`;
        }
    });

    // Hero Title Skew Effect
    const heroTitle = document.querySelector('.hero-section .massive-title');
    if (heroTitle) {
        heroTitle.style.transform = `translate3d(${scrollY * 0.1}px, 0, 0) skewX(${
            scrollY * 0.005
        }deg)`;
    }
};

/**
 * Enhances reveal elements when the platform can observe them. Content stays visible when
 * JavaScript, IntersectionObserver, or animation support is unavailable.
 * @param {object} options - Reveal initialization options.
 * @param {HTMLElement} options.root - Root element that gates enhanced reveal styles.
 * @param {Iterable<HTMLElement>} options.elements - Elements to observe.
 * @param {typeof IntersectionObserver | null} options.Observer - Observer constructor.
 * @param {boolean} options.reduceMotion - Whether the visitor requested reduced motion.
 * @returns {IntersectionObserver | null} The active observer, when enhancement is enabled.
 */
export const initScrollReveals = ({
    root = document.documentElement,
    elements = document.querySelectorAll('[data-scroll-reveal], .reveal-text'),
    Observer = typeof globalThis.IntersectionObserver === 'function'
        ? globalThis.IntersectionObserver
        : null,
    reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
} = {}) => {
    const revealElements = Array.from(elements);
    const revealAll = () =>
        revealElements.forEach((element) => element.classList.add('is-visible'));

    if (reduceMotion || !Observer) {
        root.classList.remove('reveal-ready');
        revealAll();
        return null;
    }

    try {
        const observer = new Observer(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            },
            { threshold: 0.15 }
        );

        root.classList.add('reveal-ready');
        revealElements.forEach((element) => observer.observe(element));
        return observer;
    } catch {
        root.classList.remove('reveal-ready');
        revealAll();
        return null;
    }
};

/**
 * Bootstraps the application.
 */
const bootstrap = () => {
    const root = document.documentElement;
    const body = document.body;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;

    root.classList.remove('no-js');
    root.classList.add('js');
    setTimeout(
        () => {
            body.classList.remove('is-loading');
        },
        reduceMotion ? 0 : 500
    );

    if (!reduceMotion && !coarsePointer) {
        initCursor(document.getElementById('cursor'));
    }
    initMobileMenu(
        document.getElementById('menu-toggle'),
        document.querySelector('.nav-links'),
        body
    );
    splitTexts();

    if (!reduceMotion) {
        let ticking = false;
        window.addEventListener(
            'scroll',
            () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        updateParallax(window.scrollY);
                        ticking = false;
                    });
                    ticking = true;
                }
            },
            { passive: true }
        );
    }

    initScrollReveals({ root, reduceMotion });
};

// Run bootstrap when DOM is ready, unless in a test environment
if (typeof process === 'undefined' || process.env.NODE_ENV !== 'test') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }
}
