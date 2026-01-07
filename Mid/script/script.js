// banner images
const bannerImages = [
  "images/banner1.jpeg",
  "images/banner2.jpeg",
  "images/banner3.jpeg",
  "images/banner4.jpeg",
  "images/banner5.jpeg"
];

// categories (2 rows = 14)
const categoryData = [
  { name: "Men's Fashion", img: "images/men.webp", url: "#" },
  { name: "Computer & Gaming", img: "images/computer.webp", url: "#" },
  { name: "Home & Living", img: "images/home.webp", url: "#" },
  { name: "Groceries & Pet Supplies", img: "images/groceries.webp", url: "#" },
  { name: "Health & Beauty", img: "images/beauty.webp", url: "#" },
  { name: "Women's Fashion", img: "images/women.webp", url: "#" },
  { name: "TV & Home Appliances", img: "images/tv.webp", url: "#" },
  { name: "Lifestyle & Hobbies", img: "images/hobbies.webp", url: "#" },
  { name: "Electronic Accessories", img: "images/accessories.webp", url: "#" },
  { name: "Watches & Bags", img: "images/watches.webp", url: "#" },
  { name: "Sports & Outdoors", img: "images/sports.webp", url: "#" },
  { name: "Mother & Baby", img: "images/baby.webp", url: "#" },
  { name: "Automotives & Motorbikes", img: "images/auto.webp", url: "#" },
  { name: "Phones & Accessories", img: "images/phones.webp", url: "#" }
];

// Dropdown categories
function renderDropdownCategories() {
  const list = document.getElementById("category_list");
  if (!list) return;

  list.innerHTML = "";
  categoryData.forEach(cat => {
    const div = document.createElement("div");
    div.className = "main-category";
    div.innerHTML = `<a href="${cat.url}">${cat.name}</a>`;
    list.appendChild(div);
  });
}

// Category grid
function renderCategoryGrid() {
  const grid = document.getElementById("category-grid");
  if (!grid) return;

  grid.innerHTML = "";
  categoryData.forEach(cat => {
    const card = document.createElement("a");
    card.href = cat.url;
    card.className = "category-item";
    card.innerHTML = `
      <div class="category-circle">
        <img src="${cat.img}" alt="${cat.name}">
      </div>
      <div class="category-label">${cat.name}</div>
    `;
    grid.appendChild(card);
  });
}

// Featured products
function renderFeaturedProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid || !window.productData) return;

  grid.innerHTML = "";
  Object.keys(window.productData).forEach(id => {
    const p = window.productData[id];
    const card = document.createElement("a");
    card.href = `product.html?id=${encodeURIComponent(id)}`;
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-img">
        <img src="${p.images?.[0] || ""}" alt="${p.name || ""}">
      </div>
      <div class="product-name">${p.name || ""}</div>
      <div class="product-price">${p.price || ""}</div>
    `;
    grid.appendChild(card);
  });
}

// Slider
let currentSlide = 0;
let sliderInterval = null;

function showSlide(index) {
  const slider = document.getElementById("slider");
  if (!slider) return;
  currentSlide = (index + bannerImages.length) % bannerImages.length;
  slider.src = bannerImages[currentSlide];
}

function nextSlide() { showSlide(currentSlide + 1); }
function prevSlide() { showSlide(currentSlide - 1); }

function startAutoSlide() { sliderInterval = setInterval(nextSlide, 4000); }
function resetAutoSlide() { clearInterval(sliderInterval); startAutoSlide(); }

// Init
document.addEventListener("DOMContentLoaded", () => {
  showSlide(0);
  startAutoSlide();

  document.getElementById("nextBtn")?.addEventListener("click", () => {
    nextSlide(); resetAutoSlide();
  });

  document.getElementById("prevBtn")?.addEventListener("click", () => {
    prevSlide(); resetAutoSlide();
  });

  renderDropdownCategories();
  renderCategoryGrid();
  renderFeaturedProducts();
});
