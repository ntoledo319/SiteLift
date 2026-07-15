import { initMobileMenu, initScrollReveals, updateParallax } from '../script.js';

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
});
