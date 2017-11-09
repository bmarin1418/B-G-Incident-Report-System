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
    // console.log(params);
    // console.log(forms);
    // obtain the different
    var og_str = '/locations/carmichael/students/' + params.uid;
    for (i=0; i<forms.length; i++) {
      var new_str = og_str + '/' + forms[i].toLowerCase();
      firebase.database().ref(new_str).once('value').then(function(snapshot) {
        console.log(snapshot.val());
        document.getElementById("json").innerHTML += JSON.stringify(snapshot.val(), undefined, 2) + "\n\n\n";
      });
    }

});


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
