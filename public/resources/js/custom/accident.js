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
            printPDF(FORM_ID);
            //window.location.href = "print_and_email.html";

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
            {text: "Accident Report", style: "main_header"}
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
