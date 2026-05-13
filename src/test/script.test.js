import { initMobileMenu, updateParallax } from '../script.js';

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
            <div id="menu-toggle"></div>
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
    });
    test('updateParallax applies transforms', () => {
        const frag = document.querySelector('.logo-fragment');
        updateParallax(100);
        expect(frag.style.transform).toContain('translate3d(0, 8px, 0)');
    });
});
