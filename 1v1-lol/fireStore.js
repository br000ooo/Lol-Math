var db;

function initializeFirestore() {
    if (!firebase.apps.length) {
        console.error("Firebase is not initialized.");
        return;
    }
    db = firebase.firestore();
}

function addDocument(collectionName, data, isJson = false) {
    if (!db || !collectionName) {
        console.error("Firestore database or collection name is missing.");
        return;
    }

    if (isJson) {
        try {
            data = JSON.parse(data);
        } catch (error) {
            console.error("Invalid JSON data:", error);
            return;
        }
    }

    return db.collection(collectionName).add(data);
}

function setDocument(collectionName, documentName, data, isJson = false, isMerge = false) {
    if (!db || !collectionName || !documentName) {
        console.error("Firestore database, collection name, or document name is missing.");
        return;
    }

    if (isJson) {
        try {
            data = JSON.parse(data);
        } catch (error) {
            console.error("Invalid JSON data:", error);
            return;
        }
    }

    return db.collection(collectionName).doc(documentName).set(data, { merge: isMerge });
}

function updateDocument(collectionName, documentName, data, isJson = false) {
    if (!db || !collectionName || !documentName) {
        console.error("Firestore database, collection name, or document name is missing.");
        return;
    }

    if (isJson) {
        try {
            data = JSON.parse(data);
        } catch (error) {
            console.error("Invalid JSON data:", error);
            return;
        }
    }

    return db.collection(collectionName).doc(documentName).update(data);
}

function deleteDocument(collectionName, documentName) {
    if (!db || !collectionName || !documentName) {
        console.error("Firestore database, collection name, or document name is missing.");
        return;
    }

    return db.collection(collectionName).doc(documentName).delete();
}

function getDocument(collectionName, documentName) {
    if (!db || !collectionName || !documentName) {
        console.error("Firestore database, collection name, or document name is missing.");
        return;
    }

    return db.collection(collectionName).doc(documentName).get();
}
