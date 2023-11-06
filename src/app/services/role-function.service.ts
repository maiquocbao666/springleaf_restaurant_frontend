
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { RoleFunction } from '../interfaces/role-function';


@Injectable({
    providedIn: 'root'
})
export class RoleFunctionService {

    private RoleFunctionsUrl = 'roleFunctions';
    roleFunctionsCache!: RoleFunction[];

    constructor(private apiService: ApiService) { }

   
    getRoleFunctions(): Observable<RoleFunction[]> {
        
        if (this.roleFunctionsCache) {

            return of(this.roleFunctionsCache);

        }

        const RoleFunctionsObservable = this.apiService.request<RoleFunction[]>('get', this.RoleFunctionsUrl);

        
        RoleFunctionsObservable.subscribe(data => {

            this.roleFunctionsCache = data;

        });

        return RoleFunctionsObservable;
        
    }

    addRoleFunction(newRoleFunction: RoleFunction): Observable<RoleFunction> {

        return this.apiService.request<RoleFunction>('post', this.RoleFunctionsUrl, newRoleFunction).pipe(

            tap((addedRoleFunction: RoleFunction) => {

                this.roleFunctionsCache.push(addedRoleFunction);
                localStorage.setItem(this.RoleFunctionsUrl, JSON.stringify(this.roleFunctionsCache));

            })

        );

    }

}