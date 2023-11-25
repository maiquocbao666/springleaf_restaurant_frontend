import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Cart } from '../interfaces/cart';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartsUrl = 'carts';
  private cartUrl = 'cart';
  cartsCache!: Cart[];
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

  constructor(private apiService: ApiService, private http: HttpClient, private ngZone: NgZone) {

    this.getDatasOfThisUserWorker = new Worker(new URL('../workers/user/user-call-all-apis.worker.ts', import.meta.url));

  }

  gets(): Observable<Cart[]> {

    if (this.cartsCache) {

      return of(this.cartsCache);

    }

    const cartsObservable = this.apiService.request<Cart[]>('get', this.cartsUrl);


    cartsObservable.subscribe(data => {

      this.cartsCache = data;

    });

    return cartsObservable;
  }

  getById(id: number): Observable<Cart> {

    if (!this.cartsCache) {

      this.gets();

    }

    const cartFromCache = this.cartsCache.find(cart => cart.orderId === id);

    if (cartFromCache) {

      return of(cartFromCache);

    } else {

      const url = `${this.cartUrl}/${id}`;
      return this.apiService.request<Cart>('get', url);

    }

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

    const requestBody = {

      province_id: selectedProvinceId

    };

    this.http.post<District[]>(districtUrl, requestBody, httpOptions).subscribe(data => {

      this.districtDataSubject.next(data);
      console.log(data);

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

      district_id: selectedDistrictId

    };

    const wardUrl = "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward";

    this.http.post<Ward[]>(wardUrl, requestBody, httpOptions).subscribe(data => {

      this.wardDataSubject.next(data);
      console.log(this.wardData$);

    });

  }

  delete(id: number): Observable<any> {

    const url = `${this.cartUrl}/${id}`;

    return this.apiService.request('delete', url).pipe(

      tap(() => {

        const index = this.cartsCache.findIndex(cart => cart.orderId === id);

        if (index !== -1) {

          this.cartsCache.splice(index, 1);
          localStorage.setItem(this.cartsUrl, JSON.stringify(this.cartsCache));

        }

      })
    );

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
