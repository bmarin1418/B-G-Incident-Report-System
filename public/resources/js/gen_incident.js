
function writeGenIncidentData() {
  firebase.database().ref('general/').push({
    childName: "Child Name",
    date: "Date",
    staffName: "Staff Name",
    involved: "Names of Witnesses/ People Involved",
    nature: "Description of the Incident",
    response: "Description of Response to the Incident",
    directorNotified: "Yes or No"
  });
}

function submitButton(){
  window.location.href = "print_and_email.html";
  console.log("Submit Button Clicked.")
}