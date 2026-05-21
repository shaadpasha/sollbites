// admin.js

let newImageBase64 = "";

function switchTab(tabId) {
    document.getElementById('nav-orders').classList.remove('active');
    document.getElementById('nav-menu').classList.remove('active');
    
    document.getElementById('content-orders').style.display = 'none';
    document.getElementById('content-menu').style.display = 'none';
    
    document.getElementById(`nav-${tabId}`).classList.add('active');
    document.getElementById(`content-${tabId}`).style.display = 'block';
}

function loadOrders() {
    const ordersTbody = document.getElementById('orders-tbody');
    let orders = JSON.parse(localStorage.getItem('sollbites_orders')) || [];
    
    ordersTbody.innerHTML = '';
    
    if (orders.length === 0) {
        ordersTbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #888;">No orders found.</td></tr>';
        return;
    }
    
    orders.forEach((order, index) => {
        const tr = document.createElement('tr');
        
        const dateObj = new Date(order.date);
        let dateString = "Unknown Date<br>--";
        if (!isNaN(dateObj)) {
            const day = String(dateObj.getDate()).padStart(2, '0');
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = monthNames[dateObj.getMonth()];
            const year = dateObj.getFullYear();
            
            let hours = dateObj.getHours();
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; 
            
            dateString = `${day} ${month} ${year}<br>${hours}:${minutes} ${ampm}`;
        }
        
        let itemsHTML = '';
        order.items.forEach(item => {
            const qty = item.quantity || 1;
            itemsHTML += `${qty} x ${item.name}\n`;
        });
        
        tr.innerHTML = `
            <td>${order.orderId}</td>
            <td>${order.customerName}</td>
            <td class="address-cell">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${order.customerAddress}
            </td>
            <td class="order-items-cell">${itemsHTML}</td>
            <td>₹ ${order.total.toFixed(0)}</td>
            <td><span class="status-tag">Confirmed</span></td>
            <td>${dateString}</td>
            <td>
                <button class="action-btn" onclick="deleteOrder(${index})" title="Complete Order">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="5" r="1"></circle>
                        <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                </button>
            </td>
        `;
        ordersTbody.appendChild(tr);
    });
}

function deleteOrder(index) {
    if(confirm("Mark this order as completed and remove from the list?")) {
        let orders = JSON.parse(localStorage.getItem('sollbites_orders')) || [];
        orders.splice(index, 1);
        localStorage.setItem('sollbites_orders', JSON.stringify(orders));
        loadOrders();
    }
}

function handleImageUpload() {
    const fileInput = document.getElementById('new-item-image-file');
    const uploadBox = document.getElementById('upload-box');
    const uploadContent = uploadBox.querySelector('.upload-content');
    
    if (!document.getElementById('img-preview')) {
        const img = document.createElement('img');
        img.id = 'img-preview';
        img.className = 'upload-preview';
        uploadBox.appendChild(img);
    }
    
    const preview = document.getElementById('img-preview');
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                newImageBase64 = event.target.result;
                uploadContent.style.display = 'none';
                preview.src = newImageBase64;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

function addNewDish() {
    const name = document.getElementById('new-item-name').value.trim();
    const priceStr = document.getElementById('new-item-price').value.trim();
    const image = newImageBase64 || "dish1.jpg";
    
    if (!name || !priceStr) {
        alert("Please fill in Product Name and Price.");
        return;
    }
    
    const price = parseFloat(priceStr);
    
    let products = JSON.parse(localStorage.getItem('sollbites_products')) || [];
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    products.push({
        id: newId,
        name: name,
        price: price,
        image: image
    });
    
    localStorage.setItem('sollbites_products', JSON.stringify(products));
    
    document.getElementById('new-item-name').value = '';
    document.getElementById('new-item-price').value = '';
    document.getElementById('new-item-category').value = '';
    
    newImageBase64 = "";
    document.getElementById('new-item-image-file').value = "";
    document.querySelector('.upload-content').style.display = 'block';
    if(document.getElementById('img-preview')) {
        document.getElementById('img-preview').style.display = 'none';
    }
    
    alert("Product Added Successfully!");
}

document.addEventListener("DOMContentLoaded", () => {
    // Check authentication
    if (sessionStorage.getItem('sollbites_admin_auth') !== 'true') {
        let pwd = prompt("Enter Admin Password:");
        while (pwd !== "sollbitesadmin") {
            if (pwd === null) {
                // User cancelled, redirect to home
                window.location.href = "index.html";
                return;
            }
            pwd = prompt("Incorrect password. Try again:");
        }
        sessionStorage.setItem('sollbites_admin_auth', 'true');
    }

    loadOrders();
    handleImageUpload();
});
