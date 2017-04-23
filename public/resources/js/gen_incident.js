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
    "location" : $('#locationid').val(),
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
