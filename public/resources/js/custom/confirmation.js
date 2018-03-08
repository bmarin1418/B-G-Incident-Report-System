$(document).ready(function () {
    firebaseInit();
    var form_type = sessionStorage.getItem('form_type');
    udpateMetaData(form_type);
    
    var retrieveAndPrint = function (){
        var doc_def = sessionStorage.getItem('doc_def');
        doc_def = JSON.parse(doc_def)
        pdfMake.createPdf(doc_def).open();
    }

    $("#print-again-button").click(retrieveAndPrint);
    $("#home-button").click(function(){
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
            var today = new Date();
            var club = getClub();
            var cur_month = monthNames[today.getMonth()];
            metadata_path = 'locations/' + club + '/metadata/' + form_type + '/' + cur_month + '_count';
            last_month_reset_path = 'locations/' + club + '/metadata/' + form_type + '/last_month_reset';
            firebase.database().ref(last_month_reset_path).once('value').then(function (snapshot) {
                var last_reset_month = snapshot.val();
                if (last_reset_month != cur_month) {
                    firebase.database().ref(metadata_path).set(0);
                    firebase.database().ref(last_month_reset_path).set(cur_month);
                } else {
                    firebase.database().ref(metadata_path).once('value').then(function(snapshot) {
                        month_count = parseInt(snapshot.val()) + 1;
                        firebase.database().ref(metadata_path).set(month_count);
                    });
                }
            });
        } else {
            window.location.href = "index.html";
        }
    });
} 

