import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from 'src/app/users/account.service';
import { Store } from '@ngrx/store';
import { State, getUserId } from 'src/app/users/state/user.reducer';
import { Observable, Subscription } from 'rxjs';
import { Task } from 'src/app/shared/model/task';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-calendar-task-modal',
  templateUrl: './calendar-task-modal.component.html',
  styleUrls: ['./calendar-task-modal.component.css']
})
export class CalendarTaskModalComponent implements OnInit, OnDestroy {

  @Input() date: Date;
  tasks: Task[] = [];
  userId: string;
  userIdSub: Subscription;
  taskSub: Subscription;
  emptyCalendar: boolean = false;

  constructor(public activeModal: NgbActiveModal, private taskService: TaskService,
    private store: Store<State>) { }

  ngOnInit(): void {
    this.userIdSub = this.store.select(getUserId).subscribe(
      (val) => {
        if (val != null) {
          this.userId = val;
          this.taskSub = this.taskService.getTasksForUserDates(this.userId, 0, this.date, new Date(this.date.getTime() + 1000*60*60*24)).subscribe(
            (tasks) => {
              if (tasks.length == 0)
                this.emptyCalendar = true;
              this.tasks = tasks;
            }
          );
        }
      }
    )
  }
  
  ngOnDestroy(): void {
    if (this.userIdSub) {
      this.userIdSub.unsubscribe();
    }
    if (this.taskSub) {
      this.taskSub.unsubscribe();
    }
  }

}
