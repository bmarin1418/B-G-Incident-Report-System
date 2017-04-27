//Prompt confirmation of logout
function confirmLogout() {
  if (confirm("Are you sure you want to logout?") == true) {
    firebase.auth().signOut();
    window.location.href = "index.html";
  }
  else{
      return;
  }
}

//Initialize Firebase
function firbaseInit() {
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

//Creates a pdf and prints from json
function printForm(doc_def) {
  var dd = {
	content: [
		'First paragraph',
		'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
	]
}
  pdfMake.createPdf(dd).open();
    //var pdfDoc = printer.creadtePdf
}
