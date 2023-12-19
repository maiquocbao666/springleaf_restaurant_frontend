import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Discount } from 'src/app/interfaces/discount';
import { Product } from 'src/app/interfaces/product';
import { DiscountService } from 'src/app/services/discount.service';
import { ProductService } from 'src/app/services/product.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-admin-discount-detail',
  templateUrl: './admin-discount-detail.component.html',
  styleUrls: ['./admin-discount-detail.component.css']
})
export class AdminDiscountDetailComponent {
  discounts: Discount[] = [];
  products: Product[] = [];
  discountForm: FormGroup;
  fieldNames: string[] = [];
  isSubmitted = false;
  @Input() discount: Discount | undefined;
  @Output() discountsSaved: EventEmitter<void> = new EventEmitter<void>();


  constructor(
    private discountService: DiscountService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private sweetAlertService: ToastService,
    public activeModal: NgbActiveModal

  ) {
    this.discountForm = this.formBuilder.group({
      discountId: ['', [Validators.required]],
      limitValue: ['', [Validators.required]],
      discountValue: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      discountCode: ['', [Validators.required]],
      active: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.setValue();
    this.getProducts();
  }
  getProducts(): void {
    this.productService.getCache().subscribe(
      (cached: any[]) => {
        this.products = cached;
      }
    );
  }

  getProductById(id: number): Product | null {
    const found = this.products.find(data => data.menuItemId === id);
    return found || null;
  }

  setValue() {
    if (this.discount) {
      this.discountForm.patchValue({
        discountId: this.discount.discountId,
        limitValue: this.discount.limitValue,
        discountValue: this.discount.discountValue,
        startDate: this.discount.startDate,
        endDate: this.discount.endDate,
        discountCode: this.discount.discountCode,
        active: this.discount.active,
      });
    }
  }

  updateDiscount(): void {
    // Đóng modal sau khi lưu
    this.activeModal.close('Close after saving');
    this.isSubmitted = true;

    if (this.discountForm.valid) {
      const updatedDiscount: Discount = {
        userId : 0,
        discountId: +this.discountForm.get('discountId')?.value,
        discountValue: +this.discountForm.get('discountValue')?.value,
        startDate: this.discountForm.get('startDate')?.value,
        endDate: this.discountForm.get('endDate')?.value,
        limitValue: this.discountForm.get('limitValue')?.value,
        discountCode: this.discountForm.get('discountCode')?.value,
        active: this.discountForm.get('active')?.value,
      };

      this.discountService.update(updatedDiscount).subscribe(
        () => {
          this.sweetAlertService.showCustomAnimatedAlert('Cập nhật thành công', 'success', 'animated tada');
        },
        (error) => {
          this.sweetAlertService.showCustomAnimatedAlert('Cập nhật thất bại', 'warning', 'animated shake');
          console.error('Cập nhật không thành công:', error);
        }
      );
    } else {
      this.sweetAlertService.showCustomAnimatedAlert('Cập nhật không thành công', 'warning', 'animated shake');
    }
  }


}
