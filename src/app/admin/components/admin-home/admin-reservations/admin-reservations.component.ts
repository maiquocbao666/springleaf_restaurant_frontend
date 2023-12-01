import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription, filter, map, of, tap } from 'rxjs';
import { Reservation } from 'src/app/interfaces/reservation';
import { RxStompService2 } from 'src/app/rx-stomp.service2';
import { ApiService } from 'src/app/services/api.service';
import { DateTimeService } from 'src/app/services/date-time.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { ToastService } from 'src/app/services/toast.service';
import { Message } from '@stomp/stompjs';
import { DatePipe } from '@angular/common';
import { addHours, differenceInMilliseconds, format } from 'date-fns';
// import { utcToZonedTime, format as formatTz } from 'date-fns-tz';

@Component({
  selector: 'app-admin-reservations',
  templateUrl: './admin-reservations.component.html',
  styleUrls: ['./admin-reservations.component.css']
})
export class AdminReservationsComponent {

  private receivedMessages: string[] = [];
  private topicSubscription: Subscription | undefined;
  private channel = 'public';

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
    private apiService: ApiService,
    private rxStompService: RxStompService2,
    private sweetAlertService: ToastService,
    private datePipe: DatePipe,
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

  hoursUse(reservation: Reservation): string {

    // 1000ms = 1s
    if(reservation.reservationStatusName === "Đã sử dụng xong"){
      return "Hết cứu";
    }

    const currentTime = new Date();
    const reservationTime = new Date(new Date(reservation.reservationDate).getTime() + 2 * 60 * 60 * 1000);

    const diff = reservationTime.getTime() - currentTime.getTime();

    const hours = Math.floor(diff / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((diff % (60 * 1000)) / 1000);

    if (diff >= 0) {
      return hours + ':' + minutes + ':' + seconds;
    }

    return "Hết cứu";
  }

  getReservations(): void {
    this.reservationService.getCache().subscribe(
      (cached: any[]) => {
        this.reservations = cached;
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
