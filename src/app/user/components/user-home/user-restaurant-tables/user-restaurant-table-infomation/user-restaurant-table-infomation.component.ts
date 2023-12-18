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
      (data) => {
        console.log('Received data:', data);

        if (this.restaurantTable?.tableId) {
          this.reservations = data.filter(cache => {
            return (
              (cache.reservationStatusName === "Đang đợi" ||
                cache.reservationStatusName === "Chưa tới" ||
                cache.reservationStatusName === "Đang sử dụng") &&
              cache.restaurantTableId === this.restaurantTable.tableId
            );
          });
        }
      },
      (error) => {
        console.error('Error in subscription:', error);
      },
      () => {
        console.log('Subscription completed.');
      }
    );
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
    // const searchKeyWord = this.reservationForm.get('searchKeyWord')?.value;
    // //console.log('Search keyword:',  searchKeyWord);
    // if (searchKeyWord === '') {
    //    this.isSearch = false;
    // } else {
    //   this.isSearch = true;
    // }
    // this.reservationService.searchReservations(this.restaurantTable?.tableId!, this.reservationForm.get('searchKeyWord')?.value).subscribe(
    //   results => {
    //     if(results){
    //       this.reservations = results;
    //     } else {
    //       this.getRervationsByTableId(this.restaurantTable.tableId!);
    //     }
    //   },
    //   error => {
    //     console.error('Error searching reservations:', error);
    //   }
    // );
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  bookingTable(): void {
    this.addReservation();
  }

  // getRervationsByTableId(id: number) {
  //   this.reservationService.getReservationsByTableId(id).subscribe(
  //     cached => {
  //       this.reservations = cached;
  //       //console.log(this.reservations);
  //     }
  //   );
  // }

  //-------------------------------------------------------------------------------------------------

  updateMinMaxDate() {
    const currentDate = new Date();
    this.minDate = currentDate.toISOString().split('T')[0]; // Format as 'yyyy-MM-dd'
    console.log("Min date: " + this.minDate);

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 5);
    this.maxDate = maxDate.toISOString().split('T')[0]; // Format as 'yyyy-MM-dd'
    console.log(this.maxDate);
  }

  checkDate(selectedDate: string, minDate: string): boolean {

    //const date1 = new Date(selectedDate + '00:00:00');
    //const date2 = new Date(minDate + '00:00:00');

    if (selectedDate === minDate) {
      return true;
    } else {
      return false;
    }

  }

  check(selectedDate: string, selectedTime: string): boolean {
    if (!selectedDate) {
      this.selectedDateMessage = "Mời chọn ngày đến";
      return false;
    } else {
      this.selectedDateMessage = "";
    }
    if (!selectedTime) {
      this.selectedTimeMessage = "Mời chọn thời gian đến";
      return false;
    } else {
      this.selectedTimeMessage = "";
    }
    return true;
  }

  checkIsReservedBefore(fullDateTime: string, selectedDate: string): boolean {
    const check = this.reservationService.isTableReserved(this.restaurantTable.tableId!, fullDateTime, selectedDate);
    if (check) {
      this.selectedDateMessage = "Đã có người đặt";
      this.selectedTimeMessage = "Đã có người đặt";
    } else {
      this.selectedDateMessage = "";
      this.selectedTimeMessage = "";
    }
    return check;
  }

  checkIsReservedAfter(fullDateTime: string, selectedDate: string): boolean {
    const check = this.reservationService.isTableReserved1(this.restaurantTable.tableId!, fullDateTime, selectedDate);
    if (check) {
      this.selectedDateMessage = "Đã có người đặt";
      this.selectedTimeMessage = "Đã có người đặt";
    } else {
      this.selectedDateMessage = "";
      this.selectedTimeMessage = "";
    }
    return check;
  }

  addToReservation(seatingCapacity: number, fullDateTime: string) {
    const newReservation: Reservation = {
      restaurantTableId: this.restaurantTable?.tableId!,
      userId: this.user?.userId!,
      reservationDate: fullDateTime,
      //outTime: outDateTimeString,
      outTime: '',
      numberOfGuests: seatingCapacity,
      reservationStatusName: 'Chưa tới',
    };

    let reservationsCache: Reservation[] = [];
    this.reservationService.add(newReservation).subscribe(
      {
        next: (addedReservation) => {
          this.sweetAlertService.showTimedAlert('Chúc mừng!', 'Bạn đã đặt bàn thành công', 'success', 3000);
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

  checkAllowTime(selectedDate: string, selectedTime: string): boolean {

    this.updateMinMaxDate();

    const currentDateTime1 = new Date();

    // Thời gian hiện tại
    const formattedCurrentDateTime = this.datePipe.transform(currentDateTime1, 'yyyy-MM-dd HH:mm:ss');
    //console.log(formattedCurrentDateTime);
    const currentDateTime = new Date(formattedCurrentDateTime!).getTime();

    const allowTimeString1 = selectedDate + ' ' + '07:59:59';
    const allowTimeString2 = selectedDate + ' ' + '22:00:01';
    const fullDateTimeString = selectedDate + ' ' + selectedTime;

    //alert(fullDateTimeString);

    // Thời gian mở cửa
    const allowTime1 = new Date(allowTimeString1).getTime();
    // Thời gian đóng cửa
    const allowTime2 = new Date(allowTimeString2).getTime();
    // Thời gian chọn
    const fullDateTime = new Date(fullDateTimeString).getTime();

    let isBefore2Hours1;
    let isBefore2Hours2;

    const isToday = this.checkDate(selectedDate, this.minDate);
    console.log("Is today: " + isToday);
    if (isToday) {
      isBefore2Hours1 = (fullDateTime + 1000 * 60 * 60 * 2 > allowTime1 + 1000 * 60 * 60 * 1) && (currentDateTime + 1000 * 60 * 60 * 2 <= fullDateTime);
      isBefore2Hours2 = (fullDateTime + 1000 * 60 * 60 * 2 < allowTime2) && (currentDateTime + 1000 * 60 * 60 * 2 <= fullDateTime);
    } else {
      isBefore2Hours1 = fullDateTime + 1000 * 60 * 60 * 2 > allowTime1 + 1000 * 60 * 60 * 1;
      isBefore2Hours2 = fullDateTime + 1000 * 60 * 60 * 2 < allowTime2;
    }

    console.log(isBefore2Hours1);
    console.log(isBefore2Hours2);

    //Phải đặt trước thời gian mở cửa 2 tiếng và sau thời gian mở cửa 1 tiếng
    if (isBefore2Hours1) {
      // Phải đặt trước thời gian đóng cửa 2 tiếng
      if (isBefore2Hours2) {
        this.selectedTimeMessage = "";
        return true;
      } else {
        this.selectedTimeMessage = "Phải đặt trước thời gian đóng cửa 2 tiếng hoặc trước thời gian tới 2 tiếng";
        return false;
      }
    } else {
      this.selectedTimeMessage = "Thời gian đến phải lớn hơn 2 tiếng so với hiện tại hoặc trong thời gian được phép đặt";
      return false;
    }

  }

  checkAll(): boolean {
    // Ngày mà khách hàng chọn
    const selectedDate = this.reservationForm.get('selectedDate')?.value; // yyyy-MM-dd
    const selectedTimeStr = this.reservationForm.get('selectedTime')?.value + ':00';

    const check = this.check(selectedDate, selectedTimeStr);
    if (!check) {
      return false;
    }

    const checkAllowTime = this.checkAllowTime(selectedDate, selectedTimeStr);
    if (!checkAllowTime) {
      return false;
    }

    const fullDateTime = selectedDate + ' ' + selectedTimeStr;

    const checkBefore = this.checkIsReservedBefore(fullDateTime, selectedDate);
    if (checkBefore) {
      return false;
    }

    const checkAfter = this.checkIsReservedAfter(fullDateTime, selectedDate);
    if (checkAfter) {
      return false;
    }

    return true;

  }

  addReservation() {

    // Cập nhật ngày min max
    this.updateMinMaxDate();

    const seatingCapacity = this.reservationForm.get('seatingCapacity')?.value;

    // Ngày mà khách hàng chọn
    const selectedDate = this.reservationForm.get('selectedDate')?.value; // yyyy-MM-dd
    const selectedTimeStr = this.reservationForm.get('selectedTime')?.value + ':00';

    // if (!this.checkAll()) {
    //   return;
    // }

    const fullDateTime = selectedDate + ' ' + selectedTimeStr;

    this.addToReservation(seatingCapacity, fullDateTime);

  }

  //--------------------------------------------------------------------------------------------------------------

  orderAfterReservation() {

  }

}
