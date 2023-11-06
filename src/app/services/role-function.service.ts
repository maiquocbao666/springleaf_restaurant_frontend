
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { RoleFunction } from '../interfaces/role-function';


@Injectable({
    providedIn: 'root'
})
export class RoleFunctionService {

    private roleFunctionsUrl = 'roleFunctionsUrl';
    private roleFunctionUrl = 'roleFunctionUrl';
    roleFunctionsCache!: RoleFunction[];

    constructor(private apiService: ApiService) { }


    getRoleFunctions(): Observable<RoleFunction[]> {

        if (this.roleFunctionsCache) {

            return of(this.roleFunctionsCache);

        }

        const RoleFunctionsObservable = this.apiService.request<RoleFunction[]>('get', this.roleFunctionsUrl);


        RoleFunctionsObservable.subscribe(data => {

            this.roleFunctionsCache = data;

        });

        return RoleFunctionsObservable;

    }

    addRoleFunction(newRoleFunction: RoleFunction): Observable<RoleFunction> {

        return this.apiService.request<RoleFunction>('post', this.roleFunctionUrl, newRoleFunction).pipe(

            tap((addedRoleFunction: RoleFunction) => {

                this.roleFunctionsCache.push(addedRoleFunction);
                localStorage.setItem(this.roleFunctionsUrl, JSON.stringify(this.roleFunctionsCache));

            })

        );

    }

    updateRoleFunction(updatedroleFunction: RoleFunction): Observable<any> {

        const url = `${this.roleFunctionUrl}/${updatedroleFunction.roleFunctionId}`;

        return this.apiService.request('put', url, updatedroleFunction).pipe(

            tap(() => {

                const index = this.roleFunctionsCache!.findIndex(roleFunction => roleFunction.roleFunctionId === updatedroleFunction.roleFunctionId);

                if (index !== -1) {

                    this.roleFunctionsCache![index] = updatedroleFunction;
                    localStorage.setItem(this.roleFunctionsUrl, JSON.stringify(this.roleFunctionsCache));

                }

            })

        );

    }

    deleteRoleFunction(id: number): Observable<any> {

        const url = `${this.roleFunctionUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.roleFunctionsCache.findIndex(roleFunction => roleFunction.roleFunctionId === id);

                if (index !== -1) {

                    this.roleFunctionsCache.splice(index, 1);
                    localStorage.setItem(this.roleFunctionsUrl, JSON.stringify(this.roleFunctionsCache));

                }

            })
        );

    }

}