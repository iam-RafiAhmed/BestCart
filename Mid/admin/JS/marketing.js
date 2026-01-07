
if (typeof getDB !== 'function') {
    console.error("Error: db.js not found. Make sure it is linked in the HTML.");
}

let db = getDB();


if (!db.marketing) {
    db.marketing = { sliders: [], popups: [] };
}
if (!db.marketing.sliders) db.marketing.sliders = [];
if (!db.marketing.popups) db.marketing.popups = [];

// RENDER FUNCTIONS
function renderSliders() {
    const list = document.getElementById('slider-list');
    list.innerHTML = '';

    if (db.marketing.sliders.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:gray; padding:10px;">No slides added yet.</p>';
        return;
    }

    db.marketing.sliders.forEach((s, index) => {
        let mediaHtml = s.type === 'video'
            ? '<span style="font-size:30px">🎥</span>'
            : `<img src="${s.src}" class="marketing-thumb">`;

        list.innerHTML += `
            <div class="marketing-item">
                <div style="width:80px; text-align:center;">${mediaHtml}</div>
                <div class="item-info">
                    <h4>${s.text || 'No Text'}</h4>
                    <p>Type: ${s.type}</p>
                </div>
                <button class="btn btn-danger" onclick="deleteSlider(${index})">X</button>
            </div>
        `;
    });
}

function renderPopups() {
    const list = document.getElementById('popup-list');
    list.innerHTML = '';

    if (db.marketing.popups.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:gray; padding:10px;">No popups added yet.</p>';
        return;
    }

    db.marketing.popups.forEach((p, index) => {
        let mediaHtml = p.type === 'video'
            ? '<span style="font-size:30px">🎥</span>'
            : `<img src="${p.src}" class="marketing-thumb">`;

        let badge = p.active
            ? '<span class="badge-active">Active</span>'
            : '<span class="badge-inactive">Inactive</span>';

        list.innerHTML += `
            <div class="marketing-item">
                <div style="width:80px; text-align:center;">${mediaHtml}</div>
                <div class="item-info">
                    <h4>${p.desc || 'No Description'}</h4>
                    <p>${badge} | Type: ${p.type}</p>
                </div>
                <div style="display:flex; gap:5px;">
                    <button class="btn btn-primary" style="padding:5px 8px; font-size:11px;" onclick="togglePopup(${index})">
                        ${p.active ? 'Disable' : 'Enable'}
                    </button>
                    <button class="btn btn-danger" onclick="deletePopup(${index})">X</button>
                </div>
            </div>
        `;
    });
}

// SLIDER ACTIONS
window.addSlider = () => {
    const type = document.getElementById('new-s-type').value;
    const text = document.getElementById('new-s-text').value;
    const fileInput = document.getElementById('new-s-file');

    if (!fileInput.files[0]) {
        alert("Please upload an image or video file.");
        return;
    }

    // Use global readFile from db.js
    readFile(fileInput.files[0], (base64) => {
        const newSlide = {
            id: Date.now(),
            type: type,
            text: text,
            src: base64
        };

        db.marketing.sliders.push(newSlide);
        saveDB(db);
        renderSliders();
        closeModal('slider-modal');

        // Reset Inputs
        document.getElementById('new-s-text').value = '';
        document.getElementById('new-s-file').value = '';
    });
};

window.deleteSlider = (index) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    db.marketing.sliders.splice(index, 1);
    saveDB(db);
    renderSliders();
};

// POPUP ACTIONS 
window.addPopup = () => {
    const type = document.getElementById('new-p-type').value;
    const desc = document.getElementById('new-p-desc').value;
    const active = document.getElementById('new-p-active').checked;
    const fileInput = document.getElementById('new-p-file');

    if (!fileInput.files[0]) {
        alert("Please upload an image or video file.");
        return;
    }

    readFile(fileInput.files[0], (base64) => {
        const newPopup = {
            id: Date.now(),
            type: type,
            desc: desc,
            active: active,
            src: base64
        };

        db.marketing.popups.push(newPopup);
        saveDB(db);
        renderPopups();
        closeModal('popup-modal');

        // Reset Inputs
        document.getElementById('new-p-desc').value = '';
        document.getElementById('new-p-file').value = '';
    });
};

window.deletePopup = (index) => {
    if (!confirm("Are you sure you want to delete this popup?")) return;
    db.marketing.popups.splice(index, 1);
    saveDB(db);
    renderPopups();
};

window.togglePopup = (index) => {
    // Toggle the active state
    db.marketing.popups[index].active = !db.marketing.popups[index].active;
    saveDB(db);
    renderPopups();
};

// MODAL UTILITIES 
window.openSliderModal = () => document.getElementById('slider-modal').style.display = 'block';
window.openPopupModal = () => document.getElementById('popup-modal').style.display = 'block';
window.closeModal = (id) => document.getElementById(id).style.display = 'none';

// INITIALIZATION
// Load lists when page opens
renderSliders();
renderPopups();