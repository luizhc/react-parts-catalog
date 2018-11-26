
import * as firebase from 'firebase'
import 'firebase/firestore';
require('firebase/auth')

var config = {
  apiKey: "AIzaSyCeqY3ZCUe9gBja-s4QH58qa9w0mMjtstY",
  authDomain: "starter-with.firebaseapp.com",
  databaseURL: "https://starter-with.firebaseio.com",
  projectId: "starter-with",
  storageBucket: "starter-with.appspot.com",
  messagingSenderId: "545988788168"
};
firebase.initializeApp(config);

export const db = firebase.firestore();

export const auth = firebase.auth();