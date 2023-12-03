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
import { BillDetailService } from 'src/app/services/bill-detail.service';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { IngredientService } from 'src/app/services/ingredient.service';
import { ProductService } from 'src/app/services/product.service';
import { StatisticsService } from 'src/app/services/statistical.service';
import { AdminProductDetailComponent } from '../admin-products/admin-product-detail/admin-product-detail.component';
@Component({
  selector: 'app-admin-statistical',
  templateUrl: './admin-statistical.component.html',
  styleUrls: ['./admin-statistical.component.css']
})
export class AdminStatisticalComponent {
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

  bill: Bill | undefined;


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
    this.getIngredients();
    this.getTop5OrderedItems();
    this.fetchStatistics();
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



  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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


  getCategoryById(id: number): Category | null {
    const found = this.categories.find(data => data.categoryId === id);
    return found || null;
  }

  getProductById(id: number): Product | null {
    const found = this.products.find(data => data.menuItemId === id);
    return found || null;
  }


  getIngredients(): void {
    this.ingredientService.getCache().subscribe(
      (cached: any[]) => {
        this.ingredients = cached;
      }
    );
  }

  

  getCategories(): void {
    this.categoryService.getCache().subscribe(
      (cached: any[]) => {
        this.categories = cached;
      }
    );
  }

  getIngredientById(id: number): Ingredient | null {
    const found = this.ingredients.find(data => data.ingredientId === id);
    return found || null;
  }

  onMenuItemChange(): void {
    if (this.selectedMenuItemId) {
      this.loading = true;
      this.error = undefined;

      this.statisticsService.getIngredientsForMenuItem(this.selectedMenuItemId).subscribe(
        (data: MenuItemIngredient[]) => {
          this.menuItemIngredients = data;
          this.loading = false;
        },
        (error: any) => {
          this.error = 'Failed to fetch ingredients. Please try again.';
          this.loading = false;
        }
      );
    }
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

  openModal(row: any) {
    this.selectedRow = row;
    const dialogRef = this.dialog.open(AdminProductDetailComponent, {
      width: '400px',
      data: row
    });
  }

  openModal2(content: any, billId: number): void {
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
}
