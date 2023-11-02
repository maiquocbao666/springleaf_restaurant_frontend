import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cart } from '../interfaces/cart';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';


@Injectable({
    providedIn: 'root'
})
export class CartService {

    private cartsUrl = 'carts'; // URL to web api, không cần thêm base URL
    cartsCache!: Cart[]; // Cache for categories
    getDatasOfThisUserWorker: Worker;

    // Province
    public provinceDataSubject = new BehaviorSubject<Province[]>([]);
    public provinceData$ = this.provinceDataSubject.asObservable();
    // District
    public districtDataSubject = new BehaviorSubject<District[]>([]);
    public districtData$: Observable<District[]> = this.districtDataSubject.asObservable();
    // Ward
    public wardDataSubject = new BehaviorSubject<Ward[]>([]);
    public wardData$: Observable<Ward[]> = this.wardDataSubject.asObservable();

    selectedProvinceId: number | null = null;
    selectedDistrictId: number | null = null;

    constructor(private apiService: ApiService, private http : HttpClient,  private ngZone: NgZone) { 
        this.getDatasOfThisUserWorker = new Worker(new URL('../workers/user/user-call-all-apis.worker.ts', import.meta.url));
        
    } 

    // Sử dụng ApiService để gửi yêu cầu GET
    getCartDetails(): Observable<Cart[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.cartsCache) {
            return of(this.cartsCache);
        }

        const cartsObservable = this.apiService.request<Cart[]>('get', this.cartsUrl);

        // Cache the categories observable
        cartsObservable.subscribe(data => {
            this.cartsCache = data; // Store the fetched data in the cache
        });

        return cartsObservable;
    }

    setProvinceData(provinceData: Province[]): void {
        this.provinceDataSubject.next(provinceData);
    }

    getProvince(): void {
        this.getDatasOfThisUserWorker.postMessage({ type: 'cart' });
        this.getDatasOfThisUserWorker.onmessage = (event) => {
            const dataMap = event.data;
            
            if (dataMap && dataMap.provinceResponse) {
                const provinceData: Province[] = dataMap.provinceResponse;
                this.setProvinceData(provinceData);
            }
        };
    }
    
    public getDistrict(selectedProvinceId: number): void {
        const token = 'd6f64767-329b-11ee-af43-6ead57e9219a';
        const httpOptions = {
          headers: new HttpHeaders({
            'token': token
          })
        };
        const districtUrl = "https://online-gateway.ghn.vn/shiip/public-api/master-data/district";
    
        // Assuming you have the selectedProvinceId, you can use it in the request body
        const requestBody = {
          province_id: selectedProvinceId
        };
    
        this.http.post<District[]>(districtUrl, requestBody, httpOptions).subscribe(data => {
          this.districtDataSubject.next(data);
          console.log(data); // In ra dữ liệu quận/huyện
        });
      }
  
        public getWard(selectedDistrictId: number): void {
          const token = 'd6f64767-329b-11ee-af43-6ead57e9219a';
          const httpOptions = {
            headers: new HttpHeaders({
              'token': token
            })
          };
          const requestBody = {
            district_id : selectedDistrictId
          };
          
          const wardUrl = "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward";
      
          this.http.post<Ward[]>(wardUrl, requestBody, httpOptions).subscribe(data => {
            this.wardDataSubject.next(data);
            console.log(this.wardData$);
          });
        }
      

}
export interface Province {
    ProvinceID: number;
    ProvinceName: string;
    CountryID: number;
    Code: string;
  }

export interface District {
  DistrictID: number;
  ProvinceID: number;
  DistrictName: string;
}

export interface Ward {
  WardCode: number;
  DistrictID: number;
  WardName: string;
}