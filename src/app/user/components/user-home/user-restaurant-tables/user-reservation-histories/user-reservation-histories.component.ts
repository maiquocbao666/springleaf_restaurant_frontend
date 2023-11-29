import { Component, Input } from '@angular/core';
import { Reservation } from 'src/app/interfaces/reservation';
import { ReservationService } from 'src/app/services/reservation.service';

@Component({
  selector: 'app-user-reservation-histories',
  templateUrl: './user-reservation-histories.component.html',
  styleUrls: ['./user-reservation-histories.component.css']
})
export class UserReservationHistoriesComponent {

  @Input() userId!: number;
  thisUserReservations!: Reservation[];

  constructor(
    private reservationService: ReservationService,
  ){

  }

  ngOnInit(): void {
    this.reservationService.getReservationsByUserId(this.userId).subscribe(
      cached => {
        this.thisUserReservations = cached;
      }
    )
  }

}
