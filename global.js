document.addEventListener("DOMContentLoaded", () => {
    // Update Cart Count in Header
    function updateHeaderCartCount() {
        let cart = JSON.parse(localStorage.getItem('sollbites_cart')) || [];
        const cartCountEl = document.querySelector('.cart-btn span');
        if (cartCountEl) {
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            cartCountEl.textContent = `${totalItems} | My Order`;
        }
    }
    updateHeaderCartCount();
    window.updateHeaderCartCount = updateHeaderCartCount;

    // Setup Animations for elements with .animate-on-load
    const animateElements = document.querySelectorAll('.animate-on-load');
    animateElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('fade-in-visible');
        }, index * 100 + 100); // Staggered animation: start after 100ms, with 100ms delay between each
    });

    // Mobile menu toggle
    const headerActions = document.querySelector('.header-actions');
    const navLinks = document.querySelector('.nav-links');
    if (headerActions && navLinks) {
        const menuBtn = document.createElement('button');
        menuBtn.className = 'icon-btn mobile-menu-btn';
        menuBtn.setAttribute('aria-label', 'Menu');
        menuBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        `;
        headerActions.appendChild(menuBtn);

        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            if (navLinks.classList.contains('nav-active')) {
                menuBtn.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                `;
            } else {
                menuBtn.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                `;
            }
        });
    }
});
