$(document).ready(function(){
    injury_checkbox_id = '#head_injury_checkbox';
    injury_div_id = '#head_injury_div';
    
    $(injury_checkbox_id).change(function(){
        if ($(this).is(":checked")) {
            $(injury_div_id).show();
        } else {
            $(injury_div_id).hide();
        }
    })
})

function submitButton(){
  window.location.href = "print_and_email.html";
  console.log("Submit Button Clicked.");
}

function myFunction() {
  if (confirm("Are you sure you want to logout?") == true) {
    window.location.href = "index.html";
  }
}
