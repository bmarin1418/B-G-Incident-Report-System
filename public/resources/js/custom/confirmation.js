var PRINT_AGAIN_ID = "#print-again-button";
var HOME_ID = "#home-button";

$(document).ready(function () {
    firebaseInit();
    var form_type = sessionStorage.getItem('form_type');
    udpateMetaData(form_type);
    
    var retrieveAndPrint = function (){
        var doc_def = sessionStorage.getItem('doc_def');
        doc_def = JSON.parse(doc_def)
        pdfMake.createPdf(doc_def).open();
    }

    $(PRINT_AGAIN_ID).click(retrieveAndPrint);
    $(HOME_ID).click(function(){
        sessionStorage.clear();
        window.location.replace("choose_form.html")
    });
    retrieveAndPrint();
});

//Update the metadata the database stores about forms
function udpateMetaData(form_type) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var err_msg = "We couldn't update metadata. Check your connection and if the problem persists contact an administrator.";
            var today = new Date(sessionStorage.getItem('date')); //We'll just call whatever the user chose for the date 'today'
            var club = getClub();
            var cur_month = monthNames[today.getMonth()];
            metadata_path_count = 'locations/' + club + '/metadata/' + form_type + '/' + cur_month + '_count';
            metadata_path_times = 'locations/' + club + '/metadata/' + form_type + '/' + cur_month + '_times';
            last_month_reset_path = 'locations/' + club + '/metadata/' + form_type + '/last_month_reset';
            firebase.database().ref(last_month_reset_path).once('value').then(function (snapshot) {
                //If we are on a new month, reset the data for the month
                var last_reset_month = snapshot.val();
                if (last_reset_month != cur_month) {
                    firebase.database().ref(metadata_path_count).set(0);
                    firebase.database().ref(metadata_path_times).set(0);
                    firebase.database().ref(last_month_reset_path).set(cur_month);
                } 
                
                //Add this form to the metadata info
                firebase.database().ref(metadata_path_count).once('value').then(function(snapshot) {
                    month_count = parseInt(snapshot.val()) + 1;
                    firebase.database().ref(metadata_path_count).set(month_count);
                    firebase.database().ref(metadata_path_times).push(sessionStorage.getItem('date'));
                });
            });
        } else {
            window.location.href = "index.html";
        }
    });
}

