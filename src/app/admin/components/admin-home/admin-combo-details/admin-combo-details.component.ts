import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Combo } from 'src/app/interfaces/combo';
import { ComboDetail } from 'src/app/interfaces/combo-detail';
import { Product } from 'src/app/interfaces/product';
import { ComboDetailService } from 'src/app/services/combo-detail.service';
import { ComboService } from 'src/app/services/combo.service';
import { ProductService } from 'src/app/services/product.service';
import { AdminComboDetailsUpdateComponent } from '../admin-combo-details-update/admin-combo-details-update.component';

@Component({
  selector: 'app-admin-combo-detail',
  templateUrl: './admin-combo-details.component.html',
  styleUrls: ['./admin-combo-details.component.css']
})
export class AdminComboDetailsComponent {
  comboDetails: ComboDetail[] = [];
  comboDetailForm: FormGroup;
  combos: Combo[] = [];
  products: Product[] = [];
  @Input() comboDetail: ComboDetail | undefined;
  @Output() comboDetailupdate: EventEmitter<void> = new EventEmitter<void>();
  fieldNames: string[] = [];
  selectedComboDetail: ComboDetail | undefined;

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  constructor(
    private comboDetailService: ComboDetailService,
    private comboService: ComboService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal) {
    this.comboDetailForm = this.formBuilder.group({
      comboDetailId: ['', [Validators.required]],
      comboId: ['', [Validators.required]],
      menuItem: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      comboTypeId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getComboDetails();
    this.getCombos();
    this.getProducts();
  }

  getComboDetails(): void {
    this.comboDetailService.comboDetailsCache$
      .subscribe(comboDetails => this.comboDetails = comboDetails);
  }

  getCombos(): void {
    this.comboService.combosCache$
      .subscribe(combos => this.combos = combos);
  }

  getProducts(): void {
    this.productService.productsCache$
      .subscribe(products => this.products = products);
  }

  getProductById(menuItemId: number): Observable<Product | null> {
    return this.productService.getById(menuItemId);
  }

  getComboById(comboId: number): Observable<Combo | null> {
    return this.comboService.getById(comboId);
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  addComboDetail(): void {

    const comboDetailId = this.comboDetailForm.get('comboDetailId')?.value;
    const comboId = this.comboDetailForm.get('comboId')?.value;
    const menuItem = this.comboDetailForm.get('menuItem')?.value;
    const quantity = this.comboDetailForm.get('quantity')?.value;
    const comboTypeId = this.comboDetailForm.get('comboTypeId')?.value;

    const newComboDetail: ComboDetail = {
      comboDetailId: comboDetailId,
      comboId: comboId,
      menuItem: menuItem,
      quantity: quantity,
      comboTypeId: comboTypeId
    };

    this.comboDetailService.add(newComboDetail)
      .subscribe(comboDetail => {
        this.comboDetailForm.reset();
      });
  }


  deleteComboDetail(comboDetail: ComboDetail): void {

    if (comboDetail.comboDetailId) {
      this.comboDetailService.delete(comboDetail.comboDetailId).subscribe();
    } else {
      console.log("Không có comboDetailId");
    }
  }

  openComboDetailUpdateModal(comboDetail: ComboDetail) {
    const modalRef = this.modalService.open(AdminComboDetailsUpdateComponent, { size: 'lg' });
    modalRef.componentInstance.comboDetail = comboDetail;

    // Subscribe to the emitted event
    modalRef.componentInstance.comboDetailupdate.subscribe(() => {
    });

  }
}
