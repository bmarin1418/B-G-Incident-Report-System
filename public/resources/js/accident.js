/* ------ HTML id's for global use ------ */

var FORM_ID = '#accident_form_id';
var INJURY_TEXTBOX_ID = '#head_injury_checkbox';
var INJURY_DIV_ID = '#head_injury_div';
var SUBMIT_BUTTON_ID = '#submit_button_id';    
var LOGOUT_ID = '#logout';

/* ------ Main Execution ------ */

$(document).ready(function(){
    firbaseInit();
    linkHandlers();
});


/* ------ Helper Functions ------ */

//Links all DOM events to handler functions
function linkHandlers() {
        $(INJURY_TEXTBOX_ID).change(function(){
            var cntxt = this;
            headInjuryChangeHandler(cntxt);
        });
    
        var inputValidator = initValidatorObj();
        $(SUBMIT_BUTTON_ID).click(function(){
            submitClickHandler(inputValidator);
        });
    
        $(LOGOUT_ID).click(function(){
            logoutHandler();
        });
}

//Initialize Firebase 
function firbaseInit() {
  var config = {
    apiKey: "AIzaSyBGobM_iD5YqUo09kAu2bSfXlhQhJaz3-U",
    authDomain: "bngcdb-86373.firebaseapp.com",
    databaseURL: "https://bngcdb-86373.firebaseio.com",
    storageBucket: "bngcdb-86373.appspot.com",
    messagingSenderId: "164973952286"
  };
  firebase.initializeApp(config);
}

//Returns an input validator object initalized for the accident form
function initValidatorObj() {
    return new InputValidator({
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
}

/* ------ Event Handler Functions ------ */

//Link click on head injury checkbox to showing or hiding the head injury form
function headInjuryChangeHandler(cntxt) {
        if ($(cntxt).is(":checked")) {
            $(INJURY_DIV_ID).show();
        } else {
            $(INJURY_DIV_ID).hide();
        }
}

//Send accident form data to firebase if the input is valid
function submitClickHandler(inputValidator) {
  if (inputValidator.validate()) {
      firebase.database().ref('accident/').push({
        name: "Child Name",
        staff: "Staff Name",
        description: "Description of Event"
      });
      window.location.href = "print_and_email.html";
  }
}

//Display logout warning info and redirect to login page
function logoutHandler() {
  if (confirm("Are you sure you want to logout?") == true) {
    window.location.href = "index.html";
  }
}