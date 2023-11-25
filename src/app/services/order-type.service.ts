import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { OrderType } from './../interfaces/order-type';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OrderTypeService {

    private orderTypesUrl = 'orderTypes';
    private orderTypeUrl = 'orderType';

    // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
    private orderTypesCacheSubject = new BehaviorSubject<OrderType[]>([]);
    orderTypesCache$ = this.orderTypesCacheSubject.asObservable();

    constructor(private apiService: ApiService) { }

    get orderTypesCache(): OrderType[] {
        return this.orderTypesCacheSubject.value;
    }

    set orderTypesCache(value: OrderType[]) {
        this.orderTypesCacheSubject.next(value);
    }

    getOrderTypes(): Observable<OrderType[]> {

        if (this.orderTypesCache) {
            return of(this.orderTypesCache);
        }

        const orderTypesObservable = this.apiService.request<OrderType[]>('get', this.orderTypesUrl);

        orderTypesObservable.subscribe(data => {
            this.orderTypesCache = data;
        });

        return orderTypesObservable;

    }

    private isOrderTypeNameInCache(name: string): boolean {
        const isTrue = !!this.orderTypesCache?.find(orderType => orderType.name.toLowerCase() === name.toLowerCase());
        if (isTrue) {
            console.log('Kiểu order này đã tồn tại trong cache.');
            return isTrue;
        } else {
            return isTrue;
        }
    }

    addOrderType(newOrderType: OrderType): Observable<OrderType> {

        if (this.isOrderTypeNameInCache(newOrderType.name)) {
            return of();
        }

        return this.apiService.request<OrderType>('post', this.orderTypeUrl, newOrderType).pipe(

            tap((addedOrderType: OrderType) => {

                this.orderTypesCache = [...this.orderTypesCache, addedOrderType];
                localStorage.setItem(this.orderTypesUrl, JSON.stringify(this.orderTypesCache));

            })

        );

    }

    updateOrderType(updatedOrderType: OrderType): Observable<any> {

        if (this.isOrderTypeNameInCache(updatedOrderType.name)) {
            return of();
        }

        const url = `${this.orderTypeUrl}/${updatedOrderType.orderTypeId}`;

        return this.apiService.request('put', url, updatedOrderType).pipe(

            tap(() => {

                this.updateOrderTypeCache(updatedOrderType);

                const index = this.orderTypesCache!.findIndex(orderType => orderType.orderTypeId === updatedOrderType.orderTypeId);

                if (index !== -1) {

                    this.orderTypesCache![index] = updatedOrderType;
                    localStorage.setItem(this.orderTypesUrl, JSON.stringify(this.orderTypesCache));

                }

            })

        );

    }

    updateOrderTypeCache(updatedOrderType: OrderType): void {

        if (this.orderTypesCache) {

            const index = this.orderTypesCache.findIndex(orderType => orderType.orderTypeId === updatedOrderType.orderTypeId);

            if (index !== -1) {

                this.orderTypesCache[index] = updatedOrderType;

            }

        }

    }

    deleteOrderType(id: number): Observable<any> {

        const url = `${this.orderTypeUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.orderTypesCache.findIndex(orderType => orderType.orderTypeId === id);

                if (index !== -1) {

                    this.orderTypesCache.splice(index, 1);
                    localStorage.setItem(this.orderTypesUrl, JSON.stringify(this.orderTypesCache));

                }

            })
        );

    }
}