import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MergeTable } from 'src/app/interfaces/merge-table';
import { Reservation } from 'src/app/interfaces/reservation';
import { MergeTableService } from 'src/app/services/merge-table.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { ToastService } from 'src/app/services/toast.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-admin-merge-tables',
  templateUrl: './admin-merge-tables.component.html',
  styleUrls: ['./admin-merge-tables.component.css']
})
export class AdminMergeTablesComponent {

  // @Input() reservationOfUser!: Reservation[];
  reservationsInUse: Reservation[] = [];
  // tablesToMerge: MergeTable[] = [];
  mergeTableId!: string;
  reservationForm: FormGroup;
  mergeTablesCache: MergeTable[] = [];

  mergeTableColors: { [mergeTableId: string]: string } = {};

  // // Mã gộp bàn dùng để hiển thị bên select
  mergeTableIds: string[] = [];
  isResetDisabled: boolean = false;

  constructor(
    private reservationService: ReservationService,
    private formBuilder: FormBuilder,
    private mergeTableService: MergeTableService,
    private datePipe: DatePipe,
    private sweetAlertService: ToastService,
    //public activeModal: NgbActiveModal
  ) {
    this.reservationForm = this.formBuilder.group({
      tableId: [, [Validators.nullValidator]],
      mergeTableId: [, Validators.nullValidator],
    });
  }

  ngOnInit(): void {
    this.getReservationInUse();
    this.getMergeTable();
    this.getMergeTableId();
  }

  getMergeTableId() {
    this.mergeTableIds = this.mergeTableService.getUniqueMergeTableIds();
  }

  createMergeTableId() {
    if (!this.mergeTableId) {
      this.mergeTableId = uuidv4();
    }
  }

  resetMergeTableId() {
    this.mergeTableId = '';
  }

  onMergeTableIdChange(event: any) {
    const selectedMergeTableId = event.target.value;
    this.mergeTableId = selectedMergeTableId;
  }

  onTableIdChange(event: any) {
    const tableId = this.reservationForm.get("tableId")?.value;
    const mergeTableId = this.mergeTableService.getMergeTableWithTableIdExistsInCache(+tableId);
    if (mergeTableId != '') {
      this.isResetDisabled = true;
      this.mergeTableId = mergeTableId;
    } else {
      this.isResetDisabled = false;
      console.log(mergeTableId);
    }
  }

  onStatusChange(mergeTableId: string, event: any) {
    this.changeMergeStatus(mergeTableId, event.target.value);
    this.getReservationInUse();
    this.getMergeTableId();
  }

  getMergeTable() {
    this.mergeTableService.getCache().subscribe(
      cached => {
        this.mergeTablesCache = cached;

        // Generate and store colors based on mergeTableId
        this.mergeTablesCache.forEach(mergeTable => {
          if (!this.mergeTableColors[mergeTable.mergeTableId]) {
            this.mergeTableColors[mergeTable.mergeTableId] = this.generateRandomColor();
          }
        });

        // Sort the mergeTablesCache array based on status
        this.mergeTablesCache.sort((a, b) => {
          const statusA = a.status;
          const statusB = b.status;

          // Move "Chờ xác nhận" to the top
          if (statusA === 'Chờ xác nhận') return -1;
          if (statusB === 'Chờ xác nhận') return 1;

          // Move "Đã tách" to the bottom
          if (statusA === 'Đã tách') return 1;
          if (statusB === 'Đã tách') return -1;

          // Compare other statuses for sorting
          return statusA.localeCompare(statusB);
        });
      }
    );
  }

  generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  changeMergeStatus(mergeTableId: string, status: string): void {
    this.mergeTableService.updateStatusTablesByMergeTableId(mergeTableId, status);
    
  }

  changeMergeStatusOne(id: number, newStatus: string): void {
    // Find the mergeTable by ID in the cache or wherever you store your mergeTables
    const mergeTableToUpdate = this.mergeTablesCache.find(mt => mt.id === id);

    if (mergeTableToUpdate) {
      // Update the status
      mergeTableToUpdate.status = newStatus;

      // Call the service to update the mergeTable
      this.mergeTableService.update(mergeTableToUpdate).subscribe(
        updatedMergeTable => {
          if (newStatus === 'Đã gộp') {
            this.mergeTableService.deleteMergeTableByTableId(updatedMergeTable.id!, updatedMergeTable.tableId)
          }
        },
        error => {
          // Handle error if the update fails
          console.error('Error updating status:', error);
        }
      );
    } else {
      console.warn(`MergeTable with ID ${id} not found.`);
    }
    this.getReservationInUse();
    this.getMergeTableId();
  }

  getReservationInUse() {
    this.reservationService.getAllReservationsInUse().subscribe(
      cached => {
        this.reservationsInUse = cached;
        this.reservationForm.get("tableId")?.setValue(this.reservationsInUse[0].restaurantTableId);
        const mergeTableId = this.mergeTableService.getMergeTableWithTableIdExistsInCache(+this.reservationsInUse[0].restaurantTableId);
        if (mergeTableId != '') {
          this.isResetDisabled = true;
          this.mergeTableId = mergeTableId;
        } else {
          this.isResetDisabled = false;
          console.log(mergeTableId);
        }
      }
    )
  }

  getReservationIdByTableIdInUse(tableId: number): number {
    const foundReservation = this.reservationsInUse.find(reservation => reservation.restaurantTableId === tableId);
    console.log(foundReservation!.reservationId!);
    return foundReservation!.reservationId!;
  }

  mergeTables() {
    if (!this.mergeTableId) {
      this.sweetAlertService.showTimedAlert('Không thể gộp!', 'Mời chọn hoặc tạo id gộp bàn', 'error', 3000);
      return;
    }

    const tableId = this.reservationForm.get("tableId")?.value;

    // Kiểm tra trùng lặp trong cache
    if (this.mergeTableService.tableExistsInCache(+tableId, this.mergeTableId)) {
      this.sweetAlertService.showTimedAlert('Không thể gộp!', 'Bàn đang chờ xác nhận hoặc Đang gộp', 'error', 3000);
      return;
    }

    // Bàn chưa tồn tại trong cache và danh sách, thêm mới thông tin
    const mergeTable: MergeTable = {
      tableId: tableId,
      mergeTableId: this.mergeTableId,  // Sử dụng uuid để tạo mã định danh duy nhất
      mergeTime: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss')!,
      status: 'Chờ xác nhận',
      reservationId: this.getReservationIdByTableIdInUse(+tableId),
    };

    this.mergeTableService.add(mergeTable).subscribe(() => {
      const mergeTableId = this.mergeTableService.getMergeTableWithTableIdExistsInCache(+tableId);
      if (mergeTableId != '') {
        this.isResetDisabled = true;
        this.mergeTableId = mergeTableId;
      } else {
        this.isResetDisabled = false;
        console.log(mergeTableId);
      }
    });
  }

  delete(id: number) {
    this.mergeTableService.delete(id).subscribe();
  }


}
