import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { User } from '../interfaces/user';
import { Role } from '../interfaces/role';

@Injectable({
    providedIn: 'root',
})
export class AdminGuardService implements CanActivate {

    roles: String[] | null = null;

    constructor(private authService: AuthenticationService, private router: Router) {
    }

    checkRoles(): boolean {

        this.authService.roleCacheData$.subscribe((data) => {
            this.roles = data;
            console.log(this.roles);
        });

        if(!this.roles){
            alert("Tính làm gì vậy anh bạn bruh");
            return false;
        }

        // Ensure that this.roles is not null before using the includes method
        if (this.roles && this.roles.length > 0) {
          const isAdminOrManager = this.roles.includes('ADMIN') || this.roles.includes('MANAGER');
      
          if (isAdminOrManager) {
            console.log('Có vai trò ADMIN hoặc MANAGER');
            return true;
          } else {
            alert("Tính làm gì vậy anh bạn bruh");
            console.log('Không có vai trò ADMIN hoặc MANAGER');
            return false;
          }
        } else {
          // Handle the case where this.roles is null or empty
          console.log('No roles available');
          return false;
        }
      }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const url: string = state.url;
        // Sử dụng biểu thức chính quy để kiểm tra xem đường dẫn có bắt đầu bằng '/admin' hay không
        const isAdminRoute: boolean = /^\/admin(?:\/|$)/.test(url);

        if (isAdminRoute) {
            // Nếu là đường dẫn bắt đầu bằng '/admin', cho phép truy cập
            let checked = true;
            checked = this.checkRoles();
            if(checked === false){
                this.router.navigate(['/user/index']);
            }
            return checked;
        } else {
            // Nếu không phải, bạn có thể chuyển hướng hoặc xử lý theo logic của mình
            console.log('Access denied to non-admin route');
            return true;
        }
    }
}