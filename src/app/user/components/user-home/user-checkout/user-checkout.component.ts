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
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { DeliveryOrderService } from 'src/app/services/delivery-order.service';
import { CartDetailService } from 'src/app/services/cart-detail.service';
import { DeliveryOrder } from 'src/app/interfaces/delivery-order';

@Component({
  selector: 'app-user-checkout',
  templateUrl: './user-checkout.component.html',
  styleUrls: ['./user-checkout.component.css']

}) export class UserCheckoutComponent {
  orderTotal: number | undefined;
  orderInfo: string | undefined;
  submitted = false;
  paymentStatus: string | undefined;
  redirectUrl: string | undefined;
  selectedPaymentMethod: string | undefined;
  cartInfos: CartInfomation[] = [];
  orderByUser: Order | null = null;
  ship : number | null = null;
  user : User | null = null;
  cartByUser: DeliveryOrder | null = null;
  orderDetailByUser: CartDetail[] | null = null;

  userProvince: Province | null = null;
  userDistrict: District | null = null;
  userWard: Ward | null = null;
  Provinces: any = [];
  Districts: any = [];
  Wards: any = [];
  total : number | null = null;
  totalAndShip : number | null=null;
  constructor(
    private vnpayService: VNPayService,
    private router: Router,
    private cartService: CartService,
    private orderService: OrderService,
    private http: HttpClient,
    private authService : AuthenticationService,
    private toast : ToastService,
    private deliveryOrderService : DeliveryOrderService,
    private cartDetailService : CartDetailService,
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
    this.cartInfos = this.cartService.getCartData();
    console.log(this.cartInfos);
    this.calculateTotalPrice();
    //this.calculateShipping();
  }
  initUserAddress() {
    if (this.user) {
      if (this.user.address) {
        const address = this.user.address.toString();
        const splittedStrings = address.split('-');
        const addressWard = splittedStrings[0];
        const addressDistrict = parseInt(splittedStrings[1], 10);
        const addresssProvince = parseInt(splittedStrings[2], 10);

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
                  console.log('here')
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
  calculateTotalPrice(): number {
    let totalPrice = 0;

    this.cartInfos.forEach((item) => {
      totalPrice += item.quantity*item.menuItemPrice;
    });
    this.total = totalPrice;
    return totalPrice;
  };

  calculateFinalPrice(shipFee: number): any {
    const totalPrice = this.calculateTotalPrice();
    const finalPrice = totalPrice + shipFee;
    this.totalAndShip = finalPrice;
    return finalPrice >= 0 ? this.formatAmount(finalPrice) : 0;
  };

  formatAmount(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  processPayment(): void {
    // Kiểm tra xem phương thức thanh toán nào được chọn
    if (this.selectedPaymentMethod === 'vnpay') {
      this.payWithVNPay();
    } else if (this.selectedPaymentMethod === 'momo') {
      this.payWithMoMo();
    } else if (this.selectedPaymentMethod === 'cod') {
      this.payWithCOD();
    } else {
      // Xử lý nếu không chọn phương thức thanh toán
      Swal.fire('Bạn chưa chọn phương thức thanh toán', 'vui lòng chọn!', 'info');
      console.error('Vui lòng chọn phương thức thanh toán.');
    }
  }

  payWithVNPay(): void {
    this.orderTotal = 0; // lấy dữ liệu động tổng tiền
    this.orderInfo = this.orderByUser?.orderId?.toString() +"," || ""; // dữ liệu order detail
    const cartDetail : CartDetail[] = [];
    for(const cart of this.cartInfos){
      this.orderTotal += cart.menuItemPrice*cart.quantity;
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
      console.log('Thanh toán bằng VNPAY');
    }
  }

  calculateShipping(total : number): void {
    const apiUrl = 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee';
    const distristId = this.userDistrict?.DistrictID;
    const wardCode = String(this.userWard?.WardCode);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': 'd6f64767-329b-11ee-af43-6ead57e9219a',
      'shop_id': 4421897,
    });
  
    const shippingData = {
      "service_id": 53320,
      "insurance_value": total,
      "coupon": null,
      "from_district_id": 1572,
      "to_district_id": distristId,
      "to_ward_code": wardCode,
      "weight": 1000,
      "length": 15,
      "width": 15,
      "height": 15,
    };
    
  
    this.http.post<any>(apiUrl, shippingData, { headers })
      .subscribe({
        next: (response) => {
          if(response && response.code === 200){
            console.log('Shipping Fee:', response.data.total);
            // Xử lý response cần thiết
            this.ship = response.data.total;
            return;
          }else{
            return;
          }
          
        },
        error: (error) => {
          console.error('Error calculating shipping fee:', error);
          // Xử lý lỗi
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

  payWithMoMo(): void {
    console.log('Thanh toán bằng MoMo');
  }

  payWithCOD(): void {
    console.log('Thanh toán bằng COD');
    const jwtToken = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    });

    const listItem: CartDetail[] = [];
    let totalAmount = this.totalAndShip;
    this.cartInfos.forEach((item) => {
      const cartDetail: CartDetail = {
        orderDetailId: item.orderDetailId,
        menuItemId: item.menuItem,
        orderId: item.order,
        quantity: item.quantity
      }
      
      listItem.push(cartDetail);
    });
    const orderId = this.orderByUser?.orderId;
    console.log(totalAmount)

    this.http.post(`http://localhost:8080/public/checkout-cod/${orderId}/${totalAmount}`, listItem, { headers: headers })
      .subscribe({
        next: (response : any) => {
          if(response.message === "Checkout success"){
            this.toast.showTimedAlert('Thanh toán thành công','Cám ơn quý khách','success',1500);
            this.getUserCart();
          }
          if(response === "Checkout failed"){
            this.toast.showTimedAlert('Thanh toán thất bại','Vui lòng kiểm tra lại','error',1500);
          }
          console.log('Response:', response);
        },
        error: (error) => {
          // Handle error
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
  getUserCart() {
    this.deliveryOrderService.getUserCart().subscribe({
      next: (response) => {
          console.log('GetUserOrder: ', response);
          if(response){
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
          if(response){
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
