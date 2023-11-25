import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { MenuItemIngredient } from '../interfaces/menu-item-ingredient';

@Injectable({
    providedIn: 'root'
})
export class MenuItemIngredientService {

    private menuItemIngredientsUrl = 'menuItemIngredients';
    private menuItemIngredientUrl = 'menuItemIngredient';

    // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
    private menuItemIngredientsCacheSubject = new BehaviorSubject<MenuItemIngredient[]>([]);
    menuItemIngredientsCache$ = this.menuItemIngredientsCacheSubject.asObservable();

    constructor(private apiService: ApiService) { }

    get menuItemIngredientsCache(): MenuItemIngredient[] {
        return this.menuItemIngredientsCacheSubject.value;
    }

    set menuItemIngredientsCache(value: MenuItemIngredient[]) {
        this.menuItemIngredientsCacheSubject.next(value);
    }

    gets(): Observable<MenuItemIngredient[]> {

        if (this.menuItemIngredientsCache) {
            return of(this.menuItemIngredientsCache);
        }

        const menuItemIngredientsObservable = this.apiService.request<MenuItemIngredient[]>('get', this.menuItemIngredientsUrl);

        menuItemIngredientsObservable.subscribe(data => {
            this.menuItemIngredientsCache = data;
        });

        return menuItemIngredientsObservable;

    }

    add(newMenuItemIngredient: MenuItemIngredient): Observable<MenuItemIngredient> {

        return this.apiService.request<MenuItemIngredient>('post', this.menuItemIngredientUrl, newMenuItemIngredient).pipe(

            tap((addedMenuItemIngredient: MenuItemIngredient) => {

                this.menuItemIngredientsCache = [...this.menuItemIngredientsCache, addedMenuItemIngredient];
                localStorage.setItem(this.menuItemIngredientsUrl, JSON.stringify(this.menuItemIngredientsCache));

            })

        );

    }

    update(updatedMenuItemIngredient: MenuItemIngredient): Observable<any> {

        const url = `${this.menuItemIngredientUrl}/${updatedMenuItemIngredient.menuItemIngredientId}`;

        return this.apiService.request('put', url, updatedMenuItemIngredient).pipe(

            tap(() => {

                this.updateCache(updatedMenuItemIngredient);

                const index = this.menuItemIngredientsCache!.findIndex(itemIngredient => itemIngredient.menuItemIngredientId === updatedMenuItemIngredient.menuItemIngredientId);

                if (index !== -1) {

                    this.menuItemIngredientsCache![index] = updatedMenuItemIngredient;
                    localStorage.setItem(this.menuItemIngredientsUrl, JSON.stringify(this.menuItemIngredientsCache));

                }

            })

        );

    }

    updateCache(updatedMenuItemIngredient: MenuItemIngredient): void {

        if (this.menuItemIngredientsCache) {

            const index = this.menuItemIngredientsCache.findIndex(itemIngredient => itemIngredient.menuItemIngredientId === updatedMenuItemIngredient.menuItemIngredientId);

            if (index !== -1) {

                this.menuItemIngredientsCache[index] = updatedMenuItemIngredient;

            }

        }

    }

    delete(id: number): Observable<any> {

        const url = `${this.menuItemIngredientUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.menuItemIngredientsCache.findIndex(itemIngredient => itemIngredient.menuItemIngredientId === id);

                if (index !== -1) {

                    this.menuItemIngredientsCache.splice(index, 1);
                    localStorage.setItem(this.menuItemIngredientsUrl, JSON.stringify(this.menuItemIngredientsCache));

                }

            })
        );

    }
}