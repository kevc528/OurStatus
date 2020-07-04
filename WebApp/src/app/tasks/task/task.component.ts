import { Component, OnInit, Input } from '@angular/core';
import { Task } from '../../shared/model/task';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  @Input() task: Task = null;

  constructor() { }

  ngOnInit(): void {
  }

}
