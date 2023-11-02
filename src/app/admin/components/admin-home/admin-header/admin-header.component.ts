import { Component, ElementRef, Renderer2 } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent {
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
  }
  
  ngOnInit(): void {
    this.sideNav(); // Kiểm tra trạng thái ban đầu

    // Kiểm tra kích thước cửa sổ khi cửa sổ thay đổi
    this.renderer.listen('window', 'resize', () => {
      this.sideNav();
    });
  }
  sideNav() {
    if (window.innerWidth <= 1133) {
      this.renderer.setStyle(this.elementRef.nativeElement.querySelector('.sidebar'), 'display', 'none');
    } else {
      this.renderer.removeStyle(this.elementRef.nativeElement.querySelector('.sidebar'), 'display');
    }
  }
  
  toggleCanvas() {
    // Xử lý sự kiện click cho .canvas-toggle
    // Đặt logic xử lý tại đây
  }
}
