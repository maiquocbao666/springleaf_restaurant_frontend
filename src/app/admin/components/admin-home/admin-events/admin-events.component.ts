import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Cart } from 'src/app/interfaces/cart';
import { Combo } from 'src/app/interfaces/combo';
import { Event } from 'src/app/interfaces/event';
import { CartService } from 'src/app/services/cart.service';
import { ComboService } from 'src/app/services/combo.service';
import { EventService } from 'src/app/services/event.service';
import { AdminEventDetailComponent } from './admin-event-detail/admin-event-detail.component';

@Component({
  selector: 'app-admin-events',
  templateUrl: './admin-events.component.html',
  styleUrls: ['./admin-events.component.css']
})
export class AdminEventsComponent {
  events: Event[] = [];
  combos: Combo[] = [];
  carts: Cart[] = [];
  eventForm: FormGroup;
  event: Event | undefined;
  fieldNames: string[] = [];

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  eventsUrl = 'events';
  cartsUrl = "carts";
  combosUrl = "combos";


  constructor(
    private eventService: EventService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private comboService: ComboService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.eventForm = this.formBuilder.group({
      eventId: ['', [Validators.required]],
      eventName: ['', [Validators.required]],
      eventDate: ['', [Validators.required]],
      numberOfGuests: ['', [Validators.required]],
      combo: ['', [Validators.required]],
      order: ['', [Validators.required]],

    });
  }

  ngOnInit(): void {
    this.getEvents();
    this.getCarts();
    this.getCombos();
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  getCartById(orderId: number): Observable<Cart | null> {
    return this.cartService.getById(orderId);
  }

  getComboById(comboId: number): Observable<Combo | null> {
    return this.comboService.getById(comboId);
  }

  getEvents(): void {
    this.eventService.gets();
    this.eventService.cache$
      .subscribe(events => {
        this.eventService.gets();
        this.events = JSON.parse(localStorage.getItem(this.eventsUrl) || 'null')
      });
  }

  getCarts(): void {
    this.comboService.gets();
    this.cartService.cache$
      .subscribe(carts => {
        this.cartService.gets();
        this.carts = JSON.parse(localStorage.getItem(this.cartsUrl) || 'null')
      });
  }

  getCombos(): void {
    this.comboService.gets();
    this.comboService.cache$
      .subscribe(combos => {
        this.comboService.gets();
        this.combos = JSON.parse(localStorage.getItem(this.combosUrl) || 'null')
      });
  }

  addEvent(): void {
    // Lấy giá trị từ các trường select
    const eventId = this.eventForm.get('eventId')?.value;
    const eventName = this.eventForm.get('eventName')?.value;
    const eventDate = this.eventForm.get('eventDate')?.value;
    const numberOfGuests = this.eventForm.get('numberOfGuests')?.value;
    const combo = this.eventForm.get('combo')?.value;
    const order = this.eventForm.get('order')?.value;

    const newEvent: Event = {
      eventName: eventName,
      eventDate: eventDate,
      numberOfGuests: numberOfGuests,
      combo: combo,
      order: order,
    };

    this.eventService.add(newEvent)
      .subscribe(event => {
        this.eventForm.reset();
      });

  }

  deleteEvent(event: Event): void {

    if (event.eventId) {
      this.eventService.delete(event.eventId).subscribe();
    } else {
      console.log("Không có eventId");
    }


  }

  openEventDetailModal(event: Event) {
    const modalRef = this.modalService.open(AdminEventDetailComponent, { size: 'lg' });
    modalRef.componentInstance.event = event;
    modalRef.componentInstance.eventSaved.subscribe(() => {
    });

  }
}
