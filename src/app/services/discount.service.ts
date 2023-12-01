import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';
import { Discount } from '../interfaces/discount';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class DiscountService extends BaseService<Discount>  {

    apisUrl = 'discounts';
    cacheKey = 'discounts';
    apiUrl = 'discount';

    //-----------------------------------------------------------------------------------------

    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService
    ) {
        super(apiService, rxStompService, sweetAlertService);
        this.subscribeToQueue();
    }

    //-----------------------------------------------------------------------------------------
    override getItemId(item: Discount): string | number {
        return item.discountId!;
    }
    override getItemName(item: Discount): string {
        throw new Error('Method not implemented.');
    }
    override subscribeToQueue(): void {
        super.subscribeToQueue();
    }

    getObjectName(): string {
        return 'Discounts';
    }

    getCache(): Observable<any[]> {
        return this.cache$;
    }

    //-----------------------------------------------------------------------------------------

    override add(newDiscount: Discount): Observable<Discount> {
        return super.add(newDiscount);
    }

    override update(updated: Discount): Observable<any> {
        return super.update(updated);
    }

    override delete(id: number): Observable<any> {
        return super.delete(id);
    }

    getDiscountById(discountCode: number, menuItemId: [] | null = null){
        const jwtToken = localStorage.getItem('access_item');
        if (!jwtToken) {
            of(null);
         }
         
         const customHeader = new HttpHeaders({
           'Authorization': `Bearer ${jwtToken}`,
         });
        this.apiService.request<any>('post', `getDiscountByMenuItem/${discountCode}`, menuItemId, customHeader);
    }

}