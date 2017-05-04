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
    var $studentID = $('#nameid').val();
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
    firebase.database().ref('locations/carmichael/students/'+$studentID+'/behavior/').push(data, function (err) {
      if (err) {
        alert("Data did not send");
      }
      printPDF(FORM_ID);
      //window.location.href = "confirmation_page.html";

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
        text: "\nMember Behavior Report",
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
  document_definition = addInputsTo(document_definition); //TODO implement this
  //document_definition.content.append({text: '\n Staff Signature', style:'form_field_title'})
  //If a head injury occured, add that page

  pdfMake.createPdf(document_definition).open();
}

function addInputsTo(document_definition) {
  var form_inputs = $(FORM_ID).serializeArray();
  var form_groups = $(FORM_ID).find('.form_group');

  //Serialize arrary returns a different size array when there is and isn't a checked checkbox
  //which makes the indexing a headache. That is why there is an index offset if the checkbox is
  //checked.

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
      }
      else{
        if($(label).text() == 'Inappropriate Behavior Type'){
          var selected = "";
          $('#behaviors input:checked').each(function() {
            selected = selected + " " + $(this)[0].nextSibling.nodeValue;
          });
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
        }
        if($(label).text() == 'Consequences'){
          var selected = "";
          $('#consequences input:checked').each(function() {
            selected = selected + " " + $(this)[0].nextSibling.nodeValue;
          });
          var title = {
            text: '\n' + $(label).text() + '',
            style: 'form_field_title'
          };
          var txt = {
            text: selected,
            style: 'form_field'
          };
          document_definition.content.push(title);
          document_definition.content.push(txt);        }
      }
    }
  });
  return document_definition;
}
