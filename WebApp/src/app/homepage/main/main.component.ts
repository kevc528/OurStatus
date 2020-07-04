import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  username: string;

  constructor() { }

  ngOnInit(): void {
    this.username = window.location.pathname.split('/')[2];
  }

}
