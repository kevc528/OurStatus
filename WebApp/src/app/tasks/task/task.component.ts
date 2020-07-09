import { Component, OnInit, Input } from '@angular/core';
import { Task } from '../../shared/model/task';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  @Input() task: Task = null;
  path: string = ''

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.path = this.task.dateCompleted ? "assets/images/checked-checkbox.png" : "assets/images/unchecked-checkbox.png";
  }

  onClick(): void {
    if (this.task.dateCompleted) {
      this.taskService.unresolveTask(this.task.id);
      this.path = "assets/images/unchecked-checkbox.png";
    } else {
      this.taskService.resolveTask(this.task.id);
      this.path = "assets/images/checked-checkbox.png";
    }
  }

}
