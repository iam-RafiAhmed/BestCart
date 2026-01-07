const DB_KEY = 'bestcart_db_v3'; 

const initialData = {
    
    categories: [],

    products: [
        
    ],
    orders: [],
    customers: [
        
    ],
    admin: { username: 'admin', password: '123' },
    marketing: {
        sliders: [
            
        ],
        popups: [

        ],
            
    }
};

function getDB() {
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
        localStorage.setItem(DB_KEY, JSON.stringify(initialData));
        return initialData;
    }
    const parsed = JSON.parse(data);
   
    if(!parsed.categories) parsed.categories = initialData.categories;
    return parsed;
}

function saveDB(data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
}

function readFile(file, callback) {
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (e) => callback(e.target.result);
    reader.readAsDataURL(file);
}