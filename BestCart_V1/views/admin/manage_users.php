<?php
    session_start();
    if (!isset($_SESSION['admin_status'])) {
        header('location: login.php');
        exit();
    }

    require_once('layout.php');
    require_once('../../models/userModel.php');

    // --- HANDLE ADD USER ---
    if(isset($_POST['add_user_btn'])){
        $username = $_POST['username'];
        $email = $_POST['email'];
        $password = $_POST['password'];
        $role = $_POST['role'];

        // Simple validation
        if(!empty($username) && !empty($email) && !empty($password)){
            if(addUser($username, $email, $password, $role)){
                echo "<script>alert('User Added Successfully!'); window.location.href='manage_users.php';</script>";
            } else {
                echo "<script>alert('Error: Email might already exist.');</script>";
            }
        }
    }

    // --- HANDLE DELETE ---
    if(isset($_GET['delete'])){
        deleteUser($_GET['delete']);
        echo "<script>window.location.href='manage_users.php';</script>";
    }

    $users = getAllUser();
?>

<div class="header-title">Manage Users</div>

<div class="card">
    <h3 style="margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">Add New User</h3>
    <form method="post" action="../../controllers/adminUserController.php" data-ajax="true" data-reset="true">
        <div class="form-row">
            <div class="input-group">
                <label>Username</label>
                <input type="text" name="username" class="form-control" placeholder="e.g. John Doe" required>
            </div>
            <div class="input-group">
                <label>Email Address</label>
                <input type="email" name="email" class="form-control" placeholder="user@example.com" required>
            </div>
        </div>
        <div class="form-row">
            <div class="input-group">
                <label>Password</label>
                <input type="password" name="password" class="form-control" placeholder="******" required>
            </div>
            <div class="input-group">
                <label>Role</label>
                <select name="role" class="form-control">
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                </select>
            </div>
        </div>
        <button type="submit" name="add_user_btn" class="btn btn-primary">
            <i data-lucide="user-plus"></i> Create User
        </button>
    </form>
</div>

<div class="card" style="padding:0; overflow:hidden; margin-top:20px;">
    
    <div style="padding:15px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
        <h4 style="margin:0;">User List</h4>
        
        <div style="position:relative;">
            <i data-lucide="search" style="position:absolute; left:10px; top:10px; width:18px; color:#94a3b8;"></i>
            <input type="text" id="userSearchInput" class="form-control" placeholder="Search Name or Email..." onkeyup="filterUsers()" style="width:300px; padding-left:35px;">
        </div>
    </div>

    <table id="usersTable">
        <thead>
            <tr id="row-<?= $u['id'] ?>">
                <th>ID</th>
                <th>User Profile</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach($users as $u){ ?>
            <tr>
                <td>#<?= $u['id'] ?></td>
                <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div style="width:32px; height:32px; background:#e2e8f0; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; color:#64748b;">
                            <?= strtoupper(substr($u['username'], 0, 1)) ?>
                        </div>
                        <b><?= htmlspecialchars($u['username']) ?></b>
                    </div>
                </td>
                <td><?= htmlspecialchars($u['email']) ?></td>
                <td>
                    <?php if($u['role'] == 'Admin'){ ?>
                        <span style="background:#dbeafe; color:#1e40af; padding:2px 8px; border-radius:4px; font-size:0.8rem; font-weight:bold;">Admin</span>
                    <?php } else { ?>
                        <span style="background:#f1f5f9; color:#475569; padding:2px 8px; border-radius:4px; font-size:0.8rem;">User</span>
                    <?php } ?>
                </td>
                <td>
                    <a href="edit_user.php?id=<?= $u['id'] ?>" class="btn btn-secondary" style="padding:5px 10px; font-size:0.8rem;">Edit</a>
                    <a href="manage_users.php?delete=<?= $u['id'] ?>" class="btn btn-danger" style="padding:5px 10px; font-size:0.8rem;" onclick="return confirm('Delete User?')">Del</a>
                </td>
            </tr>
            <?php } ?>
        </tbody>
    </table>
</div>

<?php require_once('footer.php'); ?>

<script>
    function filterUsers() {
        var input = document.getElementById("userSearchInput");
        var filter = input.value.toUpperCase();
        var table = document.getElementById("usersTable");
        var tr = table.getElementsByTagName("tr");

        for (var i = 1; i < tr.length; i++) {
            // Get Name (Col 1) and Email (Col 2)
            var tdName = tr[i].getElementsByTagName("td")[1];
            var tdEmail = tr[i].getElementsByTagName("td")[2];
            
            if (tdName || tdEmail) {
                var txtName = tdName.textContent || tdName.innerText;
                var txtEmail = tdEmail.textContent || tdEmail.innerText;
                
                // If either matches, show the row
                if (txtName.toUpperCase().indexOf(filter) > -1 || txtEmail.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }       
        }
    }
</script>