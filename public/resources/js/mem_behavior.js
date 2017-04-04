
function writeMemBehaviorData() {
  firebase.database().ref('behavior/').push({
    childName: "Child Name",
    date: "Date",
    staffName: "Staff Name",
    issued: "Issuer Name",
    behaviors: "Append checked behaviors here",
    consequences: "Append checked consequences here",
    comments: "Staff Comments"
  });
}

function submitButton(){
  window.location.href = "print_and_email.html";
  console.log("Submit Button Clicked.")
}