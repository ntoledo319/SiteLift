import {
    initMobileMenu,
    initMotionControl,
    initParallax,
    initScrollReveals,
    MOTION_STORAGE_KEY,
    splitTexts,
    updateParallax,
} from '../script.js';

// Mock IntersectionObserver
global.IntersectionObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
};

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);

describe('SiteLift Script Logic', () => {
    let toggle, links, body;

    beforeEach(() => {
        document.body.innerHTML = `
            <button id="menu-toggle"></button>
            <div class="nav-links"></div>
            <div class="logo-fragment"></div>
            <section>
                <div class="parallax-img" data-speed="0.2"></div>
            </section>
        `;
        toggle = document.getElementById('menu-toggle');
        links = document.querySelector('.nav-links');
        body = document.body;
    });

    test('initMobileMenu toggles classes and aria-expanded on click', () => {
        initMobileMenu(toggle, links, body);

        expect(toggle.getAttribute('aria-expanded')).toBe(null); // Or 'false' if explicitly set in HTML

        toggle.click();
        expect(toggle.classList.contains('is-active')).toBe(true);
        expect(links.classList.contains('is-active')).toBe(true);
        expect(body.classList.contains('menu-open')).toBe(true);
        expect(toggle.getAttribute('aria-expanded')).toBe('true');

        toggle.click();
        expect(toggle.classList.contains('is-active')).toBe(false);
        expect(toggle.getAttribute('aria-expanded')).toBe('false');

        toggle.click();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        expect(toggle.classList.contains('is-active')).toBe(false);
        expect(links.classList.contains('is-active')).toBe(false);
        expect(body.classList.contains('menu-open')).toBe(false);
        expect(toggle.getAttribute('aria-expanded')).toBe('false');
        expect(document.activeElement).toBe(toggle);
    });
    test('updateParallax applies transforms', () => {
        const frag = document.querySelector('.logo-fragment');
        updateParallax(100);
        expect(frag.style.transform).toContain('translate3d(0, 8px, 0)');
    });

    test('initScrollReveals fails open when IntersectionObserver is unavailable', () => {
        document.body.innerHTML = `
            <p data-scroll-reveal>Visible content</p>
            <h2 class="reveal-text">Visible heading</h2>
        `;
        document.documentElement.classList.add('reveal-ready');
        const elements = document.querySelectorAll('[data-scroll-reveal], .reveal-text');

        const observer = initScrollReveals({
            root: document.documentElement,
            elements,
            Observer: null,
            reduceMotion: false,
        });

        expect(observer).toBe(null);
        expect(document.documentElement.classList.contains('reveal-ready')).toBe(false);
        elements.forEach((element) => expect(element.classList.contains('is-visible')).toBe(true));
    });

    test('initScrollReveals makes reduced-motion content immediate', () => {
        document.body.innerHTML = '<p data-scroll-reveal>Visible content</p>';
        const element = document.querySelector('[data-scroll-reveal]');

        initScrollReveals({
            root: document.documentElement,
            elements: [element],
            Observer: global.IntersectionObserver,
            reduceMotion: true,
        });

        expect(element.classList.contains('is-visible')).toBe(true);
        expect(document.documentElement.classList.contains('reveal-ready')).toBe(false);
    });

    test('initScrollReveals gates animation only after an observer is ready', () => {
        document.body.innerHTML = '<p data-scroll-reveal>Enhanced content</p>';
        const element = document.querySelector('[data-scroll-reveal]');
        let callback;
        const observe = jest.fn();
        class WorkingObserver {
            constructor(observerCallback) {
                callback = observerCallback;
            }

            observe(target) {
                observe(target);
            }
        }

        const observer = initScrollReveals({
            root: document.documentElement,
            elements: [element],
            Observer: WorkingObserver,
            reduceMotion: false,
        });

        expect(observer).toBeInstanceOf(WorkingObserver);
        expect(document.documentElement.classList.contains('reveal-ready')).toBe(true);
        expect(observe).toHaveBeenCalledWith(element);

        callback([{ target: element, isIntersecting: true }]);
        expect(element.classList.contains('is-visible')).toBe(true);
    });

    test('initMobileMenu closes after choosing a link and when focus leaves the menu', () => {
        document.body.innerHTML = `
            <button id="menu-toggle" aria-expanded="false"></button>
            <div class="nav-links"><a href="#one" id="one-link">One</a><a href="#two">Two</a></div>
            <a href="#after" id="after">After</a>
        `;
        const menuToggle = document.getElementById('menu-toggle');
        const menuLinks = document.querySelector('.nav-links');
        initMobileMenu(menuToggle, menuLinks, document.body);

        menuToggle.click();
        expect(menuToggle.getAttribute('aria-expanded')).toBe('true');
        expect(document.activeElement).toBe(document.getElementById('one-link'));
        document.getElementById('one-link').click();
        expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
        expect(document.body.classList.contains('menu-open')).toBe(false);

        menuToggle.click();
        const after = document.getElementById('after');
        menuLinks.dispatchEvent(new FocusEvent('focusout', { relatedTarget: after, bubbles: true }));
        expect(menuToggle.getAttribute('aria-expanded')).toBe('false');

        menuToggle.click();
        menuToggle.dispatchEvent(new FocusEvent('focusout', { relatedTarget: after, bubbles: true }));
        expect(menuToggle.getAttribute('aria-expanded')).toBe('false');
    });

    test('splitTexts exposes one readable copy and keeps inline accents', () => {
        document.body.innerHTML = `
            <h1 class="reveal-text" data-reveal-type="chars">SITELIFT</h1>
            <p class="reveal-text" data-reveal-type="lines">
                WordPress is the <span class="strikethrough">monthly drag</span>.<br />
                SiteLift is the <span class="vibrant-italic">clean exit.</span>
            </p>
        `;
        splitTexts();
        splitTexts(); // idempotent

        const h1 = document.querySelector('h1');
        expect(h1.querySelector('.sr-only').textContent).toBe('SITELIFT');
        expect(h1.querySelector('.reveal-visual').getAttribute('aria-hidden')).toBe('true');
        expect(h1.querySelectorAll('.char')).toHaveLength(8);
        expect(h1.querySelectorAll('.sr-only')).toHaveLength(1);

        const p = document.querySelector('p');
        expect(p.querySelector('.sr-only').textContent).toBe(
            'WordPress is the monthly drag. SiteLift is the clean exit.'
        );
        expect(p.querySelectorAll('.line-wrapper')).toHaveLength(2);
        expect(p.querySelector('.reveal-visual .strikethrough').textContent).toBe('monthly drag');
        expect(p.querySelector('.reveal-visual .vibrant-italic').textContent).toBe('clean exit.');
    });
});

describe('Pause motion control (WCAG 2.2.2, audit round 2)', () => {
    const memoryStorage = (initial = {}) => {
        const data = { ...initial };
        return {
            data,
            getItem: (key) => (key in data ? data[key] : null),
            setItem: (key, value) => {
                data[key] = String(value);
            },
        };
    };
    const reducedMotion = (matches) => {
        const listeners = [];
        return {
            matches,
            addEventListener: (type, listener) => listeners.push(listener),
            fire: (next) => listeners.forEach((listener) => listener({ matches: next })),
        };
    };
    let root;
    let toggle;

    beforeEach(() => {
        document.body.innerHTML = `
            <button type="button" aria-pressed="false" data-motion-toggle hidden>
                <span class="motion-toggle-label">Pause motion</span>
            </button>`;
        root = document.createElement('div');
        toggle = document.querySelector('[data-motion-toggle]');
    });

    test('reveals the native toggle and pauses/resumes on click, remembering the choice', () => {
        const storage = memoryStorage();
        const motion = initMotionControl({
            root,
            toggle,
            storage,
            motionQuery: reducedMotion(false),
        });

        expect(toggle.hidden).toBe(false);
        expect(toggle.tagName).toBe('BUTTON');
        expect(toggle.getAttribute('aria-pressed')).toBe('false');
        expect(root.dataset.motion).toBe('running');
        expect(motion.isPaused()).toBe(false);
        expect(storage.data[MOTION_STORAGE_KEY]).toBeUndefined();

        toggle.click();
        expect(toggle.getAttribute('aria-pressed')).toBe('true');
        expect(root.dataset.motion).toBe('paused');
        expect(motion.isPaused()).toBe(true);
        expect(storage.data[MOTION_STORAGE_KEY]).toBe('paused');

        toggle.click();
        expect(toggle.getAttribute('aria-pressed')).toBe('false');
        expect(root.dataset.motion).toBe('running');
        expect(storage.data[MOTION_STORAGE_KEY]).toBe('running');
    });

    test('starts paused when the visitor prefers reduced motion, without writing storage', () => {
        const storage = memoryStorage();
        const motion = initMotionControl({
            root,
            toggle,
            storage,
            motionQuery: reducedMotion(true),
        });

        expect(motion.isPaused()).toBe(true);
        expect(toggle.getAttribute('aria-pressed')).toBe('true');
        expect(root.dataset.motion).toBe('paused');
        expect(storage.data[MOTION_STORAGE_KEY]).toBeUndefined();
    });

    test('a stored choice wins over the OS default in both directions', () => {
        initMotionControl({
            root,
            toggle,
            storage: memoryStorage({ [MOTION_STORAGE_KEY]: 'paused' }),
            motionQuery: reducedMotion(false),
        });
        expect(root.dataset.motion).toBe('paused');
        expect(toggle.getAttribute('aria-pressed')).toBe('true');

        const other = document.createElement('div');
        initMotionControl({
            root: other,
            toggle: null,
            storage: memoryStorage({ [MOTION_STORAGE_KEY]: 'running' }),
            motionQuery: reducedMotion(true),
        });
        expect(other.dataset.motion).toBe('running');
    });

    test('ignores unknown stored values', () => {
        initMotionControl({
            root,
            toggle,
            storage: memoryStorage({ [MOTION_STORAGE_KEY]: 'sideways' }),
            motionQuery: reducedMotion(false),
        });
        expect(root.dataset.motion).toBe('running');
    });

    test('keeps working when browser storage throws', () => {
        const throwing = {
            getItem: () => {
                throw new Error('SecurityError');
            },
            setItem: () => {
                throw new Error('QuotaExceededError');
            },
        };
        const motion = initMotionControl({ root, toggle, storage: throwing, motionQuery: null });

        expect(root.dataset.motion).toBe('running');
        expect(() => toggle.click()).not.toThrow();
        expect(motion.isPaused()).toBe(true);
        expect(toggle.getAttribute('aria-pressed')).toBe('true');
    });

    test('follows a mid-visit OS change only until the visitor chooses', () => {
        const query = reducedMotion(false);
        const motion = initMotionControl({
            root,
            toggle,
            storage: memoryStorage(),
            motionQuery: query,
        });

        query.fire(true);
        expect(motion.isPaused()).toBe(true);
        expect(toggle.getAttribute('aria-pressed')).toBe('true');

        toggle.click(); // explicit "motion on"
        query.fire(true);
        expect(motion.isPaused()).toBe(false);
        expect(root.dataset.motion).toBe('running');
    });

    test('parallax skips scroll frames while motion is paused', () => {
        document.body.innerHTML = '<div class="logo-fragment"></div>';
        const target = new EventTarget();
        target.scrollY = 100;
        let paused = true;
        initParallax({ isPaused: () => paused, target, schedule: (callback) => callback() });
        const fragment = document.querySelector('.logo-fragment');

        target.dispatchEvent(new Event('scroll'));
        expect(fragment.style.transform).toBe('');

        paused = false;
        target.dispatchEvent(new Event('scroll'));
        expect(fragment.style.transform).toContain('translate3d(0, 8px, 0)');

        paused = true;
        target.scrollY = 500;
        target.dispatchEvent(new Event('scroll'));
        expect(fragment.style.transform).toContain('translate3d(0, 8px, 0)');
    });
});
