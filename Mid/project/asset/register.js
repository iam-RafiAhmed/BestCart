
let mail = document.getElementById("mail");
let continueBtn = document.getElementById("ContinueBtn");
let submitBtn = document.getElementById("submitBtn");
let confirmBtn = document.getElementById("confirmBtn");
let otpSection = document.getElementById("otpSection");
let otpField = document.getElementById("otpField");

let passField = document.getElementById("passField");
let passSection = document.getElementById("passSection");


Continue = () => {
    if (mail.value == "") {
        alert("Please a input mail.");
        return;
    }
    else if(!mail.checkValidity()){
        alert("Input a proper mail.");
        return;
    }
    else{
        mail.style.borderColor = "green";
        otpSection.style.display = "block";
        continueBtn.style.display = "none";
        submitBtn.style.display = "block";

    }
}

Submit= ()=>{
    if(otpField.value.length!==6){
        alert("Put the OTP properly!");
        return;
    }
    else{
        otpField.style.borderColor = "green";
        submitBtn.style.display = "none";
        
        passSection.style.display = "block";
    }
}

Confirm = ()=>{
    if(passField.value < 6){
        alert("The password is too short, at least 6 characters is required");
        return;
    }
}



checkField = () => {
    if (mail.value !== "") {
        continueBtn.style.backgroundColor = "#EC009B";
        continueBtn.style.color = "white";

    }
    
    else{
        continueBtn.style.backgroundColor = "#EFF1F4";
        continueBtn.style.color = "#858D9E";
    }
}

checkConfirm= ()=>{
    if(passField.value.length >= 6){
        confirmBtn.style.backgroundColor = "#EC009B";
        confirmBtn.style.color = "white";
    }
    else{
        confirmBtn.style.backgroundColor = "#EFF1F4";
        confirmBtn.style.color = "#858D9E";
    }
}

checkSubmit= ()=>{
    if(otpField.value.length ==6 ){
        submitBtn.style.backgroundColor = "#EC009B";
        submitBtn.style.color = "white";
    }
    else{
        submitBtn.style.backgroundColor = "#EFF1F4";
        submitBtn.style.color = "#858D9E";
    }
}


mail.addEventListener("input", checkField);
otpField.addEventListener("input", checkSubmit);
passField.addEventListener("input", checkConfirm);

