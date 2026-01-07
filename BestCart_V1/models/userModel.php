<?php
    require_once('db.php');

    function getAllUser(){
        $con = getConnection();
        $result = mysqli_query($con, "SELECT * FROM users ORDER BY id DESC");
        $data = [];
        while($row = mysqli_fetch_assoc($result)) $data[] = $row;
        return $data;
    }

    function getUserById($id){
        $con = getConnection();
        $id = mysqli_real_escape_string($con, $id);
        $result = mysqli_query($con, "SELECT * FROM users WHERE id=$id");
        return mysqli_fetch_assoc($result);
    }

    // --- NEW: Add User Function ---
    function addUser($username, $email, $password, $role) {
        $con = getConnection();
        $username = mysqli_real_escape_string($con, $username);
        $email = mysqli_real_escape_string($con, $email);
        $role = mysqli_real_escape_string($con, $role);
        
        // Securely hash the password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO users (username, email, password, role) VALUES ('$username', '$email', '$hashed_password', '$role')";
        return mysqli_query($con, $sql);
    }

    function updateUser($u){
        $con = getConnection();
        $id = mysqli_real_escape_string($con, $u['id']);
        $username = mysqli_real_escape_string($con, $u['username']);
        $email = mysqli_real_escape_string($con, $u['email']);
        $role = mysqli_real_escape_string($con, $u['role']); 

        $sql = "UPDATE users SET username='$username', email='$email', role='$role' WHERE id=$id";
        return mysqli_query($con, $sql);
    }

    function deleteUser($id){
        $con = getConnection();
        return mysqli_query($con, "DELETE FROM users WHERE id=$id");
    }
?>