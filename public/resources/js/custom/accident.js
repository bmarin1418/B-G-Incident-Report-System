/* ------ HTML id's for global use ------ */

var FORM_ID = '#accident_form';
var INJURY_TEXTBOX_ID = '#head_injury_checkbox';
var INJURY_DIV_ID = '#head_injury_div';
var SUBMIT_BUTTON_ID = '#sendForm';
var LOGOUT_ID = '#logout';
var DATE_FIELD_ID = '#dateid'
var HEAD_INJURY_ID = '#head_injury_checkbox';

/* ------ Main Execution ------ */

$(document).ready(function () {
    firbaseInit();
    linkHandlers();
    initDateField(DATE_FIELD_ID);
});


/* ------ Helper Functions ------ */

//Links all DOM events to handler functions
function linkHandlers() {
    $(INJURY_TEXTBOX_ID).change(function () {
        var cntxt = this;
        headInjuryChangeHandler(cntxt);
    });

    var inputValidator = initValidatorObj();
    $(SUBMIT_BUTTON_ID).click(function () {
        submitClickHandler(inputValidator);
        console.log("form complete button clicked.");
    });
}

//Returns an input validator object initalized for the accident form
function initValidatorObj() {
    return new InputValidator(FORM_ID, {
        name: {
            presence: true
        },
        date: {
            presence: true,
            datetime: {
                dateOnly: true,
                earliest: moment().utc().subtract(7, 'days'),
                latest: moment()
            }
        },
        staff: {
            presence: true
        },
        location: {
            presence: true
        },
        incident: {
            presence: true
        },
        response: {
            presence: true
        },
        parentNotified: {
            presence: true
        },
        nature: presentIfHeadInjury,
        treatment: presentIfHeadInjury
    });
}

//Function to set validation at runtime depending on the head injury checkbox checked status
function presentIfHeadInjury(value, attributes, attributeName, options, constraints) {
    if ($(HEAD_INJURY_ID).is(':checked')) {
        return {
            presence: true
        }
    } else {
        return {
            presence: false
        }
    }
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
            "location": $('#locationid').val(),
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