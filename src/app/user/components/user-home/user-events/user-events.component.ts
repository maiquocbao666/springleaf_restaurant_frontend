import { Component } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/interfaces/event';

@Component({
  selector: 'app-user-event',
  templateUrl: './user-events.component.html',
  styleUrls: ['./user-events.component.css']
})
export class UserEventsComponent {
  events: Event[] = [];
  eventsUrl = 'events';

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    this.eventService.gets();
    this.eventService.cache$
      .subscribe(events => {
        this.eventService.gets();
        this.events = JSON.parse(localStorage.getItem(this.eventsUrl) || 'null');
      });
  }
}
