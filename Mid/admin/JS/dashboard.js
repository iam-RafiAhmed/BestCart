const db = getDB();
document.getElementById('total-cust').innerText = db.customers.length;
document.getElementById('total-prod').innerText = db.products.length;
document.getElementById('total-ord').innerText = db.orders.length;

// Pending Orders
const pTable = document.querySelector('#pending-table tbody');
db.orders.filter(o => o.status === 'Pending').forEach(o => {
    pTable.innerHTML += `<tr><td>${o.id}</td><td>${o.customer}</td><td>${o.total} Tk</td><td style="color:orange">${o.status}</td></tr>`;
});

// Stock & Search
const sTable = document.querySelector('#stock-table tbody');
function renderStock() {
    sTable.innerHTML = '';
    const q = document.getElementById('search').value.toLowerCase();
    db.products.filter(p => p.name.toLowerCase().includes(q)).forEach(p => {
        const status = p.stock < 5 ? '<span style="color:red">Low Stock</span>' : 'OK';
        sTable.innerHTML += `<tr><td>${p.name}</td><td>${p.stock}</td><td>${status}</td></tr>`;
    });
}
renderStock();