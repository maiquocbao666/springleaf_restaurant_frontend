import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { District } from 'src/app/interfaces/address/District';
import { Province } from 'src/app/interfaces/address/Province';
import { Ward } from 'src/app/interfaces/address/Ward';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-user-footer',
  templateUrl: './user-footer.component.html',
  styleUrls: ['./user-footer.component.css']
})
export class UserFooterComponent {

  restaurants: Restaurant[] = [];
  restaurantDetailAddress: RestaurantAddress[] = [];
  userCache: User | null = null;

  Provinces: Province[] = [];
  Districts: District[] = [];
  Wards: Ward[] = [];

  restaurantAddress: string = '';

  constructor(
    private authService: AuthenticationService,
    private http: HttpClient
  ) {
    const storedRestaurants = localStorage.getItem('restaurants');
    if (storedRestaurants) {
      this.restaurants = JSON.parse(storedRestaurants) as Restaurant[];
      if (this.restaurants) {

      }
    }
    this.authService.getUserCache().subscribe((data) => {
      this.userCache = data;
    });

    const provincesString = localStorage.getItem('Provinces');
    if (provincesString) {
      const parsedProvince: Province[] = JSON.parse(provincesString);
      this.Provinces = parsedProvince;
    } else {
      console.error('No products found in local storage or the value is null.');
    }

  }

  ngOnInit(): void {
    this.getProvince()
    this.initUserAddress();
  }

  async initUserAddress() {

    if (this.restaurants) {
      let addressHome = '';
      let wardRestaurant = '';
      let districtRestaurant = '';
      let provinceRestaurant = '';
      for (let restaurant of this.restaurants) {
        const address = restaurant.address.toString();
        const splittedStrings = address.split('-');
        const addressHouse = splittedStrings[0];
        addressHome = addressHouse;
        const addressWard = parseInt(splittedStrings[1], 10);
        const addressDistrict = parseInt(splittedStrings[2], 10);
        const addresssProvince = parseInt(splittedStrings[3], 10);

        for (const province of this.Provinces) {
          if (province.ProvinceID === addresssProvince) {
            provinceRestaurant = province.ProvinceName;
            break;
          }
        }

        if (addresssProvince) {
          await this.getDistrict(addresssProvince).then(() => {
            for (const district of this.Districts) {
              if (district.DistrictID === addressDistrict) {
                districtRestaurant = district.DistrictName;
                break;

              }
            }
          });
          if (addressDistrict) {
            await this.getWard(addressDistrict).then(() => {
              //alert(addressWard)
              for (const ward of this.Wards) {
                if (ward.WardCode.toString() === addressWard.toString()) {
                  wardRestaurant = ward.WardName;
                  break;
                }
              }
            });

          }
        }

        this.restaurantDetailAddress.push({
          restaurantAddr: addressHome,
          restaurantId: restaurant.restaurantId as number,
          restaurantName: restaurant.restaurantName,
          restaurantWard: wardRestaurant,
          restaurantDistrict: districtRestaurant,
          restaurantProvince: provinceRestaurant
        })
      }

    } else { }

  }

  public getProvince(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const token = "d6f64767-329b-11ee-af43-6ead57e9219a";

      const httpOptions = {
        headers: new HttpHeaders({
          'token': token
        })
      };

      const districtUrl = "https://online-gateway.ghn.vn/shiip/public-api/master-data/province";


      this.http.get<any>(districtUrl, httpOptions).subscribe(response => {
        if (response && response.data) {
          this.Provinces = response.data;
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

  async getDistrict(ProvinceId: number): Promise<void> {
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

  async getWard(selectedDistrictId: number): Promise<void> {
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

  // initUserAddress() {
  //   if (this.userCache) {
  //     if (this.userCache.) {
  //       const address = this.userCache.address.toString();
  //       const splittedStrings = address.split('-');
  //       const addressHouse = splittedStrings[0];
  //       this.restaurantAddress = addressHouse;
  //       const addressWard = splittedStrings[1];
  //       const addressDistrict = parseInt(splittedStrings[2], 10);
  //       const addresssProvince = parseInt(splittedStrings[3], 10);

  //       for (const province of this.Provinces) {
  //         if (province.ProvinceID === addresssProvince) {
  //           this.userProvince = province;
  //           break;
  //         }
  //       }

  //       if (this.userProvince) {
  //         this.getDistrict(this.userProvince.ProvinceID).then(() => {
  //           for (const district of this.Districts) {
  //             if (district.DistrictID === addressDistrict) {
  //               this.userDistrict = district;
  //               if (this.userDistrict) {
  //                 this.getWard(this.userDistrict.DistrictID).then(() => {
  //                   for (const ward of this.Wards) {
  //                     if (ward.WardCode === addressWard) {
  //                       this.userWard = ward;
  //                       break;
  //                     }
  //                   }
  //                 });

  //               }
  //               break;

  //             }
  //           }
  //         });
  //       }
  //     } else {
  //     }
  //   }
  // }
}

export interface RestaurantAddress {
  restaurantId: number;
  restaurantName: string;
  restaurantAddr: string;
  restaurantWard: string;
  restaurantDistrict: string;
  restaurantProvince: string;
}
