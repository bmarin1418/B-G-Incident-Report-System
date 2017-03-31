

function submitButton(){
  window.location.href = "print_and_email.html";
  console.log("Submit Button Clicked.")
}

function myFunction() {
  if (confirm("Are you sure you want to logout?") == true) {
    window.location.href = "index.html";
  }
}
