import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, SubscriptionLike, Subscription } from 'rxjs';
import { Task } from 'src/app/shared/model/task';
import { TaskService } from '../task.service';
import { Store } from '@ngrx/store';
import { State, getUserId } from 'src/app/users/state/user.reducer';

@Component({
  selector: 'app-task-remind',
  templateUrl: './task-remind.component.html',
  styleUrls: ['./task-remind.component.css']
})
export class TaskRemindComponent implements OnInit, OnDestroy {

  reminders: Observable<Task[]>;
  userIdSub: Subscription;
  userId: string;

  constructor(private taskService: TaskService, private store: Store<State>) { }

  ngOnInit(): void {
    this.userIdSub = this.store.select(getUserId).subscribe(
      (val) => {
        if (val != null) {
          this.userId = val;
          this.reminders = this.taskService.getRemindersForUser(this.userId, 0);
        }
      }
    )
  }

  ngOnDestroy(): void {
    if (this.userIdSub)
      this.userIdSub.unsubscribe();
  }

}
