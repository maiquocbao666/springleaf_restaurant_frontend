
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Role } from '../interfaces/role';


@Injectable({
    providedIn: 'root'
})
export class RoleService {

    private rolesUrl = 'roles';
    rolesCache!: Role[];

    constructor(private apiService: ApiService) { }

   
    getRoles(): Observable<Role[]> {
        
        if (this.rolesCache) {

            return of(this.rolesCache);

        }

        const rolesObservable = this.apiService.request<Role[]>('get', this.rolesUrl);

        rolesObservable.subscribe(data => {

            this.rolesCache = data; 

        });

        return rolesObservable;
        
    }



}