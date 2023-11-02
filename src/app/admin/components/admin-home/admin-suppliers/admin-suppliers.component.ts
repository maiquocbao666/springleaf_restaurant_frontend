import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    window.addEventListener('storage', (event) => {
      if (event.key && event.oldValue !== null) {
        localStorage.setItem(event.key, event.oldValue);
      }
    });
    this.supplierForm = this.formBuilder.group({
      // supplierId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getSuppliers();
  }

  getSuppliers(): void {
    this.supplierService.getSuppliers()
      .subscribe(suppliers => this.suppliers = suppliers);
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getSuppliers();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getSuppliers();
  }

  addSupplier(): void {

    const name = this.supplierForm.get('name')?.value;
    const phone = this.supplierForm.get('phone')?.value;
    const address = this.supplierForm.get('address')?.value;
    const email = this.supplierForm.get('email')?.value;

    this.supplierService.addSupplier({ name, phone, address, email } as Supplier)
      .subscribe(supplier => {
        this.suppliers.push(supplier);
        this.supplierForm.reset();
      });
  }

  deleteSupplier(supplier: Supplier): void {
    this.suppliers = this.suppliers.filter(i => i !== supplier);
    this.supplierService.deleteSupplier(supplier.supplierId).subscribe();
  }

  openSupplierDetailModal(supplier: Supplier) {
    const modalRef = this.modalService.open(AdminSupplierDetailComponent, { size: 'lg' });
    modalRef.componentInstance.supplier = supplier;

  }
}
