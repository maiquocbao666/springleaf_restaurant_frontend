import { Component } from '@angular/core';
import { DateTimeService } from 'src/app/services/date-time.service';

@Component({
  selector: 'app-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.css'],
  //encapsulation: ViewEncapsulation.None
})
export class DateTimeComponent {

  currentDateTime: Date = new Date();

  constructor(private dateTimeService: DateTimeService) {

  }

  ngOnInit() {

    this.dateTimeService.getCurrentTime().subscribe((dateTime: Date) => {
      this.currentDateTime = dateTime;
    });

  }

}
