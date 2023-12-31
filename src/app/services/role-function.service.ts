
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { RoleFunction } from '../interfaces/role-function';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';


@Injectable({
    providedIn: 'root'
})
export class RoleFunctionService extends BaseService<RoleFunction> {

    apisUrl = 'roleFunctions';
    cacheKey = 'roleFunctions';
    apiUrl = 'roleFunction';


    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService
    ) {
        super(apiService, rxStompService, sweetAlertService);
    }


    getCache(): Observable<any[]> {
        return this.cache$;
    }

    override add(newObject: RoleFunction): Observable<RoleFunction> {
        return super.add(newObject);
    }

    override update(updatedObject: RoleFunction): Observable<RoleFunction> {
        return super.update(updatedObject);
    }

    override delete(id: number): Observable<any> {
        return super.delete(id);
    }

    // override searchByName(term: string): Observable<RoleFunction[]> {
    //     return super.searchByName(term);
    // }

    override getItemId(item: RoleFunction): number {
        return item.roleFunctionId!;
    }

    override getItemName(item: RoleFunction): string {
        throw new Error('Method not implemented.');
    }

    override getObjectName(): string {
        return "RoleFunction";
    }
}
