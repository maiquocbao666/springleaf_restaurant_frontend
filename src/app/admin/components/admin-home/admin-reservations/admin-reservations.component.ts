import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Reservation } from 'src/app/interfaces/reservation';
import { DateTimeService } from 'src/app/services/date-time.service';
import { ReservationService } from 'src/app/services/reservation.service';

@Component({
  selector: 'app-admin-reservations',
  templateUrl: './admin-reservations.component.html',
  styleUrls: ['./admin-reservations.component.css']
})
export class AdminReservationsComponent {

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  reservation!: Reservation | null;
  reservations: Reservation[] = [];

  currentDateTime$: string = '';

  reservationsUrl = 'reservations';

  constructor(
    private reservationService: ReservationService,
    private dateTimeService: DateTimeService,
  ) {
    this.dateTimeService.currentDateTimeCache$.subscribe((dateObject: Date) => {
      // Assuming the service emits Date objects
      this.currentDateTime$ = dateObject.toISOString();
    });
  }

  ngOnInit(): void {
    console.log("Init admin reservation component");
    this.getReservations();
  }

  minusDateTime(currentDateTime: string, reservationDate: string): string {
    let currentDateTime1 = new Date(currentDateTime).getTime();
    let reservationDate1 = new Date(reservationDate).getTime();

    let differenceTime = reservationDate1 - currentDateTime1;

    if (currentDateTime1 > reservationDate1) {
      return "Đang chờ";
    }

    // Chuyển đổi thành giờ, phút, giây
    const hours = Math.floor(differenceTime / (1000 * 60 * 60));
    const minutes = Math.floor((differenceTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((differenceTime % (1000 * 60)) / 1000);

    return `${hours}:${minutes}:${seconds}`;
  }

  reservationHoldTime(currentDateTime: string, reservationDate: string) {
    let reservationDate1 = new Date(reservationDate);
    reservationDate1.setMinutes(reservationDate1.getMinutes() + 1);

    let currentDateTime1 = new Date(currentDateTime);

    if (currentDateTime1.getTime() >= reservationDate1.getTime()) {
      return "Hết thời gian chờ";
    }

    let differenceTime = reservationDate1.getTime() - currentDateTime1.getTime();

    // Chuyển đổi thành giờ, phút, giây
    const hours = Math.floor(differenceTime / (1000 * 60 * 60));
    const minutes = Math.floor((differenceTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((differenceTime % (1000 * 60)) / 1000);

    return `${hours}:${minutes}:${seconds}`;
  }

  hoursUse(currentDateTime: string, reservationDate: string) {

    const stautus: string = "Khách hàng đã rời đi";

    let reservationDate1 = new Date(reservationDate);
    reservationDate1.setHours(reservationDate1.getHours() + 0);

    let currentDateTime1 = new Date(currentDateTime);

    let differenceTime = reservationDate1.getTime() - currentDateTime1.getTime();

    // Chuyển đổi thành giờ, phút, giây
    const hours = Math.floor(differenceTime / (1000 * 60 * 60));
    const minutes = Math.floor((differenceTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((differenceTime % (1000 * 60)) / 1000);

    if (stautus === "Khách hàng đã rời đi") {
      return "Đã sử dụng xong";
    }

    if (currentDateTime1.getTime() >= reservationDate1.getTime()) {
      return "Hết giờ sử dụng bàn\n" + `Lố ${currentDateTime1.getHours() - reservationDate1.getHours()}:${currentDateTime1.getMinutes() - reservationDate1.getMinutes()}:${currentDateTime1.getSeconds() - reservationDate1.getSeconds()}`;
    }

    return `${hours}:${minutes}:${seconds}`;
  }

  getReservations(): void {
    this.reservationService.gets();
    this.reservationService.reservationsCache$
      .subscribe(reservations => {
        this.reservationService.gets();
        this.reservations = JSON.parse(localStorage.getItem(this.reservationsUrl) || 'null')
      });
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
