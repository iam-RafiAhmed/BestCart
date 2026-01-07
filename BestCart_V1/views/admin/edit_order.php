<?php
    require_once('layout.php');
    require_once('../../models/orderModel.php');

    $id = $_GET['id'];
    $order = getOrderById($id);

    if(isset($_POST['update_order'])){
        $data = [
            'id' => $id,
            'customer_name' => $_POST['customer'],
            'total_amount' => $_POST['amount'],
            'status' => $_POST['status'],
            'order_date' => $_POST['date'],
            'shipping_address' => $_POST['shipping'], // New
            'billing_address' => $_POST['billing']    // New
        ];
        if(updateOrder($data)){
            echo "<script>window.location.href='manage_orders.php';</script>";
        } else {
            echo "<script>alert('Error updating order');</script>";
        }
    }
?>

<div class="header-title">Edit Order #<?= $order['id'] ?></div>

<div class="card" style="max-width: 700px; margin: 0 auto;">
    <form method="post" action="../../controllers/adminOrderController.php" data-ajax="true">
        <input type="hidden" name="order_id" value="<?= $order['id'] ?>">

        
        <div class="form-row">
            <div class="input-group">
                <label>Customer Name</label>
                <input type="text" name="customer" class="form-control" value="<?= htmlspecialchars($order['customer_name']) ?>" required>
            </div>
            <div class="input-group">
                <label>Total Amount (৳)</label>
                <input type="number" step="0.01" name="amount" class="form-control" value="<?= $order['total_amount'] ?>" required>
            </div>
        </div>

        <div class="form-row">
            <div class="input-group">
                <label>Shipping Address</label>
                <textarea name="shipping" class="form-control"><?= htmlspecialchars($order['shipping_address']) ?></textarea>
            </div>
            <div class="input-group">
                <label>Billing Address</label>
                <textarea name="billing" class="form-control"><?= htmlspecialchars($order['billing_address']) ?></textarea>
            </div>
        </div>

        <div class="form-row">
            <div class="input-group">
                <label>Order Date</label>
                <input type="date" name="date" class="form-control" value="<?= $order['order_date'] ?>" required>
            </div>
            
            <div class="input-group">
                <label>Order Status</label>
                <select name="status" class="form-control" style="font-weight:bold;">
                    <option value="Pending" <?= $order['status']=='Pending'?'selected':'' ?>>Pending</option>
                    <option value="Completed" <?= $order['status']=='Completed'?'selected':'' ?>>Completed</option>
                    <option value="Shipped" <?= $order['status']=='Shipped'?'selected':'' ?>>Shipped</option>
                    <option value="Cancelled" <?= $order['status']=='Cancelled'?'selected':'' ?>>Cancelled</option>
                </select>
            </div>
        </div>

        <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button type="submit" name="update_order" class="btn btn-primary" style="flex: 1;">Update Order</button>
            <a href="manage_orders.php" class="btn btn-secondary">Cancel</a>
        </div>

    </form>
</div>

<?php require_once('footer.php'); ?>