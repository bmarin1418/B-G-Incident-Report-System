// We want to clean out the database of records over 5 years old. This script is to run on a page accessible only by admins
// and should be called after firebaseInit(), which is found in allpages.js, has been called by some other script.

$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (user) { // This assures the firebaseInit is done and we can get club
        if (user) {
            cleanDbIfNeeded()
        } else {
            console.log('Error logging in user, could not start database cleaning');
        }
}

//Check whether it's been long enough to start a cleaning run, or if we started one we didn't finish and need to continue, then start if necessary
function cleanDbIfNeeded() {
    var club = getClub();      //From the logged in user e-mail
    var last_cleaned_on_path = '/locations/' + club + '/metadata/last_db_clean_date;
    firebase.database().ref(form_query).once('value').then(function (snapshot) {
        var time_btwn_cleans = 1.577e+10 //This is 6 months in ms
        var time_since_last_clean = (new Date() - new Date(snapshot.val()))
        if (time_btwn_cleans > time_since_last_clean) {
            cleanDb();
        }
    });
}

//Do actual cleaning of database
function cleanDb() {
    var club = getClub();      //From the logged in user e-mail
    var forms_query_base = '/locations/' + club + '/students/';
    firebase.database().ref(form_query).once('value').then(function (snapshot) {
        console.log(snapshot.val());
    });
}
