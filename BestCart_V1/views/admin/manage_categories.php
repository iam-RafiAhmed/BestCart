<?php
    session_start();
    if (!isset($_SESSION['admin_status'])) {
        header('location: login.php');
        exit();
    }

    require_once('../../models/categoryModel.php');
    require_once('file_handler.php'); // Include Image Handler

    // --- HANDLE ADD CATEGORY ---
    if (isset($_POST['add_cat'])) {
        $name = $_POST['name'];
        
        // --- UPDATED UPLOAD LOGIC ---
        $image = uploadImage($_FILES['image']);
        // ----------------------------

        if (addCategory($name, $image)) {
            echo "<script>alert('Category Added!'); window.location.href='manage_categories.php';</script>";
        }
    }

    // --- HANDLE DELETE ---
    if (isset($_GET['delete'])) {
        deleteCategory($_GET['delete']);
        echo "<script>window.location.href='manage_categories.php';</script>";
    }

    $categories = getAllCategories();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Manage Categories</title>
    <link rel="stylesheet" href="../../assets/css/admin.css?v=<?php echo time(); ?>">
    <script src="https://unpkg.com/lucide@latest"></script>
<script src="../../assets/js/ajax.js?v=<?php echo time(); ?>"></script>
</head>
<body>

    <?php include('menu.php'); ?>

    <div class="container">
        <div class="header-title">Manage Categories</div>

        <div class="card">
            <h4 style="margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">Create New Category</h4>
            <form method="post" enctype="multipart/form-data" action="../../controllers/adminCategoryController.php" data-ajax="true" data-reset="true">
                <div class="form-row">
                    <div class="input-group">
                        <label>Category Name</label>
                        <input type="text" name="name" class="form-control" required placeholder="e.g. Headphones">
                    </div>
                    <div class="input-group">
                        <label>Image</label>
                        <input type="file" name="image" class="form-control" required style="padding:5px;">
                    </div>
                </div>
                <button type="submit" name="add_cat" class="btn btn-primary">
                    <i data-lucide="plus"></i> Add Category
                </button>
            </form>
        </div>

        <div class="card" style="padding:0; overflow:hidden; margin-top:20px;">
            <div class="table-header" style="padding:15px; background:#f8fafc; border-bottom:1px solid #e2e8f0;">
                <h4>Category List</h4>
            </div>
            <table>
                <thead>
                    <tr id="row-<?= $c['id'] ?>">
                        <th>Image</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($categories as $c) { ?>
                    <tr>
                        <td>
                            <img src="../../uploads/<?= htmlspecialchars($c['image']) ?>" style="width:50px; height:50px; object-fit:cover; border-radius:6px; border:1px solid #ddd;">
                        </td>
                        <td>
                            <b><?= htmlspecialchars($c['name']) ?></b>
                        </td>
                        <td>
                            <a href="edit_category.php?id=<?= $c['id'] ?>" class="btn btn-secondary" style="padding:5px 10px; font-size:0.85rem;">Edit</a>
                            <a href="manage_categories.php?delete=<?= $c['id'] ?>" class="btn btn-danger" style="padding:5px 10px; font-size:0.85rem;" onclick="return confirm('Delete this category?')">Del</a>
                        </td>
                    </tr>
                    <?php } ?>
                </tbody>
            </table>
        </div>
    </div>
    <script>lucide.createIcons();</script>
</body>
</html>