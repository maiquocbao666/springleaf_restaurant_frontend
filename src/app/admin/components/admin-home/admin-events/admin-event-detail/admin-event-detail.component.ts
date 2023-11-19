import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Cart } from 'src/app/interfaces/cart';
import { Combo } from 'src/app/interfaces/combo';
import { Event } from 'src/app/interfaces/event';
import { CartService } from 'src/app/services/cart.service';
import { ComboService } from 'src/app/services/combo.service';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-admin-event-detail',
  templateUrl: './admin-event-detail.component.html',
  styleUrls: ['./admin-event-detail.component.css']
})
export class AdminEventDetailComponent implements OnInit {
  @Input() event: Event | undefined;
  @Output() eventSaved: EventEmitter<void> = new EventEmitter<void>();
  fieldNames: string[] = [];
  events: Event[] = [];
  combos: Combo[] = [];
  carts: Cart[] = [];
  eventForm: FormGroup;

  constructor(
    private eventService: EventService,
    private cartService: CartService,
    private comboService: ComboService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal
  ) {
    this.eventForm = this.formBuilder.group({
      eventId: ['', [Validators.required]],
      eventName: ['', [Validators.required]],
      eventDate: ['', [Validators.required]],
      numberOfGuests: ['', [Validators.required]],
      combo: ['', [Validators.required]],
      order: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.setValue();
  }


  getCarts(): void {
    this.cartService.getCarts()
      .subscribe(carts => this.carts = carts);
  }

  getCombos(): void {
    this.comboService.getCombos()
      .subscribe(combos => this.combos = combos);
  }

  setValue() {
    if (this.event) {
      this.eventForm.patchValue({
        eventId: this.event.eventId,
        eventName: this.event.eventName,
        eventDate: this.event.eventDate,
        numberOfGuests: this.event.numberOfGuests,
        combo: this.event.combo,
        order: this.event.order
      });
    }
  }

  updateEvent(): void {
    this.activeModal.close('Close after saving');
    if (this.eventForm.valid) {
      const updatedEvent: Event = {
        eventId: +this.eventForm.get('eventId')?.value,
        eventName: this.eventForm.get('eventName')?.value,
        eventDate: this.eventForm.get('eventDate')?.value,
        numberOfGuests: +this.eventForm.get('numberOfGuests')?.value,
        combo: +this.eventForm.get('combo')?.value,
        order: +this.eventForm.get('order')?.value
      };

      this.eventService.updateEvent(updatedEvent).subscribe(() => {
        // Cập nhật cache
        this.eventService.updateEventCache(updatedEvent);
        this.eventSaved.emit(); // Emit the event
      });
    }
  }
}
