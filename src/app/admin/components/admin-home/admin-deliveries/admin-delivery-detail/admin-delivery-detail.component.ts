import { Component, Input, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Delivery } from 'src/app/interfaces/delivery';
import { InventoryBranch } from 'src/app/interfaces/inventory-branch';
import { DeliveryService } from 'src/app/services/delivery.service';
import { InventoryBranchService } from 'src/app/services/inventory-branch.service';

@Component({
  selector: 'app-admin-delivery-detail',
  templateUrl: './admin-delivery-detail.component.html',
  styleUrls: ['./admin-delivery-detail.component.css']
})
export class AdminDeliveryDetailComponent {
  @Input() delivery: Delivery | undefined;
  deliveries: Delivery[] = [];
  inventoryBranches: InventoryBranch[] = [];
  fieldNames: string[] = [];
  deliveryForm: FormGroup;

  constructor(
    private inventoryBranchService: InventoryBranchService,
    private deliveryService: DeliveryService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private zone: NgZone
  ) {
    window.addEventListener('storage', (event) => {
      if (event.key && event.oldValue !== null) {
        localStorage.setItem(event.key, event.oldValue);
      }
    });
    this.deliveryForm = this.formBuilder.group({
      deliveryId: ['', [Validators.required]],
      inventoryBranch: ['', [Validators.required]],
      date: ['', [Validators.required]],
      warehouseManager: ['', [Validators.required]],
      user: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.setValue();
    this.getInventoryBranches();
  }


  getInventoryBranches(): void {
    this.inventoryBranchService.getInventoryBranches()
      .subscribe(inventoryBranches => this.inventoryBranches = inventoryBranches);
  }

  setValue() {
    if (this.delivery) {
      this.deliveryForm.patchValue({
        deliveryId: this.delivery.deliveryId,
        inventoryBranch: this.delivery.inventoryBranch,
        date: this.delivery.date,
        warehouseManager: this.delivery.warehouseManager,
        user: this.delivery.user,
      });
    }
  }

  updateDelivery(): void {
    this.activeModal.close('Close after saving');
    if (this.deliveryForm.valid) {
      const updatedDelivery: Delivery = {
        deliveryId: this.deliveryForm.get('deliveryId')?.value,
        inventoryBranch: this.deliveryForm.get('inventoryBranch')?.value,
        date: this.deliveryForm.get('date')?.value,
        warehouseManager: this.deliveryForm.get('warehouseManager')?.value,
        user: this.deliveryForm.get('user')?.value,
      };

      this.deliveryService.updateDelivery(updatedDelivery).subscribe(() => {
        // Cập nhật cache
        this.deliveryService.updateDeliveryCache(updatedDelivery);
      });
    }
  }
}
