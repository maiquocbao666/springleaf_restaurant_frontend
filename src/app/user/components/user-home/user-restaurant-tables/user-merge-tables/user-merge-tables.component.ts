import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MergeTable } from 'src/app/interfaces/merge-table';
import { Reservation } from 'src/app/interfaces/reservation';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { MergeTableService } from 'src/app/services/merge-table.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { RestaurantTableService } from 'src/app/services/restaurant-table.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { ToastService } from 'src/app/services/toast.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-user-merge-tables',
  templateUrl: './user-merge-tables.component.html',
  styleUrls: ['./user-merge-tables.component.css']
})
export class UserMergeTablesComponent {

  @Input() reservationOfUser!: Reservation[];
  reservationsInUse: Reservation[] = [];
  tablesToMerge: MergeTable[] = [];
  mergeTableId!: string;
  reservationForm: FormGroup;
  mergeTablesCache: MergeTable[] = [];

  selectTableIdMessage: string = '';
  mergeTableIdMessage: string = '';

  // Mã gộp bàn dùng để hiển thị bên select
  mergeTableIds: string[] = [];
  //isResetDisabled: boolean = false;

  restaurants: Restaurant[] = [];
  restaurantId: number | null = null;

  selecRestaurantMessage = '';

  constructor(
    private reservationService: ReservationService,
    private formBuilder: FormBuilder,
    private mergeTableService: MergeTableService,
    private datePipe: DatePipe,
    private sweetAlertService: ToastService,
    public activeModal: NgbActiveModal,
    public restaurantTableService: RestaurantTableService,
    private restaurantService: RestaurantService,
  ) {
    this.reservationForm = this.formBuilder.group({
      tableIdMerge1: [, [Validators.required]],
      tableIdMerge2: [, [Validators.required]],
      mergeTableId: [, Validators.nullValidator],
      restaurantId: [, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getRestaurants();
    this.getReservationInUse();
    this.getMergeTable();
    this.getMergeTableId();
  }

  getRestaurants() {
    this.restaurantService.getCache().subscribe(
      data => {
        if(data.length > 0){
          this.restaurants = data;
          this.restaurantId = this.restaurants[0].restaurantId || null;
        }
      }
    )
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
    const tableId1 = this.reservationForm.get("tableIdMerge1")?.value;
    const tableId2 = this.reservationForm.get("tableIdMerge2")?.value;

    // Check if either tableId1 or tableId2 has a mergeTableId
    const mergeTableId1 = this.mergeTableService.getMergeTableWithTableIdExistsInCache(+tableId1);
    const mergeTableId2 = this.mergeTableService.getMergeTableWithTableIdExistsInCache(+tableId2);

    if (mergeTableId1 !== '' || mergeTableId2 !== '') {
      //this.isResetDisabled = true;
      this.mergeTableId = mergeTableId1 !== '' ? mergeTableId1 : mergeTableId2;
    } else {
      //this.isResetDisabled = false;
      console.log("No mergeTableId found");
    }
  }

  onRestaurantIdChange(event: any) {
    if (!event.target.value) {
      this.selecRestaurantMessage = 'Mời chọn chi nhánh';
      return;
    } else {
      this.restaurantId = Number(event.target.value); // Ensure it's a number
      this.selecRestaurantMessage = '';
    }
    console.log('Updated restaurantId:', this.restaurantId);
    this.getReservationInUse();
  }

  getMergeTable() {
    this.mergeTableService.getCache().subscribe(
      cached => {
        // Filter items with status 'Chờ xác nhận' or 'Đã gộp'
        this.mergeTablesCache = cached.filter(mergeTable =>
          mergeTable.status === 'Chờ xác nhận' || mergeTable.status === 'Đã gộp'
        );

        // console.log(this.mergeTablesCache);
      }
    );
  }

  getReservationInUse() {
    this.reservationService.getAllReservationsInUse().subscribe(
      cached => {
        this.reservationsInUse = cached.filter(
          data => this.restaurantTableService.getRestaurantIdByTableId(data.restaurantTableId) === this.restaurantId
        );
  
        if (this.reservationsInUse.length > 0) {
          // Assuming your reservationForm is correctly initialized
          this.reservationForm.get("tableId")?.setValue(this.reservationsInUse[0].restaurantTableId);
  
          const mergeTableId = this.mergeTableService.getMergeTableWithTableIdExistsInCache(+this.reservationsInUse[0].restaurantTableId);
  
          if (mergeTableId !== '') {
            this.mergeTableId = mergeTableId;
          } else {
            console.log(mergeTableId);
          }
        }
      }
    );
  }

  getClassForStatus(status: string): string {
    if (status === 'Chờ xác nhận') {
      return 'badge badge-warning';
    } else if (status === 'Đã gộp') {
      return 'badge badge-success';
    } else if (status === 'Từ chối gộp') {
      return 'badge badge-danger';
    }
    return ''; // Hoặc class mặc định khác nếu cần
  }

  getReservationIdByTableIdInUse(tableId: number): number {
    const foundReservation = this.reservationsInUse.find(reservation => reservation.restaurantTableId === tableId);
    // console.log(foundReservation!.reservationId!);
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
    if (!this.mergeTableId) {
      this.mergeTableIdMessage = "Mời tạo mã gộp";
      return;
    } else {
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
        //this.isResetDisabled = true;
        this.mergeTableId = mergeTableId;
      } else {
        //this.isResetDisabled = false;
        //console.log(mergeTableId);
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
      this.addToMergeCache(null, tableId2);
    }
    if (check2 === 2) {
      this.addToMergeCache(tableId1, null);
    }
    if (check2 === 0) {
      this.createMergeTableId();
      this.addToMergeCache(tableId1, tableId2);
    }

    return;

  }

  getTableNameById(id: number): string {
    return this.restaurantTableService.findTableNameByTableId(id);
  }

  getRestaurantNameByTableId(id: number): string | '' {
    let restaurantId = this.restaurantTableService.getRestaurantIdByTableId(id);
    return this.restaurantService.getRestaurantNameById(restaurantId);
  }

}
