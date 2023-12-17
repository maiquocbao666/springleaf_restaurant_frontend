import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MergeTable } from 'src/app/interfaces/merge-table';
import { Reservation } from 'src/app/interfaces/reservation';
import { MergeTableService } from 'src/app/services/merge-table.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { RestaurantTableService } from 'src/app/services/restaurant-table.service';
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

  selectTableIdMessage: string = '';
  mergeTableIdMessage: string = '';

  // // Mã gộp bàn dùng để hiển thị bên select
  mergeTableIds: string[] = [];
  isResetDisabled: boolean = false;

  constructor(
    private reservationService: ReservationService,
    private formBuilder: FormBuilder,
    private mergeTableService: MergeTableService,
    private datePipe: DatePipe,
    private sweetAlertService: ToastService,
    private restaurantTableService: RestaurantTableService,
    //public activeModal: NgbActiveModal
  ) {
    this.reservationForm = this.formBuilder.group({
      tableIdMerge1: [, [Validators.nullValidator]],
      tableIdMerge2: [, [Validators.nullValidator]],
      mergeTableId: [, Validators.nullValidator],
    });
  }

  ngOnInit(): void {
    this.getReservationInUse();
    this.getMergeTables();
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
    this.reservationForm.get('mergeTableId')?.setValue('');
  }

  onMergeTableIdChange(event: any) {
    const selectedMergeTableId = event.target.value;
    this.mergeTableId = selectedMergeTableId;
  }

  onTableIdChange(event: any) {
    const tableId1 = this.reservationForm.get("tableIdMerge1")?.value;
    const tableId2 = this.reservationForm.get("tableIdMerge2")?.value;
  
    // Check if either tableId1 or tableId2 has a mergeTableId
    const mergeTableId1 = this.mergeTableService.getMergeTableWithTableIdExistsInCache(+tableId1);
    const mergeTableId2 = this.mergeTableService.getMergeTableWithTableIdExistsInCache(+tableId2);
  
    if (mergeTableId1 !== '' || mergeTableId2 !== '') {
      this.isResetDisabled = true;
      this.mergeTableId = mergeTableId1 !== '' ? mergeTableId1 : mergeTableId2;
    } else {
      this.isResetDisabled = false;
      console.log("No mergeTableId found");
    }
  }

  onStatusChange(mergeTableId: string, event: any) {
    this.changeMergeStatus(mergeTableId, event.target.value);
    this.getReservationInUse();
    this.getMergeTableId();
  }

  getMergeTables() {
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
      (cached) => {
        if (cached.length === 0) {
          return;
        }

        this.reservationsInUse = cached;

        if (this.reservationsInUse[0]) {
          this.reservationForm.get('tableId')?.setValue(this.reservationsInUse[0].restaurantTableId);
          const mergeTableId = this.mergeTableService.getMergeTableWithTableIdExistsInCache(+this.reservationsInUse[0].restaurantTableId);
          if (mergeTableId !== '') {
            this.isResetDisabled = true;
            this.mergeTableId = mergeTableId;
          } else {
            this.isResetDisabled = false;
            console.log(mergeTableId);
          }
        } else {
          console.log('Không có phần tử trong mảng');
        }
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    );
  }

  getReservationIdByTableIdInUse(tableId: number): number {
    const foundReservation = this.reservationsInUse.find(reservation => reservation.restaurantTableId === tableId);
    return foundReservation!.reservationId!;
  }

  checkNullTableIdMerge(tableIdMerge1: number, tableIdMerge2: number): boolean {
    if (!tableIdMerge1 || !tableIdMerge2) {
      this.selectTableIdMessage = 'Mời chọn bàn muốn gộp';
      return true;
    }
    if (tableIdMerge1 === tableIdMerge2) {
      this.selectTableIdMessage = 'Bàn giống nhau không thể gộp';
      return true;
    }
    this.selectTableIdMessage = '';
    return false;
  }

  checkTableIdExistInMergeCache(tableIdMerge1: number, tableIdMerge2: number): number {
    const check1 = this.mergeTableService.tableExistsInCache(+tableIdMerge1, this.mergeTableId);
    const check2 = this.mergeTableService.tableExistsInCache(+tableIdMerge2, this.mergeTableId);

    // alert("check1: " + check1);
    // alert("check2: " + check2);

    //const checkBoth = check1 && check2;

    //Mã 1 đã gộp và mã 2 chưa gộp hoặc chờ xác nhận
    const checkYesAndNo = check1 && !check2;

    //Mã 1 chưa gộp và mã 2 đã gộp hoặc chờ xác nhận
    const checkNoAndYes = !check1 && check2;

    //Mã 1 đã gộp và mã 2 đã gộp hoặc chờ xác nhận
    const checkYesAndYes = check1 && check2;

    // Trường hợp 1 trong 2 đã gộp và 1 trong 2 chưa gộp
    if (checkYesAndNo) {
      return 1;
    }
    if (checkNoAndYes) {
      return 2;
    }
    if (checkYesAndYes) {
      this.selectTableIdMessage = 'Cả 2 bàn đều đang gộp hoặc đăng chờ xác nhận';
      return 3;
    }
    return 0;
  }

  addTableIdToMergeCache(tableId: number): void {
    if(!this.mergeTableId){
      this.mergeTableIdMessage = "Mời tạo mã gộp";
      return;
    } else{
      this.mergeTableIdMessage = "";
    }
    const mergeTable: MergeTable = {
      tableId: tableId!,
      mergeTableId: this.mergeTableId,  // Sử dụng uuid để tạo mã định danh duy nhất
      mergeTime: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss')!,
      status: 'Chờ xác nhận',
      reservationId: this.getReservationIdByTableIdInUse(+tableId!),
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

  addToMergeCache(tableId1: number | null, tableId2: number | null) {

    let tableId: number;

    if (tableId1) {
      tableId = tableId1;
      this.addTableIdToMergeCache(tableId);
    }
    if (tableId2) {
      tableId = tableId2;
      this.addTableIdToMergeCache(tableId);
    }
  }

  mergeTables() {

    const tableId1 = this.reservationForm.get("tableIdMerge1")?.value;
    const tableId2 = this.reservationForm.get("tableIdMerge2")?.value;

    const check1 = this.checkNullTableIdMerge(tableId1, tableId2);
    if (check1) {
      return;
    }

    const check2 = this.checkTableIdExistInMergeCache(tableId1, tableId2);
    if (check2 === 3) {
      // alert("beuh");
      return;
    }
    if (check2 === 1) {
      this.addToMergeCache(tableId1, null);
    }
    if (check2 === 2) {
      this.addToMergeCache(null, tableId2);
    }
    if (check2 === 0) {
      this.createMergeTableId();
      this.addToMergeCache(tableId1, tableId2);
    }

    return;

  }

  delete(id: number) {
    this.mergeTableService.delete(id).subscribe();
  }

  search() {
    if (this.keywords.trim() === '') {
      this.getMergeTables();
    } else {
      this.mergeTableService.searchByKeywords(this.keywords, this.fieldName).subscribe(
        (data) => {
          this.mergeTablesCache = data;
        }
      );
    }
  }

  fieldName!: keyof MergeTable;
  changeFieldName(event: any) {
    this.fieldName = event.target.value;
    this.search();
  }

  keywords = '';
  changeSearchKeyWords(event: any) {
    this.keywords = event.target.value;
    this.search();
  }

  findTableNameByTableId(tableId: number): string{
    return this.restaurantTableService.findTableNameByTableId(tableId);
  }

}
