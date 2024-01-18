import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';
import { UserRole } from '../interfaces/user-role';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService extends BaseService<UserRole> {

  //----------------------------------------------------------------------------------------------------------------

  apisUrl = 'userRoles';
  cacheKey = 'userRoles';
  apiUrl = 'userRole';

  //----------------------------------------------------------------------------------------------------------------

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
    this.subscribeToQueue();
  }

  //----------------------------------------------------------------------------------------------------------------

  getItemId(item: UserRole): number {
    return item.userRoleId!;
  }

  getItemName(item: UserRole): string {
    return "";
  }

  getObjectName(): string {
    return "UserRole";
  }

  getCache(): Observable<any[]> {
    return this.cache$;
  }

  //----------------------------------------------------------------------------------------------------------------

  override subscribeToQueue(): void {
    super.subscribeToQueue();
  }

  override add(newObject: UserRole): Observable<UserRole> {
    return super.add(newObject);
  }

  override update(updatedObject: UserRole): Observable<UserRole> {
    return super.update(updatedObject);
  }

  override delete(id: number): Observable<any> {
    return super.delete(id);
  }

  //----------------------------------------------------------------------------------------------------------------

}
