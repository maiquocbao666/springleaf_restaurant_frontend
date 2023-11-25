import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Role } from '../interfaces/role';

@Injectable({
    providedIn: 'root'
})
export class RoleService {

    private rolesUrl = 'roles';
    private roleUrl = 'role';
    private rolesCacheSubject = new BehaviorSubject<Role[]>([]);
    rolesCache$ = this.rolesCacheSubject.asObservable();

    constructor(private apiService: ApiService) { }

    get rolesCache(): Role[] {
        return this.rolesCacheSubject.value;
    }

    set rolesCache(value: Role[]) {
        this.rolesCacheSubject.next(value);
    }

    private updateCache(updatedRole: Role): void {
        const index = this.rolesCache.findIndex(role => role.roleId === updatedRole.roleId);
        if (index !== -1) {
            const updatedCache = [...this.rolesCache];
            updatedCache[index] = updatedRole;
            this.rolesCache = updatedCache;
        }
    }

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

    private isRoleNameInCache(name: string): boolean {
        return !!this.rolesCache?.find(role => role.roleName.toLowerCase() === name.toLowerCase());
    }

    addRole(newRole: Role): Observable<Role> {

        if (this.isRoleNameInCache(newRole.roleName)) {
            return of();
        }

        return this.apiService.request<Role>('post', this.roleUrl, newRole).pipe(
            tap((addedRole: Role) => {
                this.rolesCache = [...this.rolesCache, addedRole];
            })
        );
    }

    updateRole(updatedRole: Role): Observable<any> {

        if (this.isRoleNameInCache(updatedRole.roleName)) {
            return of();
        }

        const url = `${this.roleUrl}/${updatedRole.roleId}`;

        return this.apiService.request('put', url, updatedRole).pipe(
            tap(() => {
                this.updateCache(updatedRole);
            })
        );
    }

    deleteRole(id: number): Observable<any> {

        const url = `${this.roleUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(
            tap(() => {
                const updatedCache = this.rolesCache.filter(role => role.roleId !== id);
                this.rolesCache = updatedCache;
            })
        );

    }
}