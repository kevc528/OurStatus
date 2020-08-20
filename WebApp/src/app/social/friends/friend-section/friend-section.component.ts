import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-friend-section',
  templateUrl: './friend-section.component.html',
  styleUrls: ['./friend-section.component.css']
})
export class FriendSectionComponent implements OnInit {

  friendPage = true;

  constructor() { }

  ngOnInit(): void {
  }

}
