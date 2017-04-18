$(function(){
  var data = [];

  var ref = firebase.database().ref('behavior/').push();

$('#mem_behavior_form').submit(function(event) {
  var $form = $(this);
  console.log("Submit to Firebase");

  var newForm = {    
    "childName" : $('#nameid').val(),
    "date" : $('#dateid').val(),
    "staffName" : $('#staffid').val(),
    "issuerName" : $('#issuedbyid').val(),
    "staffComments" : $('#commentsid').val()
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

