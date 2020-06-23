import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../../shared/model/task';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  taskList: Task[] = [];
  username: string;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.username = 'unfl3xible'; 
    this.taskService.getTasksForUser(this.username).subscribe(
      (res: Task[]) => {
        this.taskList = res;
      }
    )
    // var newTask = {
    //   creatorUsername: 'unfl3xible',
    //   assignees: [],
    //   title: 'Drink milk',
    //   dateCreated: new Date(),
    //   dateCompleted: null,
    //   targetDate: new Date(2020, 7, 30),
    //   remind: true
    // } as Task;
    // this.taskService.addTask('unfl3xible', newTask);
  }

}
