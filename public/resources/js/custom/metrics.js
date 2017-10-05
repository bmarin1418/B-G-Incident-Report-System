$(document).ready(function () {
    firebaseInit();
    //var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('/locations/carmichael/').once('value').then(function(snapshot) {
      console.log("Value is ");
      console.log(snapshot.val());
    });
});
