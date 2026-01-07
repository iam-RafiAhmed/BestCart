// ==========================================
// CONFIGURATION & STATE
// ==========================================
let currentSlide = 0;
let autoTimer = null;
let bannerImages = [];
let productOffset = 0;      
const productsPerLoad = 5; 

// ==========================================
// 1. BANNER SLIDER LOGIC
// ==========================================
function fetchBanners() {
    // FIX: Action 'get_sliders' connects to sliderModel
    fetch('../../api/api.php?action=get_sliders')
        .then(response => response.json())
        .then(data => {
            bannerImages = data;
            if (bannerImages.length > 0) {
                renderBanners();
            }
        })
        .catch(error => console.error('Error loading banners:', error));
}

function renderBanners() {
    const slider = document.getElementById("slider");
    if (slider && bannerImages.length > 0) {
        // FIX: Ensure path points to your uploads folder
        slider.src = `../../uploads/${bannerImages[0].image}`;
        startAutoSlide();
    }
}

function showSlide(index) {
    const slider = document.getElementById("slider");
    if (!slider || bannerImages.length === 0) return;

    if (index < 0) index = bannerImages.length - 1;
    if (index >= bannerImages.length) index = 0;

    currentSlide = index;
    slider.src = `../../uploads/${bannerImages[currentSlide].image}`;
}

function nextSlide() { showSlide(currentSlide + 1); }
function prevSlide() { showSlide(currentSlide - 1); }

function startAutoSlide() {
    stopAutoSlide();
    autoTimer = setInterval(nextSlide, 3500); 
}

function stopAutoSlide() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
}

// ==========================================
// 2. CATEGORIES LOGIC
// ==========================================
function fetchCategories() {
    // FIX: Central API
    fetch('../../api/api.php?action=get_categories')
        .then(response => response.json())
        .then(data => renderCategories(data))
        .catch(err => console.error('Error loading categories:', err));
}

function renderCategories(categories) {
    const headerList = document.getElementById("category-list"); 
    const homeGrid = document.getElementById("category-grid"); 

    // 1. Header Dropdown
    if (headerList) {
        let listHtml = "";
        categories.forEach(cat => {
            listHtml += `<a href="search.php?query=${encodeURIComponent(cat.name)}">${cat.name}</a>`;
        });
        headerList.innerHTML = listHtml;
    }

    // 2. Homepage Grid
    if (homeGrid) {
        let gridHtml = "";
        categories.forEach(cat => {
            let imgPath = `../../uploads/${cat.image}`;
            gridHtml += `
                <a class="cat-item" href="search.php?query=${encodeURIComponent(cat.name)}">
                    <div class="cat-circle">
                        <img src="${imgPath}" alt="${cat.name}" onerror="this.src='../../assets/images/default.png'">
                    </div>
                    <div class="cat-name">${cat.name}</div>
                </a>
            `;
        });
        homeGrid.innerHTML = gridHtml;
    }
}

// ==========================================
// 3. PRODUCTS LOGIC (WITH LOAD MORE)
// ==========================================
function loadProducts() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if(loadMoreBtn) loadMoreBtn.innerText = "Loading...";

    // FIX: Sending limit & page to central API
    fetch(`../../api/api.php?action=get_products&limit=${productsPerLoad}&page=${productOffset}`)
        .then(res => res.json())
        .then(products => {
            renderProducts(products);
            
            productOffset += products.length;

            if(loadMoreBtn) {
                loadMoreBtn.innerText = "Load More"; 
                if (products.length < productsPerLoad) {
                    loadMoreBtn.style.display = 'none';
                }
            }
        })
        .catch(err => {
            console.error('Error loading products:', err);
            if(loadMoreBtn) loadMoreBtn.innerText = "Error (Try Again)";
        });
}

function renderProducts(products) {
    const grid = document.getElementById("featured-grid");
    if (!grid) return;

    let html = "";
    products.forEach(p => {
        let imgPath = `../../uploads/${p.image}`;
        
        let originalPrice = parseFloat(p.price);
        let discountPrice = parseFloat(p.discount_price);
        
        let priceHtml = (discountPrice > 0) 
            ? `<span style="text-decoration: line-through; color: #888; font-size: 14px; margin-right: 5px;">৳${originalPrice}</span>
               <span style="color: #e74c3c; font-weight: bold;">৳${discountPrice}</span>`
            : `<span style="color: #e74c3c; font-weight: bold;">৳${originalPrice}</span>`;

        html += `
            <a class="featured-item" href="product_details.php?id=${p.id}">
                <div class="featured-img">
                    <img src="${imgPath}" alt="${p.name}" onerror="this.src='../../assets/images/default.png'">
                </div>
                <div class="featured-name">${p.name}</div>
                <div class="featured-price">${priceHtml}</div>
            </a>
        `;
    });

    // Append to existing grid
    grid.insertAdjacentHTML('beforeend', html);
}

// ==========================================
// 4. INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    // 1. Initial Data Fetch
    fetchBanners();
    fetchCategories();
    loadProducts();

    // 2. Slider Controls
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);
    if (nextBtn) nextBtn.addEventListener("click", nextSlide);

    // 3. FIX: Attach "Load More" Button Event
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadProducts);
    }
});