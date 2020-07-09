import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../../shared/model/task';
import { Observable } from 'rxjs'; 

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  taskList: Observable<any[]>;
  @Input() username = '';

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskList = this.taskService.getTasksForUser(this.username, 0);

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

}
