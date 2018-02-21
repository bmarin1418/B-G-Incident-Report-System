/* ------ HTML id's for global use ------ */

var FORM_ID = '#accident_form';
var INJURY_TEXTBOX_ID = '#head_injury_checkbox';
var INJURY_DIV_ID = '#head_injury_div';
var SUBMIT_BUTTON_ID = '#sendForm';
var LOGOUT_ID = '#logout';
var DATE_FIELD_ID = '#dateid';
var HEAD_INJURY_ID = '#head_injury_checkbox';
var NAME_FIELD_ID = '#nameid';
var MEMBER_FIELD_ID = '#member_id';
var LOCATION_FIELD_ID = '#locationid';
var RESPONSE_FIELD_ID = '#responseid';
var PARENT_NOT_FIEL_ID = '#parentid';
var STAFF_FIELD_ID = '#staffid';
var INCIDENT_FIELD_ID = '#incidentid';
var NATURE_FIELD_ID = '#natureid';
var TREATMENT_FIELD_ID = '#treatment_id';


/* ------ Main Execution ------ */

$(document).ready(function () {
    firebaseInit();
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
    });
}

//Returns an input validator object initalized for the accident form
function initValidatorObj() {
    return new InputValidator(FORM_ID, {
        name: {
            presence: true
        },
        member_id: {
            validMemId: true,
            presence: true
        },
        date: {
            presence: true,
            datetime: {
                dateOnly: true,
                earliest: moment().utc().local().subtract(8, 'days'),
                latest: moment().local()
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
        var newForm = {
            "memberId": $(MEMBER_FIELD_ID).val(),
            "childName": $(NAME_FIELD_ID).val(),
            "date": $(DATE_FIELD_ID).val(),
            "staffName": $(STAFF_FIELD_ID).val(),
            "location": $(LOCATION_FIELD_ID).val(),
            "incidentDescription": $(INCIDENT_FIELD_ID).val(),
            "responseDescription": $(RESPONSE_FIELD_ID).val(),
            "parentNotified": $(PARENT_NOT_FIEL_ID).val()
        }

        if ($(HEAD_INJURY_ID).is(':checked')) {
            newForm["nature"] = $(NATURE_FIELD_ID).val();
            newForm["treatment"] = $(TREATMENT_FIELD_ID).val();
        }

        firebase.auth().onAuthStateChanged(function (user) { // This assures the firebaseInit is finished for getting club from user info
            if (user) {
                var club = getClub();
                if (club != "none") {
                    submitAndPrint(newForm, club);
                } else {
                    sweetAlert("Login Issue", "Unknown club location, please login again to submit a form");
                }
            } else {
                sweetAlert("Uh Oh", "No one is currently logged in");
            }
        });
    } else {
        sweetAlert("Oops", "Something isn't correctly filled in on your form");
    }
}

// Send the form info to the database and then create the JSON for a pdf
function submitAndPrint(newForm, club) {
    firebase.database().ref('locations/' + club + '/students/' + newForm["memberId"] + '/accident/').push(newForm, function (err) {
        if (err) {
            sweetAlert("Form Did Not Submit", "Check your internet connection and try again");
        } else {
            //get JSON representation of PDF to print, then save to session storage for later printing
            var document_definition = getAccidentJSON(newForm);
            document_definition = JSON.stringify(document_definition);
            sessionStorage.setItem('doc_def', document_definition);
            window.location.href = "confirmation_page.html";
        }
    });
}
