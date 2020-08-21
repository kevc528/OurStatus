import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/users/account.service';

@Component({
  selector: 'app-lazy-load-img',
  templateUrl: './lazy-load-img.component.html',
  styleUrls: ['./lazy-load-img.component.css']
})
export class LazyLoadImgComponent implements OnInit {

  @Input() defaultImage: string;
  @Input() lazyLoadUrl: string;
  lazyLoadObs: Observable<any>;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.lazyLoadObs = this.accountService.getPicDownload(this.lazyLoadUrl);
  }

}
