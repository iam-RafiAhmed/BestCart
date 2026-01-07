<?php
require_once('helpers.php');
requireAdmin();

require_once('../models/productModel.php');
require_once('../models/categoryModel.php');
require_once('../views/admin/file_handler.php'); // uploadImage()

// ADD PRODUCT (from manage_products.php)
if (isset($_POST['add_product_btn'])) {

    $name = $_POST['name'] ?? '';
    $price = $_POST['price'] ?? 0;
    $discount = $_POST['discount'] ?? 0;
    $qty = $_POST['qty'] ?? 0;
    $cat = $_POST['category'] ?? '';
    $desc = $_POST['desc'] ?? '';

    $image = uploadImage($_FILES['image'] ?? []);

    $data = [
        'name' => $name,
        'price' => $price,
        'discount_price' => $discount,
        'quantity' => $qty,
        'category' => $cat,
        'description' => $desc,
        'image' => $image
    ];

    $ok = addProduct($data);

    if (isAjax()) {
        if ($ok) jsonOut(true, "Product added");
        jsonOut(false, "Failed to add product");
    } else {
        header("Location: ../views/admin/manage_products.php");
        exit;
    }
}

// UPDATE PRODUCT (from edit_product.php)
if (isset($_POST['update_btn'])) {

    $id = (int)($_POST['product_id'] ?? 0);
    $name = $_POST['name'] ?? '';
    $price = $_POST['price'] ?? 0;
    $discount = $_POST['discount'] ?? 0;
    $qty = $_POST['qty'] ?? 0;
    $cat = $_POST['category'] ?? '';
    $desc = $_POST['desc'] ?? '';

    $p = getProductById($id);
    if (!$p) {
        if (isAjax()) jsonOut(false, "Product not found");
        header("Location: ../views/admin/manage_products.php");
        exit;
    }

    $image = $p['image']; // keep old

    if (isset($_FILES['image']['name']) && $_FILES['image']['name'] != "") {
        $image = uploadImage($_FILES['image']);
    }

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

    $ok = updateProduct($data);

    if (isAjax()) {
        if ($ok) jsonOut(true, "Product updated");
        jsonOut(false, "Failed to update product");
    } else {
        header("Location: ../views/admin/manage_products.php");
        exit;
    }
}

// DELETE PRODUCT
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $ok = deleteProduct($id);

    if (isAjax()) {
        if ($ok) jsonOut(true, "Product deleted", ['id'=>$id]);
        jsonOut(false, "Failed to delete product");
    } else {
        header("Location: ../views/admin/manage_products.php");
        exit;
    }
}

if (isAjax()) jsonOut(false, "Invalid request");
header("Location: ../views/admin/manage_products.php");
exit;
?>
