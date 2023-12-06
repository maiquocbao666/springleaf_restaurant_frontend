import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CartDetail } from 'src/app/interfaces/cart-detail';
import { CartDetailService } from 'src/app/services/cart-detail.service';
import { CartService } from 'src/app/services/cart.service';
import { DeliveryOrder } from 'src/app/interfaces/delivery-order';
import { Order } from 'src/app/interfaces/order';
import { DeliveryOrderService } from 'src/app/services/delivery-order.service';
import { OrderService } from 'src/app/services/order.service';
import { Product } from 'src/app/interfaces/product';
import { ToastService } from 'src/app/services/toast.service';
import Swal from 'sweetalert2';
import { DiscountService } from 'src/app/services/discount.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-cart',
  templateUrl: './user-cart.component.html',
  styleUrls: ['./user-cart.component.css']
})
export class UserCartComponent implements OnInit {
  cartDetails: CartDetail[] = [];
  Provinces: any = [];
  selectedProvince: number | null = null;
  Districts: any = [];
  selectedDistrict: number | null = null;
  Wards: any = [];
  selectedWard: number | null = null;
  shipFee: number | null = null;
  cartByUser: DeliveryOrder | null = null;
  orderByUser: Order | null = null;
  orderDetailByUser: CartDetail[] | null = null;
  products: Product[] | null = null;
  cartInformationArray: CartInfomation[] = [];

  selectedItems: CartInfomation[] = [];
  selectAllChecked = false;
  selections: { [key: string]: boolean } = {};
  discountCode: string = '';
  discountPrice: number | null = null;
  constructor(
    private cartService: CartService,
    private deliveryOrderService: DeliveryOrderService,
    private orderService: OrderService,
    private cartDetailService: CartDetailService,
    private toastService: ToastService,
    private discountService: DiscountService,
    private http: HttpClient,
    private router: Router
  ) {

    const productsString = localStorage.getItem('products');
    if (productsString) {
      const parsedProducts: Product[] = JSON.parse(productsString);
      this.products = parsedProducts;
    } else {
      console.error('No products found in local storage or the value is null.');
    }
    this.deliveryOrderService.userCart$.subscribe(cart => {
      this.cartByUser = cart;
    });
    this.orderService.userOrderCache$.subscribe(order => {
      this.orderByUser = order;
    });
    this.cartDetailService.orderDetails$.subscribe(orderDetails => {
      this.orderDetailByUser = orderDetails;
      if (orderDetails) {
        this.setCartInfomationArrays();
      }
    });


  }

  ngOnInit(): void {
    this.cartService.getProvince();
    this.cartService.provinceData$.subscribe(data => {
      this.Provinces = Object.values(data);
    });
    this.cartService.districtData$.subscribe(data => {
      this.Districts = Object.values(data);
    });
    this.cartService.wardData$.subscribe(data => {
      this.Wards = Object.values(data);
    });
  }

  @ViewChild('likeBtn') likeBtn!: ElementRef;
  @ViewChild('minusBtn') minusBtn!: ElementRef;
  @ViewChild('plusBtn') plusBtn!: ElementRef;

  ngAfterViewInit() {
    this.likeButtonHandler();
    this.minusButtonHandler();
    this.plusButtonHandler();
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  setCartInfomationArrays() {
    this.cartInformationArray = [];
    if (this.orderDetailByUser && this.products) {
      for (let i = 0; i < this.orderDetailByUser.length; i++) {
        const orderDetail = this.orderDetailByUser[i];
        for (let j = 0; j < this.products.length; j++) {
          const product = this.products[j];
          if (orderDetail.menuItemId === product.menuItemId) {
            const cartInfo: CartInfomation = {
              orderDetailId: orderDetail.orderDetailId,
              order: orderDetail.orderId,
              menuItem: orderDetail.menuItemId,
              quantity: orderDetail.quantity,
              menuItemPrice: product.unitPrice,
              menuItemImage: product.imageUrl,
              menuItemName: product.name,
              menuItemQuantity: product.categoryId
            };
            this.cartInformationArray.push(cartInfo)
          }
        }
      }
    }
  }


  likeButtonHandler() {
    this.likeBtn.nativeElement.addEventListener('click', () => {
      this.likeBtn.nativeElement.classList.toggle('is-active');
    });
  }

  minusButtonHandler() {
    this.minusBtn.nativeElement.addEventListener('click', (e: Event) => {
      e.preventDefault();
      const input = this.minusBtn.nativeElement.closest('div').querySelector('input');
      let value = parseInt((input as HTMLInputElement).value);

      if (value > 1) {
        value -= 1;
      } else {
        value = 0;
      }

      (input as HTMLInputElement).value = value.toString();
    });
  }

  validateQuantity(event: Event, cart: any): void {
    const inputElement = event.target as HTMLInputElement;
    const newValue = parseInt(inputElement.value, 10);
    const limitProduct = 100; // Thay đổi lại sau khi xử lý ở backend lấy giá trị cho biến này
    if (isNaN(newValue) || newValue < 1 || newValue > limitProduct) {
      inputElement.value = cart.quantity.toString();
    } else {
      cart.quantity = newValue;
      const cartDetail : CartDetail = {
        orderDetailId : cart.orderDetailId,
        orderId : cart.order,
        menuItemId : cart.menuItem,
        quantity : newValue
      };
      this.cartDetailService.update(cartDetail).subscribe();
    }
  }

  toggleSelectedAll() {
    this.selectAllChecked = !this.selectAllChecked;
    if (this.selectAllChecked) {
      this.selectedItems = this.cartInformationArray; // check lại lỗi này
    } else {
      this.selectedItems = [];
    }
    for (let cart of this.cartInformationArray) {
      this.selections[cart.menuItem] = this.selectAllChecked;
    }
  }

  toggleSelection(cart: any): void {
    const index = this.selectedItems.indexOf(cart);

    if (index === -1) {
      this.selectedItems.push(cart);
      console.log(this.selectedItems[0].menuItem);
    } else {
      this.selectedItems.splice(index, 1);
    }

    this.selectAllChecked = this.cartInformationArray.length === this.selectedItems.length;
  }

  calculateTotalPrice(): number {
    let totalPrice = 0;

    for (const cart of this.selectedItems) {
      totalPrice += cart.menuItemPrice * cart.quantity;
    }

    return totalPrice;
  }

  calculateFinalPrice(discount: number): any {
    const totalPrice = this.calculateTotalPrice();
    const finalPrice = totalPrice - discount;
    return finalPrice >= 0 ? this.formatAmount(finalPrice) : 0;
  }

  deleteCartDetail(cart: any): void {
    const orderDetailId = cart.orderDetailId;
    this.toastService.showConfirmAlert('Bạn chắc chắn xóa?', '', 'warning')
      .then((result) => {
        if (result.isConfirmed) {
          this.cartDetailService.delete(orderDetailId).subscribe({
            next: (response) => {
              if (response.message === "Delete is success") {
                this.cartDetailService.getUserOrderDetail(this.orderByUser?.orderId as number).subscribe();
                this.toastService.showTimedAlert('Xóa thành công', '', 'success', 2000);
              }
            },
            error: (error) => {
              this.toastService.showTimedAlert('Xóa thất bại', error, 'error', 2000);
            }
          });
          if (this.orderByUser) {
            this.cartDetailService.getUserOrderDetail(this.orderByUser?.orderId);
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {

        }
      });

  }

  plusButtonHandler() {
    this.plusBtn.nativeElement.addEventListener('click', (e: Event) => {
      e.preventDefault();
      const input = this.plusBtn.nativeElement.closest('div').querySelector('input');
      let value = parseInt((input as HTMLInputElement).value);

      if (value < 100) {
        value += 1;
      } else {
        value = 100;
      }

      (input as HTMLInputElement).value = value.toString();
    });
  }

  getDiscount() {
    if (this.selectedItems.length > 0) {
      const listItemId: number[] = [];
      this.selectedItems.forEach((item, index) => {
        listItemId.push(Number(this.selectedItems[index].menuItem as number));
      });
      if (this.discountCode != null) {
        this.discountService.getDiscountByName(this.discountCode, listItemId).subscribe({
          next: (response) => {
            if (response.message === "Discount is not valid") {
              this.toastService.showTimedAlert('Mã giảm giá không tồn tại', '', 'error', 2000);
            }
            else if (response.message === "Discount is Experied") {
              this.toastService.showTimedAlert('Mã giảm giá đã hết hạn', '', 'error', 2000);
            }
            else {
              this.discountPrice = response.message;
              this.toastService.showTimedAlert('Thêm thành công', '', 'success', 2000);
            }
          },
          error: (error) => {
            this.toastService.showTimedAlert('Thêm thất bại', error, 'error', 2000);
          }
        });
      } else {
        this.toastService.showTimedAlert('Vui lòng nhập mã giảm giá', '', 'info', 2000);
      }

    } else {
      this.toastService.showTimedAlert('Vui lòng chọn sản phẩm trước', '', 'info', 2000);
    }
  }

  checkout() {
    if (this.selectedItems.length > 0) {
      this.cartService.setCartData(this.selectedItems)
      this.router.navigate(['/user/checkout'], { state: { cartInfos: this.selectedItems } });
    } else {
      this.toastService.showTimedAlert('Vui lòng chọn sản phẩm trước khi thanh toán', '', 'info', 2000);
    }
  }

  onProvinceChange() {
    console.log('onProvinceChange called');
    if (typeof this.selectedProvince === 'number') {
      this.cartService.getDistrict(this.selectedProvince);
    }
    console.log(this.selectedProvince); // In ra giá trị tỉnh/thành phố đã chọn
  }

  onDistrictChange() {
    console.log('onDistrictChange called');
    if (typeof this.selectedDistrict === 'number') {
      this.cartService.getWard(this.selectedDistrict);

    }
    console.log(this.selectedDistrict); // In ra giá trị tỉnh/thành phố đã chọn
  }

  shipFeeWithUser() {

  }
}

export interface CartInfomation {
  orderDetailId?: number;
  order: number;
  menuItem: number;
  quantity: number;
  menuItemName: string;
  menuItemPrice: number;
  menuItemImage: string;
  menuItemQuantity: number
}
