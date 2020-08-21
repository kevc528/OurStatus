import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { Observable } from 'rxjs';
import { Account } from 'src/app/shared/model/account';

@Component({
  selector: 'app-profile-search',
  templateUrl: './profile-search.component.html',
  styleUrls: ['./profile-search.component.css']
})
export class ProfileSearchComponent implements OnInit {

  results: Observable<Account[]>;
  searchValue: string;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

  search(): void {
    this.results = this.accountService.searchProfiles(this.searchValue);
  }

}
