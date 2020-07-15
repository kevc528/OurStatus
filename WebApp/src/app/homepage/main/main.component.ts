import { Component, OnInit } from '@angular/core';
import { session } from '../../session';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  username: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.username = window.location.pathname.split('/')[2];
    if (session.user != this.username) {
      this.router.navigate(['/login']);
    }
  }

}
