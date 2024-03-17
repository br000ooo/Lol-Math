var tempErrorCreds;
var tempProviderName;

function retrieveIdToken(successCallback, errorCallback) {
    var currentUser = firebase.auth().currentUser;
    if (!currentUser) {
        if (errorCallback) errorCallback("User is null");
        return;
    }

    currentUser.getIdToken().then(function (idToken) {
        var resultObj = {
            token: idToken,
            displayName: currentUser.displayName || "Guest"
        };

        if (successCallback) successCallback(resultObj);
    }).catch(function (error) {
        console.error("Error retrieving ID token:", error);
        if (errorCallback) errorCallback(error.message);
    });
}

function anonymousLogin(successCallback, errorCallback) {
    var resultObj = {
        token: "",
        displayName: "Guest"
    };

    if (successCallback) successCallback(resultObj);
}

function firebaseLogin(providerName, successCallback, errorCallback) {
    if (providerName === "anonymous") {
        anonymousLogin(successCallback, errorCallback);
        return;
    }

    var user = firebase.auth().currentUser;
    if (user && !user.isAnonymous) {
        retrieveIdToken(successCallback, errorCallback);
        return;
    }

    var provider = getProvider(providerName);
    firebase.auth().useDeviceLanguage();

    firebase.auth().signInWithPopup(provider).then(function (result) {
        console.log("Successful sign in");
        retrieveIdToken(successCallback, errorCallback);
    }).catch(function (error) {
        console.error("Error signing in:", error);
        if (errorCallback) errorCallback(error.message);

        if (error.code === 'auth/account-exists-with-different-credential') {
            var email = error.email;
            firebase.auth().fetchSignInMethodsForEmail(email).then(function (methods) {
                if (methods.length > 0) {
                    tempProviderName = methods[0].trim();
                    setModalContent("generalModalContent", "<div id=\"continueWindow\"><span class=\"close\" id=\"closeButton\" onclick=\"hideModal('generalModal')\">&times;</span><p>Please press the button to continue login:</p><button onclick=\"continueLogin()\">Continue Login</button></div>");
                    showModal("generalModal");
                }
            });
        }
    });
}

function firebaseLogout() {
    firebase.auth().signOut().catch(function (error) {
        console.error("Error signing out:", error);
    });
}

function getCurrentUserDisplayName() {
    var user = firebase.auth().currentUser;
    return user ? user.displayName : "";
}

function getProvider(providerName) {
    if (providerName && providerName.indexOf("facebook") !== -1) {
        return new firebase.auth.FacebookAuthProvider();
    } else {
        return new firebase.auth.GoogleAuthProvider();
    }
}

function setModalContent(modalContentId, contentString) {
    var content = document.getElementById(modalContentId);
    if (content) content.innerHTML = contentString;
}

function continueLogin() {
    hideModal("generalModal");
    var provider = getProvider(tempProviderName);
    firebase.auth().signInWithPopup(provider).then(function (result) {
        if (tempErrorCreds) {
            result.user.linkAndRetrieveDataWithCredential(tempErrorCreds).then(function (usercred) {
                // Handle successful link
            }).catch(function (error) {
                console.error("Error linking credential:", error);
            });
        }
    }).catch(function (error) {
        console.error("Error continuing login:", error);
    });
}

function showModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) modal.style.display = "block";
}

function hideModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) modal.style.display = "none";
}
