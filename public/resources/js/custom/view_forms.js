$(document).ready(function () {
    firebaseInit();
    // get the url parameters and parse them
    var urlToParse = location.search;
    var params = parseQueryString(urlToParse);
    var forms = params.forms_found.split("%20");
    for (i=0; i<forms.length; i++) {
      if (forms[i] == "and") {
        forms.splice(i, 1);
      }
    }
    // counting the different types of forms that will be displayed
    var count = 0;
    // set the original path w/in the database where we are looking for forms
    // based on the uid param that was passed 
    var og_str = '/locations/carmichael/students/' + params.uid;
    // loop through all of the different types of forms submitted
    for (i=0; i<forms.length; i++) {
      // append that type of form to our path
      var new_str = og_str + '/' + forms[i].toLowerCase();
      // return all references to that type of form that exist
      firebase.database().ref(new_str).once('value').then(function(snapshot) {
      	var obj = snapshot.val();
      	// call a function to do some magic w/ making our json pretty
      	prettifyJSON(obj, count, forms, i);
      	count += 1;
      	// display the text to the screen
      	// document.getElementById("json").innerHTML += prettyjson + "\n\n\n";
      });
    }

});

var prettifyJSON = function(obj, count, forms, i) {
	var new_str = obj;
	var form_counter = 0;
	// remove the annoying random hash at the beginning of each form
	for (key in obj) {
		new_str = obj[key];
		console.log(new_str);
		form_counter += 1;
		var tmpstr = "<h6>" + forms[count] + " Form " + form_counter + "</h6>";
		document.getElementById("json").innerHTML += tmpstr;
		// parse the data depending on the type of form this is
		if (forms[count] == "Behavior") {
			console.log(new_str);
			for (key in new_str) {
				// possible keys include: behaviors, childName, consequences, date, issuerName, location, staffComments, staffName
				if (key == "childName") {
					document.getElementById("json").innerHTML += "<b>Name of child: </b>" + new_str["childName"] + "\n";
				}
				else if (key == "date") {
					document.getElementById("json").innerHTML += "<b>Date of incident: </b>" + new_str["date"] + "\n";
				}
				else if (key == "issuerName") {
					document.getElementById("json").innerHTML += "<b>Form issued by: </b>" + new_str["issuerName"] + "\n";
				}
				else if (key == "behaviors") {
					document.getElementById("json").innerHTML += "<b>Inappropriate behaviors included: </b>";
					// iterate through all true behaviors
					document.getElementById("json").innerHTML += "\n";
				}
				else if (key == "consequences") {
					document.getElementById("json").innerHTML += "<b>Consequences included: </b>";
					// iterate through all true consequences
					document.getElementById("json").innerHTML += "\n";
				}
				else if (key == "staffName") {
					// what's the difference between "staff name" and "issuer name"??? 
					document.getElementById("json").innerHTML += "<b>Form submitted by: </b>" + new_str["staffName"] + "\n";
				}
				else if (key == "staffComments") {
					document.getElementById("json").innerHTML += "<b>Staff member comments: </b>" + new_str["staffComments"] + "\n";
				};
			};
		};

		if (forms[count] == "Accident") {
			for (key in new_str) {
			// possible keys include: childName, date, incidentDescription, location, responseDescription, staffName, witnessName
				if (key == "childName") {
					document.getElementById("json").innerHTML += "<b>Name of child: </b>" + new_str["childName"] + "\n";
				}
				else if (key == "date") {
					document.getElementById("json").innerHTML += "<b>Date of incident: </b>" + new_str["date"] + "\n";
				}
				else if (key == "incidentDescription") {
					document.getElementById("json").innerHTML += "<b>Description of incident: </b>" + new_str["incidentDescription"] + "\n";
				}
				else if (key == "location") {
					document.getElementById("json").innerHTML += "<b>Location of incident: </b>" + new_str["location"] + "\n";
				}
				else if (key == "responseDescription") {
					document.getElementById("json").innerHTML += "<b>Staff response: </b>" + new_str["responseDescription"] + "\n";
				}
				else if (key == "staffName") {
					// what's the difference between "staff name" and "witness name"??? 
					document.getElementById("json").innerHTML += "<b>Form submitted by: </b>" + new_str["staffName"] + "\n";
				}
				else if (key == "witnessName") {
					document.getElementById("json").innerHTML += "<b>Staff member who witnessed incident: </b>" + new_str["witnessName"] + "\n";
				};
			};

		};
		if (forms[count] == "General") {
			for (key in new_str) {
			// possible keys include: childName, date, incidentDescription, location, responseDescription, staffName, witnessName
				if (key == "childName") {
					document.getElementById("json").innerHTML += "<b>Name of child: </b>" + new_str["childName"] + "\n";
				}
				else if (key == "date") {
					document.getElementById("json").innerHTML += "<b>Date of incident: </b>" + new_str["date"] + "\n";
				}
				else if (key == "incidentDescription") {
					document.getElementById("json").innerHTML += "<b>Description of incident: </b>" + new_str["incidentDescription"] + "\n";
				}
				else if (key == "location") {
					document.getElementById("json").innerHTML += "<b>Location of incident: </b>" + new_str["location"] + "\n";
				}
				else if (key == "responseDescription") {
					document.getElementById("json").innerHTML += "<b>Staff response: </b>" + new_str["responseDescription"] + "\n";
				}
				else if (key == "staffName") {
					// what's the difference between "staff name" and "witness name"??? 
					document.getElementById("json").innerHTML += "<b>Form submitted by: </b>" + new_str["staffName"] + "\n";
				}
				else if (key == "witnessName") {
					document.getElementById("json").innerHTML += "<b>Staff member who witnessed incident: </b>" + new_str["witnessName"] + "\n";
				};
			};
		};
		document.getElementById("json").innerHTML += "\n\n";
	};
}


var parseQueryString = function(url) {
  var urlParams = {};
  url.replace(
    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
    function($0, $1, $2, $3) {
      urlParams[$1] = $3;
    }
  );
  return urlParams;
}
