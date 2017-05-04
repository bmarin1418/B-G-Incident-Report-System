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

        var $studentID = $('#nameid').val();

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
        firebase.database().ref('locations/carmichael/students/'+$studentID+'/accident/').push(data, function (err) {
            if (err) {
                alert("Data did not send");
            }
            printPDF();
            //window.location.href = "print_and_email.html";

        });

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
                text: "\nAccident Report",
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
    var document_definition = addInputsTo(document_definition);
    //document_definition.content.append({text: '\n Staff Signature', style:'form_field_title'})
    //If a head injury occured, add that page
    if ($(HEAD_INJURY_ID).is(':checked')) {
        var treatment_index = document_definition.content.length - 4;
        document_definition.content.splice(treatment_index, 0, {text: "Head Injury Report", pageBreak: "before", style:"form_title"})
        document_definition.content.splice(treatment_index, 0, "Dear Parent/Guardian:\nToday, your child had an injury to his/her head. At present, he/she does not seem to exhibit any alarming symptoms. However, bumps or blows to the head sometimes cause a mild brain injury called a concussion. Signs of head injury can occur immediately or develop over several hours. Be alert and watch for the following symptoms:");
        
        document_definition.content.splice(treatment_index, 0, {
            ul: [
                "Persistent headache and /or stiff neck",
                "Slurred speech or blurry vision",
                "Any episodes of nausea or vomiting",
                "Loss of muscle coordination-unsteady walking, staggering balance, or weakness in an arm, hand or leg",
                "Having more trouble than usual remembering things, concentrating or making decisions",
                "Becoming easily irritated for little or no reason",
                "Any loss of conciseness",
                "Feeling sad, anxious or listless",
                "Extreme drowsiness or unable to arouse from sleep",
                "Any excess bleeding from the wound .Blood or clear watery liquid coming from the ears or nose",
                "Avoid all sedatives or narcotics"
                
            ]
        });
        
        document_definition.content.splice(treatment_index, 0, "It is important to call or see your doctor immediately if any of the above signs are observed in your child.")
        
        document_definition.content.push("Please note: This advice is a collaboration of general researched practices and is not intended as a substitute for medical advice, diagnosis, or treatment. Always seek the advice of a qualified health provided with any questions you may have regarding a medical condition. Never disregard professional advice or delay in seeking it because of the information provided above. If you think your child may have a medical emergency, call your doctor or 911 immediately.");

    }
    pdfMake.createPdf(document_definition).open();
}

//Take the form inputs and add them to the pdf document definition
function addInputsTo(document_definition) {
    var form_inputs = $(FORM_ID).serializeArray();
    var form_groups = $(FORM_ID).find('.form_group');
    //Serialize arrary returns a different size array when there is and isn't a checked checkbox
    //which makes the indexing a headache. That is why there is an index offset if the checkbox is
    //checked.

    var index_offset = 0;
    form_groups.each(function (form_index) {
            var label = $(this).find('label')[0];
            if (label) {
                if (form_inputs[form_index - index_offset].value) {
                    if ($(HEAD_INJURY_ID).is(':checked') ||
                    ($(label).text() != 'Nature of Head Injury' && $(label).text() != 'Treatment Given')) {
                        var title = {
                            text: '\n' + $(label).text() + '',
                            style: 'form_field_title'
                        };
                        var txt = {
                            text: form_inputs[form_index - index_offset].value,
                            style: 'form_field'
                        };
                        document_definition.content.push(title);
                        document_definition.content.push(txt);
                    }
                }
            } else {
                if (!$(HEAD_INJURY_ID).is(':checked')) {
                    index_offset += 1;
                }
            }
        });
    return document_definition;
}
