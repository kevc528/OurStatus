import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendRecommendationsComponent } from './friend-recommendations.component';

describe('FriendRecommendationsComponent', () => {
  let component: FriendRecommendationsComponent;
  let fixture: ComponentFixture<FriendRecommendationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendRecommendationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendRecommendationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
