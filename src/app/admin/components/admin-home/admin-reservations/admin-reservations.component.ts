import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reservation } from 'src/app/interfaces/reservation';
import { ApiService } from 'src/app/services/api.service';
import { DateTimeService } from 'src/app/services/date-time.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { ToastService } from 'src/app/services/toast.service';
import { Message } from '@stomp/stompjs';
import { addHours, differenceInMilliseconds, format } from 'date-fns';
// import { addHours, differenceInMilliseconds, format } from 'date-fns';
// import { utcToZonedTime, format as formatTz } from 'date-fns-tz';
import { RestaurantTable } from 'src/app/interfaces/restaurant-table';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RestaurantTableService } from 'src/app/services/restaurant-table.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-admin-reservations',
  templateUrl: './admin-reservations.component.html',
  styleUrls: ['./admin-reservations.component.css']
})
export class AdminReservationsComponent {
  dataSource!: MatTableDataSource<Reservation>;
  selectedRow: any;
  //@ViewChild(MatPaginator) paginator!: MatPaginator;
  //@ViewChild(MatSort) sort!: MatSort;

  numbersArray: number[] = [];
  restaurantIdsArray = Array.from({ length: 10 }, (_, index) => index + 1);

  restaurantTables: RestaurantTable[] = [];

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  reservation!: Reservation | null;
  reservations: Reservation[] = [];

  currentDateTime$: string = '';

  reservationsUrl = 'reservations';

  minDate!: string;
  maxDate!: string;
  isSearch = false;
  user: User | null = null;

  reservationForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private reservationService: ReservationService,
    private dateTimeService: DateTimeService,
    private apiService: ApiService,
    private sweetAlertService: ToastService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private restaurantTableService: RestaurantTableService,
  ) {
    this.dateTimeService.currentDateTimeCache$.subscribe((dateObject: Date) => {
      // Assuming the service emits Date objects
      this.currentDateTime$ = dateObject.toISOString();
    });
    this.authService.getUserCache().subscribe((data) => {
      this.user = data;
    });
    this.reservationForm = this.formBuilder.group({
      selectedDate: [, [Validators.nullValidator]],
      selectedTime: ['', [Validators.required]],
      outTime: ['', [Validators.required]],
      searchKeyWord: ['', Validators.nullValidator],
      seatingCapacity: [1, Validators.nullValidator],
      restaurantTableId: [, Validators.nullValidator],
    });
  }

  ngOnInit(): void {
    console.log("Init admin reservation component");
    this.minDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    this.maxDate = this.datePipe.transform(this.addDays(new Date(), 5), 'yyyy-MM-dd')!;
    this.getReservations();
    this.getRestaurantTables();
  }

  getRestaurantTables() {
    this.restaurantTableService.getCache().subscribe(
      cached => {
        this.restaurantTables = cached;
        this.numbersArray = Array.from({ length: this.restaurantTables[0].seatingCapacity }, (_, index) => index + 1);
        this.reservationForm.get('restaurantTableId')?.setValue(this.restaurantTables[0].tableId);
      }
    )
  }

  changeSeatingCapacity(event: Event): void {
    // Explicitly cast EventTarget to HTMLSelectElement
    const selectedTableId = (event.target as HTMLSelectElement).value;

    // Convert selectedTableId to a number
    const tableIdNumber = parseInt(selectedTableId, 10);

    // Check if the conversion is successful
    if (!isNaN(tableIdNumber)) {
      this.numbersArray = Array.from({ length: tableIdNumber }, (_, index) => index + 1);
      this.reservationForm.get('restaurantTableId')?.setValue(tableIdNumber);
    } else {
      console.error('Invalid table ID:', selectedTableId);
    }
  }


  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  bookingTable(): void {
    this.addReservation();
  }

  hoursUse(reservation: Reservation): string {

    // 1000ms = 1s
    if (reservation.reservationStatusName === "Đã sử dụng xong") {
      return "Hết giờ sử dụng";
    }

    const currentTime = new Date();
    const reservationTime = new Date(new Date(reservation.outTime).getTime());

    const diff = reservationTime.getTime() - currentTime.getTime();

    const hours = Math.floor(diff / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((diff % (60 * 1000)) / 1000);

    if (diff >= 0) {
      return hours + ':' + minutes + ':' + seconds;
    }

    return "Hết giờ sử dụng";
  }

  // getReservations(): void {
  //   this.reservationService.getCache().subscribe(
  //     (cached: any[]) => {
  //       this.reservations = cached;
  //     }
  //   );
  // }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isSearching = false;
  getReservations(): void {
    this.reservationService.getCache().subscribe(
      (cached: Reservation[]) => {
        if (this.isSearching === true) {
          return;
        }

        // Sắp xếp theo giờ giảm dần
        this.reservations = cached.sort((a, b) => {
          const timeA = new Date(a.reservationDate).getTime();
          const timeB = new Date(b.reservationDate).getTime();
          return timeB - timeA;
        });

        // Sắp xếp theo trạng thái giảm dần (Đang sử dụng sau Đang đợi)
        this.reservations = this.reservations.sort((a, b) => {
          // Đặt bản ghi đang sử dụng lên sau bản ghi đang đợi
          if (a.reservationStatusName === 'Đang sử dụng' && b.reservationStatusName === 'Đang đợi') {
            return 1;
          }
          // Giữ nguyên thứ tự với các bản ghi khác
          return 0;
        });

        //this.dataSource = new MatTableDataSource(this.reservations);
        //this.dataSource.paginator = this.paginator;
        //this.dataSource.sort = this.sort;
      },
      (error: any) => {
        console.error('Failed to fetch data', error);
      }
    );
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  deletereservation(reservation: Reservation): void {
    if (reservation.reservationId) {
      this.reservationService.delete(reservation.reservationId).subscribe();
    } else {
      console.error("Cannot delete reservation with undefined reservationId.");
    }

  }

  updateMinMaxDate() {
    const currentDate = new Date();
    this.minDate = currentDate.toISOString().split('T')[0]; // Format as 'yyyy-MM-dd'
    //console.log(this.minDate);

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 5);
    this.maxDate = maxDate.toISOString().split('T')[0]; // Format as 'yyyy-MM-dd'
    //console.log(this.maxDate);
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

    // if (!this.user) {
    //   this.sweetAlertService.showTimedAlert('Mời đăng nhập!', 'Mời đăng nhập', 'error', 3000);
    //   return;
    // }

    // // Cập nhật ngày min max
    // this.updateMinMaxDate();

    // const seatingCapacity = this.reservationForm.get('seatingCapacity')?.value;

    // // Ngày mà khách hàng chọn
    // const selectedDate = this.reservationForm.get('selectedDate')?.value; // yyyy-MM-dd
    // let selectedTimeStr = this.reservationForm.get('selectedTime')?.value;
    // let outTimeStr = this.reservationForm.get('outTime')?.value;

    // // Thời gian tới
    // const selectedDateTimeStr = `${selectedDate} ${selectedTimeStr}`;
    // const selectedTime = new Date(selectedDateTimeStr).getTime();

    // // Thời gian rời đi
    // const outDateTimeStr = `${selectedDate} ${outTimeStr}`;
    // const outDateTime = new Date(outDateTimeStr).getTime();

    // // Kiểm tra nếu thời gian nằm trong khoảng từ 23:00 đến 23:59
    // if (selectedTime >= new Date(`${selectedDate} 23:00:00`).getTime()) {
    //   this.sweetAlertService.showTimedAlert('Cảnh báo!', 'Thời gian này không được đặt', 'warning', 3000);
    //   return;
    // }

    // if (selectedDate === '' || selectedTimeStr === '' || outTimeStr === '') {
    //   this.sweetAlertService.showTimedAlert('Cảnh báo!', 'Mời chọn thời gian', 'warning', 3000);
    //   return;
    // }

    // // Nếu thời gian chọn = minDate hoặc maxDate
    // if (!this.checkDate(selectedDate, this.minDate, this.maxDate)) {

    //   // Add 1 minute to the current time
    //   const oneMinuteLater = new Date(new Date().getTime() + 60 * 1000).getTime(); // Thêm 1 phút
    //   const oneHourLater = new Date(new Date().getTime() + 60 * 60 * 1000).getTime(); // Thêm 1 tiếng

    //   if (selectedTime < oneMinuteLater) {
    //     this.sweetAlertService.showTimedAlert('Cảnh báo!', 'Thời gian đến phải lớn hơn hoặc bằng giờ hiện tại 1 phút', 'warning', 3000);
    //     return;
    //   }

    // }

    // const oneMinuteLater = new Date(new Date(selectedDateTimeStr).getTime() + 2 * 60 * 1000).getTime(); // Thêm 2 phút
    // const oneHourLater = new Date(new Date(selectedDateTimeStr).getTime() + 60 * 60 * 1000).getTime(); // Thêm 1 tiếng
    // //console.log(selectedDateTimeStr, outDateTimeStr);

    // if (outDateTime < oneHourLater) {
    //   this.sweetAlertService.showTimedAlert('Cảnh báo!', 'Thời gian rời đi phải lớn hơn hoặc bằng thời gian đến 1 giờ', 'warning', 3000);
    //   return;
    // }

    // if (this.reservationService.isReservationsInTimeRangeByTableId(0, selectedDateTimeStr, outDateTimeStr)) {
    //   this.sweetAlertService.showTimedAlert('Cảnh báo!', 'Khoảng thời gian này đã được sử dụng', 'warning', 3000);
    //   return;
    // }

    // // Tổng hợp ngày giờ lại
    // const dateTimeString = (selectedDate ? this.datePipe.transform(selectedDate, 'yyyy-MM-dd')! : '') + (selectedTimeStr ? ' ' + selectedTimeStr + ':00' : '');
    // const outDateTimeString = (selectedDate ? this.datePipe.transform(selectedDate, 'yyyy-MM-dd')! : '') + (outTimeStr ? ' ' + outTimeStr + ':00' : '');

    // const newReservation: Reservation = {
    //   restaurantTableId: this.reservationForm.get('restaurantTableId')?.value,
    //   userId: this.user?.userId!,
    //   reservationDate: dateTimeString,
    //   outTime: outDateTimeString,
    //   numberOfGuests: seatingCapacity,
    //   reservationStatusName: 'Đang đợi',
    // };

    // let reservationsCache: Reservation[] = [];

    // this.reservationService.add(newReservation).subscribe(
    //   {
    //     next: (addedReservation) => {
    //       this.sweetAlertService.showTimedAlert('Chức mừng!', 'Bạn đã dặt bàn thành công', 'success', 3000);
    //       reservationsCache.push(addedReservation);
    //       localStorage.setItem('reservations', JSON.stringify(reservationsCache));
    //     },
    //     error: (error) => {
    //       console.error('Error adding reservation:', error);
    //     },
    //     complete: () => {
    //       // Xử lý khi Observable hoàn thành (nếu cần)
    //     }
    //   }
    // );
  }

  sort(field: keyof Reservation, ascending: boolean): void {
    this.reservationService
      .sortEntities(this.reservations, field, ascending)
      .subscribe(
        (data) => {
          this.reservations = data;
        },
        (error) => {
          // Handle error if necessary
        }
      );
  }

  search() {
    if (this.keywords.trim() === '') {
      this.isSearching = false;
      this.getReservations();
    } else {
      this.reservationService.searchByKeywords(this.keywords, this.fieldName).subscribe(
        (data) => {
          this.isSearching = true;
          this.reservations = data;
        }
      );
    }
  }

  fieldName!: keyof Reservation;
  changeFieldName(event: any) {
    this.fieldName = event.target.value;
    this.search();
  }

  keywords = '';
  changeSearchKeyWords(event: any) {
    this.keywords = event.target.value;
    this.search();
  }

  // getreservationById(): void {
  //   const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
  //   this.reservationService.getReservationById(id).subscribe(reservation => {
  //     this.reservation = reservation;
  //     if (reservation) {
  //       this.reservationForm.get('name')?.setValue(reservation.name);
  //     }
  //   });
  // }

  // openreservationDetailModal(reservation: Reservation) {
  //   const modalRef = this.modalService.open(AdminreservationDetailComponent, { size: 'lg' });
  //   modalRef.componentInstance.reservation = reservation;

  //   // Subscribe to the emitted event
  //   modalRef.componentInstance.reservationSaved.subscribe(() => {
  //     this.getCategories(); // Refresh data in the parent component
  //   });

  // }

}
