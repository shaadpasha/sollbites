document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("cart-items-container");
    const summarySubtotal = document.getElementById("summary-subtotal");
    const summaryTotal = document.getElementById("summary-total");
    const summaryItemsCount = document.getElementById("summary-items-count");
    const summaryDiscount = document.getElementById("summary-discount");
    const promoSavedText = document.getElementById("promo-saved-text");
    
    // Custom descriptions for the 12 items to match the design style
    const productDescriptions = {
        1: "Crispy veg patty with fresh lettuce, tomato, onion & our special sauce.",
        2: "Double beef patties, melting cheese, lettuce, and secret sauce.",
        3: "Grilled chicken strips, fresh veggies, and spicy sauce wrapped in a tortilla.",
        4: "Marinated cottage cheese, onions, and mint chutney wrapped in flatbread.",
        5: "Classic delight with 100% real mozzarella cheese and fresh basil.",
        6: "Loaded with mushrooms, onions, bell peppers, tomatoes, and cheese.",
        7: "Crispy pepperoni slices and perfectly melted mozzarella cheese.",
        8: "Crispy golden french fries salted to perfection.",
        9: "Crispy fries dusted with our signature spicy peri peri seasoning.",
        10: "Toasted bread, fresh vegetables, and cheese slices layered beautifully.",
        11: "Rich chocolate milkshake topped with whipped cream and chocolate syrup.",
        12: "Chilled & refreshing classic cold coffee to pair with your favourite meal."
    };
    
    const deliveryFee = 40;
    let appliedCoupon = null;
    
    function renderCart() {
        let cart = JSON.parse(localStorage.getItem("sollbites_cart")) || [];
        cartContainer.innerHTML = "";
        
        if (cart.length === 0) {
            cartContainer.innerHTML = `<div class="empty-cart-message">Your cart is empty. <br><br><button onclick="window.location.href='order.html'" class="browse-menu-btn" style="margin-top: 15px;">Browse Menu</button></div>`;
            if (summarySubtotal) summarySubtotal.textContent = "₹0";
            if (summaryTotal) summaryTotal.textContent = "₹0";
            if (summaryItemsCount) summaryItemsCount.textContent = "0 Items";
            if (summaryDiscount) summaryDiscount.textContent = "- ₹0";
            if (promoSavedText) promoSavedText.textContent = "You saved ₹0";
            if (typeof window.updateHeaderCartCount === 'function') window.updateHeaderCartCount();
            return;
        }

        let subtotal = 0;
        let totalItems = 0;
        
        cart.forEach((item, index) => {
            const qty = item.quantity || 1;
            const itemTotal = item.price * qty;
            subtotal += itemTotal;
            totalItems += qty;
            
            const desc = productDescriptions[item.id] || "Delicious freshly prepared meal.";
            
            const cartItem = document.createElement("div");
            cartItem.className = "cart-item fade-in-visible";
            
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-desc">${desc}</div>
                    <div class="cart-item-price-unit">₹${item.price}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-qty-pill">
                        <button onclick="updateCartQuantity(${item.id}, -1)">-</button>
                        <span>${qty}</span>
                        <button onclick="updateCartQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${index})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                    <div class="cart-item-total-price">₹${itemTotal}</div>
                </div>
            `;
            cartContainer.appendChild(cartItem);
        });

        const subtotalAndDelivery = subtotal + deliveryFee;
        let discountAmount = 0;
        
        if (appliedCoupon === 'shaadkibiwihunmai') {
            discountAmount = subtotalAndDelivery * 0.77; // 77% off everything!
        }
        
        const total = subtotalAndDelivery - discountAmount;
        
        if (summarySubtotal) summarySubtotal.textContent = `₹${subtotal}`;
        if (summaryTotal) summaryTotal.textContent = `₹${Math.max(0, total).toFixed(2)}`;
        if (summaryItemsCount) summaryItemsCount.textContent = `${totalItems} Items`;
        
        if (discountAmount > 0) {
            if (summaryDiscount) summaryDiscount.textContent = `- ₹${discountAmount.toFixed(2)}`;
            if (promoSavedText) promoSavedText.textContent = `Secret unlocked! You saved ₹${discountAmount.toFixed(2)}`;
        } else {
            if (summaryDiscount) summaryDiscount.textContent = `- ₹0`;
            if (promoSavedText) promoSavedText.textContent = ``;
        }
        
        if (typeof window.updateHeaderCartCount === 'function') window.updateHeaderCartCount();
    }

    // Coupon logic
    const applyBtn = document.getElementById('apply-coupon-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const input = document.getElementById('coupon-input').value.trim();
            const errorText = document.getElementById('promo-error-text');
            const savedText = document.getElementById('promo-saved-text');
            
            if (input === 'shaadkibiwihunmai') {
                appliedCoupon = input;
                errorText.style.display = 'none';
                savedText.style.display = 'block';
                renderCart();
            } else {
                appliedCoupon = null;
                errorText.textContent = "Invalid coupon code!";
                errorText.style.display = 'block';
                savedText.style.display = 'none';
                renderCart();
            }
        });
    }

    window.updateCartQuantity = function(productId, change) {
        let cart = JSON.parse(localStorage.getItem('sollbites_cart')) || [];
        let itemIndex = cart.findIndex(p => p.id === productId);
        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            localStorage.setItem("sollbites_cart", JSON.stringify(cart));
            renderCart();
        }
    }

    window.removeFromCart = function(index) {
        let cart = JSON.parse(localStorage.getItem('sollbites_cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem("sollbites_cart", JSON.stringify(cart));
        renderCart();
    };

    const payBtn = document.getElementById("pay-button");
    const paymentModal = document.getElementById('payment-modal');
    const successModal = document.getElementById('success-modal');

    if (payBtn) {
        payBtn.addEventListener("click", () => {
            let cart = JSON.parse(localStorage.getItem('sollbites_cart')) || [];
            if (cart.length === 0) {
                alert("Your cart is empty! Add some delicious food first.");
                return;
            }

            const nameInput = document.getElementById("checkout-name").value.trim();
            const phoneInput = document.getElementById("checkout-phone").value.trim();
            const addressInput = document.getElementById("checkout-address").value.trim();

            if (!nameInput || !phoneInput || !addressInput) {
                alert("Please fill in your Name, Phone Number, and Delivery Address.");
                return;
            }

            // Show payment modal
            if(paymentModal) paymentModal.style.display = 'flex';
        });
    }

    if (document.getElementById('btn-close-payment')) {
        document.getElementById('btn-close-payment').addEventListener('click', () => {
            paymentModal.style.display = 'none';
        });
    }

    if (document.getElementById('btn-cod')) {
        document.getElementById('btn-cod').addEventListener('click', () => {
            paymentModal.style.display = 'none';
            processOrder();
            if(successModal) successModal.style.display = 'flex';
        });
    }

    if (document.getElementById('btn-online')) {
        document.getElementById('btn-online').addEventListener('click', async () => {
            const totalText = document.getElementById("summary-total").textContent.replace('₹', '');
            const orderTotal = parseFloat(totalText);
            
            if (orderTotal < 1) {
                alert("Minimum order amount for online payment is ₹1.");
                return;
            }
            
            // Amount in paise
            const amountInPaise = Math.round(orderTotal * 100);
            
            try {
                const response = await fetch('/api/create-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: amountInPaise })
                });
                
                const orderData = await response.json();
                
                if (!response.ok) {
                    alert("Failed to initiate payment: " + (orderData.error || "Unknown error"));
                    return;
                }
                
                const options = {
                    "key": "rzp_test_SrlNbf5P5T7St2", 
                    "amount": orderData.amount,
                    "currency": orderData.currency,
                    "name": "SollBites",
                    "description": "Food Order Payment",
                    "order_id": orderData.id,
                    "handler": async function (response) {
                        try {
                            const verifyRes = await fetch('/api/verify-payment', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature
                                })
                            });
                            
                            const verifyData = await verifyRes.json();
                            
                            if (verifyData.success) {
                                paymentModal.style.display = 'none';
                                processOrder();
                                if(successModal) successModal.style.display = 'flex';
                            } else {
                                alert("Payment verification failed! Please contact support.");
                            }
                        } catch (err) {
                            alert("Error verifying payment.");
                            console.error(err);
                        }
                    },
                    "prefill": {
                        "name": document.getElementById("checkout-name").value.trim(),
                        "contact": document.getElementById("checkout-phone").value.trim()
                    },
                    "theme": {
                        "color": "#FFB800"
                    }
                };
                
                const rzp = new Razorpay(options);
                
                rzp.on('payment.failed', function (response){
                    alert("Payment Failed. Reason: " + response.error.description);
                });
                
                rzp.open();
                
            } catch (error) {
                console.error(error);
                alert("Error connecting to payment server.");
            }
        });
    }

    if (document.getElementById('btn-close-success')) {
        document.getElementById('btn-close-success').addEventListener('click', () => {
            successModal.style.display = 'none';
        });
    }

    function processOrder() {
        let cart = JSON.parse(localStorage.getItem('sollbites_cart')) || [];
        const nameInput = document.getElementById("checkout-name").value.trim();
        const phoneInput = document.getElementById("checkout-phone").value.trim();
        const addressInput = document.getElementById("checkout-address").value.trim();
        
        const totalText = document.getElementById("summary-total").textContent.replace('₹', '');
        const orderTotal = parseFloat(totalText);

        const newOrder = {
            orderId: 'SB' + Math.floor(Math.random() * 1000000),
            customerName: nameInput,
            customerPhone: phoneInput,
            customerAddress: addressInput,
            items: cart,
            total: orderTotal,
            date: new Date().toISOString()
        };

        let orders = JSON.parse(localStorage.getItem('sollbites_orders')) || [];
        orders.unshift(newOrder); // Add to beginning
        localStorage.setItem('sollbites_orders', JSON.stringify(orders));

        // clear form
        document.getElementById("checkout-name").value = "";
        document.getElementById("checkout-phone").value = "";
        document.getElementById("checkout-address").value = "";
        
        // clear cart
        localStorage.setItem("sollbites_cart", JSON.stringify([]));
        appliedCoupon = null; // reset coupon
        document.getElementById('coupon-input').value = "";
        document.getElementById('promo-saved-text').style.display = 'none';
        renderCart();
    }

    renderCart();
});
