import { Component, OnInit, Input } from '@angular/core';
import { Task } from '../../shared/model/task';
import { TaskService } from '../task.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  @Input() task: Task = null;
  path: string = ''
  hideDetail: boolean = true;
  
  editForm;

  constructor(private taskService: TaskService) {
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
    let date = new Date(this.task.targetDate.seconds * 1000);
    this.path = this.task.dateCompleted ? "assets/images/checked-checkbox.png" : "assets/images/unchecked-checkbox.png";
    this.editForm = {
      title: this.task.title,
      targetDate: this.formatDate(date),
      targetTime: (date.getHours() > 9 ? date.getHours() : '0' + date.getHours()) + ':' + (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()),
      remind: this.task.remind
    };
  }

  onTaskClick(): void {
    if (this.task.dateCompleted) {
      this.taskService.unresolveTask(this.task.id);
      this.path = "assets/images/unchecked-checkbox.png";
    } else {
      this.taskService.resolveTask(this.task.id);
      this.path = "assets/images/checked-checkbox.png";
    }
  }
  
  onInfoClick(): void {
    this.hideDetail = !this.hideDetail;
    if (this.hideDetail) {
      let date = new Date(this.task.targetDate.seconds * 1000);
      this.editForm = {
        title: this.task.title,
        targetDate: this.formatDate(new Date(this.task.targetDate.seconds * 1000)),
        targetTime: (date.getHours() > 9 ? date.getHours() : '0' + date.getHours()) + ':' + (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()),
        remind: this.task.remind
      };
    }
  }

  onDeleteClick(): void {
    this.taskService.deleteTask(this.task.id).then(
      (val) => {
        this.hideDetail = true;
      }
    )
  }

  onSubmitEdits(): void {
    let temp = this.editForm.targetDate;
    var currTime = new Date(this.editForm.targetDate);
    this.editForm.targetDate = new Date(this.editForm.targetDate + ' ' + this.editForm.targetTime);
    delete this.editForm['targetTime'];
    this.taskService.editTask(this.task.id, this.editForm);
    this.editForm.targetDate = temp;
    this.hideDetail = true;
  }

}
