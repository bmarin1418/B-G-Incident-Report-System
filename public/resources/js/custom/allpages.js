// Prompt help option
function help() {
    swal({
            title: "Help",
            text: "Need help?\n\nPlease contact Professor Shreya Kumar from the Computer Science Department at the University of Notre Dame.\n\nshreya.kumar@nd.edu\n(574)-631-7381",
            type: "warning",
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonText: "Close",
            closeOnCancel: true
        });
}

//Prompt confirmation of logout
function confirmLogout() {
    swal({
            title: "Logout",
            text: "Are you sure you want to logout?",
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

//Redirect to choose_form.html
function backToChoose() {
    window.location.href = "choose_form.html";
}

//Gets the appropriate club based on the logged in user so we know where to store in the database
function getClub() {
    var club;
    switch (firebase.auth().currentUser.email) {
    case "occstaff@bgc.com":
        club = "carmichael";
        break;
    case "occadmin@bgc.com":
        club = "carmichael";
        break;
    case "wilsonstaff@bgc.com":
        club = "wilson";
        break;
    case "wilsonadmin@bgc.com":
        club = "wilson";
        break;
    case "lasallestaff@bgc.com":
        club = "lasalle";
        break;
    case "lasalleadmin@bgc.com":
        club = "lasalle";
        break;
    case "harrisonstaff@bgc.com":
        club = "harrison";
        break;
    case "harrisonadmin@bgc.com":
        club = "harrison";
        break;
    case "battellstaff@bgc.com":
        club = "battell";
        break;
    case "battelladmin@bgc.com":
        club = "battell";
        break;
    default:
        club = "none";
        break;
    }
    return club;
}