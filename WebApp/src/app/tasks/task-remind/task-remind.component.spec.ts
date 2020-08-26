import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskRemindComponent } from './task-remind.component';

describe('TaskRemindComponent', () => {
  let component: TaskRemindComponent;
  let fixture: ComponentFixture<TaskRemindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskRemindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskRemindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
