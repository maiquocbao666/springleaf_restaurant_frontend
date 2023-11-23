import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReservationStatus } from 'src/app/interfaces/reservation-status';
import { ReservationStatusSerivce } from 'src/app/services/reservation-status.service';
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

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  isCustomChecked = false;

  constructor(
    private reservationStatusService: ReservationStatusSerivce,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private sweetAlertService: ToastService,
    private reservationService: ReservationService,
  ) {
    this.reservationStatusForm = this.formBuilder.group({
      reservationStatusId: ['', [Validators.required]],
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
    this.getReservationStatuses();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getReservationStatuses();
  }

  getReservationStatuses(): void {
    this.reservationStatusService.getReservationStatuses()
      .subscribe(reservationStatuses => this.reservationStatuses = reservationStatuses);
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

    this.reservationStatusService.addReservationStatus(newReservationStatus)
      .subscribe(reservationStatus => {
        this.getReservationStatuses();
        this.reservationStatusForm.reset();
      });

  }

  deleteReservationStatus(reservationStatus: ReservationStatus): void {

    if (reservationStatus.reservationStatusId) {

      if (this.reservationService.isReservationStatusUsed(reservationStatus.reservationStatusId)) {
        console.log("Trạng thái đặt bàn này đang được sử dụng");
        return;
      }

      this.reservationStatuses = this.reservationStatuses.filter(i => i !== reservationStatus);
      this.reservationStatusService.deleteReservationStatus(reservationStatus.reservationStatusId).subscribe();

    } else {
      console.log("Không có reservationStatusId");
    }

  }

  // openReservationStatusDetailModal(ReservationStatus: ReservationStatus) {
  //   const modalRef = this.modalService.open(Admi, { size: 'lg' });
  //   modalRef.componentInstance.ReservationStatus = ReservationStatus;
  // }

}
