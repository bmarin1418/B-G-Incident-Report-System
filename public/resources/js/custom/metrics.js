$(document).ready(function () {
    firebaseInit();
    //firebase.database().ref('/locations/carmichael/').once('value').then(function(snapshot) {
    //  console.log(snapshot.val());
    //});
});

// Prompt errors w/ searching by uid
function uidError(message) {
    swal({
            title: "Error",
            text: message,
            type: "warning",
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonText: "Close",
            closeOnCancel: true
        });
}

function loadingForms() {
    swal({
        title: "Searching...",
        text: "Please wait",
        imageUrl: "https://github.com/bmarin1418/B-G-Incident-Report-System/blob/59db4d0ad1ec3d157b975763245c93303f6ae1b6/public/resources/img/ajax-loader.gif?raw=true",
        showConfirmButton: false,
        allowOutsideClick: false
    });
}

// Search by student UID
function searchUID() {
    var uid = document.getElementById('userID').value;
    var locationSelected = false;
    if (uid === "") {
        // throw error if no ID number was entered
        uidError("Please enter a student ID number")
    } else {
        console.log(uid);
        // determine the location that we're looking at via the locations dropdown
        if (document.getElementById("location").value != "") {
            locationSelected = true;
            var str = '/locations/' + document.getElementById("location").value + '/students/';
        }
        else {
            uidError("Please select a location");
        }
        // only proceed with the search for uid if they have selected a location
        if (locationSelected == true) {
            str += uid;
            console.log(str)
            document.getElementById("showForms").style = "display: none;";
            document.getElementById("forms_found").innerHTML = '';
            firebase.database().ref(str).once('value').then(function (snapshot) {
                // make sure the student being searched for actually exists
                if (snapshot.val() != null) {
                    var behavior = str + '/behavior';
                    var accident = str + '/accident';
                    var general = str + '/general';
                    loadingForms();
                    // check for behavior forms
                    var form_types = ''
                    firebase.database().ref(behavior).once('value').then(function (snapshot) {
                        if (snapshot.val() != null) {
                            if (form_types == '') {
                                form_types = 'Behavior';
                            } else {
                                form_types += ' and Behavior';
                            }
                        }
                    });
                    // check for accident forms
                    firebase.database().ref(accident).once('value').then(function (snapshot) {
                        if (snapshot.val() != null) {
                            if (form_types == '') {
                                form_types = 'Accident';
                            } else {
                                form_types += ' and Accident';
                            }
                        }
                    });
                    // check for general incident forms
                    firebase.database().ref(general).once('value').then(function (snapshot) {
                        if (snapshot.val() != null) {
                            if (form_types == '') {
                                form_types = 'General Incident';
                            } else {
                                form_types += ' and General Incident';
                            }
                        }
                    });
                    // wait three seconds for query to complete
                    setTimeout(function(){
                        window.location.href = 'view_forms.html'+'?uid='+document.getElementById('userID').value+'&forms_found='+form_types
                    }, 3000);
                } else {
                    // print error message if not
                    uidError("You have either entered an incorrect student ID number, or that student has no incident reports in the database. Please try again.")
                }
        });
        }
    }
}

