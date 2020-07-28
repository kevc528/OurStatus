import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  username: string;

  constructor(private cookieService: CookieService, private router: Router) { 
  }

  ngOnInit(): void {
    this.username = this.cookieService.get('user');
  }

  onLogOut(): void {
    this.cookieService.delete('user');
    this.router.navigate(['/login']);
  }

}
