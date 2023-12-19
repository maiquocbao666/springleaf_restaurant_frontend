import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Discount } from 'src/app/interfaces/discount';
import { Product } from 'src/app/interfaces/product';
import { DiscountService } from 'src/app/services/discount.service';
import { ProductService } from 'src/app/services/product.service';
import { ToastService } from 'src/app/services/toast.service';
import { AdminDiscountDetailComponent } from '../admin-discount-detail/admin-discount-detail.component';

@Component({
  selector: 'app-admin-discounts',
  templateUrl: './admin-discounts.component.html',
  styleUrls: ['./admin-discounts.component.css']
})
export class AdminDiscountsComponent {

  discounts: Discount[] = [];
  products: Product[] = [];
  discountForm: FormGroup;
  discount: Discount | undefined;
  fieldNames: string[] = [];
  isSubmitted = false;
  productsUrl = 'products';
  discountsUrl = 'discounts';
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  constructor(
    private discountService: DiscountService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private sweetAlertService: ToastService
  ) {
    this.discountForm = this.formBuilder.group({
      limitValue: ['', [Validators.required]],
      discountValue: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      discountCode: ['', [Validators.required]],
      active: ['', [Validators.required]],
    });
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }



  ngOnInit(): void {
    this.getDiscount();
    this.getProducts();
  }

  getDiscount(): void {
    this.discountService.getCache().subscribe(
      (cached: any[]) => {
        this.discounts = cached;
      }
    );
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

  formatAmount(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  addDiscount(): void {
    this.isSubmitted = true;
    if (this.discountForm.valid) {
      const limitValue = this.discountForm.get('limitValue')?.value;
      const discountValue = this.discountForm.get('discountValue')?.value;
      const startDate = this.discountForm.get('startDate')?.value;
      const endDate = this.discountForm.get('endDate')?.value;
      const discountCode = this.discountForm.get('discountCode')?.value;
      const active = this.discountForm.get('active')?.value;

      const newDiscount: Discount = {
        userId: 0,
        limitValue: limitValue,
        discountValue: discountValue,
        startDate: startDate,
        endDate: endDate,
        discountCode: discountCode,
        active: active,
      };

      this.discountService.add(newDiscount)
        .subscribe(
          () => {
            this.discountForm.reset();
            this.isSubmitted = false;
            // Thực hiện các hành động sau khi thêm thành công, nếu cần
            // Ví dụ: Hiển thị thông báo thành công
            this.sweetAlertService.showCustomAnimatedAlert('Thêm thành công', 'success', 'animated tada');
          },
          (error) => {
            // Nếu có lỗi, hiển thị thông báo lỗi mà không thực hiện bất kỳ hành động nào khác
            this.sweetAlertService.showCustomAnimatedAlert('Thất bại, không thể thêm', 'warning', 'animated tada');
            console.error('Lỗi khi thêm:', error);
          }
        );
    } else {
      this.sweetAlertService.showCustomAnimatedAlert('Thất bại, chưa nhập đủ dữ liệu', 'warning', 'animated tada');
    }
  }

  deleteDiscount(discount: Discount): void {
    if (discount.discountId) {
      this.sweetAlertService.showConfirmAlert('Bạn có muốn xóa?', 'Không thể tải lại!', 'warning')
        .then((result) => {
          if (result.isConfirmed) {
            this.discountService.delete(discount.discountId!)
              .subscribe(() => {
                this.sweetAlertService.fireAlert('Đã xóa!', 'Bạn đã xóa discount thành công', 'success');
                // Thực hiện các hành động bổ sung sau khi xóa nếu cần
              },
                error => {
                  this.sweetAlertService.fireAlert('Lỗi khi xóa!', 'Đã xảy ra lỗi khi xóa discount', 'error');
                  console.error('Lỗi khi xóa Discount:', error);
                });
          }
        });
    } else {
      this.sweetAlertService.fireAlert('Không có discountId!', 'Không có ID để xóa.', 'info');
    }
  }

  openDiscountDetailModal(discount: Discount) {
    const modalRef = this.modalService.open(AdminDiscountDetailComponent, { size: 'lg' });
    modalRef.componentInstance.discount = discount;
    modalRef.componentInstance.discountSaved.subscribe(() => {
    });
  }

}
