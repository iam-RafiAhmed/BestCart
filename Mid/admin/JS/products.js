let db = getDB();


// Toggle Add Form Image Input
document.getElementById('img-type').addEventListener('change', function () {
    if (this.value === 'file') {
        document.getElementById('p-file').style.display = 'inline-block';
        document.getElementById('p-url').style.display = 'none';
    } else {
        document.getElementById('p-file').style.display = 'none';
        document.getElementById('p-url').style.display = 'inline-block';
    }
});

// Load everything on start
populateDropdowns();
render();

// CATEGORY LOGIC

function populateDropdowns() {
    const cats = db.categories || [];
    const pSelect = document.getElementById('p-cat');
    const eSelect = document.getElementById('e-cat');

    // Generate Options HTML
    let opts = '<option value="" disabled selected>Select Category</option>';
    cats.forEach(c => {
        opts += `<option value="${c}">${c}</option>`;
    });

    pSelect.innerHTML = opts;
    eSelect.innerHTML = opts;
}

function renderCategoryList() {
    const list = document.getElementById('cat-list');
    list.innerHTML = '';

    db.categories.forEach((c, index) => {
        list.innerHTML += `
            <li style="display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid #f0f0f0;">
                <span>${c}</span>
                <button onclick="deleteCategory(${index})" style="color:red; border:none; background:none; cursor:pointer;">X</button>
            </li>
        `;
    });
}

window.addNewCategory = () => {
    const input = document.getElementById('new-cat-input');
    const val = input.value.trim();
    if (!val) return alert("Enter category name");

    if (!db.categories) db.categories = [];

    // Prevent duplicates
    if (db.categories.includes(val)) return alert("Category already exists");

    db.categories.push(val);
    saveDB(db);
    input.value = '';

    renderCategoryList();
    populateDropdowns(); // Update the dropdowns immediately
};

window.deleteCategory = (index) => {
    if (!confirm("Delete this category?")) return;
    db.categories.splice(index, 1);
    saveDB(db);
    renderCategoryList();
    populateDropdowns();
};

window.openCatModal = () => {
    document.getElementById('cat-modal').style.display = 'block';
    renderCategoryList();
};
window.closeCatModal = () => document.getElementById('cat-modal').style.display = 'none';


// PRODUCT LOGIC

function render() {
    const tb = document.querySelector('tbody');
    tb.innerHTML = '';

    if (!db.products || db.products.length === 0) {
        tb.innerHTML = '<tr><td colspan="6" style="text-align:center;">No Products Found</td></tr>';
        return;
    }

    db.products.forEach(p => {
        const cat = p.category ? p.category : '-';
        tb.innerHTML += `<tr>
            <td><img src="${p.image}" class="thumb"></td>
            <td>${p.name}</td>
            <td><span style="background:#eef; padding:4px 8px; border-radius:4px; font-size:0.9em;">${cat}</span></td>
            <td>${p.price} Tk</td>
            <td>${p.stock}</td>
            <td>
                <button class="btn btn-edit" onclick="openEdit(${p.id})">Edit</button>
                <button class="btn btn-danger" onclick="del(${p.id})">Delete</button>
            </td>
        </tr>`;
    });
}

// ADD PRODUCT
window.addProd = () => {
    const name = document.getElementById('p-name').value;
    const cat = document.getElementById('p-cat').value;
    const price = document.getElementById('p-price').value;
    const stock = document.getElementById('p-stock').value;
    const type = document.getElementById('img-type').value;

    if (!name || !price || !cat) { alert("Please fill Name, Category, and Price."); return; }

    const save = (img) => {
        db.products.push({
            id: Date.now(), name, category: cat, price, stock, image: img, type: 'image'
        });
        saveDB(db);
        render();
        // Clear fields
        document.getElementById('p-name').value = '';
        document.getElementById('p-price').value = '';
        document.getElementById('p-stock').value = '';
    };

    if (type === 'file') {
        const f = document.getElementById('p-file');
        if (f.files[0]) readFile(f.files[0], save);
        else alert("Select an image");
    } else {
        save(document.getElementById('p-url').value);
    }
};

// EDIT SYSTEM
window.openEdit = (id) => {
    const p = db.products.find(x => x.id === id);
    if (!p) return;

    document.getElementById('e-id').value = p.id;
    document.getElementById('e-name').value = p.name;
    document.getElementById('e-cat').value = p.category; // Auto-selects if category exists in list
    document.getElementById('e-price').value = p.price;
    document.getElementById('e-stock').value = p.stock;

    // Reset Image Select
    document.getElementById('e-img-type').value = 'keep';
    toggleEditImg();

    document.getElementById('edit-modal').style.display = 'block';
};

window.toggleEditImg = () => {
    const type = document.getElementById('e-img-type').value;
    document.getElementById('e-url').style.display = type === 'url' ? 'block' : 'none';
    document.getElementById('e-file').style.display = type === 'file' ? 'block' : 'none';
};

window.saveEdit = () => {
    const id = Number(document.getElementById('e-id').value);
    const name = document.getElementById('e-name').value;
    const cat = document.getElementById('e-cat').value;
    const price = document.getElementById('e-price').value;
    const stock = document.getElementById('e-stock').value;
    const imgType = document.getElementById('e-img-type').value;

    const pIndex = db.products.findIndex(x => x.id === id);
    if (pIndex === -1) return;

    const finalizeUpdate = (newImg) => {
        db.products[pIndex] = {
            ...db.products[pIndex],
            name: name, category: cat, price: price, stock: stock,
            image: newImg || db.products[pIndex].image
        };
        saveDB(db);
        document.getElementById('edit-modal').style.display = 'none';
        render();
    };

    if (imgType === 'file') {
        const f = document.getElementById('e-file');
        if (f.files[0]) readFile(f.files[0], finalizeUpdate);
        else finalizeUpdate(null);
    } else if (imgType === 'url') {
        finalizeUpdate(document.getElementById('e-url').value);
    } else {
        finalizeUpdate(null);
    }
};

window.closeEdit = () => {
    document.getElementById('edit-modal').style.display = 'none';
};

window.del = (id) => {
    if (confirm("Delete product?")) {
        db.products = db.products.filter(p => p.id !== id);
        saveDB(db);
        render();
    }
};