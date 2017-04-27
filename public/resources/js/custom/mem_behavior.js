/* ------ HTML id's for global use ------ */

var FORM_ID = '#member_behavior_form';
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
            date: {
                earliest: moment().utc().subtract(7, 'days'),
                latest: moment(),
                datetime: true
            }
        },
        staff: {
            presence: true
        },
        issuer: {
            presence: true
        },
        location: {
            presence: true
        },
        comments: {
            presence: true
        }
    });
}

//Send accident form data to firebase if the input is valid
function submitClickHandler(inputValidator) {
    if (inputValidator.validate()) {
        var data = [];
        var $form = $(this);
        console.log("Submit to Firebase");

        var behaviors = {
            "talking": $('#talking').is(':checked'),
            "not_listening": $('#not_listening').is(':checked'),
            "language": $('#language').is(':checked'),
            "gestures": $('#gestures').is(':checked'),
            "BGC_rules": $('#BGC_rules').is(':checked'),
            "member_disrespect": $('#member_disrespect').is(':checked'),
            "staff_disrespect": $('#staff_disrespect').is(':checked'),
            "name_calling": $('#name_calling').is(':checked'),
            "touching": $('#touching').is(':checked'),
            "physical_contact": $('#physical_contact').is(':checked'),
            "fighting": $('#fighting').is(':checked'),
            "threatenting": $('#threatening').is(':checked'),
            "property_damage": $('#property_damage').is(':checked'),
            "stealing_cheating": $('#stealing_cheating').is(':checked'),
            "behavior_other": $('#behavior_other').is(':checked')
        }
        var consequences = {
            "event_loss": $('#event_loss').is(':checked'),
            "conference": $('#conference').is(':checked'),
            "parent_contact": $('#parent_contact').is(':checked'),
            "suspension": $('#suspension').is(':checked'),
            "consequence_other": $('#consequence_other').is(':checked')
        }

        var newForm = {
            "childName": $('#nameid').val(),
            "date": $('#dateid').val(),
            "staffName": $('#staffid').val(),
            "location": $('#locationid').val(),
            "issuerName": $('#issuedbyid').val(),
            "behaviors": behaviors,
            "consequences": consequences,
            "staffComments": $('#commentsid').val()
        }

        data = newForm;
        firebase.database().ref('behavior/').push(data, function (err) {
            if (err) {
                alert("Data did not send");
            }
            window.location.href = "print_and_email.html";

        });

        return false;
    }
}
