import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CartDetail } from 'src/app/interfaces/cart-detail';
import { CartDetailService } from 'src/app/services/cart-detail.service';
import { CartService } from 'src/app/services/cart.service';
import { DeliveryOrder } from 'src/app/interfaces/delivery-order';
import { Order } from 'src/app/interfaces/order';
import { DeliveryOrderService } from 'src/app/services/delivery-order.service';
import { OrderService } from 'src/app/services/order.service';
import { Product } from 'src/app/interfaces/product';

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
  cartByUser: DeliveryOrder | null = null;
  orderByUser: Order | null = null;
  orderDetailByUser: CartDetail[] | null = null;
  products: Product[] | null = null;
  cartInformationArray: CartInfomation[] = [];

  selectedItems: any[] = [];
  selectAllChecked = false;
  selections: { [key: string]: boolean } = {};
  constructor(
    private cartService: CartService,
    private deliveryOrderService : DeliveryOrderService,
    private orderService : OrderService,
    private cartDetailService : CartDetailService,
  ) {
    this.deliveryOrderService.userCart$.subscribe(cart => {
      this.cartByUser = cart;
      console.log(this.cartByUser);
      // Xử lý khi có sự thay đổi trong giỏ hàng người dùng
    });
    this.orderService.userOrderCache$.subscribe(order => {
      this.orderByUser = order;
    });
    const productsString = localStorage.getItem('products');
    if (productsString) {
      const parsedProducts: Product[] = JSON.parse(productsString);
      this.products = parsedProducts;
    } else {
      console.error('No products found in local storage or the value is null.');
    }
    this.cartDetailService.orderDetails$.subscribe(orderDetails => {
      this.orderDetailByUser = orderDetails;
      this.setCartInfomationArrays();
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

  setCartInfomationArrays(){
    if (this.orderDetailByUser && this.products) {
      for (let i = 0; i < this.orderDetailByUser.length; i++) {
        const orderDetail = this.orderDetailByUser[i];
        for (let j = 0; j < this.products.length; j++) {
          const product = this.products[j];
          if (orderDetail.menuItemId === product.menuItemId) {
            const cartInfo: CartInfomation = {
              orderDetailId: orderDetail.orderDetailId,
              order: orderDetail.order,
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
    }
  }
  
  toggleSelectedAll() {
    this.selectAllChecked = !this.selectAllChecked;
    if(this.selectAllChecked){
      this.selectedItems = this.cartInformationArray;
    }else{
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

  calculateFinalPrice(discount: number): number {
    const totalPrice = this.calculateTotalPrice();
    const finalPrice = totalPrice - discount;

    return finalPrice >= 0 ? finalPrice : 0;
  }

  deleteCartDetail(cart : any) : void{
    const orderDetailId = cart.orderDetailId;
    this.cartDetailService.delete(orderDetailId);
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

  ngOnInit(): void {
    this.cartService.getProvince();
    this.cartService.provinceData$.subscribe(data => {
      this.Provinces = Object.values(data);
      console.log(this.Provinces);
    });
    this.cartService.districtData$.subscribe(data => {
      this.Districts = Object.values(data);
    });
    this.cartService.wardData$.subscribe(data => {
      this.Wards = Object.values(data);
    });
    
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
}

export interface CartInfomation{
  orderDetailId?: number;
  order: number;
  menuItem: number;
  quantity: number;
  menuItemName: string;
  menuItemPrice: number;
  menuItemImage: string;
  menuItemQuantity: number
}
