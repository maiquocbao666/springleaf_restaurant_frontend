import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { OrderThreshold } from './../interfaces/order-threshold';

@Injectable({
    providedIn: 'root'
})
export class OrderThresholdService {

    private orderThresholdsUrl = 'orderThresholds';
    private orderThresholdUrl = 'orderThreshold';
    
    // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
    private orderThresholdsCacheSubject = new BehaviorSubject<OrderThreshold[]>([]);
    orderThresholdsCache$ = this.orderThresholdsCacheSubject.asObservable();

    constructor(private apiService: ApiService) { }

    get orderThresholdsCache(): OrderThreshold[] {
        return this.orderThresholdsCacheSubject.value;
    }

    set orderThresholdsCache(value: OrderThreshold[]) {
        this.orderThresholdsCacheSubject.next(value);
    }

    gets(): Observable<OrderThreshold[]> {

        if (this.orderThresholdsCache) {
            return of(this.orderThresholdsCache);
        }

        const orderThresholdsObservable = this.apiService.request<OrderThreshold[]>('get', this.orderThresholdsUrl);

        orderThresholdsObservable.subscribe(data => {
            this.orderThresholdsCache = data;
        });

        return orderThresholdsObservable;

    }

    add(newOrderThreshold: OrderThreshold): Observable<OrderThreshold> {

        return this.apiService.request<OrderThreshold>('post', this.orderThresholdUrl, newOrderThreshold).pipe(

            tap((addedOrderThreshold: OrderThreshold) => {

                this.orderThresholdsCache = [...this.orderThresholdsCache, addedOrderThreshold];
                localStorage.setItem(this.orderThresholdsUrl, JSON.stringify(this.orderThresholdsCache));

            })

        );

    }

    update(updatedOrderThreshold: OrderThreshold): Observable<any> {

        const url = `${this.orderThresholdUrl}/${updatedOrderThreshold.orderThresholdId}`;

        return this.apiService.request('put', url, updatedOrderThreshold).pipe(

            tap(() => {

                this.updateCache(updatedOrderThreshold);

                const index = this.orderThresholdsCache!.findIndex(threshold => threshold.orderThresholdId === updatedOrderThreshold.orderThresholdId);

                if (index !== -1) {

                    this.orderThresholdsCache![index] = updatedOrderThreshold;
                    localStorage.setItem(this.orderThresholdsUrl, JSON.stringify(this.orderThresholdsCache));

                }

            })

        );

    }

    updateCache(updatedOrderThreshold: OrderThreshold): void {

        if (this.orderThresholdsCache) {

            const index = this.orderThresholdsCache.findIndex(threshold => threshold.orderThresholdId === updatedOrderThreshold.orderThresholdId);

            if (index !== -1) {

                this.orderThresholdsCache[index] = updatedOrderThreshold;

            }

        }

    }

    delete(id: number): Observable<any> {

        const url = `${this.orderThresholdUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.orderThresholdsCache.findIndex(threshold => threshold.orderThresholdId === id);

                if (index !== -1) {

                    this.orderThresholdsCache.splice(index, 1);
                    localStorage.setItem(this.orderThresholdsUrl, JSON.stringify(this.orderThresholdsCache));

                }

            })
        );

    }
}