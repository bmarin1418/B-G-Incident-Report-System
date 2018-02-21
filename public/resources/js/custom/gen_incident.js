/* ------ HTML id's for global use ------ */

var FORM_ID = '#general_incident_form';
var SUBMIT_BUTTON_ID = '#sendForm';
var LOGOUT_ID = '#logout';
var DATE_FIELD_ID = '#dateid'

/* ------ Main Execution ------ */

$(document).ready(function () {
    firebaseInit();
    linkHandlers();
    initDateField(DATE_FIELD_ID);
});


/* ------ Helper Functions ------ */

//Links all DOM events to handler functions
function linkHandlers() {
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
        witness: {
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
        }
    });
}

//Send accident form data to firebase if the input is valid
function submitClickHandler(inputValidator) {
    if (inputValidator.validate()) {
        console.log("Submit to Firebase");
        var newForm = {
            "memberId": $('#member_id').val(),
            "childName": $('#nameid').val(),
            "date": $('#dateid').val(),
            "staffName": $('#staffid').val(),
            "witnessName": $('#witnessid').val(),
            "location": $('#locationid').val(),
            "incidentDescription": $('#incidentid').val(),
            "responseDescription": $('#responseid').val()
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
    firebase.database().ref('locations/' + club + '/students/' + newForm['memberId'] + '/accident/').push(newForm, function (err) {
        if (err) {
            sweetAlert("Form Did Not Submit", "Check your internet connection and try again");
        } else {
            //get JSON representation of PDF to print, then save to session storage for later printing
            var document_definition = getGeneralIncidentJSON(newForm);
            document_definition = JSON.stringify(document_definition);
            sessionStorage.setItem('doc_def', document_definition);
            window.location.href = "confirmation_page.html";
        }
    });
}
