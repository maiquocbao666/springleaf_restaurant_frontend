import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Supplier } from 'src/app/interfaces/supplier';
import { SupplierService } from 'src/app/services/supplier.service';

@Component({
  selector: 'app-admin-supplier-detail',
  templateUrl: './admin-supplier-detail.component.html',
  styleUrls: ['./admin-supplier-detail.component.css']
})
export class AdminSupplierDetailComponent  implements OnInit {
  @Input() supplier: Supplier | undefined;
  @Output() supplierSaved: EventEmitter<void> = new EventEmitter<void>();
  suppliers: Supplier[] = [];
  fieldNames: string[] = [];
  supplierForm: FormGroup;

  constructor(
    private supplierService: SupplierService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private zone: NgZone) {
    window.addEventListener('storage', (event) => {
      if (event.key && event.oldValue !== null) {
        localStorage.setItem(event.key, event.oldValue);
      }
    });
    this.supplierForm = this.formBuilder.group({
      supplierId: ['', [Validators.required]],
      supplierName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.setValue();
  }

  setValue() {
    if (this.supplier) {
      this.supplierForm.patchValue({
        supplierId: this.supplier.supplierId,
        supplierName: this.supplier.supplierName,
        phone: this.supplier.phone,
        email: this.supplier.email,
        address: this.supplier.address,
      });
    }
  }

  updateSupplier(): void {
    this.activeModal.close('Close after saving');
    if (this.supplierForm.valid) {
      const updatedSupplier: Supplier = {
        supplierId: +this.supplierForm.get('supplierId')?.value,
        supplierName: this.supplierForm.get('supplierName')?.value,
        phone: this.supplierForm.get('phone')?.value,
        email: this.supplierForm.get('email')?.value,
        address: this.supplierForm.get('address')?.value
      };

      this.supplierService.update(updatedSupplier).subscribe(() => {
      });
    }
  }
}
