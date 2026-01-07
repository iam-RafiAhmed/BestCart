<?php
require_once('helpers.php');

// LOGIN
if (isset($_POST['submit'])) {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    // demo admin creds (same as your old code)
    if ($username === "admin" && $password === "password") {
        $_SESSION['admin_status'] = true;

        if (isAjax()) {
            jsonOut(true, "Login successful", ['redirect'=>'dashboard.php']);
            exit;
        }
        header("Location: ../views/admin/dashboard.php");
        exit;
    }

    if (isAjax()) {
        jsonOut(false, "Invalid Credentials");
        exit;
    }
    header("Location: ../views/admin/login.php?err=1");
    exit;
}

// LOGOUT
if (isset($_GET['logout'])) {
    session_destroy();
    if (isAjax()) {
        jsonOut(true, "Logged out", ['redirect'=>'login.php']);
        exit;
    }
    header("Location: ../views/admin/login.php");
    exit;
}

if (isAjax()) {
    jsonOut(false, "Invalid request");
    exit;
}
header("Location: ../views/admin/login.php");
exit;
?>
