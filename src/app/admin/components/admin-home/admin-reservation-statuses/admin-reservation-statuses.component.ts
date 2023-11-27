import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReservationStatus } from 'src/app/interfaces/reservation-status';
import { ReservationStatusService } from 'src/app/services/reservation-status.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-admin-reservation-statuses',
  templateUrl: './admin-reservation-statuses.component.html',
  styleUrls: ['./admin-reservation-statuses.component.css']
})
export class AdminReservationStatusesComponent {

  reservationStatuses: ReservationStatus[] = [];
  reservationStatusForm: FormGroup;
  ReservationStatus: ReservationStatus | undefined;
  fieldNames: string[] = [];

  reservationStatusesUrl = 'reservationStatuses';

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  isCustomChecked = false;

  constructor(
    private reservationStatusService: ReservationStatusService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private sweetAlertService: ToastService,
    private reservationService: ReservationService,
  ) {
    this.reservationStatusForm = this.formBuilder.group({
      reservationStatusName: new FormControl({ value: 'Chọn trạng thái đặt bàn', disabled: false }),
      name: new FormControl({ value: '', disabled: true }),
    });
  }

  ngOnInit(): void {
    this.getReservationStatuses();
  }

  // Handle the checkbox change event
  onCheckboxChange(event: any) {

    this.isCustomChecked = event.checked;

    const nameControl = this.reservationStatusForm.get('name');
    const statusNameControl = this.reservationStatusForm.get('reservationStatusName');
    if (nameControl) {
      if (this.isCustomChecked) {
        nameControl.enable();
        statusNameControl?.disable();
      } else {
        nameControl.disable();
        statusNameControl?.enable();
      }
    }
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  getReservationStatuses(): void {
    this.reservationStatusService.gets();
    this.reservationStatusService.cache$
      .subscribe(reservationStatuses => {
        this.reservationStatusService.gets();
        this.reservationStatuses = JSON.parse(localStorage.getItem(this.reservationStatusesUrl) || 'null')
      });
  }

  addReservationStatus(): void {

    let name = '';

    if (this.isCustomChecked) {
      name = this.reservationStatusForm.get('name')?.value?.trim() ?? '';
      if (name === '') {
        this.sweetAlertService.showAlert('Mời nhập trạng thái đặt bàn', 'Bạn chưa nhập trạng thái', 'info')
        return
      }
    } else {
      name = this.reservationStatusForm.get('reservationStatusName')?.value?.trim() ?? '';
      if (name === 'Chọn trạng thái đặt bàn') {
        this.sweetAlertService.showAlert('Mời chọn trạng thái đặt bàn', 'Bạn chưa chọn trạng thái', 'info')
        return
      }
    }

    const newReservationStatus: ReservationStatus = {
      reservationStatusName: name,
    }

    this.reservationStatusService.add(newReservationStatus)
      .subscribe(reservationStatus => {
        this.reservationStatusForm.reset();
      });

  }

  deleteReservationStatus(reservationStatus: ReservationStatus): void {

    if (reservationStatus.reservationStatusName) {

      this.reservationStatusService.delete(reservationStatus.reservationStatusName).subscribe();

    } else {
      console.log("Không có reservationStatusId");
    }

  }

  // openReservationStatusDetailModal(ReservationStatus: ReservationStatus) {
  //   const modalRef = this.modalService.open(Admi, { size: 'lg' });
  //   modalRef.componentInstance.ReservationStatus = ReservationStatus;
  // }

}
