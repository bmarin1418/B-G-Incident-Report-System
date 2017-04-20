

function confirmLogout() {
  if (confirm("Are you sure you want to logout?") == true) {
    firebase.auth().signOut();
    window.location.href = "index.html";
  }
  else{}
}
