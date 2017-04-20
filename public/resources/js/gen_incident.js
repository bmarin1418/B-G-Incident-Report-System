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
$(function(){
  var data = [];

  var ref = firebase.database().ref('general/').push();

$('#general_incident_form').submit(function(event) {
  var $form = $(this);
  console.log("Submit to Firebase");

  var newForm = {
    "childName" : $('#nameid').val(),
    "date" : $('#dateid').val(),
    "staffName" : $('#staffid').val(),
    "witnessName" : $('#witnessid').val(),
    "incidentDescription" : $('#incidentid').val(),
    "responseDescription" : $('#responseid').val(),
    "directorNotified" : $('#directorid').val()
  }


  data = newForm;
  console.log(data);

  ref.set(data,function(err){ 
    if(err){
      alert("Data did not send");
    }
  });

  
  window.location.href = "print_and_email.html";

  return false;
})


})
