import { Component } from '@angular/core';
import { DateTimeService } from 'src/app/services/date-time.service';

@Component({
  selector: 'app-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.css'],
})
export class DateTimeComponent {

  currentDateTime$: string = '';

  constructor(private dateTimeService: DateTimeService) { }

  ngOnInit() {
    this.dateTimeService.currentDateTimeCache$.subscribe((dateObject: Date) => {
      // Assuming the service emits Date objects
      this.currentDateTime$ = dateObject.toISOString();
    });
  }
  
}