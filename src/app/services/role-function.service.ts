
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { RoleFunction } from '../interfaces/role-function';


@Injectable({
    providedIn: 'root'
})
export class RoleFunctionService {

    private RoleFunctionsUrl = 'roleFunctions'; // URL to web api, không cần thêm base URL
    roleFunctionsCache!: RoleFunction[]; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getRoleFunctions(): Observable<RoleFunction[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.roleFunctionsCache) {
            return of(this.roleFunctionsCache);
        }

        const RoleFunctionsObservable = this.apiService.request<RoleFunction[]>('get', this.RoleFunctionsUrl);

        // Cache the categories observable
        RoleFunctionsObservable.subscribe(data => {
            this.roleFunctionsCache = data; // Store the fetched data in the cache
        });

        return RoleFunctionsObservable;
    }



}