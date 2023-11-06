
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Role } from '../interfaces/role';


@Injectable({
    providedIn: 'root'
})
export class RoleService {

    private rolesUrl = 'rolesUrl';
    private roleUrl = 'roleUrl';
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

    addRole(newRole: Role): Observable<Role> {

        return this.apiService.request<Role>('post', this.roleUrl, newRole).pipe(

            tap((addedRole: Role) => {

                this.rolesCache.push(addedRole);
                localStorage.setItem(this.rolesUrl, JSON.stringify(this.rolesCache));

            })

        );

    }

    updateRole(updatedrole: Role): Observable<any> {

        const url = `${this.roleUrl}/${updatedrole.roleId}`;

        return this.apiService.request('put', url, updatedrole).pipe(

            tap(() => {

                const index = this.rolesCache!.findIndex(role => role.roleId === updatedrole.roleId);

                if (index !== -1) {

                    this.rolesCache![index] = updatedrole;
                    localStorage.setItem(this.rolesUrl, JSON.stringify(this.rolesCache));

                }

            })

        );

    }


    deleteRole(id: number): Observable<any> {

        const url = `${this.roleUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.rolesCache.findIndex(role => role.roleId === id);

                if (index !== -1) {

                    this.rolesCache.splice(index, 1);
                    localStorage.setItem(this.rolesUrl, JSON.stringify(this.rolesCache));

                }

            })
        );

    }

}