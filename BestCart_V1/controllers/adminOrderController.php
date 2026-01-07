<?php
require_once('helpers.php');
requireAdmin();

require_once('../models/orderModel.php');

// ADD ORDER (Place Order)
if (isset($_POST['add_order'])) {

    $data = [
        'customer_name'    => $_POST['customer'] ?? '',
        'email'            => $_POST['email'] ?? '',
        'total_amount'     => $_POST['amount'] ?? 0,
        // In manage_orders.php you used product_search. Keep it as order_items (single text field).
        'order_items'      => $_POST['items'] ?? ($_POST['product_search'] ?? 'Manual Entry'),
        'billing_address'  => $_POST['billing'] ?? '',
        'shipping_address' => $_POST['shipping'] ?? '',
        'order_date'       => $_POST['date'] ?? date('Y-m-d'),
        'status'           => $_POST['status'] ?? 'Pending'
    ];

    $ok = addOrder($data);

    if (isAjax()) {
        if ($ok) jsonOut(true, "Order placed successfully");
        jsonOut(false, "Failed to place order");
    } else {
        header("Location: ../views/admin/manage_orders.php");
        exit;
    }
}

// UPDATE ORDER
if (isset($_POST['update_order'])) {

    $id = (int)($_POST['order_id'] ?? 0);

    $data = [
        'id'               => $id,
        'customer_name'    => $_POST['customer'] ?? '',
        'email'            => $_POST['email'] ?? '',
        'total_amount'     => $_POST['amount'] ?? 0,
        'order_items'      => $_POST['items'] ?? ($_POST['product_search'] ?? ''),
        'billing_address'  => $_POST['billing'] ?? '',
        'shipping_address' => $_POST['shipping'] ?? '',
        'order_date'       => $_POST['date'] ?? date('Y-m-d'),
        'status'           => $_POST['status'] ?? 'Pending'
    ];

    $ok = updateOrder($data);

    if (isAjax()) {
        if ($ok) jsonOut(true, "Order updated successfully");
        jsonOut(false, "Failed to update order");
    } else {
        header("Location: ../views/admin/manage_orders.php");
        exit;
    }
}

// DELETE ORDER (optional: allow ajax link / direct)
if (isset($_GET['delete'])) {
    $id = (int)($_GET['delete'] ?? 0);
    $ok = deleteOrder($id);

    if (isAjax()) {
        if ($ok) jsonOut(true, "Order deleted", ['id' => $id]);
        jsonOut(false, "Failed to delete order");
    } else {
        header("Location: ../views/admin/manage_orders.php");
        exit;
    }
}

if (isAjax()) jsonOut(false, "Invalid request");
header("Location: ../views/admin/manage_orders.php");
exit;
?>