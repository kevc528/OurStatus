import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendSectionComponent } from './friend-section.component';

describe('FriendSectionComponent', () => {
  let component: FriendSectionComponent;
  let fixture: ComponentFixture<FriendSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
