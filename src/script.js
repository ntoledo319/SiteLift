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

    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

    toggle.addEventListener('click', () => {
        const opening = !isOpen();
        setActive(opening);
        // The toggle sits after the links in source order, so move focus into the opened menu.
        if (opening) links.querySelector('a')?.focus();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || !isOpen()) return;
        setActive(false);
        toggle.focus();
    });
    // Choosing a destination (including same-page anchors) closes the full-screen menu so the
    // visitor actually sees where they landed.
    links.addEventListener('click', (event) => {
        if (isOpen() && event.target.closest?.('a')) setActive(false);
    });
    // Keyboard users tabbing past the last link must not end up focused on content hidden
    // behind the full-screen overlay.
    const closeWhenFocusLeaves = (event) => {
        const next = event.relatedTarget;
        if (!isOpen() || !next || links.contains(next) || next === toggle) return;
        setActive(false);
    };
    links.addEventListener('focusout', closeWhenFocusLeaves);
    toggle.addEventListener('focusout', closeWhenFocusLeaves);
};

/**
 * Deconstructs text into spans for staggered animations. The animated copy is hidden from
 * assistive technology and a single visually hidden copy of the original text is exposed
 * instead, so screen readers never announce headings letter by letter. Line reveals keep
 * inline markup (for example the strikethrough and italic accents in the hero).
 */
export const splitTexts = () => {
    document.querySelectorAll('.reveal-text').forEach((el) => {
        if (el.dataset.revealSplit === 'true') return;
        const type = el.dataset.revealType;
        const label = (el.textContent || '').replace(/\s+/g, ' ').trim();
        const animated = document.createElement('span');
        animated.className = 'reveal-visual';
        animated.setAttribute('aria-hidden', 'true');

        if (type === 'chars') {
            const words = label.split(' ');
            words.forEach((word, wordIdx) => {
                const wordSpan = document.createElement('span');
                wordSpan.style.whiteSpace = 'nowrap';
                wordSpan.style.display = 'inline-block';

                word.split('').forEach((char, i) => {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.classList.add('char');
                    span.style.transitionDelay = `${(wordIdx * 5 + i) * 0.02}s`;
                    wordSpan.appendChild(span);
                });

                animated.appendChild(wordSpan);
                if (wordIdx < words.length - 1) {
                    animated.appendChild(document.createTextNode(' '));
                }
            });
        } else {
            const lines = [[]];
            Array.from(el.childNodes).forEach((node) => {
                if (node.nodeName === 'BR') lines.push([]);
                else lines[lines.length - 1].push(node);
            });
            lines.forEach((nodes, i) => {
                if (nodes.every((node) => (node.textContent || '').trim() === '')) return;
                const lineDiv = document.createElement('span');
                lineDiv.classList.add('line-wrapper');
                lineDiv.style.display = 'block';
                lineDiv.style.overflow = 'hidden';

                const span = document.createElement('span');
                span.classList.add('word');
                span.style.transitionDelay = `${i * 0.15}s`;
                nodes.forEach((node) => span.appendChild(node));
                lineDiv.appendChild(span);
                animated.appendChild(lineDiv);
            });
        }

        const spoken = document.createElement('span');
        spoken.className = 'sr-only';
        spoken.textContent = label;
        el.replaceChildren(spoken, animated);
        el.dataset.revealSplit = 'true';
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

/** localStorage key holding the visitor's explicit "Pause motion" choice. */
export const MOTION_STORAGE_KEY = 'sitelift-motion';

/**
 * Returns window.localStorage, or null when the browser blocks storage (private modes and
 * strict privacy settings can throw on mere access).
 * @returns {Storage | null} The storage area, when available.
 */
const getLocalStorage = () => {
    try {
        return window.localStorage;
    } catch {
        return null;
    }
};

/**
 * Reads the stored motion choice.
 * @param {Storage | null} storage - Storage area to read.
 * @returns {'paused' | 'running' | null} The explicit choice, or null when none was made.
 */
export const readMotionPreference = (storage) => {
    try {
        const value = storage?.getItem(MOTION_STORAGE_KEY);
        return value === 'paused' || value === 'running' ? value : null;
    } catch {
        return null;
    }
};

/**
 * Persists the motion choice. Blocked storage is not an error: the choice then lasts for the
 * current page view only.
 * @param {Storage | null} storage - Storage area to write.
 * @param {'paused' | 'running'} value - The visitor's choice.
 */
export const writeMotionPreference = (storage, value) => {
    try {
        storage?.setItem(MOTION_STORAGE_KEY, value);
    } catch {
        // Storage unavailable or full; keep the in-memory state.
    }
};

/**
 * Wires the "Pause motion" control (WCAG 2.2.2). The looping hero glow, the scroll cue, and
 * the scroll-linked parallax only move while `html[data-motion="running"]`. The visitor's
 * explicit choice wins; otherwise the OS "reduce motion" setting decides the starting state.
 * @param {object} options - Motion control options.
 * @param {HTMLElement} options.root - Element that carries the `data-motion` state.
 * @param {HTMLElement | null} options.toggle - The native toggle button, when the page has one.
 * @param {Storage | null} options.storage - Where the explicit choice is remembered.
 * @param {MediaQueryList | null} options.motionQuery - The prefers-reduced-motion query.
 * @returns {{ isPaused: () => boolean }} Live accessor for the current state.
 */
export const initMotionControl = ({
    root = document.documentElement,
    toggle = document.querySelector('[data-motion-toggle]'),
    storage = getLocalStorage(),
    motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null,
} = {}) => {
    let choice = readMotionPreference(storage);
    let paused = choice ? choice === 'paused' : Boolean(motionQuery?.matches);

    const apply = () => {
        root.dataset.motion = paused ? 'paused' : 'running';
        toggle?.setAttribute('aria-pressed', String(paused));
    };
    apply();

    if (toggle) {
        toggle.hidden = false;
        toggle.addEventListener('click', () => {
            paused = !paused;
            choice = paused ? 'paused' : 'running';
            writeMotionPreference(storage, choice);
            apply();
        });
    }

    // Until the visitor chooses, follow the OS setting if it changes mid-visit.
    motionQuery?.addEventListener?.('change', (event) => {
        if (choice) return;
        paused = event.matches;
        apply();
    });

    return { isPaused: () => paused };
};

/**
 * Drives the scroll-linked parallax, skipping frames while motion is paused.
 * @param {object} options - Parallax options.
 * @param {() => boolean} options.isPaused - Whether decorative motion is currently paused.
 * @param {Window} options.target - Scroll source.
 * @param {(callback: FrameRequestCallback) => number} options.schedule - Frame scheduler.
 */
export const initParallax = ({
    isPaused,
    target = window,
    schedule = (callback) => window.requestAnimationFrame(callback),
}) => {
    let ticking = false;
    target.addEventListener(
        'scroll',
        () => {
            if (ticking || isPaused()) return;
            ticking = true;
            schedule(() => {
                ticking = false;
                if (!isPaused()) updateParallax(target.scrollY);
            });
        },
        { passive: true }
    );
};

/**
 * Bootstraps the application.
 */
const bootstrap = () => {
    const root = document.documentElement;
    const body = document.body;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;

    // Set the motion state first so the looping decoration never starts before a paused choice.
    const motion = initMotionControl({ root });
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
    // Parallax starts paused under "reduce motion" unless the visitor turned motion back on.
    initParallax({ isPaused: motion.isPaused });

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
