let cartItems = [
    { id: 1, title: "Pink Hoodie", price: 1200, qty: 1, img: "hoodie.png" },
    { id: 2, title: "Cute Bag", price: 850, qty: 2, img: "cutebag.png" }
];

function renderCart() {
    const cart = document.getElementById("cart");
    cart.innerHTML = "";
    let total = 0;

    cartItems.forEach(item => {
        total += item.price * item.qty;

        cart.innerHTML += `
            <div class="cart-item">
                <div class="item-info">
                    <img src="${item.img}">
                    <div>
                        <div class="item-title">${item.title}</div>
                        <div>৳${item.price}</div>
                    </div>
                </div>
                <div>
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                    <span> ${item.qty} </span>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
            </div>
        `;
    });

    document.getElementById("totalPrice").innerText = `Total: ৳${total}`;
}

function updateQty(id, change) {
    cartItems = cartItems.map(item => {
        if (item.id === id) { item.qty = Math.max(1, item.qty + change); }
        return item;
    });
    renderCart();
}

function removeItem(id) {
    cartItems = cartItems.filter(item => item.id !== id);
    renderCart();
}

renderCart();
