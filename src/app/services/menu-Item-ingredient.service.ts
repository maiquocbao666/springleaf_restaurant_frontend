import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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



}