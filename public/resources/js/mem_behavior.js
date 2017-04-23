$(function(){
  var data = [];

  var ref = firebase.database().ref('behavior/').push();

$('#mem_behavior_form').submit(function(event) {
  var $form = $(this);
  console.log("Submit to Firebase");

  var behaviors = {
	"talking" : $('#talking').is(':checked'),
	"not_listening" : $('#not_listening').is(':checked'),
	"language" : $('#language').is(':checked'),
	"gestures" : $('#gestures').is(':checked'),
	"BGC_rules" : $('#BGC_rules').is(':checked'),
	"member_disrespect" : $('#member_disrespect').is(':checked'),
	"staff_disrespect" : $('#staff_disrespect').is(':checked'),
	"name_calling" : $('#name_calling').is(':checked'),
	"touching" : $('#touching').is(':checked'),
	"physical_contact" : $('#physical_contact').is(':checked'),
	"fighting" : $('#fighting').is(':checked'),
	"threatenting" : $('#threatening').is(':checked'),
	"property_damage" : $('#property_damage').is(':checked'),
	"stealing_cheating" : $('#stealing_cheating').is(':checked'),
	"behavior_other" : $('#behavior_other').is(':checked')
  }
  var consequences = {
	"event_loss" : $('#event_loss').is(':checked'),
	"conference" : $('#conference').is(':checked'),
	"parent_contact" : $('#parent_contact').is(':checked'),
	"suspension" : $('#suspension').is(':checked'),
	"consequence_other" : $('#consequence_other').is(':checked')
  }

  var newForm = {    
    "childName" : $('#nameid').val(),
    "date" : $('#dateid').val(),
    "staffName" : $('#staffid').val(),
    "issuerName" : $('#issuedbyid').val(),
    "behaviors" : behaviors,
    "consequences": consequences,
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
