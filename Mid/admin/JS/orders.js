let db = getDB();
let curId = null;
let newOrderItems = []; // Temp cart for creating order

function render() {
    const tb = document.querySelector('#order-table tbody');
    tb.innerHTML = '';
    // Reverse to show newest first
    db.orders.slice().reverse().forEach(o => {
        tb.innerHTML += `<tr>
            <td>${o.id}</td><td>${o.customer}</td><td>${o.status}</td><td>${o.total} Tk</td>
            <td>
                <button class="btn btn-edit" onclick="openEdit(${o.id})">Edit</button>
                <button class="btn btn-danger" onclick="delOrder(${o.id})">Delete</button>
            </td>
        </tr>`;
    });
}

// EDIT LOGIC
window.openEdit = (id) => {
    curId = id;
    const o = db.orders.find(x => x.id === id);
    document.getElementById('m-cust').value = o.customer;
    document.getElementById('m-status').value = o.status;
    document.getElementById('modal').style.display = 'block';
    renderItems(o);
    populateSelect('add-prod-select');
};

function populateSelect(id) {
    const sel = document.getElementById(id);
    sel.innerHTML = '';
    db.products.forEach(p => {
        sel.innerHTML += `<option value="${p.id}">${p.name} (${p.price} Tk)</option>`;
    });
}

function renderItems(order) {
    const ul = document.getElementById('m-items');
    ul.innerHTML = '';
    order.items.forEach((item, idx) => {
        const p = db.products.find(x => x.id == item.pid);
        const name = p ? p.name : 'Unknown';
        ul.innerHTML += `<li>${name} (x${item.qty}) <button onclick="remItem(${idx})" style="color:red; border:none; background:none; cursor:pointer;">X</button></li>`;
    });
}

window.addItem = () => {
    const pid = document.getElementById('add-prod-select').value;
    const o = db.orders.find(x => x.id === curId);
    o.items.push({ pid: pid, qty: 1 });
    renderItems(o);
};

window.remItem = (idx) => {
    const o = db.orders.find(x => x.id === curId);
    o.items.splice(idx, 1);
    renderItems(o);
};

window.saveEdit = () => {
    const o = db.orders.find(x => x.id === curId);
    o.customer = document.getElementById('m-cust').value;
    o.status = document.getElementById('m-status').value;
    
    let total = 0;
    o.items.forEach(i => {
        const p = db.products.find(x => x.id == i.pid);
        if(p) total += (p.price * i.qty);
    });
    o.total = total;
    saveDB(db);
    document.getElementById('modal').style.display = 'none';
    render();
};

window.closeModal = () => document.getElementById('modal').style.display = 'none';
window.delOrder = (id) => {
    if(confirm('Delete Order?')) {
        db.orders = db.orders.filter(o => o.id !== id);
        saveDB(db);
        render();
    }
};

//CREATE ORDER
window.openCreateModal = () => {
    newOrderItems = []; // Reset temp cart
    document.getElementById('new-cust-name').value = '';
    document.getElementById('create-modal').style.display = 'block';
    populateSelect('new-prod-select');
    renderNewCart();
};

window.addToNewCart = () => {
    const pid = document.getElementById('new-prod-select').value;
    const qty = parseInt(document.getElementById('new-prod-qty').value);
    
    if(!pid || qty < 1) return;

    // Check if already in list
    const existing = newOrderItems.find(i => i.pid == pid);
    if(existing) {
        existing.qty += qty;
    } else {
        newOrderItems.push({ pid: pid, qty: qty });
    }
    renderNewCart();
};

function renderNewCart() {
    const ul = document.getElementById('new-order-list');
    const totalSpan = document.getElementById('new-order-total');
    ul.innerHTML = '';
    let total = 0;

    if(newOrderItems.length === 0) {
        ul.innerHTML = '<li style="color:gray">No items yet</li>';
        totalSpan.innerText = '0';
        return;
    }

    newOrderItems.forEach((item, idx) => {
        const p = db.products.find(x => x.id == item.pid);
        const name = p ? p.name : 'Unknown';
        const itemTotal = p ? (p.price * item.qty) : 0;
        total += itemTotal;

        ul.innerHTML += `
            <li style="display:flex; justify-content:space-between; border-bottom:1px solid #eee; padding:5px;">
                <span>${name} x ${item.qty}</span>
                <span>${itemTotal} Tk <button onclick="remNewItem(${idx})" style="color:red;margin-left:5px;cursor:pointer;">X</button></span>
            </li>`;
    });
    totalSpan.innerText = total;
}

window.remNewItem = (idx) => {
    newOrderItems.splice(idx, 1);
    renderNewCart();
};

window.placeAdminOrder = () => {
    const cust = document.getElementById('new-cust-name').value;
    if(!cust || newOrderItems.length === 0) {
        alert("Please enter Customer Name and add at least one product.");
        return;
    }

    let total = 0;
    newOrderItems.forEach(i => {
        const p = db.products.find(x => x.id == i.pid);
        if(p) total += (p.price * i.qty);
    });

    const newOrder = {
        id: Date.now(),
        customer: cust,
        total: total,
        status: 'Pending',
        items: newOrderItems
    };

    db.orders.push(newOrder);
    saveDB(db);
    
    alert("Order Placed Successfully!");
    document.getElementById('create-modal').style.display = 'none';
    render();
};

window.closeCreateModal = () => document.getElementById('create-modal').style.display = 'none';

render();