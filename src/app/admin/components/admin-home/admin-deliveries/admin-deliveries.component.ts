import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Delivery } from 'src/app/interfaces/delivery';
import { InventoryBranch } from 'src/app/interfaces/inventory-branch';
import { DeliveryService } from 'src/app/services/delivery.service';
import { InventoryBranchService } from 'src/app/services/inventory-branch.service';
import { AdminDeliveryDetailComponent } from './admin-delivery-detail/admin-delivery-detail.component';

@Component({
  selector: 'app-admin-deliveries',
  templateUrl: './admin-deliveries.component.html',
  styleUrls: ['./admin-deliveries.component.css']
})
export class AdminDeliveriesComponent {
  deliveries: Delivery[] = [];
  deliveryForm: FormGroup;
  delivery: Delivery | undefined;
  inventoryBranches: InventoryBranch[] = [];
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  constructor(
    private deliveryService: DeliveryService,
    private inventoryBranchService: InventoryBranchService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.deliveryForm = this.formBuilder.group({
      deliveryId: ['', [Validators.required]],
      inventoryBrand: ['', [Validators.required]],
      date: ['', [Validators.required]],
      warehouseManager: ['', [Validators.required]],
      user: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getDeliveries();
    this.getInventoryBranches();
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getDeliveries();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getDeliveries();
  }

  getDeliveries(): void {
    this.deliveryService.getDeliveries()
      .subscribe(deliveries => this.deliveries = deliveries);
  }

  getInventoryBranches(): void {
    this.inventoryBranchService.getInventoryBranches()
      .subscribe(inventoryBranches => this.inventoryBranches = inventoryBranches);
  }

  getInventoryBranchById(inventoryBranchId: number): Observable<InventoryBranch> {
    return this.inventoryBranchService.getInventoryBranchById(inventoryBranchId);
  }



  addDelivery(): void {

    const inventoryBrand = this.deliveryForm.get('inventoryBrand')?.value;
    const date = this.deliveryForm.get('date')?.value;
    const warehouseManager = this.deliveryForm.get('warehouseManager')?.value;
    const user = this.deliveryForm.get('user')?.value;

    this.deliveryService.addDelivery({ inventoryBrand, date, warehouseManager, user } as Delivery)
      .subscribe(delivery => {
        this.deliveries.push(delivery);
        this.getDeliveries();
        this.deliveryForm.reset();
      });
  }

  deleteDelivery(delivery: Delivery): void {
    this.deliveries = this.deliveries.filter(d => d !== delivery);
    this.deliveryService.deleteDelivery(delivery.deliveryId).subscribe();
  }

  openDeliveryDetailModal(delivery: Delivery) {
    const modalRef = this.modalService.open(AdminDeliveryDetailComponent, { size: 'lg' });
    modalRef.componentInstance.delivery = delivery;
  }
}
