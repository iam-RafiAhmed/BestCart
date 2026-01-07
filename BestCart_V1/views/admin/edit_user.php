<?php
    require_once('layout.php');
    require_once('../../models/userModel.php');

    // Security: Check if ID exists
    if(!isset($_GET['id'])){ header("location: manage_users.php"); exit(); }
    
    $id = $_GET['id'];
    $user = getUserById($id);

    // Handle Update Button
    if(isset($_POST['update_user'])){
        $data = [
            'id' => $id,
            'username' => $_POST['username'],
            'email' => $_POST['email'],
            'role' => $_POST['role']
        ];
        
        if(updateUser($data)){
            echo "<script>window.location.href='manage_users.php';</script>";
        } else {
            echo "<script>alert('Error updating user');</script>";
        }
    }
?>

<div class="header-title">Edit User</div>

<div class="card" style="max-width: 600px; margin: 0 auto;">
    <h3 style="margin-bottom:20px;">Edit Profile: <?= htmlspecialchars($user['username']) ?></h3>
    
    <form method="post" action="../../controllers/adminUserController.php" data-ajax="true">
        <input type="hidden" name="user_id" value="<?= $user['id'] ?>">

        <div class="form-row">
            <div class="input-group">
                <label>Username</label>
                <input type="text" name="username" class="form-control" value="<?= htmlspecialchars($user['username']) ?>" required>
            </div>
            <div class="input-group">
                <label>Email Address</label>
                <input type="email" name="email" class="form-control" value="<?= htmlspecialchars($user['email']) ?>" required>
            </div>
        </div>

        <div class="form-row">
            <div class="input-group">
                <label>Role</label>
                <select name="role" class="form-control">
                    <option value="User" <?= $user['role']=='User'?'selected':'' ?>>User</option>
                    <option value="Admin" <?= $user['role']=='Admin'?'selected':'' ?>>Admin</option>
                </select>
                <small style="color:#64748b; margin-top:5px;">
                    <b>Warning:</b> 'Admin' role gives full access to this dashboard.
                </small>
            </div>
        </div>

        <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button type="submit" name="update_user" class="btn btn-primary" style="flex: 1;">
                <i data-lucide="save"></i> Save Changes
            </button>
            <a href="manage_users.php" class="btn btn-secondary">Cancel</a>
        </div>
    </form>
</div>

<?php require_once('footer.php'); ?>