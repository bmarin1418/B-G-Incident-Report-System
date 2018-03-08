/* ------ HTML id's for global use ------ */

var FORM_ID = '#member_behavior_form';
var SUBMIT_BUTTON_ID = '#sendForm';
var LOGOUT_ID = '#logout';
var DATE_FIELD_ID = '#dateid';
var OTHER_CONSEQUENCE_CHECK_ID = '#consequence_other';
var OTHER_CONSEQUENCE_INPUT_ID = '#other_consequence';
var OTHER_BEHAVIOR_CHECK_ID = '#behavior_other';
var OTHER_BEHAVIOR_INPUT_ID = '#other_behavior';

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

    $(OTHER_BEHAVIOR_CHECK_ID).change(function () {
        var cntxt = this;
        otherChangeHandler(cntxt, OTHER_BEHAVIOR_INPUT_ID);
    });

    $(OTHER_CONSEQUENCE_CHECK_ID).change(function () {
        var cntxt = this;
        otherChangeHandler(cntxt, OTHER_CONSEQUENCE_INPUT_ID);
    });

    $(document).keypress(function (e) {
        var key = e.which;
        var enter_key_num = 13;
        if (key == enter_key_num) {
            submitClickHandler(inputValidator);
        }
    });
}

//Link click on other checkbox to showing or hiding the input
function otherChangeHandler(cntxt, other_id) {
    if ($(cntxt).is(":checked")) {
        $(other_id).show();
    } else {
        $(other_id).hide();
    }
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
        issuer: {
            presence: true
        },
        location: {
            presence: true
        },
        comments: {
            presence: true
        },
        behaviors: behaviorChecked,
        other_behavior: presentIfOtherBehavior,
        other_consequence: presentIfOtherConsequence
    });
}

//Function to set validation at runtime depending on the behavior other checkbox checked status
function presentIfOtherBehavior(value, attributes, attributeName, options, constraints) {
    if ($(OTHER_BEHAVIOR_CHECK_ID).is(':checked')) {
        return {
            presence: true
        }
    } else {
        return {
            presence: false
        }
    }
}

//Function to set validation at runtime depending on the behavior other checkbox checked status
function behaviorChecked(value, attributes, attributeName, options, constraints) {
    if ($('#stealing_cheating').is(':checked')) {
        return {
            presence: true
        }
    } else {
        return {
            presence: false
        }
    }
}

//Function to set validation at runtime depending on the consequence checkbox checked status
function presentIfOtherConsequence(value, attributes, attributeName, options, constraints) {
    if ($(OTHER_CONSEQUENCE_CHECK_ID).is(':checked')) {
        return {
            presence: true
        }
    } else {
        return {
            presence: false
        }
    }
}

//Send accident form data to firebase if the input is valid
function submitClickHandler(inputValidator) {
    if (inputValidator.validate()) {
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
            "threatening": $('#threatening').is(':checked'),
            "property_damage": $('#property_damage').is(':checked'),
            "stealing_cheating": $('#stealing_cheating').is(':checked'),
            "behavior_other": $('#behavior_other').is(':checked'),
            "other_behavior": $('#other_behavior').val()

        }
        var consequences = {
            "event_loss": $('#event_loss').is(':checked'),
            "conference": $('#conference').is(':checked'),
            "parent_contact": $('#parent_contact').is(':checked'),
            "suspension": $('#suspension').is(':checked'),
            "consequence_other": $('#consequence_other').is(':checked'),
            "other_consequence": $('#other_consequence').val()
        }

        var newForm = {
            "memberId": $('#member_id').val(),
            "childName": $('#nameid').val(),
            "date": $('#dateid').val(),
            "staffName": $('#staffid').val(),
            "location": $('#locationid').val(),
            "issuerName": $('#issuedbyid').val(),
            "behaviors": behaviors,
            "consequences": consequences,
            "staffComments": $('#commentsid').val()
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
                sweetAlert("Uh Oh", "No User is Logged In");
            }
        });
    } else {
        sweetAlert("Oops", "Something isn't correctly filled in on your form");
    }
}

// Send the form info to the database and then create the JSON for a pdf
function submitAndPrint(newForm, club) {
    firebase.database().ref('locations/' + club + '/students/' + newForm["memberId"] + '/behavior/').push(newForm, function (err) {
        if (err) {
            sweetAlert("Form Did Not Submit", "Check your internet connection and try again");
        } else if (noBoxChecked(behaviors) && noBoxChecked(consequences)) {
            sweetAlert("Form Did Not Submit", "Please check at least one box under the \"Inappropriate Behavior Type\" and \"Consequences\" sections");
        } else if (noBoxChecked(behaviors)) {
            sweetAlert("Form Did Not Submit", "Please check at least one box under the \"Inappropriate Behavior Type\" section");
        } else if (noBoxChecked(consequences)) {
            sweetAlert("Form Did Not Submit", "Please check at least one box under the \"Consequences\" section");
        } else {
            //get JSON representation of PDF to print, then save to session storage for later printing
            var document_definition = getBehaviorJSON(newForm);
            document_definition = JSON.stringify(document_definition);
            sessionStorage.setItem('doc_def', document_definition);
            sessionStorage.setItem('form_type', 'behavior');
            window.location.href = "confirmation_page.html";
        }
    });
}

function noBoxChecked(checkboxes) {
    for (var key in checkboxes) {
        if (checkboxes[key]) {
            return false;
        }
    }
    return true;
}
