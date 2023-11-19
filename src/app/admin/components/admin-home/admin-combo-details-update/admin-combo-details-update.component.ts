import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Combo } from 'src/app/interfaces/combo';
import { ComboDetail } from 'src/app/interfaces/combo-detail';
import { Product } from 'src/app/interfaces/product';
import { ComboDetailService } from 'src/app/services/combo-detail.service';
import { ComboService } from 'src/app/services/combo.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-admin-combo-details-update',
  templateUrl: './admin-combo-details-update.component.html',
  styleUrls: ['./admin-combo-details-update.component.css']
})
export class AdminComboDetailsUpdateComponent {

  comboDetails: ComboDetail[] = [];
  comboDetailForm: FormGroup;
  combos: Combo[] = [];
  products: Product[] = [];
  @Input() comboDetail: ComboDetail | undefined;
  @Output() comboDetailupdate: EventEmitter<void> = new EventEmitter<void>();
  fieldNames: string[] = [];

  constructor(
    private comboDetailService: ComboDetailService,
    private comboService: ComboService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
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
    this.setValue();
  }

  setValue() {
    if (this.comboDetail) {
      this.comboDetailForm.patchValue({
        comboDetailId: this.comboDetail.comboDetailId,
        comboId: this.comboDetail.comboId,
        menuItem: this.comboDetail.menuItem,
        quantity: this.comboDetail.quantity,
        comboTypeId: this.comboDetail.comboTypeId
      });
    }
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



  updateComboDetail(): void {
    if (this.comboDetailForm.valid) {
      const updatedComboDetail: ComboDetail = {
        comboDetailId: +this.comboDetailForm.get('comboDetailId')?.value,
        comboId: +this.comboDetailForm.get('comboId')?.value,
        menuItem: +this.comboDetailForm.get('menuItem')?.value,
        quantity: +this.comboDetailForm.get('quantity')?.value,
        comboTypeId: +this.comboDetailForm.get('comboTypeId')?.value,
      };

      this.comboDetailService.updateComboDetail(updatedComboDetail).subscribe(() => {

        // Cập nhật cache nếu cần
        this.comboDetailService.updateComboDetailCache(updatedComboDetail);
        this.comboDetailupdate.emit();
      });
    }
  }
}
