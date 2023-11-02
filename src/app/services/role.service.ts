
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Role } from '../interfaces/role';


@Injectable({
    providedIn: 'root'
})
export class RoleService {

    private rolesUrl = 'roles'; // URL to web api, không cần thêm base URL
    rolesCache!: Role[]; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getRoles(): Observable<Role[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.rolesCache) {
            return of(this.rolesCache);
        }

        const rolesObservable = this.apiService.request<Role[]>('get', this.rolesUrl);

        // Cache the categories observable
        rolesObservable.subscribe(data => {
            this.rolesCache = data; // Store the fetched data in the cache
        });

        return rolesObservable;
    }



}