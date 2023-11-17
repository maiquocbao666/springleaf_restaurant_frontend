import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Reservation } from 'src/app/interfaces/reservation';
import { RestaurantTable } from 'src/app/interfaces/restaurant-table';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { RestaurantTableService } from 'src/app/services/restaurant-table.service';

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
  reservations: Reservation[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private authService: AuthenticationService,
    private reservationService: ReservationService,
    private formBuilder: FormBuilder,
    private restaurantTableService: RestaurantTableService,
  ) {
    this.authService.cachedData$.subscribe((data) => {
      this.user = data;
      //console.log(this.user);
      // Cập nhật thông tin người dùng từ userCache khi có sự thay đổi
    });
    this.reservationForm = this.formBuilder.group({
      selectedDate: [, [Validators.nullValidator]],
      selectedTime: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getReservationsByTableId();
  }

  bookingTable(): void {
    this.addReservation();
    
  }

  getReservationsByTableId(): void{
    if (this.restaurantTable?.tableId) {
      this.reservationService.getReservationsByTableId(this.restaurantTable.tableId).subscribe(
        {
          next: (reservations) => {
            this.reservations = reservations;
            console.log(this.reservations);
          },
          error: (error) => {

          },
          complete: () => {

          }
        }
      );
    }
  }

  addReservation() {

    const selectedDate = this.reservationForm.get('selectedDate')?.value;
    const selectedTime = this.reservationForm.get('selectedTime')?.value;
    const dateTimeString = selectedDate + 'T' + selectedTime;
    const dateTime = new Date(dateTimeString);
    const formattedDateTime = dateTime.toISOString();

    const restaurantTableId = this.restaurantTable?.tableId;
    const userId = this.user?.userId;
    const reservationDate = formattedDateTime;
    const outTime = '';
    const numberOfGuests = 1;

    const newReservation: Reservation = {
      restaurantTableId: restaurantTableId!,
      userId: userId!,
      reservationDate: reservationDate,
      outTime: outTime,
      numberOfGuests: numberOfGuests,
      reservationsStatus: 0
    };

    this.reservationService.addReservation(newReservation).subscribe(
      {
        next: (addedReservation) => {
          //console.log('Reservation added successfully:', addedReservation);
          // Thực hiện các hành động khác nếu cần
        },
        error: (error) => {
          console.error('Error adding reservation:', error);
          // Xử lý lỗi nếu có
        },
        complete: () => {
          // Xử lý khi Observable hoàn thành (nếu cần)
        }
      }
    );

  }

}
