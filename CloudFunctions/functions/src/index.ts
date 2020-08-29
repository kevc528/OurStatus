import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';
import admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

export const deleteExpiredCookies = functions.firestore
    .document('cookie/{cookieId}')
    .onWrite(async (change, context) => {
        var ref = db.collection('cookie');
        var oldItemsQuery = ref.where('expiration', '<=', firestore.Timestamp.now());
        var snapshot = await oldItemsQuery.get();
        snapshot.forEach(child => {
            console.log(child);
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
