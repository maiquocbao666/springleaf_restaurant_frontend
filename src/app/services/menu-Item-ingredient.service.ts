import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { MenuItemIngredient } from '../interfaces/menu-item-ingredient';




@Injectable({
    providedIn: 'root'
})
export class MenuItemIngredientService {

    private menuItemIngredientsUrl = 'menuItemIngredients'; // URL to web api, không cần thêm base URL
    menuItemIngredientsCache!: MenuItemIngredient[]; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getMenuItemIngredients(): Observable<MenuItemIngredient[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.menuItemIngredientsCache) {
            console.log("Có Inventorys cache");
            return of(this.menuItemIngredientsCache);
        }

        const menuItemIngredientsObservable = this.apiService.request<MenuItemIngredient[]>('get', this.menuItemIngredientsUrl);

        // Cache the categories observable
        menuItemIngredientsObservable.subscribe(data => {
            this.menuItemIngredientsCache = data; // Store the fetched data in the cache
        });

        return menuItemIngredientsObservable;
    }



}