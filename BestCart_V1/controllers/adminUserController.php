<?php
require_once('helpers.php');
requireAdmin();

require_once('../models/userModel.php');

// ADD USER
if (isset($_POST['add_user_btn'])) {
    $data = [
        'username' => $_POST['username'] ?? '',
        'email' => $_POST['email'] ?? '',
        'password' => $_POST['password'] ?? '',
        'role' => $_POST['role'] ?? 'customer'
    ];

    $ok = addUser($data['username'], $data['email'], $data['password'], $data['role']);

    if (isAjax()) {
        if ($ok) jsonOut(true, "User added");
        jsonOut(false, "Failed to add user");
    } else {
        header("Location: ../views/admin/manage_users.php");
        exit;
    }
}

// UPDATE USER
if (isset($_POST['update_user'])) {
    $id = (int)($_POST['user_id'] ?? 0);
    $data = [
        'id' => $id,
        'username' => $_POST['username'] ?? '',
        'email' => $_POST['email'] ?? '',
        'role' => $_POST['role'] ?? 'customer'
    ];

    $ok = updateUser($data);

    if (isAjax()) {
        if ($ok) jsonOut(true, "User updated");
        jsonOut(false, "Failed to update user");
    } else {
        header("Location: ../views/admin/manage_users.php");
        exit;
    }
}

// DELETE USER
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $ok = deleteUser($id);

    if (isAjax()) {
        if ($ok) jsonOut(true, "User deleted", ['id'=>$id]);
        jsonOut(false, "Failed to delete user");
    } else {
        header("Location: ../views/admin/manage_users.php");
        exit;
    }
}

if (isAjax()) jsonOut(false, "Invalid request");
header("Location: ../views/admin/manage_users.php");
exit;
?>
