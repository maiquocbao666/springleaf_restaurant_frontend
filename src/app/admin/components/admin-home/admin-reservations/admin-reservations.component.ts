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

  selectedTimeMessage = '';
  selectedDateMessage = '';

  reservationsUrl = 'reservations';

  minDate!: string;
  maxDate!: string;
  isSearch = false;
  user: User | null = null;

  outTime = '';
  warningMessage = '';
  warningMessage2 = '';

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
      //outTime: ['', [Validators.required]],
      searchKeyWord: ['', Validators.nullValidator],
      seatingCapacity: [1, Validators.nullValidator],
      restaurantTableId: [, Validators.nullValidator],
      username: [''],
      userPhone: [''],
    });
  }

  ngOnInit(): void {
    console.log("Init admin reservation component");
    this.minDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    this.maxDate = this.datePipe.transform(this.addDays(new Date(), 5), 'yyyy-MM-dd')!;
    this.getReservations();
    this.getRestaurantTables();
    this.checkAll();
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
        if (!this.isSearching) {
          // Sắp xếp danh sách theo trạng thái (Đang đợi lên trên cùng)
          const statusOrder: { [key: string]: number } = {
            'Đang đợi': 0,
            'Chưa tới': 1,
            'Hết thời gian dùng': 2,
            'Đang sử dụng': 3,
            'Hết thời gian đợi': 4,
            'Đã sử dụng xong': 5,
          };

          // Sắp xếp theo giờ giảm dần
          this.reservations = cached.filter(reservation => this.restaurantTableService.getRestaurantIdByTableId(reservation.restaurantTableId) === this.user?.restaurantBranchId
          );
          this.reservations.sort((a, b) => {
            const timeA = new Date(a.reservationDate).getTime();
            const timeB = new Date(b.reservationDate).getTime();
            return timeB - timeA;
          });

          // Sắp xếp theo trạng thái giảm dần (Đang sử dụng sau Đang đợi)
          this.reservations.sort((a, b) => {
            if (statusOrder[a.reservationStatusName] === statusOrder[b.reservationStatusName]) {
              // Đặt bản ghi đang sử dụng lên sau bản ghi đang đợi
              if (a.reservationStatusName === 'Đang sử dụng' && b.reservationStatusName === 'Đang đợi') {
                return 1;
              }
              // Giữ nguyên thứ tự với các bản ghi khác
              return 0;
            }
            // Sắp xếp theo trạng thái
            return statusOrder[a.reservationStatusName] - statusOrder[b.reservationStatusName];
          });
        }
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
    if (!selectedTime || selectedTime === ':00') {
      this.selectedTimeMessage = "Mời chọn thời gian đến";
      return false;
    } else {
      this.selectedTimeMessage = "";
    }
    return true;
  }

  checkIsReservedBefore(fullDateTime: string, selectedDate: string): boolean {
    const restaurantTableId = this.reservationForm.get('restaurantTableId')?.value;
    const check = this.reservationService.isTableReservedBefore(restaurantTableId, fullDateTime, selectedDate);
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
    const restaurantTableId = this.reservationForm.get('restaurantTableId')?.value;
    const check = this.reservationService.isTableReservedAfter(restaurantTableId, fullDateTime, selectedDate);
    if (check.length > 0) {
      this.selectedDateMessage = "Đã có người đặt và tới lúc: " + check[0].reservationDate;
      this.selectedTimeMessage = "Đã có người đặt và tới lúc: " + check[0].reservationDate;
      const outTime = new Date(new Date(check[0].reservationDate).getTime() - 1000 * 60 * 15);

      const fullDateTime1 = new Date(fullDateTime).getTime() + 1000 * 60 * 60 * 3;
      const reservationDateTime = new Date(check[0].reservationDate).getTime();

      this.warningMessage = "Nếu đến vào thời gian này thì chỉ sử dụng được tới " + this.datePipe.transform(outTime, 'yyyy-MM-dd HH:mm:ss');
      if (fullDateTime1 > reservationDateTime) {
        this.warningMessage2 = "Thời gian đến phải <= thời gian đến của người khác đặt 3 tiếng";
        return false;
      } else {
        this.warningMessage2 = '';
        this.outTime = this.datePipe.transform(outTime, 'yyyy-MM-dd HH:mm:ss') || '';
        return true;
      }
    } else {
      this.selectedDateMessage = "";
      this.selectedTimeMessage = "";
      this.warningMessage = '';
      this.warningMessage2 = '';
    }
    this.outTime = '';
    this.warningMessage = '';
    this.warningMessage2 = '';
    return true;
  }

  addToReservation(seatingCapacity: number, fullDateTime: string, outTime?: string) {
    const restaurantTableId = this.reservationForm.get('restaurantTableId')?.value;
    const newReservation: Reservation = {
      restaurantTableId: restaurantTableId,
      userId: this.user?.userId!,
      reservationDate: fullDateTime,
      //outTime: outDateTimeString,
      outTime: outTime || '',
      numberOfGuests: seatingCapacity,
      reservationStatusName: 'Chưa tới',
      reservationOrderStatus: false,
      username: this.reservationForm.get('username')?.value,
      userPhone: this.reservationForm.get('userPhone')?.value,
      reservationDeposit: 0 // Thay thế bằng phí cọc
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
      isBefore2Hours1 = (fullDateTime + 1000 * 60 * 60 * 2 > allowTime1 + 1000 * 60 * 60 * 1) && (currentDateTime <= fullDateTime);
      isBefore2Hours2 = (fullDateTime + 1000 * 60 * 60 * 2 < allowTime2) && (currentDateTime <= fullDateTime);
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
        this.selectedTimeMessage = "Phải đặt trước thời gian đóng cửa 2 tiếng hoặc sau thời gian hiện tại";
        return false;
      }
    } else {
      this.selectedTimeMessage = "Thời gian đến phải lớn hơn thời gian hiện tại hoặc trong thời gian được phép đặt";
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
    if (!checkAfter) {
      return false;
    }

    //alert("Thêm được");

    return true;

  }

  addReservation() {

    // Cập nhật ngày min max
    this.updateMinMaxDate();

    const seatingCapacity = this.reservationForm.get('seatingCapacity')?.value;

    // Ngày mà khách hàng chọn
    const selectedDate = this.reservationForm.get('selectedDate')?.value; // yyyy-MM-dd
    const selectedTimeStr = this.reservationForm.get('selectedTime')?.value + ':00';

    if (!this.checkAll()) {
      return;
    }

    const fullDateTime = selectedDate + ' ' + selectedTimeStr;

    this.addToReservation(seatingCapacity, fullDateTime, this.outTime);

    this.checkAll();

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

  getClassForStatus(status: string): string {
    if (status === 'Chưa tới') {
      return 'badge badge-info'; // or any other color you prefer for this status
    } else if (status === 'Đang đợi') {
      return 'badge badge-warning';
    } else if (status === 'Đang sử dụng') {
      return 'badge badge-success';
    } else if (status === 'Hết thời gian đợi') {
      return 'badge badge-danger';
    } else if (status === 'Đã sử dụng xong') {
      return 'badge badge-secondary'; // or any other color you prefer for this status
    } else if (status === 'Hết thời gian dùng') {
      return 'badge badge-primary'; // or any other color you prefer for this status
    }
    return ''; // Default class or no class if status is not recognized
  }

  changeStatusOne(id: number, newStatus: string): void {
    // Find the mergeTable by ID in the cache or wherever you store your mergeTables
    const reservationToUpdate = this.reservations.find(mt => mt.reservationId === id);

    if (reservationToUpdate) {
      // Update the status
      reservationToUpdate.reservationStatusName = newStatus;
      this.reservationService.update(reservationToUpdate).subscribe();
    } else {
      //console.warn(`MergeTable with ID ${id} not found.`);
    }

  }

  findTableNameByTableId(id: number): string {
    return this.restaurantTableService.findTableNameByTableId(id);
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
