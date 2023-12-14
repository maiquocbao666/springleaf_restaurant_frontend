import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { MenuItemIngredient } from '../interfaces/menu-item-ingredient';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class MenuItemIngredientService extends BaseService<MenuItemIngredient> {

    //------------------------------------------------------------------------------------------------

    apisUrl = 'menuItemIngredients';
    cacheKey = 'menuItemIngredients';
    apiUrl = 'menuItemIngredient';

    //------------------------------------------------------------------------------------------------

    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService
    ) {
        super(apiService, rxStompService, sweetAlertService);
        this.subscribeToQueue();
    }

    //------------------------------------------------------------------------------------------------

    getItemId(item: MenuItemIngredient): number {
        return item.menuItemIngredientId!;
    }

    getItemName(item: MenuItemIngredient): string {
        throw new Error('Method not implemented.');
    }

    getObjectName(): string {
        return "MenuItemIngredient";
    }
    getCache(): Observable<any[]> {
        return this.cache$;
    }

    //------------------------------------------------------------------------------------------------

    override subscribeToQueue(): void {
        super.subscribeToQueue();
    }

    override add(newObject: MenuItemIngredient): Observable<MenuItemIngredient> {
        return super.add(newObject);
    }

    override update(updatedObject: MenuItemIngredient): Observable<MenuItemIngredient> {
        return super.update(updatedObject);
    }

    override delete(id: number): Observable<any> {
        return super.delete(id);
    }

    override searchByName(term: string): Observable<MenuItemIngredient[]> {
        return super.searchByName(term);
    }

    override sortEntities(entities: MenuItemIngredient[], field: keyof MenuItemIngredient, ascending: boolean): Observable<MenuItemIngredient[]> {
        return super.sortEntities(entities, field, ascending);
    }

    //------------------------------------------------------------------------------------------------


}