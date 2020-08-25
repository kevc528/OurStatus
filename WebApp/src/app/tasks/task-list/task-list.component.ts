import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../../shared/model/task';
import { Observable, Subscription } from 'rxjs'; 
import { CookieService } from 'ngx-cookie-service';
import { State, getUserId } from 'src/app/users/state/user.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {

  taskList: Task[] = [];
  userId;
  subscription: Subscription;
  noTasks: boolean;
  userIdSubscription;

  constructor(private store: Store<State>,private taskService: TaskService, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.userIdSubscription = this.store.select(getUserId).subscribe(
      val => {
        if (val != null) {
          this.userId = val;
          this.subscription = this.taskService.getTasksForUser(this.userId, 0).subscribe(
            val => {
              if (val.length == 0) {
                this.noTasks = true;
              } else {
                this.noTasks = false;
                this.taskList = val.sort(
                  (a,b) => {
                    let a_date = new Date(a.targetDate.seconds * 1000);
                    let b_date = new Date(b.targetDate.seconds * 1000);
                    return a_date.valueOf() - b_date.valueOf();
                  }
                );
              }
            }
          );
        }
      }
    )
    // CODE TO ADD A NEW TASK
    // var newTask = {
    //   creatorUsername: 'jqaz123',
    //   assignees: [],
    //   title: 'Wash the dishes',
    //   dateCreated: new Date(),
    //   dateCompleted: null,
    //   targetDate: new Date(2020, 7, 30),
    //   remind: true,
    //   level: 0
    // };
    // this.taskService.addTask(newTask);


    // CODE TO DELETE A TASK
    // this.taskService.deleteTask("v97fh6ITBdx0ezM8aXTk");

    // CODE TO RESOLVE A TASK
    // this.taskService.resolveTask("Rx9MHagavTC1dhQ58lcG");
  }

  ngOnDestroy() {
    this.userIdSubscription.unsubscribe();
    this.subscription.unsubscribe();
  }
}
