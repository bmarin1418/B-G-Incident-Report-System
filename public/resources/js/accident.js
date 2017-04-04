
function writeAccidentData() {
  firebase.database().ref('accident/').push({
    name: "Child Name",
    staff: "Staff Name",
    description: "Description of Event"
  });
}

function submitButton(){
  window.location.href = "print_and_email.html";
  console.log("Submit Button Clicked.")
}
