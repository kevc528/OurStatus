import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarTaskModalComponent } from './calendar-task-modal.component';

describe('CalendarTaskModalComponent', () => {
  let component: CalendarTaskModalComponent;
  let fixture: ComponentFixture<CalendarTaskModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarTaskModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
