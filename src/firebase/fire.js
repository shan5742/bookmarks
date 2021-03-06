import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var config = {
  apiKey: "AIzaSyCDTRxj-WkENMSnCFRjlF0FWxQA09gvI0M",
  authDomain: "bookmarks-5b08e.firebaseapp.com",
  databaseURL: "https://bookmarks-5b08e.firebaseio.com",
  projectId: "bookmarks-5b08e",
  storageBucket: "bookmarks-5b08e.appspot.com",
  messagingSenderId: "889472335087",
  appId: "1:889472335087:web:346902e685d42cbbb52f1a",
  measurementId: "G-J5NGWW9H0R",
};
var fire = firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const generateUserDocument = async (user, additionalData) => {
  if (!user) return;
  const userRef = firestore.doc(`users/${user.email}`);
  const snapshot = await userRef.get();
  if (!snapshot.exists) {
    const { email, displayName, photoURL } = user;
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        ...additionalData,
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.email);
};

const getUserDocument = async (email) => {
  if (!email) return null;
  try {
    const userDocument = await firestore.doc(`users/${email}`).get();

    return {
      email,
      ...userDocument.data(),
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};

export const addBookmark = async (bookmarkData, callback) => {
  const email = firebase.auth().currentUser.email;
  const userDocument = await firestore.doc(`users/${email}`);
  userDocument.update({
    bookmarks: firebase.firestore.FieldValue.arrayUnion(bookmarkData),
  });
  callback();
};

export const removeBookmark = async (bookmarkData, callback) => {
  const email = firebase.auth().currentUser.email;
  const userDocument = await firestore.doc(`users/${email}`);
  userDocument.update({
    bookmarks: firebase.firestore.FieldValue.arrayRemove(bookmarkData),
  });
  callback();
};

export default fire;
