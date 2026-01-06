function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function initializeTabs() {
  const buttons = document.querySelectorAll(".product-tabs .tab-button");
  const sections = document.querySelectorAll("#tab-content .tab-content-section");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;

      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      sections.forEach(sec => {
        sec.style.display = (sec.dataset.tab === target) ? "block" : "none";
      });
    });
  });
}

function initializeQuantity() {
  const qtyInput = document.getElementById("product-qty");
  const minus = document.getElementById("qty-minus");
  const plus = document.getElementById("qty-plus");

  if (!qtyInput || !minus || !plus) return;

  minus.addEventListener("click", () => {
    qtyInput.value = Math.max(1, Number(qtyInput.value || 1) - 1);
  });

  plus.addEventListener("click", () => {
    qtyInput.value = Number(qtyInput.value || 1) + 1;
  });
}

function renderProductPage(productId) {
  const product = window.productData?.[productId];
  const detailArea = document.getElementById("product-details-area");
  const tabContent = document.getElementById("tab-content");

  if (!detailArea || !tabContent) return;

  if (!product) {
    detailArea.innerHTML = "<h2>Product not found.</h2>";
    return;
  }

  document.getElementById("page-title").textContent = product.name;
  document.getElementById("current-category").textContent = product.category || "";
  document.getElementById("current-product-name").textContent = product.name || "";

  const images = Array.isArray(product.images) ? product.images : [];
  const details = Array.isArray(product.details) ? product.details : [];
  const specs = Array.isArray(product.specs) ? product.specs : [];
  const colors = Array.isArray(product.color) ? product.color : [];

  detailArea.innerHTML = `
    <div class="product-main-flex">
      <div class="product-image-gallery">
        <div class="main-image">
          <img id="main-product-img" src="${images[0] || ""}" alt="${product.name || ""}">
        </div>
        <div class="thumbnail-images">
          ${images.map(img => `<img class="thumb" src="${img}" data-img="${img}" alt="">`).join("")}
        </div>
      </div>

      <div class="product-info">
        <h1>${product.name || ""}</h1>
        <div class="pricing"><span class="current-price">${product.price || ""}</span></div>

        <div class="delivery-details">
          <p>Delivery: ${product.delivery || "N/A"}</p>
          <p>Warranty: ${product.warranty || "None"}</p>
        </div>

        <div class="product-options">
          <label>Color:</label>
          <select ${colors.length ? "" : "disabled"}>
            ${colors.length ? colors.map(c => `<option>${c}</option>`).join("") : "<option>N/A</option>"}
          </select>
        </div>

        <div class="buy-actions">
          <div class="quantity-selector">
            <button id="qty-minus" type="button">-</button>
            <input type="number" value="1" id="product-qty" min="1">
            <button id="qty-plus" type="button">+</button>
          </div>
          <button class="btn btn-buy" type="button">Buy Now</button>
          <button class="btn btn-cart" type="button">Add to Cart</button>
        </div>
      </div>
    </div>
  `;

  detailArea.querySelectorAll(".thumb").forEach(t => {
    t.addEventListener("click", () => {
      document.getElementById("main-product-img").src = t.dataset.img;
    });
  });

  tabContent.innerHTML = `
    <div class="tab-content-section" data-tab="details" style="display:block;">
      <ul>${details.length ? details.map(d => `<li>${d}</li>`).join("") : "<li>No details available</li>"}</ul>
    </div>
    <div class="tab-content-section" data-tab="specs" style="display:none;">
      <ul>${specs.length ? specs.map(s => `<li>${s}</li>`).join("") : "<li>No specifications available</li>"}</ul>
    </div>
  `;

  initializeTabs();
  initializeQuantity();
}

document.addEventListener("DOMContentLoaded", () => {
  const productId = getProductIdFromUrl();
  renderProductPage(productId);
});
