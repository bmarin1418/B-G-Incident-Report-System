$(document).ready(function () {
    firebaseInit();

    firebase.database().ref(str).once('value').then(function(snapshot) {
      console.log(snapshot)
    }

    //firebase.database().ref('/locations/carmichael/').once('value').then(function(snapshot) {
    //  console.log(snapshot.val());
    //});
});
