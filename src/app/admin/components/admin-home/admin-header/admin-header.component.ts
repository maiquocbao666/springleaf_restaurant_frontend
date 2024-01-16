import { Component } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
declare var $: any;
@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent {
  user: User | null = null;
  userRoles : String = '';

  constructor(
    private authService: AuthenticationService,

  ) {

    this.authService.getUserCache().subscribe((data) => {
      this.user = data;
      console.log(this.user);
      // Cập nhật thông tin người dùng từ userCache khi có sự thay đổi
      if (this.user != null) {
      }
    });
  }

  ngOnInit() : void {
    this.checkRoles();
  }

  toggleNav() {
    document.documentElement.classList.toggle('openNav');

    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
      navToggle.classList.toggle('active');
    }
  }

  logOut() {
    // Cập nhật userCache trước khi đăng xuất
    this.authService.setUserCache(null);
    this.authService.logout();
  }

  truncateString(inputString: string): string {
    // Tìm vị trí của khoảng trắng đầu tiên từ bên phải
    const firstSpaceIndex = inputString.lastIndexOf(' ');

    if (firstSpaceIndex !== -1) {
      // Cắt chuỗi từ bên phải đến khoảng trắng đầu tiên
      return inputString.slice(firstSpaceIndex + 1);
    } else {
      // Trường hợp không có khoảng trắng
      return inputString;
    }
  }

  checkRoles(): void {

    this.authService.roleCacheData$.subscribe((data) => {
      console.log(data);
      if(data){
        const predefinedRoles = ['USER', 'MANAGER', 'ADMIN'];
        for (const role of predefinedRoles) {
          if (data.includes(role)) {
            this.userRoles = role;
            
          } else {
            // Nếu không tìm thấy, thoát vòng lặp
            break;
          }
        }

      }
      console.log(this.userRoles);
    });
  }
}

