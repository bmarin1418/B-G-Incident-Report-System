//Fill in the current date for the date field
function initDateField(date_field_id) {
    $(date_field_id)[0].valueAsDate = new Date();
}

//Gets the appropriate club for the user
function getClub(){
        var club;
        switch(firebase.auth().currentUser.email){
          case "occstaff@bngc.com":
            club = "carmichael";
            break;
          case "wilsonstaff@bngc.com":
            club = "wilson";
            break;
          case "lasallestaff@bngc.com":
            club = "lasalle";
            break;
          case "harrisonstaff@bngc.com":
            club = "harrison";
            break;
          case "battellstaff@bngc.com":
            club = "battell";
            break;
          default:
            club = "none";
            break;
        }
        return club;
}

//Add a signature line for the staff on a form
function addSignatureLineTo(document_definition, indx) {
    document_definition.content.splice(indx, 0, {
       text: '\n\nStaff Signature: _____________________________________________\n\nSignature Date: _____________________________________________',
       style: 'form_field_title'
    });
    return document_definition;
}








