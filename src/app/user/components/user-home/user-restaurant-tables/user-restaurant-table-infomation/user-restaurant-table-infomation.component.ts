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

    const selectedDate = this.reservationForm.get('selectedDate')?.value;
    const selectedTime = this.reservationForm.get('selectedTime')?.value;
    const dateTimeString = selectedDate + 'T' + selectedTime;
    const dateTime = new Date(dateTimeString);
    const formattedDateTime = dateTime.toLocaleString('en-US',{
      year: 'numeric', 
         month: '2-digit', 
         day: '2-digit', 
         hour: '2-digit', 
         minute: '2-digit', 
         second: '2-digit' 
    });

    // test() {
    //   const datetimeString = this.selectedDate + 'T' + this.selectedTime;
    //   const datetime = new Date(datetimeString);
    //   const formattedDatetime = datetime.toLocaleString('en-US', { 
    //     year: 'numeric', 
    //     month: '2-digit', 
    //     day: '2-digit', 
    //     hour: '2-digit', 
    //     minute: '2-digit', 
    //     second: '2-digit' 
    //   });

    //   // Lưu giá trị datetime vào cơ sở dữ liệu tại đây
    //   console.log(formattedDatetime); // In ra giá trị datetime để kiểm tra
    // }

    const formattedDateString = "2023-11-15 12:34:56.789123";

    // Chuyển đổi chuỗi thành đối tượng Date
    const formattedDateObject = new Date(formattedDateString);
    alert(formattedDateObject);

    const newReservation: Reservation = {
      restaurantTableId: this.restaurantTable?.tableId!,
      userId: this.user?.userId!,
      reservationDate: formattedDateTime,
      numberOfGuests: 1,
    };

    console.log(newReservation);
    this.reservationService.addReservation(newReservation);
  }

}
