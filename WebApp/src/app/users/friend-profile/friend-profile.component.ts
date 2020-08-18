import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.component.html',
  styleUrls: ['./friend-profile.component.css']
})
export class FriendProfileComponent implements OnInit {

  @Input() friendUsername;

  constructor() { }

  ngOnInit(): void {
  }

}
