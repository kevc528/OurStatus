import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/users/account.service';

@Component({
  selector: 'app-lazy-load-img',
  templateUrl: './lazy-load-img.component.html',
  styleUrls: ['./lazy-load-img.component.css']
})
export class LazyLoadImgComponent implements OnInit, OnChanges {

  @Input() defaultImage: string;
  @Input() lazyLoadUrl: string;
  @Input() useObs: boolean = false;
  @Input() lazyLoadObs: Observable<any>;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    if (!this.useObs)
      this.lazyLoadObs = this.accountService.getPicDownload(this.lazyLoadUrl);
  }

  ngOnChanges(): void {
    if (!this.useObs)
      this.lazyLoadObs = this.accountService.getPicDownload(this.lazyLoadUrl);
  }

}
