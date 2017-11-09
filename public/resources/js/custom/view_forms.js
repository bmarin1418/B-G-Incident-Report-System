$(document).ready(function () {
    firebaseInit();

  //  firebase.database().ref(str).once('value').then(function(snapshot) {
  //    console.log(snapshot);
  //  });

    //firebase.database().ref('/locations/carmichael/').once('value').then(function(snapshot) {
    //  console.log(snapshot.val());
    //});
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
