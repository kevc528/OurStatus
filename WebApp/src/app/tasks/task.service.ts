import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Task } from '../shared/model/task';
import { AccountService } from '../users/account.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private firestore: AngularFirestore, private accountService: AccountService) {}

  getTasksForUser(creatorId: string, level: number): Observable<Task[]> {
    return this.firestore.collection<Task>('tasks', ref => ref.where('creatorId', '==', creatorId)
      .where('level', '==', level)).valueChanges();
  }

  /**
   * getFeedTasks will get the completed tasks of the user id array
   * @param userIds the list of friends
   */
  getFeedTasks(userIds: string[]): Observable<Task[]> {
    return this.firestore.collection<Task>('tasks', ref => ref.where('creatorId', 'in', userIds)
      .where('level', '==', 0).where('dateCompleted', '<', new Date())).valueChanges();
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
    this.editTask(taskId, {'dateCompleted': null})
  }

}
