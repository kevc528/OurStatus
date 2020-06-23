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

  getTasksForUser(username: string): Observable<any[]> {
    return this.firestore.collection('tasks', ref => ref.where('creatorUsername', '==', username)).valueChanges();
  }

  // likely need the account service to get the account for the user and then add the id to the list
  // tasks need to store their id so we can distinguish between them
  addTask(username: string, task: Task): Promise<void> {
    var service = this.accountService;
    return this.firestore.collection('tasks').add(task)
      .then(function(doc) {
        let subscription = service.findAccountKey(username).subscribe(
        (res) => {
          if (res.length >= 1) {
            subscription.unsubscribe();
            let accountKey = res[0].payload.doc.id;
            let taskMapList = res[0].payload.doc.EE.kt.proto.mapValue.fields.taskIds.arrayValue.values;
            let taskList = taskMapList.map((val) => {
              return val.stringValue;
            })
            taskList.push(doc.id);
            service.updateAccount(accountKey, { taskIds: taskList })
              .then(function() {
                console.log('SUCCESS');
              }, function() {
                console.log('ERROR');
              })
          } else {
            subscription.unsubscribe();
            console.log('NO ACCOUNT');
          }
        })
      })
  }

  deleteTask(task_id: string) {}

  resolveTask(task_id: string) {}


}
