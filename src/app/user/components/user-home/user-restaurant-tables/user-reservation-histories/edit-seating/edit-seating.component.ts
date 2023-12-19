import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Reservation } from 'src/app/interfaces/reservation';
import { RestaurantTable } from 'src/app/interfaces/restaurant-table';
import { ReservationService } from 'src/app/services/reservation.service';
import { RestaurantTableService } from 'src/app/services/restaurant-table.service';

@Component({
  selector: 'app-edit-seating',
  templateUrl: './edit-seating.component.html',
  styleUrls: ['./edit-seating.component.css']
})
export class EditSeatingComponent {

  restaurants: RestaurantTable[] = [];
  @Input() reservationId!: number;
  @Input() restaurantTable!: RestaurantTable;
  @Output() restaurantTableSaved: EventEmitter<void> = new EventEmitter<void>();

  reservation1!: Reservation;

  constructor(
    private restaurantTableService: RestaurantTableService,
    private reservationService: ReservationService,
  ) {
    //this.getRestaurantTables();
    
  }

  ngOnInit(): void {
    //alert(this.reservationId);
    this.reservationService.getReservationById(this.reservationId).subscribe(
      data => {this.reservation1 = data;}
    )
  }

  // getRestaurantTables(){
  //   this.restaurantTableService.getCache().subscribe(
  //     data => {
  //       this.restaurants = data;
  //     }
  //   )
  // }

  getNumbersArray(): number[] {
    // Use safe navigation operator (?) to check if restaurantTable is available
    return this.restaurantTable?.seatingCapacity ? Array.from({ length: this.restaurantTable.seatingCapacity }, (_, index) => index + 1) : [];
  }

  save(event: any) {
    const updatedReservation = { ...this.reservation1 };
    updatedReservation.numberOfGuests = +event.target.value;
  
    this.reservationService.update(updatedReservation).subscribe(() => {
      // Emit an event or perform any other actions upon successful update
      //this.restaurantTableSaved.emit();
    });
  }

}
