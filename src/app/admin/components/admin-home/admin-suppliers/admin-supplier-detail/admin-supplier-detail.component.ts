import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Supplier } from 'src/app/interfaces/supplier';
import { SupplierService } from 'src/app/services/supplier.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-supplier-detail',
  templateUrl: './admin-supplier-detail.component.html',
  styleUrls: ['./admin-supplier-detail.component.css']
})
export class AdminSupplierDetailComponent implements OnInit {
  @Input() supplier: Supplier | undefined;
  @Output() supplierSaved: EventEmitter<void> = new EventEmitter<void>();
  suppliers: Supplier[] = [];
  fieldNames: string[] = [];
  supplierForm: FormGroup;
  isSubmitted = false;


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
      phone: ['', [Validators.required, Validators.pattern('^\\d{10,11}$')]],
      email: ['', [Validators.required, Validators.email]],
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
    this.isSubmitted = true;

    if (this.supplierForm.valid) {
      const updatedSupplier: Supplier = {
        supplierId: +this.supplierForm.get('supplierId')?.value,
        supplierName: this.supplierForm.get('supplierName')?.value,
        phone: this.supplierForm.get('phone')?.value,
        email: this.supplierForm.get('email')?.value,
        address: this.supplierForm.get('address')?.value
      };

      this.supplierService.update(updatedSupplier).subscribe(
        () => {
          Swal.fire('Thành công', 'Cập nhật thành công!', 'success');
          this.activeModal.close('Close after saving');
          this.supplierForm.reset();
        },
        (error) => {
          Swal.fire('Thất bại', 'Cập nhật thất bại!', 'warning');
          console.error('Cập nhật không thành công:', error);
        }
      );
    } else {
      Swal.fire('Thất bại', 'Cập nhật không thành công!', 'warning');
    }
  }

}
