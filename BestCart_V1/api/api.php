<?php
    session_start();
    header('Content-Type: application/json');
    
    // Include ALL Models
    require_once('../models/productModel.php');
    require_once('../models/userModel.php');
    require_once('../models/orderModel.php');
    require_once('../models/categoryModel.php'); 
    require_once('../models/sliderModel.php');   

    $action = isset($_REQUEST['action']) ? $_REQUEST['action'] : '';

    // --- 1. DEFINE PUBLIC ACTIONS (Open to everyone) ---
    $public_actions = ['get_products', 'get_product_details', 'get_categories', 'get_sliders', 'login', 'register'];

    // --- 2. SECURITY CHECK ---
    // Only block if the action is NOT public and user is NOT logged in as Admin
    if(!in_array($action, $public_actions) && !isset($_SESSION['admin_status'])){
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit();
    }

    switch($action){
        
        // =================================================
        // PUBLIC ACTIONS (For Homepage & Client)
        // =================================================

        // --- HOME: SLIDERS ---
        case 'get_sliders':
            echo json_encode(getAllSliders());
            break;

        // --- HOME: CATEGORIES ---
        case 'get_categories':
            echo json_encode(getAllCategories());
            break;

        // --- HOME & SEARCH: PRODUCTS ---
        case 'get_products':
            $term = isset($_GET['search']) ? $_GET['search'] : "";
            
            // Fetch all matching products
            $all_products = getAllProducts($term);

            // Handle "Load More" Pagination
            if(isset($_GET['limit'])){
                $limit = (int)$_GET['limit'];
                $offset = isset($_GET['page']) ? (int)$_GET['page'] : 0;
                $output = array_slice($all_products, $offset, $limit);
                echo json_encode($output);
            } else {
                echo json_encode($all_products);
            }
            break;

        // --- PRODUCT DETAILS ---
        case 'get_product_details':
            if(isset($_GET['id'])){
                $product = getProductById($_GET['id']);
                echo json_encode($product);
            } else {
                echo json_encode(null);
            }
            break;

        // --- AUTHENTICATION ---
        case 'login':
            $email = $_POST['email']; 
            $password = $_POST['password'];
            // Admin Check
            if($email === 'admin@bestcart.com' && $password === '1234'){ 
                $_SESSION['admin_status'] = true;
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
            }
            break;

        case 'logout':
            session_destroy();
            echo json_encode(['success' => true]);
            break;

        // =================================================
        // ADMIN ACTIONS (Restored from your original file)
        // =================================================

        // --- ADMIN: DASHBOARD STATS ---
        case 'get_dashboard':
            $products = getAllProducts();
            $orders = getAllOrders();
            $users = getAllUser();
            
            $revenue = 0;
            foreach($orders as $o) $revenue += $o['total_amount'];

            echo json_encode([
                'stats' => [
                    'revenue' => number_format($revenue, 2),
                    'orders' => count($orders),
                    'users' => count($users)
                ],
                'recentOrders' => array_slice($orders, 0, 5)
            ]);
            break;

        // --- ADMIN: ADD PRODUCT (via API) ---
        case 'add_product':
            $data = [
                'name' => $_POST['name'],
                'price' => $_POST['price'],
                'quantity' => $_POST['stock'],
                // Note: You might want to handle other fields like 'category' here too
            ];
            if(addProduct($data)){
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false]);
            }
            break;

        // --- ADMIN: DELETE PRODUCT (via API) ---
        case 'delete_product':
            if(isset($_POST['id'])){
                deleteProduct($_POST['id']); 
                echo json_encode(['success' => true]); 
            } else {
                echo json_encode(['success' => false, 'message' => 'ID missing']);
            }
            break;

        // --- ADMIN: GET ORDERS ---
        case 'get_orders':
            echo json_encode(getAllOrders());
            break;

        // --- ADMIN: GET USERS ---
        case 'get_users':
            echo json_encode(getAllUser());
            break;
    }
?>