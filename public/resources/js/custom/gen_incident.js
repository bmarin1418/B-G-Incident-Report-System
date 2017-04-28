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
        var data = [];
        var $form = $(this);
        console.log("Submit to Firebase");

        var newForm = {
            "childName": $('#nameid').val(),
            "date": $('#dateid').val(),
            "staffName": $('#staffid').val(),
            "witnessName": $('#witnessid').val(),
            "location": $('#locationid').val(),
            "incidentDescription": $('#incidentid').val(),
            "responseDescription": $('#responseid').val()
        }

        data = newForm;
        firebase.database().ref('general/').push(data, function (err) {
            if (err) {
                alert("Data did not send");
            }
            printPDF(FORM_ID);
            // window.location.href = "print_and_email.html";

        });

        return false;
    }
}

//Take the form and turn it to JSON to make a pdf
function printPDF(form_id) {
    var user_inputs = $(form_id).find('input');
    document_definition = {
        content: [
            {image: BASE_64_BNG_LOGO, style: "main_header"},
            {text: "BOYS AND GIRLS CLUBS", style: "main_header"},
            {text: "OF ST. JOSEPH COUNTY", style: "sub_header"},
            {text: "General Incident Report", style: "main_header"}
        ],
        styles: {
            main_header: {
                fontSize: 20,
                bold: true,
                alignment: "center"
            },
            sub_header: {
                fontSize: 15,
                alignment: "center"
            },
            'form_field': {
                fontSize: 12,
                alignment: 'left'
            }
        }
    }

    $(form_id).find('.form_group').each(function(index) {
        var label = $(this).find('label')[0];
        var input = $(this).find('input')[0];
        var txt = {text: $(label).text() + ': \n' + $(input).text(), style: 'form_field'};
        document_definition.content.push(txt);
    });   
    
    printForm(document_definition);
}
