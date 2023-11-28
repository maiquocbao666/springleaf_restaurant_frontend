import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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
  minDate!: string;
  maxDate!: string;

  constructor(
    public activeModal: NgbActiveModal,
    private authService: AuthenticationService,
    private reservationService: ReservationService,
    private formBuilder: FormBuilder,
    private restaurantTableService: RestaurantTableService,
    private toastService: ToastService,
    private reservationStatusService: ReservationStatusService,
    private datePipe: DatePipe,
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
    //this.getReservationsByTableId();
    // this.authService.cachedData$.subscribe((data) => {
    //   this.user = data;
    //   if (this.user && typeof this.user.userId === 'number') {
    //     this.getReservationsByCurrentUser(this.user.userId);
    //   }
    // });
    this.minDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    this.maxDate = this.datePipe.transform(this.addDays(new Date(), 5), 'yyyy-MM-dd')!;
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  bookingTable(): void {
    this.addReservation();
  }

  // getReservationsByTableId(): void {
  //   if (this.restaurantTable?.tableId) {
  //     this.reservationService.getReservationsByTableId(this.restaurantTable.tableId).subscribe(
  //       {
  //         next: (reservations) => {
  //           this.reservations = reservations;
  //           console.log(this.reservations);
  //         },
  //         error: (error) => {

  //         },
  //         complete: () => {

  //         }
  //       }
  //     );
  //   }
  // }

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

  updateMinMaxDate() {
    const currentDate = new Date();
    this.minDate = currentDate.toISOString().split('T')[0]; // Format as 'yyyy-MM-dd'
    console.log(this.minDate);

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 5);
    this.maxDate = maxDate.toISOString().split('T')[0]; // Format as 'yyyy-MM-dd'
    console.log(this.maxDate);
  }

  checkDate(selectedDate: string, minDate: string, maxDate: string): boolean {
    const date1 = new Date(selectedDate);
    const date2 = new Date(minDate);
    const date3 = new Date(maxDate);

    if (date1 > date2 && date1 < date3) {
      return true;
    } else {
      return false;
    }
  }

  addReservation() {

    // Cập nhật ngày min max
    this.updateMinMaxDate();

    // Ngày mà khách hàng chọn
    const selectedDate = this.reservationForm.get('selectedDate')?.value; // yyyy-MM-dd
    let selectedTimeStr = this.reservationForm.get('selectedTime')?.value;

    if (!this.checkDate(selectedDate, this.minDate, this.maxDate)) {
      selectedTimeStr = this.reservationForm.get('selectedTime')?.value;
      const currentDateStr = new Date().toLocaleDateString(); // Get the current date in a suitable format

      const selectedDateTimeStr = `${currentDateStr} ${selectedTimeStr}`;
      const selectedTime = new Date(selectedDateTimeStr).getTime();

      // Add 1 hour to the current time
      // const oneHourLater = new Date(new Date().getTime() + 60 * 60 * 1000).getTime();

      // if (selectedTime <= oneHourLater) {
      //   console.log(selectedTime);
      //   console.log(oneHourLater);
      //   console.log("Giờ đặt phải lớn hơn giờ hiện tại 1 tiếng");
      //   return;
      // }

      // Add 1 minute to the current time
      const oneMinuteLater = new Date(new Date().getTime() + 60 * 1000).getTime(); // Thêm 1 phút

      if (selectedTime <= oneMinuteLater) {
        console.log(selectedTime);
        console.log(oneMinuteLater);
        console.log("Giờ đặt phải lớn hơn giờ hiện tại 1 phút");
        return;
      }

    }

    let reservations: Reservation[] = JSON.parse(localStorage.getItem('reservations') || '[]');

    // Tổng hợp ngày giờ lại
    const dateTimeString = (selectedDate ? this.datePipe.transform(selectedDate, 'dd-MM-yyyy')! : '') + (selectedTimeStr ? ' ' + selectedTimeStr + ':00' : '');

    const newReservation: Reservation = {
      restaurantTableId: this.restaurantTable?.tableId!,
      userId: this.user?.userId!,
      reservationDate: dateTimeString,
      outTime: '',
      numberOfGuests: 1,
      reservationStatusName: 'Đang chờ',
    };

    this.reservationService.add(newReservation).subscribe(
      {
        next: (addedReservation) => {
          console.log("Đặt bàn thành công");
          reservations.push(addedReservation);
          localStorage.setItem('reservations', JSON.stringify(reservations));
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

  // getYear(dateString: string): number {
  //   const dateParts = dateString.split('-');
  //   const year = parseInt(dateParts[0], 10);
  //   // 
  //   return year;
  // }

  // getMonth(dateString: string): number {
  //   const dateParts = dateString.split('-');
  //   const month = parseInt(dateParts[1], 10) - 1;
  //   return month;
  // }

  // getDay(dateString: string): number {
  //   const dateParts = dateString.split('-');
  //   const day = parseInt(dateParts[2], 10);
  //   return day;
  // }

}
