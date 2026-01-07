const db = getDB();

let currentSlide = 0;
const sliders = db.marketing && db.marketing.sliders ? db.marketing.sliders : [];

function renderSlider() {
    const wrapper = document.getElementById('slider-media-wrapper');
    const textDiv = document.getElementById('slider-text');

    // Case 1: No sliders added
    if (sliders.length === 0) {
        wrapper.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:gray;background:#eee;"><h3>No Banners Available</h3></div>';
        if (textDiv) textDiv.style.display = 'none';
        return;
    }

    // Case 2: Render current slide
    const slide = sliders[currentSlide];

    // Handle Media Type
    if (slide.type === 'video') {
        wrapper.innerHTML = `<video src="${slide.src}" autoplay muted loop style="width:100%; height:100%; object-fit:cover;"></video>`;
    } else {
        wrapper.innerHTML = `<img src="${slide.src}" alt="Banner" style="width:100%; height:100%; object-fit:cover;">`;
    }

    // Handle Text
    if (textDiv) {
        if (slide.text) {
            textDiv.style.display = 'block';
            textDiv.innerText = slide.text;
        } else {
            textDiv.style.display = 'none';
        }
    }
}

function nextSlide() {
    if (sliders.length === 0) return;
    currentSlide = (currentSlide + 1) % sliders.length;
    renderSlider();
}

function prevSlide() {
    if (sliders.length === 0) return;
    currentSlide = (currentSlide - 1 + sliders.length) % sliders.length;
    renderSlider();
}

// PRODUCT & CATEGORY LOGIC

function loadCategories() {
    // 1. Get Categories from the Central List (Admin managed)
    const categories = db.categories || [];

    const dropList = document.getElementById('dropdown-list'); // Header Dropdown
    const gridDiv = document.getElementById('category-grid');   // Homepage Grid

    let dropHTML = '';
    let gridHTML = '';

    if (categories.length === 0) {
        if (gridDiv) gridDiv.innerHTML = '<p style="text-align:center; width:100%;">No categories found.</p>';
        return;
    }

    categories.forEach(cat => {
        // Build Dropdown Link
        if (dropList) {
            dropHTML += `<a href="#" onclick="filterByCategory('${cat}')">${cat}</a>`;
        }

        // Build Grid Card
        if (gridDiv) {
            gridHTML += `
                <div class="category-card" onclick="filterByCategory('${cat}')">
                    ${cat}
                </div>
            `;
        }
    });

    if (dropList) dropList.innerHTML = dropHTML;
    if (gridDiv) gridDiv.innerHTML = gridHTML;
}

function renderProducts(productList) {
    const grid = document.getElementById('product-grid');
    if (!grid) return; // Guard clause if element missing

    grid.innerHTML = '';

    if (!productList || productList.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">No products found.</p>';
        return;
    }

    productList.forEach(p => {
        const imgSrc = p.image || 'https://via.placeholder.com/200';

        grid.innerHTML += `
            <div class="product-card">
                <div class="product-img">
                    <img src="${imgSrc}" alt="${p.name}">
                </div>
                <div class="product-name" title="${p.name}">${p.name}</div>
                <div class="product-price">৳ ${p.price}</div>
                <button class="add-btn" onclick="addToCart('${p.name}')">Add to Cart</button>
            </div>
        `;
    });
}

// SEARCH & FILTER

window.searchProducts = () => {
    const input = document.getElementById('search-input');
    if (!input) return;

    const query = input.value.toLowerCase();
    const filtered = db.products.filter(p => p.name.toLowerCase().includes(query));
    renderProducts(filtered);

    // Scroll to products
    const section = document.querySelector('.featured-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
};

window.filterByCategory = (category) => {
    const filtered = db.products.filter(p => p.category === category);
    renderProducts(filtered);

    const section = document.querySelector('.featured-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
};

window.addToCart = (name) => {
    alert(name + " added to cart!");
    // Logic to update cart count could go here
    const countSpan = document.getElementById('cart-count');
    if (countSpan) {
        let current = parseInt(countSpan.innerText);
        countSpan.innerText = current + 1;
    }
};

//  POPUP LOGIC 
function checkPopup() {
    const popups = db.marketing && db.marketing.popups ? db.marketing.popups : [];

    // Find the FIRST popup that is marked "Active"
    const activePop = popups.find(p => p.active === true);

    if (activePop) {
        const modal = document.getElementById('promo-popup');
        const mediaDiv = document.getElementById('popup-media');
        const desc = document.getElementById('popup-desc');

        if (modal && mediaDiv && desc) {
            // Render Media
            if (activePop.type === 'video') {
                mediaDiv.innerHTML = `<video src="${activePop.src}" autoplay muted loop style="width:100%; max-height:300px; object-fit:contain;"></video>`;
            } else {
                mediaDiv.innerHTML = `<img src="${activePop.src}" style="width:100%; max-height:300px; object-fit:contain;">`;
            }

            // Render Text
            desc.innerText = activePop.desc || '';

            // Show Modal
            modal.style.display = 'flex';
        }
    }
}

window.closePopup = () => {
    const modal = document.getElementById('promo-popup');
    if (modal) modal.style.display = 'none';
};

// INITIALIZATION 
window.onload = function () {
    console.log("Frontend Loaded. DB Version:", db); // Debug check
    renderSlider();
    loadCategories();
    renderProducts(db.products);

    // Delay popup by 1 second for better UX
    setTimeout(checkPopup, 1000);
};