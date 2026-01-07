let db = getDB();
function render() {
    const tb = document.querySelector('tbody');
    tb.innerHTML = '';
    db.customers.forEach(c => {
        tb.innerHTML += `<tr>
            <td contenteditable="true" onblur="upd(${c.id}, 'name', this.innerText)">${c.name}</td>
            <td contenteditable="true" onblur="upd(${c.id}, 'email', this.innerText)">${c.email}</td>
            <td contenteditable="true" onblur="upd(${c.id}, 'phone', this.innerText)">${c.phone}</td>
            <td><button class="btn btn-danger" onclick="del(${c.id})">Delete</button></td>
        </tr>`;
    });
}
window.addCust = () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    db.customers.push({ id: Date.now(), name, email, phone });
    saveDB(db);
    render();
};
window.upd = (id, field, val) => {
    const c = db.customers.find(x => x.id === id);
    if (c) { c[field] = val; saveDB(db); }
};
window.del = (id) => {
    db.customers = db.customers.filter(c => c.id !== id);
    saveDB(db);
    render();
};
render();