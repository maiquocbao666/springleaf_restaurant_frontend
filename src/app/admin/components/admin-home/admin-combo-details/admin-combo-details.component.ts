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
    this.comboDetailService.getComboDetails()
      .subscribe(comboDetails => this.comboDetails = comboDetails);
  }

  getCombos(): void {
    this.comboService.getCombos()
      .subscribe(combos => this.combos = combos);
  }

  getProducts(): void {
    this.productService.getProducts()
      .subscribe(products => this.products = products);
  }

  getProductById(menuItemId: number): Observable<Product | null> {
    return this.productService.getProduct(menuItemId);
  }

  getComboById(comboId: number): Observable<Combo | null> {
    return this.comboService.getComboById(comboId);
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getComboDetails();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getComboDetails();
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  fillComboDetailForm(comboDetail: ComboDetail) {
    this.comboDetailForm.patchValue({
      // comboDetailId: comboDetail.comboDetailId,
      comboId: comboDetail.comboId,
      menuItem: comboDetail.menuItem,
      quantity: comboDetail.quantity,
      comboTypeId: comboDetail.comboTypeId
    });
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

    this.comboDetailService.addComboDetail(newComboDetail)
      .subscribe(comboDetail => {
        this.getComboDetails();
        this.comboDetailForm.reset();
      });
  }

  updateComboDetail(): void {
    if (this.comboDetailForm.valid) {
      const updatedComboDetail: ComboDetail = {
        comboDetailId: this.comboDetailForm.get('comboDetailId')?.value,
        comboId: this.comboDetailForm.get('comboId')?.value,
        menuItem: this.comboDetailForm.get('menuItem')?.value,
        quantity: this.comboDetailForm.get('quantity')?.value,
        comboTypeId: this.comboDetailForm.get('comboTypeId')?.value,
      };

      this.comboDetailService.updateComboDetail(updatedComboDetail).subscribe(() => {

        // Cập nhật cache nếu cần
        this.comboDetailService.updateComboDetailCache(updatedComboDetail);
        this.comboDetailupdate.emit();
      });
    }
  }


  deleteComboDetail(comboDetail: ComboDetail): void {

    if (comboDetail.comboDetailId) {
      this.comboDetails = this.comboDetails.filter(i => i !== comboDetail);
      this.comboDetailService.deleteComboDetail(comboDetail.comboDetailId).subscribe();
    } else {
      console.log("Không có comboDetailId");
    }
  }
}
