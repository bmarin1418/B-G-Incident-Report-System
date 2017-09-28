var db = firebase.database()
var dbRef = db.ref('locations');
dbRef.on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();
      console.log(childData);
    });
});
