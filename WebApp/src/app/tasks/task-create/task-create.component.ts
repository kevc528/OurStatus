import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { TaskService } from '../task.service';
import { FormsModule, NgForm } from '@angular/forms';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css']
})
export class TaskCreateComponent implements OnInit {

  task;
  username;
  reset = true;

  constructor(private cookieService: CookieService, private taskService: TaskService) { 
    this.username = cookieService.get('user');
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
    this.task = {
      creatorUsername: this.username,
      assignees: [this.username],
      title: null,
      dateCreated: new Date(),
      dateCompleted: null,
      targetDate: this.formatDate(new Date()),
      remind: false,
      level: 0
    }
  }

  clearForm() {
    this.reset = true;
    this.task.title = ''
    this.task.remind = false;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.task.targetDate = new Date(this.task.targetDate);
      console.log(this.task.targetDate);
      this.taskService.addTask(this.task).then(
        val => {this.clearForm();},
        err => {console.log(err)}
      );
    } else {
      this.reset = false;
    }
  }

}
