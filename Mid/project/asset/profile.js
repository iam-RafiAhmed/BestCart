const options = document.querySelectorAll(".option");
const detailBox = document.getElementById("optionDetails");


options.forEach(option => {
    option.addEventListener("click", (e) => {

        const id = option.id;

        if (id == "logout") return;

        e.preventDefault();

        if (id == "manageAccount") {
            let opt = document.getElementById(id);
            options.forEach(o => o.style.color = "#7F8899");
            opt.style.color = "#EC009B";
            detailBox.innerHTML = `<h2 class="">Manage Account</h3>
            <div class="myAccount">
                <div>              
                <p class="personalLine">Personal Profile</p> <a href="">Edit</a>
                <p>abcd@gmail.com</p>
            </div>
            <div>
                <p class="personalLine">Address</p> <a href="">Edit</a>
                <p>Default Delivery address</p>
            </div>`
        }
        else if (id == "profile") {
            let opt = document.getElementById(id);
            options.forEach(o => o.style.color = "#7F8899");
            opt.style.color = "#EC009B";
            detailBox.innerHTML = `<h2>My profile</h2>
            <div class="myProfile">
                <div>
                <div>
                    <h3>My full name</h3>
                    <p>---</p>
                    <h3>Gender</h3>
                    <p>---</p>
                </div>
                <div>
                    <h3>My address</h3>
                    <p>---</p>
                </div>
            </div>
                <div>
                    <h3>Email</h3>
                    <p>---</p>
                    <h3>Phone Number</h3>
                    <p>---</p>
                </div>
            </div>
            <div class="btnGrp">
                <button class="profileBtn">Change Password</button>
                <button class="profileBtn">Edit Profile</button>
            </div>`
        }
        else if (id == "orders") {
            let opt = document.getElementById(id);
            options.forEach(o => o.style.color = "#7F8899");
            opt.style.color = "#EC009B";
            detailBox.innerHTML = `
            <div>
                <h2>My Orders</h2>              
            </div>`
        }
        else if (id == "wishlist") {
            let opt = document.getElementById(id);
            options.forEach(o => o.style.color = "#7F8899");
            opt.style.color = "#EC009B";
            detailBox.innerHTML = `
            <div>
                <h2>My Wishlist</h2>              
            </div>`
        }
    })
})