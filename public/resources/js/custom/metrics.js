$(document).ready(function () {
    firebaseInit();
    //firebase.database().ref('/locations/carmichael/').once('value').then(function(snapshot) {
    //  console.log(snapshot.val());
    //});
});

function searchUID() {
    var uid = document.getElementById('userID').value;
    if (uid === "") {
        document.getElementById("search_result").innerHTML = 'Please enter a student ID'
    } else {
        console.log(uid);
        var str = '/locations/carmichael/students/';
        str += uid;
        console.log(str)
        document.getElementById("showForms").style = "display: none;";
        document.getElementById("forms_found").innerHTML = '';
        firebase.database().ref(str).once('value').then(function (snapshot) {
            // make sure the student being searched for actually exists
            if (snapshot.val() != null) {
                var phrase = 'Student ';
                phrase += uid;
                phrase += ' found. Incident reports include: ';
                // determine which incident reports exist in the database
                document.getElementById("search_result").innerHTML = phrase;
                var behavior = str + '/behavior';
                var accident = str + '/accident';
                var general = str + '/general';
                console.log(behavior)
                    // check for behavior forms
                var form_types = ''
                firebase.database().ref(behavior).once('value').then(function (snapshot) {
                    if (snapshot.val() != null) {
                        if (form_types == '') {
                            form_types = 'Behavior';
                        } else {
                            form_types += ' and Behavior';
                        }
                        document.getElementById("forms_found").innerHTML = form_types;
                        console.log('behavior found')
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
                        document.getElementById("forms_found").innerHTML = form_types;
                        console.log('accident found')
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
                        document.getElementById("forms_found").innerHTML = form_types;
                        console.log('general found')
                    }
                });
                document.getElementById("showForms").style = "display: inline-block;";
            } else {
                // print error message if not
                document.getElementById("search_result").innerHTML = 'You have either entered an incorrect student ID number, or that student has no incident reports in the database. Please try again.'
            }

        });
    }
}


// query the entire JSON
// what are the keys?
// go through all of the keys
// or
// access just the json w/ those keys
// query on those keys
