import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ProductDiscount } from '../interfaces/product-discounts';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class ProductDiscountService extends BaseService<ProductDiscount> {

    //--------------------------------------------------------------------------------------------------------

    apisUrl = 'productDiscounts';
    cacheKey = 'productDiscounts';
    apiUrl = 'productDiscount';

    //--------------------------------------------------------------------------------------------------------

    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService
    ) {
        super(apiService, rxStompService, sweetAlertService);
        this.subscribeToQueue();
    }

    //--------------------------------------------------------------------------------------------------------

    getItemId(item: ProductDiscount): number {
        return item.productDiscountId!;
    }

    getItemName(item: ProductDiscount): string {
        // Replace 'name' with the actual property of ProductDiscount that represents its name
        return '';
    }

    getObjectName(): string {
        return "ProductDiscount";
    }

    getCache(): Observable<any[]> {
        return this.cache$;
    }

    //--------------------------------------------------------------------------------------------------------

    override subscribeToQueue(): void {
        super.subscribeToQueue();
    }

    override add(newObject: ProductDiscount): Observable<ProductDiscount> {
        return super.add(newObject);
    }

    override update(updatedObject: ProductDiscount): Observable<ProductDiscount> {
        return super.update(updatedObject);
    }

    override delete(id: number): Observable<any> {
        return super.delete(id);
    }

    //--------------------------------------------------------------------------------------------------------


}
