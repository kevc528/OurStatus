import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedListingComponent } from './feed-listing.component';

describe('FeedListingComponent', () => {
  let component: FeedListingComponent;
  let fixture: ComponentFixture<FeedListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
