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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Province } from 'src/app/interfaces/address/Province';
import { District } from 'src/app/interfaces/address/District';
import { Ward } from 'src/app/interfaces/address/Ward';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserOrderHistoriesComponent } from '../user-header/user-order-histories/user-order-histories.component';

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

  userAddressHouse: string = '';
  userProvince: Province | null = null;
  userDistrict: District | null = null;
  userWard: Ward | null = null;
  user: User | null = null;
  ship: number | null = null;
  finalPrice2: number | null = null;
  constructor(
    private cartService: CartService,
    private deliveryOrderService: DeliveryOrderService,
    private orderService: OrderService,
    private cartDetailService: CartDetailService,
    private toastService: ToastService,
    private discountService: DiscountService,
    private authService: AuthenticationService,
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal,
  ) {
    const provincesString = localStorage.getItem('Provinces');
    if (provincesString) {
      const parsedProvince: Province[] = JSON.parse(provincesString);
      this.Provinces = parsedProvince;
    } else {
      console.error('No products found in local storage or the value is null.');
    }
    const productsString = localStorage.getItem('products');
    if (productsString) {
      const parsedProducts: Product[] = JSON.parse(productsString);
      this.products = parsedProducts;
    } else {
      console.error('No products found in local storage or the value is null.');
    }
    
    
  }

  ngOnInit(): void {
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
    this.authService.getUserCache().subscribe(
      (data) => {
        this.user = data;
      }
    );
    this.initUserAddress();
    sessionStorage.removeItem('discountPrice');
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

  initUserAddress() {
    if (this.user) {
      if (this.user.address) {
        const address = this.user.address.toString();
        const splittedStrings = address.split('-');
        const addressHouse = splittedStrings[0];
        this.userAddressHouse = addressHouse;
        const addressWard = splittedStrings[1];
        const addressDistrict = parseInt(splittedStrings[2], 10);
        const addresssProvince = parseInt(splittedStrings[3], 10);

        for (const province of this.Provinces) {
          if (province.ProvinceID === addresssProvince) {
            this.userProvince = province;
            break;
          }
        }

        if (this.userProvince) {
          this.getDistrict(this.userProvince.ProvinceID).then(() => {
            for (const district of this.Districts) {
              if (district.DistrictID === addressDistrict) {
                this.userDistrict = district;
                if (this.userDistrict) {
                  this.getWard(this.userDistrict.DistrictID).then(() => {
                    for (const ward of this.Wards) {
                      if (ward.WardCode === addressWard) {
                        this.userWard = ward;
                        break;
                      }
                    }
                  });

                }
                break;

              }
            }
          });
        }
      } else {
      }
    }
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
      const cartDetail: CartDetail = {
        orderDetailId: cart.orderDetailId,
        orderId: cart.order,
        menuItemId: cart.menuItem,
        quantity: newValue
      };
      this.cartDetailService.update(cartDetail).subscribe();
      this.cartDetailService.getUserOrderDetail(cart.order).subscribe();
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

    const anyUnchecked = this.cartInformationArray.some(cart => !this.selections[cart.menuItem]);

    // Cập nhật giá trị của selectAllChecked dựa trên kết quả kiểm tra
    this.selectAllChecked = !anyUnchecked;
  }

  calculateTotalPrice(): number {
    let totalPrice = 0;

    for (const cart of this.selectedItems) {
      totalPrice += cart.menuItemPrice * cart.quantity;
    }
    return totalPrice;
  }

  // calculateFinalPrice(discount: number): any {
  //   const totalPrice = this.calculateTotalPrice();
  //   const finalPrice = totalPrice - discount;

  //   return finalPrice >= 0 ? this.formatAmount(finalPrice) : 0;
  // }

  createDelivery() {
    if (this.selectedItems.length > 0) {
      const jwtToken = sessionStorage.getItem('access_token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      });
      let listDetail : CartDetail[] =  [];
      for(const item of this.selectedItems){
        let cartDetail : CartDetail = {
          orderDetailId : item.orderDetailId,
          orderId : item.order,
          menuItemId : item.menuItem,
          quantity : item.quantity
        }
        listDetail.push(cartDetail);
      }
      this.http.post(`http://localhost:8080/public/config-user-cart`, listDetail, { headers })
        .subscribe({
          next: (response: any) => {
            if (response.message === 'Success') {
              this.toastService.showTimedAlert('Đặt hàng thành công', 'Cám ơn quý khách', 'success', 1500);
            } else if (response.message === 'Failed') {
              this.toastService.showTimedAlert('Đặt hàng thất bại', 'Vui lòng kiểm tra lại', 'error', 1500);
            }
            console.log('Response:', response);
          },
          error: (error) => {
            // Xử lý lỗi
            console.error('Error:', error);
          }
        });
    } else {
      this.toastService.showTimedAlert('Vui lòng chọn ít nhất 1 sản phẩm', '', 'info', 2000);
    }
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

  checkout() {
    if (this.selectedItems.length > 0) {
      this.cartService.setCartData(this.selectedItems)
      this.router.navigate(['/user/checkout'], { state: { cartInfos: this.selectedItems } });
    } else {
      this.toastService.showTimedAlert('Vui lòng chọn ít nhất 1 sản phẩm', '', 'info', 2000);
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

  public getDistrict(ProvinceId: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const token = 'd6f64767-329b-11ee-af43-6ead57e9219a';

      const httpOptions = {
        headers: new HttpHeaders({
          'token': token
        })
      };

      const districtUrl = "https://online-gateway.ghn.vn/shiip/public-api/master-data/district";

      const requestBody = {
        province_id: ProvinceId
      };

      this.http.post<any>(districtUrl, requestBody, httpOptions).subscribe(response => {
        if (response && response.data) {
          this.Districts = response.data;
          resolve();
        } else {
          console.error('Invalid response format');
          reject('Invalid response format');
        }
      }, error => {
        console.error('Error fetching districts:', error);
        reject(error);
      });
    });
  }

  public getWard(selectedDistrictId: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const token = 'd6f64767-329b-11ee-af43-6ead57e9219a';

      const httpOptions = {
        headers: new HttpHeaders({
          'token': token
        })
      };

      const requestBody = {
        district_id: selectedDistrictId
      };

      const wardUrl = "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward";

      this.http.post<any>(wardUrl, requestBody, httpOptions).subscribe(response => {
        if (response && response.data) {
          this.Wards = response.data;
          console.log(response)
          resolve(); // Giải quyết Promise khi dữ liệu đã được lấy
        } else {
          console.error('Invalid response format');
          reject('Invalid response format'); // Từ chối Promise nếu có lỗi định dạng phản hồi
        }
      }, error => {
        console.error('Error fetching wards:', error);
        reject(error); // Từ chối Promise nếu có lỗi
      });
    });
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
