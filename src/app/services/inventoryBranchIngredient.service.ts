import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';
import { InventoryBranchIngredient } from '../interfaces/inventoryBranch-ingredient';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class InventoryBranchIngredientService extends BaseService<InventoryBranchIngredient> { // Đổi tên class thành InventoryBranchIngredientService

    //------------------------------------------------------------------------------------------------

    apisUrl = 'inventoryBranchIngredients'; // Thay thế tên APIs tương ứng
    cacheKey = 'inventoryBranchIngredients'; // Thay thế tên cache key tương ứng
    apiUrl = 'inventoryBranchIngredient'; // Thay thế tên API tương ứng

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

    getItemId(item: InventoryBranchIngredient): number { // Thay thế tên kiểu dữ liệu của tham số và giá trị trả về
        return item.inventoryBranchIngredientId!; // Thay thế trường tương ứng trong đối tượng
    }

    getItemName(item: InventoryBranchIngredient): string { // Thay thế tên kiểu dữ liệu của tham số và giá trị trả về
        throw new Error('Method not implemented.');
    }

    getObjectName(): string {
        return "InventoryBranchIngredient"; // Thay thế tên đối tượng
    }
    getCache(): Observable<any[]> {
        return this.cache$;
    }

    //------------------------------------------------------------------------------------------------

    override subscribeToQueue(): void {
        super.subscribeToQueue();
    }

    override add(newObject: InventoryBranchIngredient): Observable<InventoryBranchIngredient> { // Thay thế tên kiểu dữ liệu của tham số và giá trị trả về
        return super.add(newObject);
    }

    override update(updatedObject: InventoryBranchIngredient): Observable<InventoryBranchIngredient> { // Thay thế tên kiểu dữ liệu của tham số và giá trị trả về
        return super.update(updatedObject);
    }

    override delete(id: number): Observable<any> {
        return super.delete(id);
    }

    //------------------------------------------------------------------------------------------------

}
