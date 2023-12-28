import { IngredientService } from 'src/app/services/ingredient.service';

import { Component, ElementRef, HostListener, OnDestroy, Renderer2, ViewChild } from "@angular/core";
import { AuthenticationService } from "./services/authentication.service";
import { CategoryService } from "./services/category.service";
import { ComboDetailService } from "./services/combo-detail.service";
import { ComboService } from "./services/combo.service";
// import { DeliveryDetailService } from "./services/delivery-detail.service";
import { SwUpdate } from '@angular/service-worker';
import { BillDetailService } from "./services/bill-detail.service";
import { BillService } from "./services/bill.service";
import { CartDetailService } from "./services/cart-detail.service";
import { CartService } from "./services/cart.service";
import { DeliveryOrderDetailService } from "./services/delivery-order-detail.service";
import { DeliveryOrderStatusService } from "./services/delivery-order-status.service";
import { DeliveryOrderService } from "./services/delivery-order.service";
import { DiscountService } from "./services/discount.service";
import { EventService } from "./services/event.service";
import { FavoriteService } from "./services/favorite.service";
import { GoodsReceiptDetailService } from "./services/goods-receipt-detail.service";
import { GoodsReceiptService } from "./services/goods-receipt.service";
import { InventoryBranchService } from "./services/inventory-branch.service";
import { InventoryService } from "./services/inventory.service";
import { InventoryBranchIngredientService } from './services/inventoryBranchIngredient.service';
import { MenuItemIngredientService } from "./services/menu-Item-ingredient.service";
import { MergeTableService } from "./services/merge-table.service";
import { OrderThresholdService } from "./services/order-threshold.service";
import { OrderService } from "./services/order.service";
import { PaymentService } from "./services/payment.service";
import { ProductService } from "./services/product.service";
import { RatingService } from "./services/rating.service";
import { ReceiptDetailService } from "./services/receipt-detail.service";
import { ReceiptService } from "./services/receipt.service";
import { ReservationStatusService } from "./services/reservation-status.service";
import { ReservationService } from "./services/reservation.service";
import { RestaurantTableService } from "./services/restaurant-table.service";
import { RestaurantService } from "./services/restaurant.service";
import { SupplierService } from "./services/supplier.service";
import { TableStatusService } from "./services/table-status.service";
import { TableTypeService } from "./services/table-type.service";
import { Loader } from '@googlemaps/js-api-loader'


// interface DataService<T> {
//   cache: T[] | null;
//   localStorageKey: string;
// }

// interface ServiceMap {
//   [key: string]: DataService<any>;
// }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  //   title = 'springleaf_restaurant';
  //   @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  //   private context!: CanvasRenderingContext2D | null;

  //   circles: { x: number; y: number; dx: number; dy: number; radius: number }[] = [];

  //   mouse = {
  //     x: 0,
  //     y: 0,
  //   }

  //   @HostListener('document:mousemove', ['$event'])
  //   handleMouseMove(event: MouseEvent): void {
  //     //console.log('Mouse moved', event);
  //     this.mouse.x = event.x;
  //     this.mouse.y = event.y;
  //   }

  //   ngAfterViewInit(): void {
  //     this.canvas.nativeElement.width = 1872 - 20;
  //     this.canvas.nativeElement.height = 924 - 20;

  //     this.context = this.canvas.nativeElement.getContext('2d');

  //     // Create initial circles
  //     for (let i = 0; i < 100; i++) {
  //       this.circles.push({
  //         x: Math.random() * (1872 - 20),
  //         y: Math.random() * (924 - 20),
  //         dx: (Math.random() - 0.5) * 8,
  //         dy: (Math.random() - 0.5) * 8,
  //         radius: 30
  //       });
  //     }

  //     this.animate();
  //   }



  //   circle(x: number, y: number, radius: number): void {
  //     if (this.context) {
  //       this.context.beginPath();
  //       this.context.arc(x, y, radius, 0, Math.PI * 2, false);
  //       this.context.strokeStyle = 'blue';
  //       this.context.stroke();
  //       this.context.fill();
  //     }
  //   }

  //   animate(): void {
  //     requestAnimationFrame(this.animate.bind(this));

  //     if (this.context) {
  //       this.context.clearRect(0, 0, 1872 - 20, 924 - 20);

  //       // Update and draw each circle
  //       this.circles.forEach(circle => {
  //         this.circle(circle.x, circle.y, circle.radius);

  //         if (circle.x + circle.radius > this.canvas.nativeElement.width || circle.x - circle.radius < 0) {
  //           circle.dx = -circle.dx;
  //         }
  //         if (circle.y + circle.radius > this.canvas.nativeElement.height || circle.y - circle.radius < 0) {
  //           circle.dy = -circle.dy;
  //         }

  //         circle.x += circle.dx;
  //         circle.y += circle.dy;

  //         if(this.mouse.x - circle.x < 50 && this.mouse.x - circle.x > -50 && this.mouse.y - circle.y < 50 && this.mouse.y - circle.y > -50){
  //           circle.radius += 1;
  //         } else if (circle.radius > 2){
  //           circle.radius -= 1;
  //         }

  //       });
  //     }
  //   }

  private map: google.maps.Map | undefined;

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {
    let loader = new Loader({
      apiKey: 'AIzaSyA2RgLSEt0AMVaW-Vj5ehMd60ItXkXsvEs',
    });

    loader.load().then(() => {
      const mapElement = this.renderer.selectRootElement('#map');

      if (mapElement) {
        this.map = new google.maps.Map(mapElement, {
          center: { lat: 10.25495094762458, lng: 105.9632437480188 },
          zoom: 20,
          styles: [],
        });

        // Thêm sự kiện click cho bản đồ
        // this.map.addListener('click', (event: google.maps.KmlMouseEvent) => {
        //   this.handleMapClick(event);
        // });
      } else {
        console.error('Map element not found.');
      }
    });
  }

  // Xử lý sự kiện click trên bản đồ
  private handleMapClick(event: google.maps.KmlMouseEvent): void {
    // Lấy tọa độ từ sự kiện
    const clickedLatLng = event.latLng;

    console.log(clickedLatLng);

    if (!clickedLatLng) {
      return;
    }

    // Hiển thị thông báo với tọa độ đã click
    alert(`Clicked LatLng: ${clickedLatLng.lat()}, ${clickedLatLng.lng()}`);
    const centerLatLng = new google.maps.LatLng(clickedLatLng.lat(), clickedLatLng.lng());
    this.map?.setCenter(centerLatLng);
  }

  target() {
    const centerLatLng = new google.maps.LatLng(10.25495094762458, 105.9632437480188);
    this.map?.setCenter(centerLatLng);
  }

}