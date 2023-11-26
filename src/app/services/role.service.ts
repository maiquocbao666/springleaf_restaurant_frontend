import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Role } from '../interfaces/role';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class RoleService extends BaseService<Role> {

    apisUrl = 'roles';
    cacheKey = 'roles';
    apiUrl = 'role';



    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService
    ) {
        super(apiService, rxStompService, sweetAlertService);
    }

   

    override gets(): Observable<Role[]> {
        return super.gets();
    }

    override getById(id: number): Observable<Role | null> {
        return super.getById(id);
    }

    override add(newObject: Role): Observable<Role> {
        return super.add(newObject);
    }

    override update(updatedObject: Role): Observable<Role> {
        return super.update(updatedObject);
    }

    override delete(id: number): Observable<Role> {
        return super.delete(id);
    }

    override searchByName(term: string): Observable<Role[]> {
        return super.searchByName(term);
    }

    override getItemId(item: Role): number {
        return item.roleId!;
    }

    override getItemName(item: Role): string {
        return item.roleName;
    }

    override getObjectName(): string {
        return "Role";
    }

    // private updateCache(updatedRole: Role): void {
    //     const index = this.rolesCache.findIndex(role => role.roleId === updatedRole.roleId);
    //     if (index !== -1) {
    //         const updatedCache = [...this.rolesCache];
    //         updatedCache[index] = updatedRole;
    //         this.rolesCache = updatedCache;
    //     }
    // }

    // private isRoleNameInCache(name: string): boolean {
    //     return !!this.rolesCache?.find(role => role.roleName.toLowerCase() === name.toLowerCase());
    // }

}