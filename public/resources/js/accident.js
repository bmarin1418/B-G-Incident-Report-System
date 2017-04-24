/* ------ HTML id's for global use ------ */

var FORM_ID = '#accident_form_id';
var INJURY_TEXTBOX_ID = '#head_injury_checkbox';
var INJURY_DIV_ID = '#head_injury_div';
var SUBMIT_BUTTON_ID = '#sendForm';
var LOGOUT_ID = '#logout';
var DATE_FIELD_ID = '#dateid'

/* ------ Main Execution ------ */

$(document).ready(function(){
    firbaseInit();
    linkHandlers();
    initDateField();
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
            console.log("form complete button clicked.");
        });

  /*      $(LOGOUT_ID).click(function(){
            logoutHandler();
        });*/
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
    return new InputValidator(FORM_ID, {
        name: {
          presence: true
        },
        date: {
          presence: true,
          date: {
              latest: moment(),
              dateTime: true
          }
        },
        staff: {
          presence: true
        },
        incident : {
            presence: true
        },
        response: {
            presence: true
        },
        parentNotified: {
            presence: true
        }
    });
}

//Fill in the current date for the date field
function initDateField() {
    $(DATE_FIELD_ID)[0].valueAsDate = new Date();
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
        var data = [];
        var $form = $(this);
        console.log("Submit to Firebase");

        var newForm = {
            "childName": $('#nameid').val(),
            "date": $('#dateid').val(),
            "staffName": $('#staffid').val(),
	    "location" : $('#locationid').val(),
            "incidentDescription": $('#incidentid').val(),
            "responseDescription": $('#responseid').val(),
            "parentNotified": $('#parentid').val(),
            "headInjury": $('#headinjuryid')
        }

        data = newForm;
        firebase.database().ref('accident/').push(data, function (err) {
            if (err) {
                alert("Data did not send");
            }
            window.location.href = "print_and_email.html";

        });

        return false;
    }
}

//Display logout warning info and redirect to login page
function logoutHandler() {
  if (confirm("Are you sure you want to logout?") == true) {
    window.location.href = "index.html";
  }
}
