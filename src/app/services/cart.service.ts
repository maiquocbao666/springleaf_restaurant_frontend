import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { CartDetail } from '../interfaces/cart-detail';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cart } from '../interfaces/cart';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';
import { Ward } from '../interfaces/address/Ward';
import { District } from '../interfaces/address/District';
import { Province } from '../interfaces/address/Province';
import { Service } from '../interfaces/address/Service';

@Injectable({
  providedIn: 'root'
})
export class CartService extends BaseService<Cart> {

  //----------------------------------------------------------------------------------------------

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService,
    private http: HttpClient,
  ) {
    super(apiService, rxStompService, sweetAlertService);
    this.getDatasOfThisUserWorker = new Worker(new URL('../workers/user/user-call-all-apis.worker.ts', import.meta.url))
    this.subscribeToQueue();
  }

  //----------------------------------------------------------------------------------------------

  apisUrl = 'carts';
  cacheKey = 'carts';
  apiUrl = 'cart';
  cartsCache!: Cart[];
  getDatasOfThisUserWorker: Worker;

  // Province
  public provinceDataSubject = new BehaviorSubject<Province[]>([]);
  public provinceData$ = this.provinceDataSubject.asObservable();
  // District
  public districtDataSubject = new BehaviorSubject<District[]>([]);
  public districtData$: Observable<District[]> = this.districtDataSubject.asObservable();
  // form API
  public districtAPIDataSubject = new BehaviorSubject<District[]>([]);
  public districtAPIData$: Observable<District[]> = this.districtAPIDataSubject.asObservable();
  // Ward
  public wardDataSubject = new BehaviorSubject<Ward[]>([]);
  public wardData$: Observable<Ward[]> = this.wardDataSubject.asObservable();
  // from API
  public wardAPIDataSubject = new BehaviorSubject<Ward[]>([]);
  public wardAPIData$: Observable<Ward[]> = this.wardAPIDataSubject.asObservable();

  selectedProvinceId: number | null = null;
  selectedDistrictId: number | null = null;

  cartInfo: any[] = [];

  //----------------------------------------------------------------------------------------------

  getItemId(item: Cart): number {
    throw new Error('Method not implemented.');
  }

  getItemName(item: Cart): string {
    throw new Error('Method not implemented.');
  }

  getObjectName(): string {
    return "Cart";
  }

  getCache(): Observable<any[]> {
    return this.cache$;
  }

  //----------------------------------------------------------------------------------------------

  override subscribeToQueue(): void {
    super.subscribeToQueue();
  }

  override add(newCart: Cart): Observable<Cart> {
    return super.add(newCart);
  }

  override update(updated: Cart): Observable<any> {
    return super.update(updated);
  }

  //----------------------------------------------------------------------------------------------  

  setProvinceData(provinceData: Province[]): void {

    this.provinceDataSubject.next(provinceData);

  }

  getProvince(): void {

    this.getDatasOfThisUserWorker.postMessage({ type: 'provinces' });
    this.getDatasOfThisUserWorker.onmessage = (event) => {

      const dataMap = event.data;

      if (dataMap && dataMap.provinceResponse) {
        const provinceData: Province[] = dataMap.provinceResponse;
        this.setProvinceData(provinceData);
        localStorage.setItem('Provinces', JSON.stringify(dataMap.provinceResponse.data));
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

  setCartData(cart: any[]) {
    this.cartInfo = cart;
  }

  getCartData() {
    return this.cartInfo;
  }

}


