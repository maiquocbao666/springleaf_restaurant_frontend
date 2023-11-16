import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  reservationForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private authService: AuthenticationService,
    private reservationService: ReservationService,
    private formBuilder: FormBuilder,
  ) {
    this.authService.cachedData$.subscribe((data) => {
      this.user = data;
      console.log(this.user);
      // Cập nhật thông tin người dùng từ userCache khi có sự thay đổi
    });
    this.reservationForm = this.formBuilder.group({
      selectedDate: [, [Validators.nullValidator]],
      selectedTime: ['', [Validators.required]],
    });
  }

  bookingTable(): void {
    this.addReservation();
  }

  addReservation() {

    try {
      const selectedDate = this.reservationForm.get('selectedDate')?.value;
      const selectedTime = this.reservationForm.get('selectedTime')?.value;
      const dateTimeString = selectedDate + 'T' + selectedTime;
      const dateTime = new Date(dateTimeString);
      const formattedDateTime = dateTime.toUTCString();

      const restaurantTableId = this.restaurantTable?.tableId;
      const userId = this.user?.userId;
      const reservationDate = formattedDateTime;
      const outTime = '';
      const numberOfGuests = 1;

      const newReservation: Reservation = {
        restaurantTableId: restaurantTableId!,
        userId: userId!,
        reservationDate: reservationDate!,
        outTime: '',
        numberOfGuests: 1,
      };

      //console.log(newReservation);
      this.reservationService.addReservation(newReservation);
    } catch (error) {
      console.log("Thêm reservation thất bại");
    }

  }

}
