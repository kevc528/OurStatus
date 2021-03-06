import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable, merge, forkJoin, combineLatest } from 'rxjs';
import { Task } from '../shared/model/task';
import { AccountService } from '../users/account.service';
import { map } from 'rxjs/operators';
import { CommentService } from '../social/comment.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private firestore: AngularFirestore, private accountService: AccountService,
      private commentService: CommentService) {}

  getTasksForUser(creatorId: string, level: number): Observable<Task[]> {
    return this.firestore.collection<Task>('tasks', ref => ref.where('creatorId', '==', creatorId)
      .where('level', '==', level)).valueChanges();
  }

  getTasksForUserDates(creatorId: string, level: number, startDate: Date, endDate: Date): Observable<Task[]> {
    let noncomplete = this.firestore.collection<Task>('tasks', ref => ref.where('creatorId', '==', creatorId)
      .where('level', '==', level).where('dateCompleted', '==', null)
      .where('targetDate', '>=', startDate).where('targetDate', '<', endDate)).valueChanges();
    let complete = this.firestore.collection<Task>('tasks', ref => ref.where('creatorId', '==', creatorId)
      .where('level', '==', level).where('dateCompleted', '>', new Date(0))
      .where('dateCompleted', '>=', startDate).where('dateCompleted', '<', endDate)).valueChanges();
    return combineLatest(noncomplete, complete).pipe(map(([s1, s2]) => [...s1, ...s2]));
  }

  getUncompletedTasksForUser(creatorId: string, level: number): Observable<Task[]> {
    return this.firestore.collection<Task>('tasks', ref => ref.where('creatorId', '==', creatorId)
      .where('level', '==', level).where('dateCompleted', '==', null)
      .where('targetDate', '>=', new Date())).valueChanges();
  }

  getRemindersForUser(creatorId: string, level: number): Observable<Task[]> {
    return this.firestore.collection<Task>('tasks', ref => ref.where('creatorId', '==', creatorId)
      .where('level', '==', level).where('dateCompleted', '==', null).where('remind', '==', true)
      .where('targetDate', '>=', new Date())
      .where('targetDate', '<=', new Date((new Date()).getTime() + 1000*60*60*24))).valueChanges();
  }

  /**
   * getFeedTasks will get the completed tasks of the user id array
   * @param userIds the list of friends
   */
  getFeedTasks(userIds: string[]): Observable<Task[]> {
    let obsList: Observable<Task[]>[] = [];
    for (let i = 0; i < userIds.length; i += 10) {
      let ids = [];
      for (let j = i; j < Math.min(userIds.length, i + 10); j++) {
        ids.push(userIds[j]);
      }
      let obs = this.firestore.collection<Task>('tasks', ref => ref.where('creatorId', 'in', ids)
        .where('level', '==', 0).where('dateCompleted', '<', new Date())
        .where('dateCompleted', '>', new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)))).valueChanges();
      obsList.push(obs);
    }
    return combineLatest(...obsList).pipe(map(x => [].concat.apply([], x)));
  }

  // getAssignedTasksForUser(username: string): Observable<any[]> {
  //   return this.firestore.collection('tasks', ref => ref.where('assignees', "array-contains", username)).valueChanges();
  // }

  // likely need the account service to get the account for the user and then add the id to the list
  // tasks need to store their id so we can distinguish between them
  addTask(task: Task): Promise<void> {
    var firestore = this.firestore;
    return this.firestore.collection('tasks').add(task)
      .then(function(doc) {
        firestore.collection('tasks').doc(doc.id).update({'id': doc.id});
      });
  }

  deleteTask(taskId: string): Promise<void> {
    let taskDoc = this.firestore.collection('tasks').doc(taskId);
    return taskDoc.delete();
  }

  editTask(taskId: string, newData): Promise<void> {
    let taskDoc = this.firestore.collection('tasks').doc(taskId);
    return taskDoc.update(newData);
  }

  resolveTask(taskId: string) {
    this.editTask(taskId, {'dateCompleted': new Date()})
  }

  unresolveTask(taskId: string) {
    console.log('here');
    this.editTask(taskId, {'dateCompleted': null})
  }

}
