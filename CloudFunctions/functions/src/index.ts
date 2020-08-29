import * as functions from 'firebase-functions';
//import { firestore } from 'firebase-admin';
//import admin = require('firebase-admin');
import * as firebase from "firebase/app";
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB-CuxGBSwGbgsM88C97F4pU7jLSMBVavw",
    authDomain: "ourstatus-71678.firebaseapp.com",
    databaseURL: "https://ourstatus-71678.firebaseio.com",
    projectId: "ourstatus-71678",
    storageBucket: "ourstatus-71678.appspot.com",
    messagingSenderId: "158499871442",
    appId: "1:158499871442:web:9e3bdd6ade46d8fd792b0b",
    measurementId: "G-RJ70VQGR3C"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export const deleteExpiredCookies = functions.firestore
    .document('cookie/{cookieId}')
    .onWrite(async (change, context) => {
        var ref = db.collection('cookie');
        var oldItemsQuery = ref.where('expiration', '<=', firebase.firestore.Timestamp.now());
        var snapshot = await oldItemsQuery.get();
        snapshot.forEach(child => {
            child.ref.delete().then().catch();
        })
    })

export const deleteCommentsForTasks = functions.firestore
    .document('tasks/{taskId}')
    .onDelete(async (change, context) => {
        const commentRef = db.collection('comments');
        const toDelete = commentRef.where('taskId', '==', context.params.taskId);
        const snapshot = await toDelete.get();
        snapshot.forEach(child => {
            child.ref.delete().then().catch();
        })
    })
