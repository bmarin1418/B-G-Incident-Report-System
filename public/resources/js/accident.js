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


    var constraints = {
        name: {
          // Email is required
          presence: true,
          // and must be an email (duh)
          email: true
        },
        password: {
          // Password is also required
          presence: true,
          // And must be at least 5 characters long
          length: {
            minimum: 5
          }
        },
        "confirm-password": {
          // You need to confirm your password
          presence: true,
          // and it needs to be equal to the other password
          equality: {
            attribute: "password",
            message: "^The passwords does not match"
          }
        },
        username: {
          // You need to pick a username too
          presence: true,
          // And it must be between 3 and 20 characters long
          length: {
            minimum: 3,
            maximum: 20
          },
          format: {
            // We don't allow anything that a-z and 0-9
            pattern: "[a-z0-9]+",
            // but we don't care if the username is uppercase or lowercase
            flags: "i",
            message: "can only contain a-z and 0-9"
          }
        },
        birthdate: {
          // The user needs to give a birthday
          presence: true,
          // and must be born at least 18 years ago
          date: {
            latest: moment().subtract(18, "years"),
            message: "^You must be at least 18 years old to use this service"
          }
        },
        country: {
          // You also need to input where you live
          presence: true,
          // And we restrict the countries supported to Sweden
          inclusion: {
            within: ["SE"],
            // The ^ prevents the field name from being prepended to the error
            message: "^Sorry, this service is for Sweden only"
          }
        },
        zip: {
          // Zip is optional but if specified it must be a 5 digit long number
          format: {
            pattern: "\\d{5}"
          }
        },
        "number-of-children": {
          presence: true,
          // Number of children has to be an integer >= 0
          numericality: {
            onlyInteger: true,
            greaterThanOrEqualTo: 0
          }
        }
      };
