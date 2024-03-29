import { Component, OnInit, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { TaskService } from '../task.service';
import { FormsModule, NgForm } from '@angular/forms';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { Task } from 'src/app/shared/model/task';
import { Store } from '@ngrx/store';
import { State, getUsername, getUserId } from 'src/app/users/state/user.reducer';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css']
})
export class TaskCreateComponent implements OnInit, OnDestroy {

  task: Task;
  reset = true;
  dateString;
  timeString;
  userId;
  userIdSub;

  constructor(private store: Store<State>, private taskService: TaskService) { 
  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  ngOnInit(): void {
    this.userIdSub = this.store.select(getUserId).subscribe(
      (val) => {
        this.userId = val;
        this.task = {
          id: null,
          creatorId: this.userId,
          assignees: [this.userId],
          title: null,
          dateCreated: new Date(),
          dateCompleted: null,
          targetDate: new Date(new Date().getTime() + 1000 * 60 * 60),
          remind: false,
          level: 0,
          likes: 0,
          likedUsers: []
        }
      }
    )
    this.dateString = this.formatDate(new Date());
    this.timeString = (this.task.targetDate.getHours() > 9 ? this.task.targetDate.getHours() : '0' + this.task.targetDate.getHours()) + ':' + (this.task.targetDate.getMinutes() > 9 ? this.task.targetDate.getMinutes() : '0' + this.task.targetDate.getMinutes());
  }

  ngOnDestroy(): void {
    this.userIdSub.unsubscribe();
  }

  clearForm() {
    let newDate = new Date(new Date().getTime() + 1000 * 60 * 60);
    this.reset = true;
    this.task.title = ''
    this.task.remind = false;
    this.dateString = this.formatDate(newDate);
    this.timeString = (newDate.getHours() > 9 ? newDate.getHours() : '0' + newDate.getHours()) + ':' + (newDate.getMinutes() > 9 ? newDate.getMinutes() : '0' + newDate.getMinutes());
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.task.targetDate = new Date(this.dateString + ' ' + this.timeString);
      this.task.dateCreated = new Date();
      this.taskService.addTask(this.task).then(
        val => {this.clearForm();},
        err => {console.log(err)}
      );
    } else {
      this.reset = false;
    }
  }

}
