/* --- HTML id's for global use --- */
var FORM_ID = '#accident_form_id';
var INJURY_TEXTBOX_ID = '#head_injury_checkbox';
var INJURY_DIV_ID = '#head_injury_div';
var SUBMIT_DATA_ID = '#write_data_id';    

$(document).ready(function(){
    //Set up head injury option show and hide handlers
    $(INJURY_TEXTBOX_ID).change(function(){
        if ($(this).is(":checked")) {
            $(INJURY_DIV_ID).show();
        } else {
            $(INJURY_DIV_ID).hide();
        }
    });
    
    //Link data submission to button
    $(SUBMIT_DATA_ID).click(function(){
        //Set up the validation to check before submission
        var inputValidator = new InputValidator({
            name: {
              presence: true
            },
            date: {
              presence: true,
              date: {dateTime: true}
            },
            staff: {
              presence: true
            }
        });
        
        writeAccidentData(inputValidator);
    });
});

function writeAccidentData(inputValidator) {
  if (inputValidator.validate()) {
      firebase.database().ref('accident/').push({
        name: "Child Name",
        staff: "Staff Name",
        description: "Description of Event"
      });
  }
}

function submitButton(){
  window.location.href = "print_and_email.html";
  console.log("Submit Button Clicked.");
}

function myFunction() {
  if (confirm("Are you sure you want to logout?") == true) {
    window.location.href = "index.html";
  }
}