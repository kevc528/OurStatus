import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  username: string;

  constructor(private router: Router, private cookieService: CookieService, private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('OurStatus');
    this.username = this.cookieService.get('user');
    if (!this.username) {
      this.router.navigate(['/login']);
    }
  }

}
