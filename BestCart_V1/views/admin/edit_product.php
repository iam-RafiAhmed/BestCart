<?php
    session_start();
    
    // 1. Security Check
    if (!isset($_SESSION['admin_status'])) {
        header('location: login.php');
        exit();
    }

    require_once('layout.php');
    require_once('../../models/productModel.php');
    require_once('../../models/categoryModel.php');
    require_once('file_handler.php'); // Required for image upload

    // 2. Check if ID is provided
    if (!isset($_GET['id'])) {
        header("location: manage_products.php");
        exit();
    }

    $id = $_GET['id'];
    $p = getProductById($id);

    // 3. Handle Update Submission
    if (isset($_POST['update_btn'])) {
        $name = $_POST['name'];
        $price = $_POST['price'];
        $discount = $_POST['discount'];
        $qty = $_POST['qty'];
        $cat = $_POST['category'];
        $desc = $_POST['desc'];

        // Image Logic
        $image = ""; 
        
        // Only process upload if a new file is selected
        if (isset($_FILES['image']['name']) && $_FILES['image']['name'] != "") {
            $image = time() . "_" . $_FILES['image']['name'];
            move_uploaded_file($_FILES['image']['tmp_name'], "../../uploads/" . $image);
        }
        // If $image is empty "", the model keeps the old image

        $data = [
            'id' => $id,
            'name' => $name,
            'price' => $price,
            'discount_price' => $discount,
            'quantity' => $qty,
            'category' => $cat,
            'description' => $desc,
            'image' => $image 
        ];

        if(updateProduct($data)){
            echo "<script>alert('Product Updated Successfully!'); window.location.href='manage_products.php';</script>";
        } else {
            echo "<script>alert('Database Error: Could not update.');</script>";
        }
    }
?>

<div class="header-title">Edit Product</div>

<div class="card" style="max-width: 800px; margin: 0 auto;">
    <form method="post" enctype="multipart/form-data" action="../../controllers/adminProductController.php" data-ajax="true">
        <input type="hidden" name="product_id" value="<?= $p['id'] ?>">


        <div style="text-align:center; margin-bottom:20px;">
            <label>Current Image:</label><br>
            <img src="../../uploads/<?= htmlspecialchars($p['image']) ?>" style="width:120px; height:120px; object-fit:cover; border-radius:10px; border:1px solid #ddd; margin-top:5px;">
        </div>

        <div class="form-row">
            <div class="input-group">
                <label>Product Name</label>
                <input type="text" name="name" class="form-control" value="<?= htmlspecialchars($p['name']) ?>" required>
            </div>

            <div class="input-group">
                <label>Category</label>
                <select name="category" class="form-control">
                    <?php
                    $categories = getAllCategories(); 
                    foreach ($categories as $c) {
                        $selected = ($p['category'] == $c['name']) ? 'selected' : '';
                        echo "<option value='{$c['name']}' $selected>{$c['name']}</option>";
                    }
                    ?>
                </select>
            </div>
        </div>

        <div class="form-row">
            <div class="input-group" style="grid-column: span 2;">
                <label>Description</label>
                <textarea name="desc" class="form-control" style="height:100px;"><?= htmlspecialchars($p['description']) ?></textarea>
            </div>
        </div>

        <div class="form-row">
            <div class="input-group">
                <label>Original Price (৳)</label>
                <input type="number" step="0.01" name="price" class="form-control" value="<?= $p['price'] ?>" required>
            </div>
            <div class="input-group">
                <label>Discount Price (৳)</label>
                <input type="number" step="0.01" name="discount" class="form-control" value="<?= $p['discount_price'] ?>">
            </div>
        </div>

        <div class="form-row">
            <div class="input-group">
                <label>Stock Quantity</label>
                <input type="number" name="qty" class="form-control" value="<?= $p['quantity'] ?>" required>
            </div>
            <div class="input-group">
                <label>Upload New Image (Optional)</label>
                <input type="file" name="image" class="form-control" style="padding:5px;">
                <small style="color:#64748b;">Leave empty to keep the current image.</small>
            </div>
        </div>

        <div style="display:flex; gap:10px; margin-top:20px;">
            <button type="submit" name="update_btn" class="btn btn-primary" style="flex:1">
                <i data-lucide="save"></i> Save Changes
            </button>
            <a href="manage_products.php" class="btn btn-secondary">Cancel</a>
        </div>
    </form>
</div>

<?php require_once('footer.php'); ?>