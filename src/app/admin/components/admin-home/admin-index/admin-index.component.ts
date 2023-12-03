import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Bill } from 'src/app/interfaces/bill';
import { BillDetail } from 'src/app/interfaces/bill-detail';
import { Category } from 'src/app/interfaces/category';
import { Ingredient } from 'src/app/interfaces/ingredient';
import { MenuItemIngredient } from 'src/app/interfaces/menu-item-ingredient';
import { Product } from 'src/app/interfaces/product';
import { Reservation } from 'src/app/interfaces/reservation';
import { BillDetailService } from 'src/app/services/bill-detail.service';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { IngredientService } from 'src/app/services/ingredient.service';
import { ProductService } from 'src/app/services/product.service';
import { StatisticsService } from 'src/app/services/statistical.service';

@Component({
  selector: 'app-admin-index',
  templateUrl: './admin-index.component.html',
  styleUrls: ['./admin-index.component.css']
})
export class AdminIndexComponent {
  totalRevenue: number | undefined;
  statisticsData: any;
  loading = false;
  error: string | undefined;
  selectedMenuItemId: number | undefined;
  menuItemIngredients: MenuItemIngredient[] = [];
  products: Product[] = [];
  ingredients: Ingredient[] = [];
  productsUrl = 'products';
  ingredientsUrl = 'ingredients';
  categoriesUrl = 'categories';
  categories: Category[] = [];
  revenueData: Object[] = [];
  billsData: Bill[] = [];
  billDetails: BillDetail[] = [];
  reservations: any[] = [];
  selectedDate: string = '';
  topItems: any[] = [];
  startDate: string = '';
  endDate: string = '';
  displayedColumns: string[] = ['name', 'description', 'unitPrice', 'imageUrl', 'status']; // Các cột bạn muốn hiển thị
  dataSource!: MatTableDataSource<Product>;
  selectedRow: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private statisticsService: StatisticsService,
    private billService: BillService,
    private billDetailService: BillDetailService,
    private modalService: NgbModal,
    private productService: ProductService,
    private ingredientService: IngredientService,
    private dialog: MatDialog,
    private http: HttpClient,
    private categoryService: CategoryService,
  ) { }

  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
    // this.getIngredients();
    this.getTop5OrderedItems();
    // this.fetchStatistics();
    this.fetchTotalRevenue();
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }


  getCategories(): void {
    this.categoryService.getCache().subscribe(
      (cached: any[]) => {
        this.categories = cached;
      }
    );
  }

  getProducts(): void {
    this.productService.getCache().subscribe(
      (cached: Product[]) => {
        this.products = cached;
        this.dataSource = new MatTableDataSource(this.products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error: any) => {
        console.error('Failed to fetch data', error);
      }
    );
  }

  getReservations(): void {
    if (this.selectedDate) {
      this.statisticsService.getReservationsByDate(this.selectedDate).subscribe(
        (data: any[]) => {
          this.reservations = data;
        },
        (error: any) => {
          console.error('Failed to get reservations.', error);
        }
      );
    }
  }

  hoursUse(reservation: Reservation): string {

    // 1000ms = 1s
    if (reservation.reservationStatusName === "Đã sử dụng xong") {
      return "Hết giờ sử dụng";
    }

    const currentTime = new Date();
    const reservationTime = new Date(new Date(reservation.reservationDate).getTime() + 2 * 60 * 60 * 1000);

    const diff = reservationTime.getTime() - currentTime.getTime();

    const hours = Math.floor(diff / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((diff % (60 * 1000)) / 1000);

    if (diff >= 0) {
      return hours + ':' + minutes + ':' + seconds;
    }

    return "Hết giờ sử dụng";
  }

  getRevenueAndBills(): void {
    if (this.startDate && this.endDate) {
      this.statisticsService.getRevenueByTimeRange(this.startDate, this.endDate).subscribe(
        (revenueData: Object[]) => {
          this.revenueData = revenueData;
        },
        (error: any) => {
          console.error('Failed to get revenue data.', error);
        }
      );

      this.statisticsService.getBillsByTimeRange(this.startDate, this.endDate).subscribe(
        (billsData: Bill[]) => {
          this.billsData = billsData;
        },
        (error: any) => {
          console.error('Failed to get bills data.', error);
        }
      );
    } else {
      console.error('Please provide both start date and end date.');
    }
  }

  fetchTotalRevenue() {
    this.statisticsService.getTotalRevenue()
      .subscribe((data: number) => {
        // Lưu kết quả vào biến totalRevenue để sử dụng trong giao diện
        this.totalRevenue = data;
        console.log('Total Revenue:', this.totalRevenue);
      }, error => {
        // Xử lý lỗi nếu có
        console.error('Error fetching total revenue:', error);
      });
  }

  fetchStatistics(): void {
    this.loading = true;
    this.error = undefined;

    this.statisticsService.getStatistics().subscribe(
      (data: any) => {
        this.statisticsData = data;
        this.loading = false;
      },
      (error: any) => {
        this.error = 'Failed to fetch statistics. Please try again.';
        this.loading = false;
      }
    );
  }

  getTop5OrderedItems() {
    this.statisticsService.getTop5MostOrderedItems().subscribe(
      (data: any) => {
        this.topItems = data;
        console.log(data);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getProductById(id: number): Product | null {
    const found = this.products.find(data => data.menuItemId === id);
    return found || null;
  }



}
