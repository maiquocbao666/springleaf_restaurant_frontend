import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Restaurant } from '../interfaces/restaurant';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class RestaurantService extends BaseService<Restaurant> {

    //----------------------------------------------------------------------------------------------------------------------

    apisUrl = 'restaurants';
    cacheKey = 'restaurants';
    apiUrl = 'restaurant';

    //-----------------------------------------------------------------------------------------------------------------------

    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService
    ) {
        super(apiService, rxStompService, sweetAlertService);
    }

    //--------------------------------------------------------------------------------------------------------------------------

    getItemId(item: Restaurant): number {
        return item.restaurantId!;
    }

    getItemName(item: Restaurant): string {
        return item.restaurantName;
    }

    getObjectName(): string {
        return "Restaurant";
    }

    getCache(): Observable<any[]> {
        return this.cache$;
    }

    //--------------------------------------------------------------------------------------------------------------------------

    override add(newObject: Restaurant): Observable<Restaurant> {
        return super.add(newObject);
    }

    override update(updatedObject: Restaurant): Observable<Restaurant> {
        return super.update(updatedObject);
    }

    override delete(id: number): Observable<any> {
        return super.delete(id);
    }

    override searchByName(term: string): Observable<Restaurant[]> {
        return super.searchByName(term);
    }

    //----------------------------------------------------------------------------------------------------------------------------

    // private isInCache(name: string, idToExclude: number | null = null): boolean {
    //     const isInCache = this.restaurantsCache?.some(
    //         (cache) =>
    //             cache.restaurantName.toLowerCase() === name.toLowerCase() && cache.restaurantId !== idToExclude
    //     );

    //     if (isInCache) {
    //         console.log("Restaurant này đã có rồi");
    //     }

    //     return isInCache || false;
    // }

}