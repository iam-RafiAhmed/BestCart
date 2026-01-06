// ==========================================
// SEARCH PAGE LOGIC
// ==========================================
function runSearch(term) {
    const grid = document.getElementById('search-grid');
    grid.innerHTML = "<h3>Searching...</h3>";
    
    // FIX: Using central API for search
    fetch(`../../api/api.php?action=get_products&search=${term}`)
        .then(res => res.json())
        .then(products => {
            if (products.length === 0) {
                grid.innerHTML = `<h3 style="color:#666;">No products found for "${term}"</h3>`;
            } else {
                grid.innerHTML = ""; 
                let html = "";
                products.forEach(p => {
                    let imgPath = `../../uploads/${p.image}`;
                    let originalPrice = parseFloat(p.price);
                    let discountPrice = parseFloat(p.discount_price);
                    
                    let priceHtml = (discountPrice > 0)
                        ? `<span style="text-decoration:line-through;color:#888;margin-right:5px;">৳${originalPrice}</span><span style="color:#e74c3c;font-weight:bold;">৳${discountPrice}</span>`
                        : `<span style="color:#e74c3c;font-weight:bold;">৳${originalPrice}</span>`;

                    html += `
                        <a class="featured-item" href="product_details.php?id=${p.id}">
                            <div class="featured-img"><img src="${imgPath}" onerror="this.src='../../assets/images/default.png'"></div>
                            <div class="featured-name">${p.name}</div>
                            <div class="featured-price">${priceHtml}</div>
                        </a>
                    `;
                });
                grid.innerHTML = html;
            }
        })
        .catch(err => {
            console.error(err);
            grid.innerHTML = "<h3>Error loading results.</h3>";
        });
}