import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Bill } from 'src/app/interfaces/bill';
import { BillDetail } from 'src/app/interfaces/bill-detail';
import { Cart } from 'src/app/interfaces/cart';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BillDetailService } from 'src/app/services/bill-detail.service';
import { BillService } from 'src/app/services/bill.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-bills',
  templateUrl: './admin-bills.component.html',
  styleUrls: ['./admin-bills.component.css']
})
export class AdminBillsComponent {
  bills: Bill[] = [];
  users: User[] = [];
  orders: Cart[] = [];
  billForm: FormGroup;
  billDetails: BillDetail[] = [];
  products: Product[] = [];
  bill: Bill | undefined;
  fieldNames: string[] = [];

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];
  billsUrl = 'bills';
  cartsUrl = 'carts';
  productsUrl = 'products';

  user: User | null = null;

  constructor(
    private billService: BillService,
    private billDetailService: BillDetailService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private authService: AuthenticationService,
    private userService: UserService,

  ) {
    this.billForm = this.formBuilder.group({
      inventoryId: ['', [Validators.required]],
      ingredientId: ['', [Validators.required]],
      supplierId: ['', [Validators.required]]
    });
    this.authService.getUserCache().subscribe((data) => {
      this.user = data;
    });
  }

  ngOnInit(): void {
    this.getBills();
    this.getProducts();
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  getProductById(id: number): Product | null {
    const found = this.products.find(data => data.menuItemId === id);
    return found || null;
  }

  getBills(): void {
    this.billService.getCache().subscribe(
      (cached: any[]) => {
        this.bills = cached.filter(data => this.userService.getRestaurantIdByUserId(data.userId) === this.user?.restaurantBranchId);
        console.log(this.userService.getRestaurantIdByUserId(2));
      }
    );
  }
  getBillDetails(billId: number): void {
    this.billDetailService.getBillDetailsByBillId(billId)
      .subscribe(
        (data: BillDetail[]) => {
          this.billDetails = data;
          // Xử lý dữ liệu nhận được từ API ở đây
        },
        (error: any) => {
          console.error('Failed to get bill details.', error);
        }
      );
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  getProducts(): void {
    this.productService.getCache().subscribe(
      (cached: any[]) => {
        this.products = cached;
      }
    );
  }

  openModal(content: any, billId: number): void {
    this.billDetailService.getBillDetailsByBillId(billId)
      .subscribe(
        (data: BillDetail[]) => {
          this.billDetails = data;
          this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
        },
        (error: any) => {
          console.error('Failed to get bill details.', error);
        }
      );
  }

  search() {
    if (this.keywords.trim() === '') {
      this.getBills();
    } else {
      this.billService.searchByKeywords(this.keywords, this.fieldName).subscribe(
        (data) => {
          this.bills = data;
        }
      );
    }
  }

  fieldName!: keyof Bill;
  changeFieldName(event: any) {
    this.fieldName = event.target.value;
    this.search();
  }

  keywords = '';
  changeSearchKeyWords(event: any){
    this.keywords = event.target.value;
    this.search();
  }
  

}
