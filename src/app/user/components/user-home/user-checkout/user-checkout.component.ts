import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VNPayService } from 'src/app/services/VNpay.service';
import { CartService } from 'src/app/services/cart.service';
import { ToastService } from 'src/app/services/toast.service';
import { CartDetail } from 'src/app/interfaces/cart-detail';
import Swal from 'sweetalert2';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/interfaces/order';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/interfaces/user';
import { Province } from 'src/app/interfaces/address/Province';
import { District } from 'src/app/interfaces/address/District';
import { Ward } from 'src/app/interfaces/address/Ward';
import { DeliveryOrderService } from 'src/app/services/delivery-order.service';
import { CartDetailService } from 'src/app/services/cart-detail.service';
import { DeliveryOrder } from 'src/app/interfaces/delivery-order';
import { Service } from 'src/app/interfaces/address/Service';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { DiscountService } from 'src/app/services/discount.service';

@Component({
  selector: 'app-user-checkout',
  templateUrl: './user-checkout.component.html',
  styleUrls: ['./user-checkout.component.css']

}) export class UserCheckoutComponent {
  apiUrl = 'http://localhost:8080/public';


  orderTotal: number | undefined;
  orderInfo: string | undefined;
  submitted = false;
  paymentStatus: string | undefined;
  redirectUrl: string | undefined;
  selectedPaymentMethod: string | undefined;
  cartInfos: CartInfomation[] = [];
  orderByUser: Order | null = null;
  ship: number | null = null;
  user: User | null = null;
  cartByUser: DeliveryOrder | null = null;
  orderDetailByUser: CartDetail[] | null = null;

  userAddressHouse: string = '';
  userProvince: Province | null = null;
  userDistrict: District | null = null;
  userWard: Ward | null = null;
  Provinces: any = [];
  Districts: any = [];
  Wards: any = [];
  total: number | null = null;
  totalAndShip: number | null = null;
  service: Service[] = [];
  selectedService: number | null = null;
  // Địa chỉ nhà hàng của user
  restaurants: Restaurant[] = []
  userRestaurantAddress: string = '';
  userRestaurantProvince: Province | null = null;
  userRestaurantDistrict: District | null = null;
  userRestaurantWard: Ward | null = null;
  discountCode: string = '';
  discountPrice: number | null = null;
  isCheckoutActive: boolean = false;
  constructor(
    private vnpayService: VNPayService,
    private router: Router,
    private cartService: CartService,
    private orderService: OrderService,
    private http: HttpClient,
    private authService: AuthenticationService,
    private toast: ToastService,
    private deliveryOrderService: DeliveryOrderService,
    private cartDetailService: CartDetailService,
    private restaurantSerivce: RestaurantService,
    private discountService: DiscountService,
  ) {
    this.orderService.userOrderCache$.subscribe(order => {
      this.orderByUser = order;
    });
    const provincesString = localStorage.getItem('Provinces');
    if (provincesString) {
      const parsedProvince: Province[] = JSON.parse(provincesString);
      this.Provinces = parsedProvince;
    } else {
      console.error('No products found in local storage or the value is null.');
    }
    this.authService.getUserCache().subscribe(
      (data) => {
        this.user = data;
      }
    );
    this.calculateTotalPrice();
    this.initUserAddress();
    this.deliveryOrderService.userCart$.subscribe(cart => {
      this.cartByUser = cart;
    });
    this.orderService.userOrderCache$.subscribe(order => {
      this.orderByUser = order;
    });
    this.cartDetailService.orderDetails$.subscribe((orderDetails) => {
      this.orderDetailByUser = orderDetails;
    });
  }


  ngOnInit(): void {
    this.getRestaurants();
    this.cartInfos = this.cartService.getCartData();
    this.calculateTotalPrice();
    this.initUserRestaurantAddress();
    //this.getService();
  }

  getRestaurants(): void {
    this.restaurantSerivce.getCache().subscribe(
      (cached: any[]) => {
        this.restaurants = cached;
      }
    );
  }

  async initUserRestaurantAddress() {
    if (this.user) {
      var userRestaurantBrand: Restaurant | null = null;
      for (const restaurant of this.restaurants) {
        if (restaurant.restaurantId === this.user.restaurantBranchId) {
          userRestaurantBrand = restaurant;
        }
        if (userRestaurantBrand) {
          const address = userRestaurantBrand.address.toString();
          const restaurantStrings = address.split('-');
          const restaurantAddressHouse = restaurantStrings[0];
          this.userRestaurantAddress = restaurantAddressHouse;
          const restaurantAddressWard = restaurantStrings[1];
          const restaurantAddressDistrict = parseInt(restaurantStrings[2], 10);
          const restaurantAddresssProvince = parseInt(restaurantStrings[3], 10);
          for (const province of this.Provinces) {
            if (province.ProvinceID === restaurantAddresssProvince) {
              this.userRestaurantProvince = province;
              break;
            }
          }

          if (this.userRestaurantProvince) {
            this.getDistrict(this.userRestaurantProvince.ProvinceID).then(() => {
              for (const district of this.Districts) {
                if (district.DistrictID === restaurantAddressDistrict) {
                  this.userRestaurantDistrict = district;
                  if (this.userRestaurantDistrict) {
                    console.log('here')
                    this.getWard(this.userRestaurantDistrict.DistrictID).then(() => {
                      for (const ward of this.Wards) {
                        if (ward.WardCode === restaurantAddressWard) {
                          this.userRestaurantWard = ward;
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
        }
      }
    }
  }

  initUserAddress() {
    if (this.user) {
      if (this.user.address && this.user.restaurantBranchId) {
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
      } else {}
    }
  }
  calculateTotalPrice(): number {
    let totalPrice = 0;

    this.cartInfos.forEach((item) => {
      totalPrice += item.quantity * item.menuItemPrice;
    });
    this.total = totalPrice;
    return totalPrice;
  };

  calculateFinalPrice(shipFee: number): any {
    const totalPrice = this.calculateTotalPrice();
    const discount = Number(sessionStorage.getItem('discountPrice'));
    const finalPrice = totalPrice + shipFee - discount;
    this.totalAndShip = finalPrice;
    return finalPrice >= 0 ? this.formatAmount(finalPrice) : 0;
  };

  formatAmount(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  // changed() {
  //   this.isCheckoutActive = true;
  // }

  processPayment(): void {
    if (this.selectedPaymentMethod === 'vnpay') {
      this.payWithVNPay();
    } else if (this.selectedPaymentMethod === 'cod') {
      this.payWithCOD();
    } else {
      Swal.fire('Vui lòng chọn phương thức thanh toán','', 'info');
    }
  }

  payWithVNPay(): void {
    this.orderTotal = 0; // lấy dữ liệu động tổng tiền
    this.orderInfo = 'CartPayment,' + this.orderByUser?.orderId?.toString() + "," || ""; // dữ liệu order detail
    const cartDetail: CartDetail[] = [];
    for (const cart of this.cartInfos) {
      this.orderTotal += cart.menuItemPrice * cart.quantity;
      this.orderInfo += cart.orderDetailId + ",";
    }
    this.orderInfo = this.orderInfo.replace(/,$/, "");
    if (this.orderTotal && this.orderInfo && this.orderByUser && cartDetail) {
      this.vnpayService.submitOrder(this.orderTotal, this.orderInfo).subscribe({
        next: (data: any) => {
          if (data.redirectUrl) {
            window.location.href = data.redirectUrl; // Chuyển hướng đến URL được trả về từ backend
            this.onGetPaymentStatus();
          } else {
            // Xử lý các trường hợp khác nếu cần
          }
        },
        error: (error: any) => {
          console.error('Failed to submit order. Please try again.', error);
        }
      });
    }
  }

  calculateShipping(): void {
    const apiUrl = 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee';
    const total = this.calculateTotalPrice();
    const formDistrict = this.userRestaurantDistrict?.DistrictID;
    const toDistrict = this.userDistrict?.DistrictID;
    const wardCode = String(this.userWard?.WardCode);
    const selectedServiceId = this.selectedService;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': 'd6f64767-329b-11ee-af43-6ead57e9219a',
      'shop_id': 4421897,
    });

    const shippingData = {
      "service_id": selectedServiceId,
      "insurance_value": total,
      "coupon": null,
      "from_district_id": formDistrict,
      "to_district_id": toDistrict,
      "to_ward_code": wardCode,
      "weight": 1000,
      "length": 15,
      "width": 15,
      "height": 15,
    };


    this.http.post<any>(apiUrl, shippingData, { headers })
      .subscribe({
        next: (response) => {
          if (response && response.code === 200) {
            console.log('Shipping Fee:', response.data.total);
            // Xử lý response cần thiết
            this.ship = response.data.total;
            this.isCheckoutActive = true;
            return;
          } else {
            return;
          }

        },
        error: (error) => {
          console.error('Error calculating shipping fee:', error);

          if (error.error.code_message_value === "Không tìm thấy bảng giá hợp lệ") {
            this.toast.showTimedAlert('Không tìm được bảng giá', 'Vui lòng thay đổi hình thức vận chuyển', 'error', 1000);
          }
          return; // Dừng hàm khi gặp lỗi
        }
      });
  }



  // Sử dụng Router để điều hướng tới URL trả về từ backend
  redirectToPayment(): void {
    if (this.redirectUrl) {
      this.router.navigateByUrl(this.redirectUrl);
    }
  }

  onGetPaymentStatus(): void {
    this.vnpayService.getPaymentStatus().subscribe(
      (data: any) => {
        if (data.paymentStatus === 1) {
          this.paymentStatus = 'Order success';
          // Hiển thị thông tin thanh toán nếu cần
          console.log('Order Info:', data.orderInfo);
          console.log('Payment Time:', data.paymentTime);
          console.log('Transaction ID:', data.transactionId);
          console.log('Total Price:', data.totalPrice);
        } else {
          this.paymentStatus = 'Order failed';
        }
      },
      (error: any) => {
        console.error('Failed to get payment status. Please try again.', error);
      }
    );
  }

  payWithCOD(): void {
    const jwtToken = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    });

    const listItem: CartDetail[] = this.cartInfos.map(item => ({
      orderDetailId: item.orderDetailId,
      menuItemId: item.menuItem,
      orderId: item.order,
      quantity: item.quantity
    }));

    const orderId = this.orderByUser?.orderId;
    const totalAmount = this.totalAndShip;

    // Chú ý: Kiểm tra xem this.discountCode có giá trị không trước khi sử dụng nó
    const discountCode = this.discountCode ? `/${this.discountCode}` : '/noDiscount';

    this.http.post(`${this.apiUrl}/checkout-cod/${orderId}/${totalAmount}${discountCode}/${this.cartByUser?.deliveryOrderId}`, listItem, { headers })
      .subscribe({
        next: (response: any) => {
          if (response.message === 'Checkout success') {
            this.toast.showTimedAlert('Thanh toán thành công', 'Cám ơn quý khách', 'success', 1500);
            this.getUserCart();
          } else if (response.message === 'Checkout failed') {
            this.toast.showTimedAlert('Thanh toán thất bại', 'Vui lòng kiểm tra lại', 'error', 1500);
          }
          console.log('Response:', response);
        },
        error: (error) => {
          // Xử lý lỗi
          console.error('Error:', error);
        }
      });
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

  getService() {
    const shop_id = 4421897;
    const from_district = this.userRestaurantDistrict?.DistrictID;
    const to_distrist = this.userDistrict?.DistrictID;
    const token = 'd6f64767-329b-11ee-af43-6ead57e9219a';

    const httpOptions = {

      headers: new HttpHeaders({
        'token': token
      })

    };

    const requestBody = {

      "shop_id": shop_id,
      "from_district": from_district,
      "to_district": to_distrist,

    };

    const serviceUrl = "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services";

    this.http.post<any>(serviceUrl, requestBody, httpOptions).subscribe(data => {
      this.service = data.data
    });
  }

  getUserCart() {
    this.deliveryOrderService.getUserCart().subscribe({
      next: (response) => {
        console.log('GetUserOrder: ', response);
        if (response) {
          this.getUserOrder(this.cartByUser?.deliveryOrderId as number);
        }
      },
      error: (error) => {
        console.error('Error fetching user order:', error);
      }
    });
  }

  getUserOrder(deliveryOrderId: number) {
    this.orderService.getUserOrder(deliveryOrderId).subscribe({
      next: (response) => {
        console.log('GetUserOrder: ', response);
        if (response) {
          this.getUserOrderDetail(this.orderByUser?.orderId as number);
        }
      },
      error: (error) => {
        console.error('Error fetching user order:', error);
      }
    });
  }


  getUserOrderDetail(orderId: number) {
    this.cartDetailService.getUserOrderDetail(orderId).subscribe({
      next: (response) => {
        console.log('GetUserOrder: ', response);
      },
      error: (error) => {
        console.error('Error fetching user order:', error);
      }
    });
  }

  getDiscount() {
    if (this.discountCode) {
      this.discountService.getDiscountByName(this.discountCode, this.calculateTotalPrice()).subscribe({
        next: (response) => {
          if (response.message === "Discount is not valid") {
            this.toast.showTimedAlert('Mã giảm giá không tồn tại', '', 'error', 2000);
          }
          else if (response.message === "Discount has expired") {
            this.toast.showTimedAlert('Mã giảm giá đã hết hạn', '', 'error', 2000);
          }
          else if (response.message === "Discount has not start") {
            this.toast.showTimedAlert('Chưa đến ngày sử dụng', '', 'info', 2000);
          }
          else {
            this.discountPrice = Number(response.message);
            sessionStorage.setItem('discountPrice', response.message);
            this.toast.showTimedAlert('Áp dụng thành công', '', 'success', 1500);
          }
        },
        error: (error) => {
          this.toast.showTimedAlert('Thêm thất bại', error, 'error', 2000);
        }
      });
    } else {
      this.toast.showTimedAlert('Vui lòng nhập mã giảm giá', '', 'error', 2000);
    }
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
