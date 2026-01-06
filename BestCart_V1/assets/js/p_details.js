// ==========================================
// PRODUCT DETAILS PAGE LOGIC
// ==========================================
function loadProductDetails(id) {
    // FIX: Using central API
    fetch(`../../api/api.php?action=get_product_details&id=${id}`)
        .then(res => res.json())
        .then(p => {
            if (!p) {
                document.getElementById('details-wrapper').innerHTML = "<h3>Product not found.</h3>";
                return;
            }

            const wrapper = document.getElementById('details-wrapper');
            let imgPath = `../../uploads/${p.image}`;
            
            // Calculate Prices
            let originalPrice = parseFloat(p.price);
            let discountPrice = parseFloat(p.discount_price);
            let finalPrice = (discountPrice > 0) ? discountPrice : originalPrice;

            let priceHtml = (discountPrice > 0) 
                ? `<span class="p-old-price">৳${originalPrice}</span> <span class="p-new-price">৳${discountPrice}</span>`
                : `<span class="p-new-price">৳${originalPrice}</span>`;

            // Stock Logic
            let stock = parseInt(p.quantity);
            let stockStatus = (stock > 0) 
                ? `<span style="color:green; font-weight:bold;">In Stock (${stock})</span>`
                : `<span style="color:red; font-weight:bold;">Out of Stock</span>`;
            
            let disableBtn = (stock === 0) ? "btn-disabled" : "";

            wrapper.innerHTML = `
                <div class="details-img"><img src="${imgPath}" onerror="this.src='../../assets/images/default.png'"></div>
                <div class="details-info">
                    <div class="p-category">${p.category || 'General'}</div>
                    <h1 class="p-title">${p.name}</h1>
                    <div class="p-price-box">${priceHtml}</div>
                    <p class="p-desc">${p.description || 'No description.'}</p>
                    <div style="margin-bottom: 20px;"><strong>Availability:</strong> ${stockStatus}</div>
                    
                    <div class="qty-wrapper">
                        <label><strong>Quantity:</strong></label>
                        <input type="number" id="qtyInput" class="qty-input" value="1" min="1" max="${stock}" 
                               oninput="validateQty(this, ${stock})" ${stock == 0 ? 'disabled' : ''}>
                    </div>

                    <div class="action-buttons">
                        <button class="add-cart-btn ${disableBtn}" onclick="addToCart('${p.id}', '${p.name}', ${finalPrice})">Add to Cart</button>
                        <button class="buy-now-btn ${disableBtn}" onclick="buyNow('${p.id}', ${finalPrice})">Buy Now</button>
                    </div>
                </div>
            `;
        })
        .catch(err => console.error("Error loading details:", err));
}

function validateQty(input, maxStock) {
    if (parseInt(input.value) > maxStock) input.value = maxStock;
    if (parseInt(input.value) < 1) input.value = 1;
}

function addToCart(id, name, price) {
    let qty = document.getElementById('qtyInput').value;
    alert(`Added to Cart: ${name} (x${qty})`);
}

function buyNow(id, price) {
    let qty = document.getElementById('qtyInput').value;
    // Redirect logic here if needed
    alert(`Buying ${qty} items...`);
}