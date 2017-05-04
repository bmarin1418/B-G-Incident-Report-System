//Prompt confirmation of logout
function confirmLogout() {
    swal({
            title: "Are you sure you want to logout?",
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
                firebase.auth().signOut();
                window.location.href = "index.html";
            } else {
                return;
            }
        });
}

//Initialize Firebase
function firebaseInit() {
    var config = {
        apiKey: "AIzaSyBGobM_iD5YqUo09kAu2bSfXlhQhJaz3-U",
        authDomain: "bngcdb-86373.firebaseapp.com",
        databaseURL: "https://bngcdb-86373.firebaseio.com",
        storageBucket: "bngcdb-86373.appspot.com",
        messagingSenderId: "164973952286"
    };
    firebase.initializeApp(config);
}

//Fill in the current date for the date field
function initDateField(date_field_id) {
    $(date_field_id)[0].valueAsDate = new Date();
}

//Redirect to choose_form.html
function backToChoose() {
    window.location.href = "choose_form.html";
}