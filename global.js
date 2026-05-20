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
});
