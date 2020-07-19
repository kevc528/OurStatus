import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  username: string;

  constructor(private router: Router, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.username = this.cookieService.get('user');
    console.log(this.username);
    if (!this.username) {
      this.router.navigate(['/login']);
    }
  }

}
