import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Reservation } from 'src/app/interfaces/reservation';
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

  @Input() restaurantTable!: RestaurantTable;
  @Output() restaurantTableSaved: EventEmitter<void> = new EventEmitter<void>();
  user: User | null = null;
  reservationForm: FormGroup;
  reservations: Reservation[] = [];
  minDate!: string;
  maxDate!: string;
  isSearch = false;

  // validate
  isTermsAccepted: boolean = false;
  selectedDateMessage = '';
  selectedTimeMessage = '';
  selectedOutTimeMessage = '';


  searchReservations: Reservation[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private authService: AuthenticationService,
    private reservationService: ReservationService,
    private formBuilder: FormBuilder,
    private restaurantTableService: RestaurantTableService,
    private toastService: ToastService,
    private reservationStatusService: ReservationStatusService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private sweetAlertService: ToastService,
  ) {
    this.authService.getUserCache().subscribe((data) => {
      this.user = data;
    });
    this.reservationForm = this.formBuilder.group({
      selectedDate: [, [Validators.required]],
      selectedTime: ['', [Validators.required]],
      outTime: ['', [Validators.required]],
      searchKeyWord: ['', Validators.nullValidator],
      seatingCapacity: [1, Validators.required],
      agree: [false, Validators.requiredTrue],
    });

    this.reservationForm.get('agree')?.valueChanges.subscribe(
      (value) => {
        this.isTermsAccepted = value;
        console.log(this.isTermsAccepted);
      }
    );

  }


  ngOnInit(): void {
    this.minDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    this.maxDate = this.datePipe.transform(this.addDays(new Date(), 5), 'yyyy-MM-dd')!;
    this.reservationService.getCache().subscribe(
      () => {
        if (this.restaurantTable?.tableId) {
          this.getRervationsByTableId(this.restaurantTable.tableId);
        }
      }
    )
  }


  @ViewChild('termsModal') termsModal!: ElementRef;

  isConfirmed: boolean = false;

  openTermsModal() {
    this.modalService.open(this.termsModal, { scrollable: true, size: 'lg' });
  }

  onScroll(event: any) {
    const element = event.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      this.isTermsAccepted = true;
    }
  }

  getNumbersArray(): number[] {
    // Use safe navigation operator (?) to check if restaurantTable is available
    return this.restaurantTable?.seatingCapacity ? Array.from({ length: this.restaurantTable.seatingCapacity }, (_, index) => index + 1) : [];
  }

  onSearch(): void {
    const searchKeyWord = this.reservationForm.get('searchKeyWord')?.value;
    //console.log('Search keyword:',  searchKeyWord);
    if (searchKeyWord === '') {
      this.isSearch = false;
      return;
    } else {
      this.isSearch = true;
    }
    this.reservationService.searchReservations(this.restaurantTable?.tableId!, this.reservationForm.get('searchKeyWord')?.value).subscribe(
      results => {
        this.searchReservations = results;
      },
      error => {
        console.error('Error searching reservations:', error);
      }
    );
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  bookingTable(): void {
    this.addReservation();
  }

  getRervationsByTableId(id: number) {
    this.reservationService.getReservationsByTableId(id).subscribe(
      cached => {
        this.reservations = cached;
        //console.log(this.reservations);
      }
    );
  }

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

    const seatingCapacity = this.reservationForm.get('seatingCapacity')?.value;

    // Ngày mà khách hàng chọn
    const selectedDate = this.reservationForm.get('selectedDate')?.value; // yyyy-MM-dd
    let selectedTimeStr = this.reservationForm.get('selectedTime')?.value;
    let outTimeStr = this.reservationForm.get('outTime')?.value;

    // Thời gian tới
    const selectedDateTimeStr = `${selectedDate} ${selectedTimeStr}`;
    const selectedTime = new Date(selectedDateTimeStr).getTime();

    // Thời gian rời đi
    const outDateTimeStr = `${selectedDate} ${outTimeStr}`;
    const outDateTime = new Date(outDateTimeStr).getTime();

    if (!selectedDate || !this.reservationForm.valid || selectedTimeStr === '' || outTimeStr === '') {
      this.selectedDateMessage = 'Mời chọn thời gian';
      this.selectedTimeMessage = 'Mời chọn thời gian';
      this.selectedOutTimeMessage = 'Mời chọn thời gian';
      //this.sweetAlertService.showTimedAlert('Cảnh báo!', 'Mời chọn thời gian', 'warning', 3000);
      return;
    } else {
      this.selectedDateMessage = '';
      this.selectedTimeMessage = '';
      this.selectedOutTimeMessage = '';
    }

    if (
      (
        (selectedTime >= new Date(`${selectedDate} 23:00:00`).getTime() && selectedTime <= new Date(`${selectedDate} 23:59:59`).getTime())
        ||
        (outDateTime >= new Date(`${selectedDate} 23:00:00`).getTime() && outDateTime <= new Date(`${selectedDate} 23:59:59`).getTime())
      )
      ||
      (
        (selectedTime >= new Date(`${selectedDate} 00:00:00`).getTime() && selectedTime <= new Date(`${selectedDate} 07:00:00`).getTime())
        ||
        (outDateTime >= new Date(`${selectedDate} 00:00:00`).getTime() && outDateTime <= new Date(`${selectedDate} 07:00:00`).getTime())
      )
    ) {
      this.selectedTimeMessage = 'Thời gian này không được đặt';
      this.selectedOutTimeMessage = 'Thời gian này không được đặt';
      //this.sweetAlertService.showTimedAlert('Cảnh báo!', 'Thời gian này không được đặt', 'warning', 3000);
      return;
    } else {
      this.selectedTimeMessage = '';
      this.selectedOutTimeMessage = '';
    }

    // Nếu thời gian chọn = minDate hoặc maxDate
    if (!this.checkDate(selectedDate, this.minDate, this.maxDate)) {

      // Add 1 minute to the current time
      const fiveMinutesLater = new Date(new Date().getTime() + 60 * 1000 * 5).getTime(); // Thêm 1 phút
      const oneHourLater = new Date(new Date().getTime() + 60 * 60 * 1000).getTime(); // Thêm 1 tiếng

      if (selectedTime < fiveMinutesLater) {
        this.selectedTimeMessage = 'Thời gian đến phải lớn hơn hoặc bằng giờ hiện tại 5 phút';
        //this.sweetAlertService.showTimedAlert('Cảnh báo!', 'Thời gian đến phải lớn hơn hoặc bằng giờ hiện tại 5 phút', 'warning', 3000);
        return;
      } else {
        this.selectedTimeMessage = '';
      }

    }

    const fiveMinutesLater = new Date(new Date(selectedDateTimeStr).getTime() + 5 * 60 * 1000).getTime(); // Thêm 2 phút
    const twoHoursLater = new Date(new Date(selectedDateTimeStr).getTime() + 60 * 60 * 1000 * 2).getTime(); // Thêm 1 tiếng
    //console.log(selectedDateTimeStr, outDateTimeStr);

    if (outDateTime < fiveMinutesLater) {
      this.selectedOutTimeMessage = 'Thời gian rời đi phải lớn hơn hoặc bằng thời gian đến 5 phút';
      //this.sweetAlertService.showTimedAlert('Cảnh báo!', 'Thời gian rời đi phải lớn hơn hoặc bằng thời gian đến 3 phút', 'warning', 3000);
      return;
    } else {
      this.selectedOutTimeMessage = '';
    }

    if (this.reservationService.isReservationsInTimeRangeByTableId(this.restaurantTable?.tableId!, selectedDateTimeStr, outDateTimeStr)) {
      this.selectedTimeMessage = 'Khoảng thời gian này đã được sử dụng';
      this.selectedOutTimeMessage = 'Khoảng thời gian này đã được sử dụng';
      //this.sweetAlertService.showTimedAlert('Cảnh báo!', 'Khoảng thời gian này đã được sử dụng', 'warning', 3000);
      return;
    } else {
      this.selectedTimeMessage = '';
      this.selectedOutTimeMessage = '';
    }

    // Tổng hợp ngày giờ lại
    const dateTimeString = (selectedDate ? this.datePipe.transform(selectedDate, 'yyyy-MM-dd')! : '') + (selectedTimeStr ? ' ' + selectedTimeStr + ':00' : '');
    const outDateTimeString = (selectedDate ? this.datePipe.transform(selectedDate, 'yyyy-MM-dd')! : '') + (outTimeStr ? ' ' + outTimeStr + ':00' : '');

    const newReservation: Reservation = {
      restaurantTableId: this.restaurantTable?.tableId!,
      userId: this.user?.userId!,
      reservationDate: dateTimeString,
      outTime: outDateTimeString,
      numberOfGuests: seatingCapacity,
      reservationStatusName: 'Đang đợi',
    };

    let reservationsCache: Reservation[] = [];
    this.reservationService.add(newReservation).subscribe(
      {
        next: (addedReservation) => {
          this.sweetAlertService.showTimedAlert('Chức mừng!', 'Bạn đã dặt bàn thành công', 'success', 3000);
          reservationsCache.push(addedReservation);
          localStorage.setItem('reservations', JSON.stringify(reservationsCache));
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

  orderAfterReservation() {

  }

}
