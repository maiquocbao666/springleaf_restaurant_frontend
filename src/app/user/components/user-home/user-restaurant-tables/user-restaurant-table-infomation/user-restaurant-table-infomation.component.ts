import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Reservation } from 'src/app/interfaces/reservation';
import { RestaurantTable } from 'src/app/interfaces/restaurant-table';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ReservationService } from 'src/app/services/reservation.service';

@Component({
  selector: 'app-user-restaurant-table-infomation',
  templateUrl: './user-restaurant-table-infomation.component.html',
  styleUrls: ['./user-restaurant-table-infomation.component.css']
})
export class UserRestaurantTableInfomationComponent {

  @Input() restaurantTable: RestaurantTable | undefined;
  @Output() restaurantTableSaved: EventEmitter<void> = new EventEmitter<void>();
  user: User | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private authService: AuthenticationService,
    private reservationService: ReservationService,
  ) {
    this.authService.cachedData$.subscribe((data) => {
      this.user = data;
      console.log(this.user);
      // Cập nhật thông tin người dùng từ userCache khi có sự thay đổi
    });
  }

  bookingTable(): void {
    this.addReservation();
  }

  addReservation() {

    const formattedDateString = "2023-11-15 12:34:56.789123";

    // Chuyển đổi chuỗi thành đối tượng Date
    const formattedDateObject = new Date(formattedDateString);
    alert(formattedDateObject);

    const newReservation: Reservation = {
      restaurantTableId: this.restaurantTable?.tableId!,
      userId: this.user?.userId!,
      reservationDate: formattedDateObject,
      numberOfGuests: 1,
    };

    console.log(newReservation);
    this.reservationService.addReservation(newReservation);
  }

}
