import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Reservation } from 'src/app/interfaces/reservation';
import { ReservationStatus } from 'src/app/interfaces/reservation-status';
import { RestaurantTable } from 'src/app/interfaces/restaurant-table';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ReservationStatusService } from 'src/app/services/reservation-status.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { RestaurantTableService } from 'src/app/services/restaurant-table.service';
import { ToastService } from 'src/app/services/toast.service';

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
    private toastService: ToastService,
    private reservationStatusService: ReservationStatusService,
  ) {
    this.authService.cachedData$.subscribe((data) => {
      this.user = data;
    });
    this.reservationForm = this.formBuilder.group({
      selectedDate: [, [Validators.nullValidator]],
      selectedTime: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getReservationsByTableId();
    // this.authService.cachedData$.subscribe((data) => {
    //   this.user = data;
    //   if (this.user && typeof this.user.userId === 'number') {
    //     this.getReservationsByCurrentUser(this.user.userId);
    //   }
    // });
  }

  bookingTable(): void {
    this.addReservation();
  }

  getReservationsByTableId(): void {
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

  // getReservationsByCurrentUser(userId: number): void {
  //   this.reservationService.getReservationsByUser(userId).subscribe(
  //     (reservations) => {
  //       this.reservations = reservations;
  //       console.log('Reservations for current user:', this.reservations);
  //     },
  //     (error) => {
  //       console.error('Error fetching reservations:', error);
  //       // Xử lý lỗi nếu cần
  //     }
  //   );
  // }


  // showMessage() {
  //   this.toastService.showSuccess('Đây là thông báo thành công');
  //   this.toastService.showError('Đây là thông báo lỗi');
  //   this.toastService.showInfo('Đây là thông báo thông tin');
  //   this.toastService.showWarn('Đây là thông báo cảnh báo');
  // }

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
    let reservationStatusId: string = '';

    // this.reservationStatusService.getById("Đang rảnh").subscribe(
    //   (statuses: ReservationStatus | null) => {
    //     reservationStatusId = statuses?.reservationStatusName ?? '';
    //   },
    //   error => {
    //     console.error(error);
    //     // Xử lý lỗi nếu cần thiết
    //   }
    // );

    const newReservation: Reservation = {
      restaurantTableId: restaurantTableId!,
      userId: userId!,
      reservationDate: reservationDate,
      outTime: outTime,
      numberOfGuests: numberOfGuests,
      reservationStatusName: reservationStatusId
    };

    this.reservationService.add(newReservation).subscribe(
      {
        next: (addedReservation) => {
          console.log("Đặt bàn thành công");
        },
        error: (error) => {
          console.error('Error adding reservation:', error);
        },
        complete: () => {
          // Xử lý khi Observable hoàn thành (nếu cần)
        }
      }
    );

  }

}
