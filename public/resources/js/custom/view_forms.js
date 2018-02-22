FORM_DISPLAY_ID = "#json"

$(document).ready(function () {
    firebaseInit();
    var urlToParse = location.search;
    var url_params = parseQueryString(urlToParse);
    var form_types = parseFormTypes(url_params); //So we can tell the user what type each form we retrieved is
    firebase.auth().onAuthStateChanged(function (user) { // This assures the firebaseInit is done and we can get club
        if (user) {
            var club = getClub(); //   from the logged in user e-mail
            var database_query_base = '/locations/' + club + '/students/' + url_params.uid;
            for (var form_type_i = 0; form_type_i < form_types.length; form_type_i++) { // loop through all of the different types of forms submitted
                var form_query = database_query_base + '/' + form_types[form_type_i].toLowerCase(); //This adds the type of form we're looking for
                (function (form_type_i) { //Closure to preserve form_type_i for asyncronous callback
                    firebase.database().ref(form_query).once('value').then(function (snapshot) { //return all forms of that type for a given student
                        var form_json = snapshot.val(); //form_json is indexed by the random hash for the each
                        displayForms(form_json, form_types, form_type_i); //   form, followed by form keys
                    });
                })(form_type_i);
            }
        } else {
            sweetAlert("Uh Oh", "There isn't a logged in user");
        }
    });
});

// Return an array of form types for this student (accident, General Incident, or Behvior)
function parseFormTypes(url_params) {
    var form_types = url_params.forms_found.split("%20");
    for (i = 0; i < form_types.length; i++) {
        if (form_types[i] == "and") {
            form_types.splice(i, 1);
        }
    }
    return form_types
}

// Parse the URL parameters
var parseQueryString = function (url) {
    var urlParams = {};
    url.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function ($0, $1, $2, $3) {
            urlParams[$1] = $3;
        }
    );
    return urlParams;
}

// Put up some basic form info and buttons for the form
function displayForms(form_json, form_types, form_type_i) {
    form_type = form_types[form_type_i];
    var padding = (form_type_i == 0 ? "0px" : "30px"); //Don't pad the first form type title
    $(FORM_DISPLAY_ID).append("<h4 style='padding-top: " + padding + "'>" + form_type + " Forms</h4>");
    for (hash_id in form_json) {
        tags = "<div class='form_container' id='" + hash_id + "'>" //Add a div to surround a given form
        for (key in form_json[hash_id]) { //Pick select data from the form to display
            tags += displayKey(form_json[hash_id], key);
        }

        //Now add a delete and view button
        var view_button_id = form_type + '_view_' + hash_id;
        var delete_button_id = form_type + '_delete_' + hash_id;
        tags += generateButtomHTML(view_button_id, delete_button_id);
        tags += '</div>'
        $(FORM_DISPLAY_ID).append(tags);

        //Associate the form with the div for easy retrieval later and bind handlers
        $('#' + hash_id).data('form', form_json);
        $('#' + view_button_id).click(viewHandler);
        $('#' + delete_button_id).click(deleteHandler);
    }
}

// Create a string with HTML for a view and delete button, with Id's based on the form_type, hash_id, and button type
function generateButtomHTML(view_button_id, delete_button_id) {
    var tags = "";
    tags += '<br><button class="mdl-button mdl-js-button mdl-button--raised mdl-color--grey-100" id="' + view_button_id + '">View</button>';
    tags += '<button class="mdl-button mdl-js-button mdl-button--raised mdl-color--grey-100" id="' + delete_button_id + '">Delete</button><br>';
    return tags
}

// Handler to create a pdf for a form on a view button click
function viewHandler(event) {
    var form_info = $(this).attr('id').split('_', 3); //return array containing [form_type, button_type, hash_id]
    var form_json = $('#' + form_info[2]).data()['form'][form_info[2]]; // We don't care about the hash name for form PDF generation
    var document_definition;
    if (form_info[0] == 'Behavior') {
        document_definition = getBehaviorJSON(form_json);
    } else if (form_info[0] == "Accident") {
        document_definition = getAccidentJSON(form_json);
    } else if (form_info[0] == "General") {
        document_definition = getGeneralIncidentJSON(form_json);
    }
    pdfMake.createPdf(document_definition).open();
}

// Handler to allow user to delete a form
function deleteHandler(event) {
    var this_ref = $(this);
    firebase.auth().onAuthStateChanged(function (user) { // This assures the firebaseInit is done and we can get club
        if (user) {
            swal({
                    title: "Are you sure you want to permanently delete this form?",
                    text: "",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#0288d1",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    closeOnConfirm: false,
                    closeOnCancel: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        var club = getClub(); //   from the logged in user e-mail
                        var urlToParse = location.search;
                        var url_params = parseQueryString(urlToParse);
                        var form_info = this_ref.attr('id').split('_', 3); //return array containing [form_type, button_type, hash_id]
                        var form_type = form_info[0].toLowerCase();
                        var hash_id = form_info[2];
                        var form_path = '/locations/' + club + '/students/' + url_params.uid + '/' + form_type + '/' + hash_id;
                        firebase.database().ref(form_path).remove(function(error){
                            if (!error) {
                                if (this_ref.parent("div").prev().is("h4")) { //Remove the form type title if there are no more forms of that type
                                    this_ref.parent("div").prev().remove();
                                }
                                this_ref.parent("div").remove();
                                sweetAlert("Success", "Your form has been permanently deleted");
                            } else {
                                sweetAlert("Deletion Error", "Error deleting form");
                            }
                        });
                    } else {
                        return;
                    }
                });

        } else {
            sweetAlert("Uh Oh", "There isn't a logged in user");
        }
    });
}

// Put info for a given form property up on the DOM
function displayKey(form_json, key) {
    if (key == "childName") {
        return "<b>Name of child: </b>" + form_json["childName"] + "\n";
    } else if (key == "date") {
        return "<b>Date of incident: </b>" + form_json["date"] + "\n";
    } else if (key == "staffName") {
        return "<b>Form submitted by: </b>" + form_json["staffName"] + "\n";
    } else {
        return "";
    }
}