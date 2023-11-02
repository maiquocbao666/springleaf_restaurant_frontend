import { Component, Input, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Supplier } from 'src/app/interfaces/supplier';
import { SupplierService } from 'src/app/services/supplier.service';

@Component({
  selector: 'app-admin-supplier-detail',
  templateUrl: './admin-supplier-detail.component.html',
  styleUrls: ['./admin-supplier-detail.component.css']
})
export class AdminSupplierDetailComponent {
  @Input() supplier: Supplier | undefined;
  suppliers: Supplier[] = [];
  fieldNames: string[] = [];
  supplierForm: FormGroup;

  constructor(
    private supplierService: SupplierService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private zone: NgZone) {
    this.supplierForm = this.formBuilder.group({
      supplierId: ['', [Validators.required]],
      name: ['', [Validators.required]],
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
        name: this.supplier.name,
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
        supplierId: this.supplierForm.get('supplierId')?.value,
        name: this.supplierForm.get('name')?.value,
        phone: this.supplierForm.get('phone')?.value,
        email: this.supplierForm.get('email')?.value,
        address: this.supplierForm.get('address')?.value
      };

      this.supplierService.updateSupplier(updatedSupplier).subscribe(() => {
        // Cập nhật cache
        this.supplierService.updateSupplierCache(updatedSupplier);
      });
    }
  }
}
