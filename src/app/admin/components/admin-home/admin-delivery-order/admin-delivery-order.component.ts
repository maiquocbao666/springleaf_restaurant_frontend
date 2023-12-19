import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeliveryOrder } from 'src/app/interfaces/delivery-order';
import { Product } from 'src/app/interfaces/product';
import { DeliveryOrderService } from 'src/app/services/delivery-order.service';
import { ProductService } from 'src/app/services/product.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-admin-delivery-order',
  templateUrl: './admin-delivery-order.component.html',
  styleUrls: ['./admin-delivery-order.component.css']
})
export class AdminDeliveryOrderComponent {

  deliveryOrders: DeliveryOrder[] = [];
  products: Product[] = [];
  deliveryOrderForm: FormGroup;
  deliveryOrder: DeliveryOrder | undefined;
  fieldNames: string[] = [];
  isSubmitted = false;
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  constructor(
    private deliveryOrderService: DeliveryOrderService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private sweetAlertService: ToastService
  ) {
    this.deliveryOrderForm = this.formBuilder.group({
      menuItemId: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      orderTime: ['', [Validators.required]],
      deliveryOrderId: ['', [Validators.required]],
    });
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }


  ngOnInit(): void {
    this.getDelivery();
    this.getProducts();
  }

  getDelivery(): void {
    this.deliveryOrderService.getCache().subscribe(
      (cached: any[]) => {
        this.deliveryOrders = cached;
      }
    );
  }

  getProducts(): void {
    this.productService.getCache().subscribe(
      (cached: any[]) => {
        this.products = cached;
      }
    );
  }

  getProductById(id: number): Product | null {
    const found = this.products.find(data => data.menuItemId === id);
    return found || null;
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }
}
