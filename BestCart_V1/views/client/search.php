<?php
    // Get the search query safely
    $query = isset($_GET['query']) ? htmlspecialchars($_GET['query']) : '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search Results | BestCart</title>
    <link rel="stylesheet" href="../../assets/css/home.css">
    <style>
        /* Reusing the grid style from home but ensuring it fits here */
        .search-results-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            min-height: 70vh; /* Ensure footer stays down */
        }
        .page-title {
            margin-bottom: 20px;
            font-size: 24px;
            color: #333;
        }
    </style>
</head>
<body>

    <header>
        <div class="header-container">
            <a href="home.php" class="logo">
                <img src="../../assets/images/logo.png" alt="BestCart">
            </a>
            <div class="categories-dropdown">
                <a href="#">☰ Categories</a>
                <div id="category-list"></div>
            </div>
            <div class="search-center">
                <form class="search-box" action="search.php" method="get">
                    <input type="text" name="query" placeholder="Search products..." value="<?= $query ?>">
                    <button type="submit">Search</button>
                </form>
            </div>
            <div class="nav-actions">
                <a href="cart.php" class="nav-btn">🛒 Cart</a>
                <a href="profile.php" class="nav-btn">🙎🏻‍♂️ Profile</a>
            </div>
        </div>
    </header>

    <div class="search-results-container">
        <h1 class="page-title">Search Results for: "<?= $query ?>"</h1>
        
        <div id="search-grid" class="featured-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px;">
            <h3>Searching...</h3>
        </div>
    </div>

    <footer class="main-footer">
        <div class="container footer-content-container">
            <div class="footer-column contact-column">
                <p class="contact-detail">Rahman Regnum Centre, Level-6, 191/1 Tejgaon C/A, Dhaka-1208, Bangladesh</p>
                <p class="contact-detail">📞 +8809613444455</p>
                <p class="contact-detail hours">8 am - 10 pm (Everyday)</p>
                <p class="contact-detail">customer.care@bestcart.com</p>
            </div>

            <div class="footer-column link-group">
                <h4 class="footer-heading">BestCart</h4>
                <ul>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">BestCart Blog</a></li>
                    <li><a href="#">Join the Affiliate Program</a></li>
                    <li><a href="#">Cookies Policy</a></li>
                </ul>
            </div>

            <div class="footer-column link-group">
                <h4 class="footer-heading">Customer Care</h4>
                <ul>
                    <li><a href="#">Returns & Refunds</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Warranty Policy</a></li>
                    <li><a href="#">Help Center</a></li>
                    <li><a href="#">Terms & Conditions</a></li>
                    <li><a href="#">EMI Policy</a></li>
                </ul>
            </div>

            <div class="footer-column payment-methods">
                <h4 class="footer-heading">Payment Methods</h4>
                <div class="payment-grid">
                    <img src="../../assets/images/bkash.jpg" alt="bKash" class="payment-icon" onerror="this.style.display='none'">
                    <img src="../../assets/images/nagad.png" alt="Nagad" class="payment-icon" onerror="this.style.display='none'">
                    <img src="../../assets/images/cod.jpg" alt="Cash on Delivery" class="payment-icon wide" onerror="this.style.display='none'">
                </div>
            </div>
        </div>

        <div class="footer-copyright">
            © Copyright 2025 BestCart. All Rights Reserved.
        </div>
    </footer>

    <script src="../../assets/js/shop.js"></script>
    <script src="../../assets/js/search.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            // Fetch Categories for the menu
            fetchCategories();

            // Perform Search
            const searchQuery = "<?= $query ?>";
            if(searchQuery) {
                runSearch(searchQuery);
            } else {
                document.getElementById('search-grid').innerHTML = "<p>Please enter a keyword to search.</p>";
            }
        });
    </script>
</body>
</html>