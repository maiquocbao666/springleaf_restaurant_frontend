import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { MenuItemIngredient } from '../interfaces/menu-item-ingredient';




@Injectable({
    providedIn: 'root'
})
export class MenuItemIngredientService {

    private menuItemIngredientsUrl = 'menuItemIngredients';
    menuItemIngredientsCache!: MenuItemIngredient[]; 

    constructor(private apiService: ApiService) { } 

    getMenuItemIngredients(): Observable<MenuItemIngredient[]> {
        
        if (this.menuItemIngredientsCache) {

            console.log("Có Inventorys cache");
            return of(this.menuItemIngredientsCache);
            
        }

        const menuItemIngredientsObservable = this.apiService.request<MenuItemIngredient[]>('get', this.menuItemIngredientsUrl);

        
        menuItemIngredientsObservable.subscribe(data => {

            this.menuItemIngredientsCache = data; 

        });

        return menuItemIngredientsObservable;

    }

    addMenuItemIngredient(newMenuItemIngredient: MenuItemIngredient): Observable<MenuItemIngredient> {

        return this.apiService.request<MenuItemIngredient>('post', this.menuItemIngredientsUrl, newMenuItemIngredient).pipe(

            tap((addedMenuItemIngredient: MenuItemIngredient) => {

                this.menuItemIngredientsCache.push(addedMenuItemIngredient);
                localStorage.setItem(this.menuItemIngredientsUrl, JSON.stringify(this.menuItemIngredientsCache));

            })

        );

    }

    updateMenuItemIngredient(updatedMenuItemIngredient: MenuItemIngredient): Observable<any> {

        const url = `${this.menuItemIngredientsUrl}/${updatedMenuItemIngredient.menuItemIngredientId}`;

        return this.apiService.request('put', url, updatedMenuItemIngredient).pipe(

            tap(() => {

                const index = this.menuItemIngredientsCache!.findIndex(ienuItemIngredient => ienuItemIngredient.menuItemIngredientId === updatedMenuItemIngredient.menuItemIngredientId);

                if (index !== -1) {

                    this.menuItemIngredientsCache![index] = updatedMenuItemIngredient;
                    localStorage.setItem(this.menuItemIngredientsUrl, JSON.stringify(this.menuItemIngredientsCache));

                }

            })

        );

    }

}