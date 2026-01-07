<?php
    require_once('layout.php');
    require_once('../../models/orderModel.php');
    require_once('../../models/productModel.php');

    // --- HANDLE ADD ORDER ---
    if(isset($_POST['add_order'])){
        $product_name = $_POST['product_search']; 
        $qty = $_POST['order_qty'];
        if(empty($product_name)) { $items_string = "Manual Entry"; } 
        else { $items_string = "$product_name (x$qty)"; }

        $data = [
            'customer_name' => $_POST['customer'],
            'email' => $_POST['email'],
            'total_amount' => $_POST['amount'],
            'status' => $_POST['status'],
            'order_date' => $_POST['date'],
            'shipping_address' => $_POST['shipping'],
            'billing_address' => $_POST['billing'],
            'order_items' => $items_string
        ];
        if(addOrder($data)){ echo "<script>window.location.href='manage_orders.php';</script>"; } 
        else { echo "<script>alert('Error placing order');</script>"; }
    }

    // --- HANDLE DELETE ---
    if(isset($_GET['delete'])){
        deleteOrder($_GET['delete']);
        echo "<script>window.location.href='manage_orders.php';</script>";
    }
    
    // FETCH ALL ORDERS (No PHP Search needed anymore)
    $orders = getAllOrders();
    $products = getAllProducts();

    // Prepare Price List for JS
    $price_list_for_js = [];
    foreach($products as $p){
        $price_list_for_js[$p['name']] = (float)$p['price'];
    }
?>

<div class="header-title">Manage Orders</div>

<div class="card">
    <h3 style="margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">Place New Order</h3>
    <form method="post" action="../../controllers/adminOrderController.php" data-ajax="true" data-reset="true">
        <div class="form-row" style="background:#f8fafc; padding:15px; border-radius:8px; border:1px solid #e2e8f0;">
            <div class="input-group">
                <label>Find Product</label>
                <input type="text" name="product_search" id="productInput" list="products_list" class="form-control" placeholder="Type product name..." oninput="calculateTotal()" autocomplete="off">
                <datalist id="products_list">
                    <?php foreach($products as $p){ ?>
                        <option value="<?= htmlspecialchars($p['name']) ?>"></option>
                    <?php } ?>
                </datalist>
            </div>
            <div class="input-group">
                <label>Quantity</label>
                <input type="number" name="order_qty" id="orderQty" class="form-control" value="1" min="1" oninput="calculateTotal()">
            </div>
        </div>

        <div class="form-row">
            <div class="input-group">
                <label>Customer Name</label>
                <input type="text" name="customer" class="form-control" required>
            </div>
            <div class="input-group">
                <label>Customer Email</label>
                <input type="email" name="email" class="form-control" placeholder="client@example.com">
            </div>
        </div>

        <div class="form-row">
            <div class="input-group">
                <label>Total Amount (৳)</label>
                <input type="number" step="0.01" name="amount" id="totalAmount" class="form-control" style="background-color:#e2e8f0; font-weight:bold;">
            </div>
        </div>

        <div class="form-row">
            <div class="input-group">
                <label>Shipping Address</label>
                <textarea name="shipping" class="form-control" rows="2"></textarea>
            </div>
            <div class="input-group">
                <label>Billing Address</label>
                <textarea name="billing" class="form-control" rows="2"></textarea>
            </div>
        </div>

        <div class="form-row">
            <div class="input-group">
                <label>Order Date</label>
                <input type="date" name="date" class="form-control" value="<?= date('Y-m-d') ?>" required>
            </div>
            <div class="input-group">
                <label>Status</label>
                <select name="status" class="form-control">
                    <option value="Pending">Pending</option>
                    <option value="In Process">In Process</option>
                    <option value="Completed">Completed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
        </div>

        <button type="submit" name="add_order" class="btn btn-primary">
            <i data-lucide="shopping-bag"></i> Place Order
        </button>
    </form>
</div>

<div class="card" style="padding:0; overflow:hidden;">
    
    <div style="padding:15px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
        <h4 style="margin:0;">Order List</h4>
        
        <div style="position:relative;">
            <i data-lucide="search" style="position:absolute; left:10px; top:10px; width:18px; color:#94a3b8;"></i>
            <input type="text" id="orderSearchInput" class="form-control" placeholder="Filter ID, Name, Email..." onkeyup="filterOrders()" style="width:300px; padding-left:35px;">
        </div>
    </div>

    <table id="ordersTable">
        <thead>
            <tr id="row-<?= $o['id'] ?>">
                <th>ID</th>
                <th>Customer Info</th>
                <th>Total Amount (৳)</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach($orders as $o){ ?>
            <tr>
                <td>#<?= $o['id'] ?></td>
                <td>
                    <b><?= htmlspecialchars($o['customer_name']) ?></b><br>
                    <span style="color:#0369a1; font-size:0.85rem;"><?= isset($o['email']) ? htmlspecialchars($o['email']) : '' ?></span><br>
                    <span style="color:#64748b; font-size:0.8rem;">
                        <i data-lucide="package" style="width:12px; vertical-align:middle;"></i> 
                        <?= isset($o['order_items']) ? htmlspecialchars($o['order_items']) : 'Manual Order' ?>
                    </span>
                </td>
                <td>৳<?= number_format($o['total_amount'], 2) ?></td>
                <td>
                    <?php 
                        $color = "#f59e0b"; 
                        if($o['status'] == 'Completed') $color = "#10b981"; 
                        if($o['status'] == 'Shipped') $color = "#3b82f6";   
                        if($o['status'] == 'Cancelled') $color = "#ef4444"; 
                        if($o['status'] == 'In Process') $color = "#8b5cf6"; 
                    ?>
                    <span style="color:<?= $color ?>; font-weight:bold; background:<?= $color ?>15; padding:4px 8px; border-radius:4px; font-size:0.8rem;">
                        <?= $o['status'] ?>
                    </span>
                </td>
                <td>
                    <a href="edit_order.php?id=<?= $o['id'] ?>" class="btn btn-secondary" style="padding:5px 10px; font-size:0.8rem;">Edit</a>
                    <a href="manage_orders.php?delete=<?= $o['id'] ?>" class="btn btn-danger" style="padding:5px 10px; font-size:0.8rem;" onclick="return confirm('Delete?')">Del</a>
                </td>
            </tr>
            <?php } ?>
        </tbody>
    </table>
</div>

<?php require_once('footer.php'); ?>

<script>
    // 1. Calculator Logic
    const productPrices = <?php echo json_encode($price_list_for_js); ?>;

    function calculateTotal() {
        var nameInput = document.getElementById('productInput').value;
        var qtyInput = document.getElementById('orderQty').value;
        var totalInput = document.getElementById('totalAmount');
        var price = productPrices[nameInput] || 0;
        var qty = parseInt(qtyInput) || 1;
        if(price > 0){
            totalInput.value = (price * qty).toFixed(2);
        }
    }

    // 2. Filter Logic
    function filterOrders() {
        var input = document.getElementById("orderSearchInput");
        var filter = input.value.toUpperCase();
        var table = document.getElementById("ordersTable");
        var tr = table.getElementsByTagName("tr");

        for (var i = 1; i < tr.length; i++) {
            // Check ID (Col 0) and Info (Col 1)
            var tdId = tr[i].getElementsByTagName("td")[0];
            var tdInfo = tr[i].getElementsByTagName("td")[1];
            
            if (tdInfo || tdId) {
                var txtId = tdId.textContent || tdId.innerText;
                var txtInfo = tdInfo.textContent || tdInfo.innerText;
                
                // If either ID OR Info matches, show it
                if (txtId.toUpperCase().indexOf(filter) > -1 || txtInfo.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }       
        }
    }
</script>