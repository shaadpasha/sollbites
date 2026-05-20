document.addEventListener("DOMContentLoaded", () => {
    const defaultProducts = [
        { id: 1, name: "Classic Veg Burger", price: 150, image: "dish1.jpg" },
        { id: 2, name: "Double Cheese Burger", price: 250, image: "dish2.jpg" },
        { id: 3, name: "Spicy Chicken Wrap", price: 220, image: "dish3.jpg" },
        { id: 4, name: "Paneer Tikka Roll", price: 180, image: "dish4.jpg" },
        { id: 5, name: "Margherita Pizza", price: 299, image: "dish5.jpg" },
        { id: 6, name: "Farmhouse Pizza", price: 399, image: "dish6.jpg" },
        { id: 7, name: "Pepperoni Pizza", price: 349, image: "dish7.jpg" },
        { id: 8, name: "French Fries (Large)", price: 120, image: "dish8.jpg" },
        { id: 9, name: "Peri Peri Fries", price: 140, image: "dish9.jpg" },
        { id: 10, name: "Veggie Club Sandwich", price: 160, image: "dish10.jpg" },
        { id: 11, name: "Chocolate Milkshake", price: 180, image: "dish11.jpg" },
        { id: 12, name: "Classic Cold Coffee", price: 150, image: "dish12.jpg" }
    ];

    let products = JSON.parse(localStorage.getItem('sollbites_products'));
    if (!products || products.length === 0) {
        products = defaultProducts;
        localStorage.setItem('sollbites_products', JSON.stringify(products));
    }

    const productGrid = document.getElementById("product-grid");

    // Generate product cards
    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card fade-in";
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxYTFhMWEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iIzU1NSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMThweCIgZHk9Ii4zZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlIHdpbGwgbG9hZCBoZXJlPC90ZXh0Pjwvc3ZnPg=='">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">₹${product.price}</div>
                <div class="action-container" id="action-${product.id}">
                    <!-- Buttons injected via JS -->
                </div>
            </div>
        `;
        
        productGrid.appendChild(card);
        updateButtonState(product.id);
    });

    function updateButtonState(productId) {
        let cart = JSON.parse(localStorage.getItem('sollbites_cart')) || [];
        const cartItem = cart.find(p => p.id === productId);
        const quantity = cartItem ? cartItem.quantity : 0;
        
        const container = document.getElementById(`action-${productId}`);
        if (!container) return;
        
        if (quantity > 0) {
            container.innerHTML = `
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity(${productId}, -1)">-</button>
                    <span class="qty-count">${quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${productId}, 1)">+</button>
                </div>
            `;
        } else {
            container.innerHTML = `
                <button class="add-to-cart-btn" onclick="updateQuantity(${productId}, 1)">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add to Cart
                </button>
            `;
        }
    }

    window.updateQuantity = function(productId, change) {
        let cart = JSON.parse(localStorage.getItem('sollbites_cart')) || [];
        let cartItemIndex = cart.findIndex(p => p.id === productId);
        
        if (cartItemIndex > -1) {
            cart[cartItemIndex].quantity += change;
            if (cart[cartItemIndex].quantity <= 0) {
                cart.splice(cartItemIndex, 1);
            }
        } else if (change > 0) {
            const product = products.find(p => p.id === productId);
            if (product) {
                cart.push({ ...product, quantity: change });
            }
        }
        
        localStorage.setItem('sollbites_cart', JSON.stringify(cart));
        updateButtonState(productId);
        
        // Update header count (defined in global.js)
        if (typeof updateHeaderCartCount === 'function') {
            updateHeaderCartCount();
        }
    };

    // Setup Intersection Observer for fade-in animations on scroll
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll(".product-card").forEach(card => {
        observer.observe(card);
    });
});
