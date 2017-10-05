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
        var data = [];
        var $form = $(this);

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
        var studentID = $('#member_id').val();
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
        var club = getClub();
        if (club != "none") {
            firebase.database().ref('locations/' + club + '/students/' + studentID + '/behavior/').push(data, function (err) {
                if (err) {
                    sweetAlert("Form Did Not Submit", "Check your internet connection and try again");
                } else if (noBoxChecked(behaviors) && noBoxChecked(consequences)) {
                    sweetAlert("Form Did Not Submit", "Please check at least one box under the \"Inappropriate Behavior Type\" and \"Consequences\" sections");
                } else if (noBoxChecked(behaviors)) {
                    sweetAlert("Form Did Not Submit", "Please check at least one box under the \"Inappropriate Behavior Type\" section");
                } else if (noBoxChecked(consequences)) {
                    sweetAlert("Form Did Not Submit", "Please check at least one box under the \"Consequences\" section");
                } else {
                    printPDF();
                }
            });
        } else {
            sweetAlert("Login Issue", "Unknown club location, please login again to submit a form");
        }
        return false;
    }
}

//Take the form and turn it to JSON to make a pdf
function printPDF() {
    document_definition = {
        content: [
            {
                image: BASE_64_BNG_LOGO,
                width: 109,
                height: 65,
                style: "center"
      },
            {
                text: "BOYS AND GIRLS CLUBS",
                style: "main_header"
      },
            {
                text: "OF ST. JOSEPH COUNTY",
                style: "sub_header"
      },
            {
                text: "\nMember Behavior Report",
                style: "form_title"
      },
            {
                text: "\n*Fighting, blatant disrespect of staff or others, and destruction of property all result in an automatic 3-day suspension from the club",
                style: "suspension_header"
      },
    ],
        styles: {
            suspension_header: {
                alignment: "center",
                bold: "true"
            },
            center: {
                alignment: "center"
            },
            main_header: {
                fontSize: 20,
                bold: true,
                alignment: "center"
            },
            sub_header: {
                fontSize: 15,
                alignment: "center"
            },
            form_title: {
                fontSize: 18,
                alignment: "center"
            },
            form_field_title: {
                bold: true,
                fontSize: 12,
                alignment: 'left'
            },
            form_field: {
                fontSize: 12,
                alignment: 'left'
            }
        }
    }
    document_definition = addInputsTo(document_definition);
    document_definition = addExtraLinesTo(document_definition);
    document_definition = JSON.stringify(document_definition)
    sessionStorage.setItem('doc_def', document_definition);
    window.location.href = "confirmation_page.html";
}

function addExtraLinesTo(document_definition) {
    document_definition.content.push({
        text: 'Please discuss this behavior with your child. Contact your club director if you have any questions about this report. Please note that if inappropriate behavior/incidents continue, it may result in automatic suspension or termination from the club. Thank you.',
        style: 'form_field'
    });
    document_definition.content.push({
        text: '\nClub Director/Authorized Signature: _____________________________________________',
        style: 'form_field_title'
    });
    document_definition.content.push({
        text: '\nParent/Guardian Signature: _____________________________________________\n(Must be returned signed in order for member to re-enter club)',
        style: 'form_field_title'
    });
    return document_definition;
}

function addInputsTo(document_definition) {
    var form_inputs = $(FORM_ID).serializeArray();
    var form_groups = $(FORM_ID).find('.form_group');

    form_groups.each(function (form_index) {
        var label = $(this).find('label')[0];
        if (label) {
            if ($(label).text() != 'Inappropriate Behavior Type' && $(label).text() != 'Consequences') {
                var title = {
                    text: '\n' + $(label).text() + '',
                    style: 'form_field_title'
                };
                var txt = {
                    text: form_inputs[form_index].value,
                    style: 'form_field'
                };
                document_definition.content.push(title);
                document_definition.content.push(txt);
            } else {
                if ($(label).text() == 'Inappropriate Behavior Type') {
                    var selected = "";
                    $('#behaviors input:checked').each(function () {
                        selected = selected + " " + $(this)[0].nextSibling.nodeValue;
                    });
                    if ($(OTHER_BEHAVIOR_CHECK_ID).is(":checked")) {
                        selected = selected + ": " + $(OTHER_BEHAVIOR_INPUT_ID).val();
                    }
                    var title = {
                        text: '\n' + $(label).text() + '',
                        style: 'form_field_title'
                    };
                    var txt = {
                        text: selected,
                        style: 'form_field'
                    };
                    document_definition.content.push(title);
                    document_definition.content.push(txt);

                    if ($(OTHER_BEHAVIOR_CHECK_ID).is(":checked")) {
                        document_definition.content.push({
                            text: '\n'
                        });
                    }
                }
                if ($(label).text() == 'Consequences') {
                    var selected = "";
                    $('#consequences input:checked').each(function () {
                        selected = selected + " " + $(this)[0].nextSibling.nodeValue;
                    });
                    if ($(OTHER_CONSEQUENCE_CHECK_ID).is(":checked")) {
                        selected = selected + ": " + $(OTHER_CONSEQUENCE_INPUT_ID).val() + '\n';
                    }
                    var title = {
                        text: $(label).text() + '',
                        style: 'form_field_title'
                    };
                    var txt = {
                        text: selected,
                        style: 'form_field'
                    };
                    document_definition.content.push(title);
                    document_definition.content.push(txt);
                    if ($(OTHER_CONSEQUENCE_CHECK_ID).is(":checked")) {
                        document_definition.content.push({
                            text: '\n'
                        });
                    }
                }
            }
        }
    });
    return document_definition;
}

function noBoxChecked(checkboxes) {
  for (var key in checkboxes) {
    if (checkboxes[key]) {
      return false;
    }
  }

  return true;
}
