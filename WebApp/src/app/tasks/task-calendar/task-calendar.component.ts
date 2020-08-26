import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarTaskModalComponent } from '../calendar-task-modal/calendar-task-modal.component';

@Component({
  selector: 'app-task-calendar',
  templateUrl: './task-calendar.component.html',
  styleUrls: ['./task-calendar.component.css']
})
export class TaskCalendarComponent implements OnInit {

  calendarOptions: CalendarOptions

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      dateClick: this.handleDateClick.bind(this)
    };
  }

  handleDateClick(arg) {
    const modalRef = this.modalService.open(CalendarTaskModalComponent, { size: 'lg'});
    modalRef.componentInstance.name = 'Daily Task';
    modalRef.componentInstance.date = arg.date;
  }
}
