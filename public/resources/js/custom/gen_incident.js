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
        var studentID = $('#member_id').val();
        var newForm = {
            "childName": $('#nameid').val(),
            "date": $('#dateid').val(),
            "staffName": $('#staffid').val(),
            "witnessName": $('#witnessid').val(),
            "location": $('#locationid').val(),
            "incidentDescription": $('#incidentid').val(),
            "responseDescription": $('#responseid').val()
        }

        var club = getClub();
        if (club != "none") {
            firebase.database().ref('locations/' + club + '/students/' + studentID + '/accident/').push(newForm, function (err) {
                if (err) {
                    sweetAlert("Form Did Not Submit", "Check your internet connection and try again");
                } else {
                    printPDF();
                }
            });
        } else {
            sweetAlert("Login Issue", "Unknown club location, please login again to submit a form");
        }
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
                style: "logo"
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
                text: "\nGeneral Incident Report",
                style: "form_title"
            }
        ],
        styles: {
            logo: {
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
    document_definition = addSignatureLineTo(document_definition, document_definition.content.length);
    document_definition.content.push({
        text: '\n\nBranch Director Signature: _____________________________________________',
        style: 'form_field_title'
    });
    document_definition.content.push({
        text: '\nSignature Date: ________________________________________________________',
        style: 'form_field_title'
    });
    document_definition = JSON.stringify(document_definition)
    sessionStorage.setItem('doc_def', document_definition);
    window.location.href = "confirmation_page.html";
}

//Take the form inputs and add them to the pdf document definition
function addInputsTo(document_definition) {
    var form_inputs = $(FORM_ID).serializeArray();
    var form_groups = $(FORM_ID).find('.form_group');

    form_groups.each(function (form_index) {
        var label = $(this).find('label')[0];
        if (label) {
            if (form_inputs[form_index].value) {
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
            }
        }
    });
    return document_definition;
}
