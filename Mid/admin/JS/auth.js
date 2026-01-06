if (!sessionStorage.getItem('is_logged_in')) {
    window.location.href = 'login.html';
}

function logout() {
    sessionStorage.removeItem('is_logged_in');
    window.location.href = 'login.html';
}