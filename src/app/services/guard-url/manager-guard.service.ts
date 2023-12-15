import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { ToastService } from '../toast.service';

@Injectable({
  providedIn: 'root',
})
export class ManagerGuardService implements CanActivate {

  roles: String[] | null = null;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toast: ToastService,
  ) {
  }

  checkRoles(): string | null {

    this.authService.roleCacheData$.subscribe((data) => {
      this.roles = data;
      console.log(this.roles);
    });

    if (!this.roles) {
      // alert("Bạn không có quyền truy cập url này");
      this.toast.showTimedAlert('403', 'Bạn không có quyền truy cập', 'error', 1500);
      return "403";
    }

    // Ensure that this.roles is not null before using the includes method
    if (this.roles && this.roles.length > 0) {
      const predefinedRoles = ['USER', 'MANAGER', 'ADMIN'];
      let foundRole: string | null = null;

      for (const role of predefinedRoles) {
        if (this.roles.includes(role)) {
          foundRole = role;
        } else {
          // Nếu không tìm thấy, thoát vòng lặp
          break;
        }
      }

      if (foundRole) {
        console.log(foundRole);
        return foundRole;
      }

      console.log('USER');
      // Mặc định trả về 'USER' nếu không có role nào khớp
      return '403';
    } else {
      // Handle the case where this.roles is null or empty
      this.toast.showTimedAlert('403', 'Bạn không có quyền truy cập', 'error', 1500);
      console.log('No roles available');
      return "403";
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const url: string = state.url;
    // Sử dụng biểu thức chính quy để kiểm tra xem đường dẫn có bắt đầu bằng '/manager' hay không
    const isManagerRoute: boolean = /^\/manager(?:\/|$)/.test(url);

    if (isManagerRoute) {
      // Nếu là đường dẫn bắt đầu bằng '/admin', cho phép truy cập
      let checked = true;
      //checked = this.checkRoles();
      // Kiểm tra role được trả ra từ hàm check Role
      // Nếu có quyền ADMIN hoặc MANAGER sẽ được cấp quyền truy cập
      let roleCheck = this.checkRoles();
      if(roleCheck === "ADMIN" || roleCheck === "MANAGER"){
        checked = true;
      }else{
        checked = false;
      }
      
      if (checked === false) {
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