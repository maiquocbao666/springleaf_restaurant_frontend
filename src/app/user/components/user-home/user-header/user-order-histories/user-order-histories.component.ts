import { Component } from '@angular/core';
import { CartDetail } from 'src/app/interfaces/cart-detail';
import { DeliveryOrder } from 'src/app/interfaces/delivery-order';
import { Order } from 'src/app/interfaces/order';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { CartDetailService } from 'src/app/services/cart-detail.service';
import { DeliveryOrderService } from 'src/app/services/delivery-order.service';
import { OrderService } from 'src/app/services/order.service';
import { RestaurantService } from 'src/app/services/restaurant.service';

import { Province } from 'src/app/interfaces/address/Province';
import { District } from 'src/app/interfaces/address/District';
import { Ward } from 'src/app/interfaces/address/Ward';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CartService } from 'src/app/services/cart.service';
import { DeliveryOrderStatusService } from 'src/app/services/delivery-order-status.service';

@Component({
  selector: 'app-user-order-histories',
  templateUrl: './user-order-histories.component.html',
  styleUrls: ['./user-order-histories.component.css']
})
export class UserOrderHistoriesComponent {

  orders!: Order[];
  cartByUser: DeliveryOrder | null = null; // Thông tin đặt hàng giỏ hàng
  orderByUser: Order | null = null; // Thông tin order của giỏ hàng
  orderDetailByUser: CartDetail[] | null = null; // Thông tin chi tiết của order giỏ hàng
  allCartByUser : DeliveryOrder[] | null = null;

  restaurants: Restaurant[] | null = null;
  Provinces: any = [];
  selectedProvince: number | null = null;
  Districts: any = [];
  selectedDistrict: number | null = null;
  Wards: any = [];

  constructor(
    private orderService: OrderService,
    private deliveryOrderService: DeliveryOrderService,
    private cartDetailService: CartDetailService,
    private restaurantService : RestaurantService,
    private cartService : CartService,
    private deliveryOrderStatusService : DeliveryOrderStatusService,
    private http : HttpClient,
  ){

  }

  ngOnInit(): void {

    this.getRestaurants();
    // this.orderService.gets().subscribe(
    //   data => {
    //     this.orders = data;
    //   }
    // )
    this.deliveryOrderService.getAllUserCartByRestaurant().subscribe(
      (response) => {
        this.allCartByUser = response;
      },
      (error) => {
        console.error("Error fetching user cart:", error);
      }
    );
    // this.deliveryOrderService.allUserCart$.subscribe(
    //   (response) => {
    //     this.allCartByUser = response;
    //   },
    //   (error) => {
    //     console.error("Error fetching user cart:", error);
    //     // Handle the error, e.g., show an error message to the user
    //   }
    // );
    

    // this.orderService.getUserOrderCache().subscribe(
    //   (cached: any | null) => {
    //     if(cached === null && this.cartByUser !== null){
    //       console.log('Lấy dữ liệu Order mới');
    //       this.orderService.getUserOrder(this.cartByUser.deliveryOrderId as number).subscribe(
    //         response => {
    //           this.orderByUser = response;
    //         }
    //       );
    //     }else{
    //       console.log('Lấy dữ liệu từ cache');
    //       this.orderByUser = cached;
    //     }
    //     if(this.orderByUser){
    //     }
        
    //   });

    //   this.cartDetailService.getOrderDetailsCache().subscribe(
    //     (cached: any[] | null) => {
    //       if(cached === null && this.orderByUser !== null){
    //         this.cartDetailService.getUserOrderDetail(this.orderByUser.orderId).subscribe();
    //       }else{
    //         this.orderDetailByUser = cached;
    //       }
          
    //     }
    //   );
  }

  getRestaurants(): void {
    this.restaurantService.getCache().subscribe(
      (cached: any[]) => {
        this.restaurants = cached;
      }
    );
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
