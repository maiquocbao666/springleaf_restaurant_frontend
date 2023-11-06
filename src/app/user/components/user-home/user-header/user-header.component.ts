import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from 'src/app/components/login/login.component';
import { ProfileComponent } from 'src/app/components/profile/profile.component';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent {
  navbarfixed: boolean = false; // Hiện header
  scrollCounter: number = 0;
  previousScrollY = 0;
  user: User | null = null;
  isMobile: boolean = false;
  isTablet: boolean = false;
  isLaptop: boolean = true;



  constructor(
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private renderer: Renderer2,
    private el: ElementRef,
    private mediaObserver: MediaObserver,
  ) {
    this.authService.cachedData$.subscribe((data) => {
      this.user = data;
      console.log(this.user);
      // Cập nhật thông tin người dùng từ userCache khi có sự thay đổi
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const screenWidth = (event.target as Window).innerWidth;

    this.isMobile = screenWidth <= 768;
    this.isTablet = screenWidth > 768 && screenWidth <= 1024;
    this.isLaptop = screenWidth > 1024;
  }


  openLoginModal() {
    const modalRef = this.modalService.open(LoginComponent);
  }

  logOut() {
    // Cập nhật userCache trước khi đăng xuất
    this.authService.setUserCache(null);
    this.authService.logout();
  }

  ngOnInit(): void {
    this.user = this.authService.getUserCache(); // Lấy thông tin người dùng từ userCache
    this.renderer.setStyle(this.el.nativeElement.querySelector('#navbar'), 'transition', 'top 0.3s ease-in-out');
    let prevScrollPos = window.scrollY;

    window.onscroll = () => {
      const currentScrollPos = window.scrollY;
      if (prevScrollPos > currentScrollPos) {
        this.renderer.setStyle(this.el.nativeElement.querySelector('#navbar'), 'top', '0');
      } else {
        this.renderer.setStyle(this.el.nativeElement.querySelector('#navbar'), 'top', '-100px');
      }
      prevScrollPos = currentScrollPos;
    };

    // this.checkScreenSize();
    // this.checkIfIPad();

    // window.addEventListener('resize', () => {
    //   this.checkScreenSize();
    //   this.checkIfIPad();
    // });

  }

  openProfileModel() {
    const modalRef = this.modalService.open(ProfileComponent);
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
}