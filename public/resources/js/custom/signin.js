//Main execution
$(document).ready(function () {
    firebaseInit();
    initApp();
});

/**
 * Handles the sign in button press.
 */
function toggleSignIn() {
    if (!firebase.auth().currentUser) {
        var email = document.getElementById('email').value + "@bngc.com";
        var password = document.getElementById('password').value;
        if (email.length < 10) {
            sweetAlert("Login Issue", 'Please enter a valid username');
            return;
        }
        if (password.length < 4) {
            sweetAlert("Login Issue", "Invalid password");
            return;
        }

        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                sweetAlert("Login Issue",'Invalid password');
            } else {
                if (errorMessage == "There is no user record corresponding to this identifier. The user may have been deleted."){
                    sweetAlert("Login Issue", "Unknown username");
                } else {
                    sweetAlert("Login Issue", errorMessage);
                }
            }
            console.log(error);
            document.getElementById('quickstart-sign-in').disabled = false;
        });
    }
    document.getElementById('quickstart-sign-in').disabled = true;
}



/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
    // Listening for auth state changes.
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var uid = user.uid;
            window.location.href = "choose_form.html";
        } else {
            document.getElementById('quickstart-sign-in').textContent = 'Sign in';
        }
    });
    document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
}
