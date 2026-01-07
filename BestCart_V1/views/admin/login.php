<?php
    session_start();
    require_once('../../models/userModel.php');

    if(isset($_GET['logout'])){ session_destroy(); header("location: login.php"); }

    if(isset($_POST['submit'])){
        $username = $_POST['username'];
        $password = $_POST['password'];
        if($username == "admin" && $password == "password"){
            $_SESSION['admin_status'] = true;
            header('location: dashboard.php');
        } else {
            $error = "Invalid Credentials";
        }
    }
?>
<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
    <style>
        body { background: #0f172a; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; }
        .login-box { background: white; padding: 40px; border-radius: 10px; width: 350px; }
        input { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; }
        button { width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
    </style>
<script src="../../assets/js/ajax.js?v=<?php echo time(); ?>"></script>
</head>
<body>
    <div class="login-box">
        <h2 style="text-align:center; color:#333;">Admin Login</h2>
        <form method="post" action="../../controllers/adminAuthController.php" data-ajax="true">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit" name="submit">Sign In</button>
        </form>
        <?php if(isset($error)) echo "<p style='color:red; text-align:center'>$error</p>"; ?>
    </div>
</body>
</html>