import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Supplier } from 'src/app/interfaces/supplier';
import { SupplierService } from 'src/app/services/supplier.service';
import { AdminSupplierDetailComponent } from './admin-supplier-detail/admin-supplier-detail.component';

@Component({
  selector: 'app-admin-supplier',
  templateUrl: './admin-suppliers.component.html',
  styleUrls: ['./admin-suppliers.component.css']
})
export class AdminSuppliersComponent {
  suppliers: Supplier[] = [];
  supplierForm: FormGroup;
  supplier: Supplier | undefined;
  fieldNames: string[] = [];

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  suppliersUrl = 'suppliers';

  constructor(
    private supplierService: SupplierService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.supplierForm = this.formBuilder.group({
      // supplierId: ['', [Validators.required]],
      supplierName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getSuppliers();
  }

  getSuppliers(): void {
    this.supplierService.getCache().subscribe(
      (cached: any[]) => {
        this.suppliers = cached;
      }
    );
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getSuppliers();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  addSupplier(): void {

    const supplierName = this.supplierForm.get('supplierName')?.value;
    const phone = this.supplierForm.get('phone')?.value;
    const address = this.supplierForm.get('address')?.value;
    const email = this.supplierForm.get('email')?.value;

    const newSupplier: Supplier = {
      supplierName: supplierName,
      address: address,
      phone: phone,
      email: email
    };

    this.supplierService.add(newSupplier)
      .subscribe(supplier => {
        this.supplierForm.reset();
      });
  }

  deleteSupplier(supplier: Supplier): void {

    if (supplier.supplierId) {
      this.supplierService.delete(supplier.supplierId).subscribe();
    } else {
      console.log("Không có supplierId");
    }


  }

  openSupplierDetailModal(supplier: Supplier) {
    const modalRef = this.modalService.open(AdminSupplierDetailComponent, { size: 'lg' });
    modalRef.componentInstance.supplier = supplier;
    modalRef.componentInstance.supplierSaved.subscribe(() => {
    });

  }
}
