if (typeof getDB !== 'function') {
    alert("Error: 'db.js' could not be found. \n\nPlease check that your file structure matches exactly:\nBESTCART -> Backend -> db.js");
}

const db = getDB();


if (!db || !db.admin || !db.admin.username) {
    console.log("Admin data missing. Resetting Database...");
    localStorage.removeItem('bestcart_db_v3');
    location.reload(); 
}

function login() {
    console.log("Login button clicked...");

    // Get input values
    const u = document.getElementById('user').value.trim();
    const p = document.getElementById('pass').value.trim();
    const errorMsg = document.getElementById('error');

    
    console.log("Input User:", u);
    console.log("Input Pass:", p);
    console.log("Real User:", db.admin.username);
    console.log("Real Pass:", db.admin.password);

    // Check Credentials
    if (u === db.admin.username && p === db.admin.password) {
        
        console.log("Login Successful!");
        sessionStorage.setItem('is_logged_in', 'true');
        window.location.href = 'dashboard.html';
    } else {
        
        console.log("Login Failed");
        errorMsg.style.display = 'block';
        errorMsg.innerText = "Invalid Username or Password";
    }
}


document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        login();
    }
});