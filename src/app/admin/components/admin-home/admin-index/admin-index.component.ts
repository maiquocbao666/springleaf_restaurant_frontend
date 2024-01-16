import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { colorSets } from '@swimlane/ngx-charts';
import { Bill } from 'src/app/interfaces/bill';
import { BillDetail } from 'src/app/interfaces/bill-detail';
import { Category } from 'src/app/interfaces/category';
import { Ingredient } from 'src/app/interfaces/ingredient';
import { MenuItemIngredient } from 'src/app/interfaces/menu-item-ingredient';
import { Product } from 'src/app/interfaces/product';
import { Reservation } from 'src/app/interfaces/reservation';
import { Role } from 'src/app/interfaces/role';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BillDetailService } from 'src/app/services/bill-detail.service';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { IngredientService } from 'src/app/services/ingredient.service';
import { ProductService } from 'src/app/services/product.service';
import { StatisticsService } from 'src/app/services/statistical.service';
import { ToastService } from 'src/app/services/toast.service';

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
  monthlyRevenue!: any[];
  selectedYear!: number;
  colorScheme: any; // Khai báo colorScheme
  paidBillsCount!: number;
  years: number[] = [];
  mostOrderedItems!: any[];
  countRestaurant!: any[];
  showTable: boolean = false;
  userRoles: String = '';

  productsBestBuy: ProductBest[] | null = null;
  products2 : Product[] = [];


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private statisticsService: StatisticsService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private sweetAlertService: ToastService,
    private authService: AuthenticationService,

  ) { 
    this.colorScheme = colorSets.find(s => s.name === 'cool'); 
    this.statisticsService.getMostOrderedItems().subscribe(
      data => {
        this.mostOrderedItems = this.transformData(data);
        
      }
      ,
      error => {
        console.error(error);
      }
    );
    
  }

  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
    this.getNumberOfPaidBills();
    this.getCountRestaurant();
    this.fetchTotalRevenue();
    this.populateYears();
    this.selectedYear = new Date().getFullYear();
    this.getRevenueByYear(this.selectedYear);
    this.monthlyRevenue = this.formatDataForChart(this.monthlyRevenue);
    this.checkRoles();
  }

  // Trong component của bạn:
  transformData(data: any[]): TransformedData[] {
    const transformedData: TransformedData[] = [];
    data.forEach(item => {
      const menuItemId = Number(Object.keys(item)[0]); // Chuyển menuItemId thành kiểu số
      const quantity = Number(Object.values(item)[0]); // Chuyển quantity thành kiểu số
      transformedData.push({ menuItemId: menuItemId, quantity: quantity });
    });
    return transformedData;
  }

  formatDataForChart(data: any): any[] {
    const formattedData: any[] = [];

    // Lặp qua các tháng trong dữ liệu doanh thu
    for (const month in data) {
      if (data.hasOwnProperty(month)) {
        const revenueForMonth = data[month]; // Lấy doanh thu của từng tháng

        // Tạo một đối tượng mới thể hiện doanh thu của mỗi tháng
        const formattedItem = {
          name: this.getMonthName(Number(month)), // Tên tháng (có thể là tên tiếng Việt hoặc tiếng Anh)
          value: revenueForMonth // Giá trị doanh thu của tháng
        };

        formattedData.push(formattedItem); // Thêm đối tượng vào mảng formattedData
      }
    }

    return formattedData;
  }

  getMonthName(monthNumber: number): string {
    const months = [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12'
    ];

    // Kiểm tra xem số tháng có hợp lệ không (từ 1 đến 12)
    if (monthNumber >= 1 && monthNumber <= 12) {
      return months[monthNumber - 1]; // Trả về tên tháng từ mảng months
    } else {
      return 'Tháng không hợp lệ'; // Trả về thông báo nếu số tháng không hợp lệ
    }
  }


  getRevenueByYear(year: number): void {
    this.statisticsService.getMonthlyRevenueByYear(year)
      .subscribe(data => {
        this.monthlyRevenue = data;
        this.monthlyRevenue = this.formatDataForChart(this.monthlyRevenue); // Gọi formatDataForChart ở đây
        console.log('Monthly revenue:', this.monthlyRevenue);
      }, error => {
        console.error('Error fetching data:', error);
      });
  }

  getNumberOfPaidBills(): void {
    this.statisticsService.getCountOfPaidBills()
      .subscribe(count => {
        this.paidBillsCount = count;
      });
  }
  getCountRestaurant(): void {
    this.statisticsService.getCountRestaurant()
      .subscribe(count2 => {
        this.countRestaurant = count2;
      });
  }


  onYearSelected(): void {
    this.getRevenueByYear(this.selectedYear);
  }

  populateYears(): void {
    const currentYear = new Date().getFullYear();
    const startYear = 2000; // Năm bắt đầu
    for (let year = startYear; year <= currentYear; year++) {
      this.years.push(year);
    }
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
    if (this.checkDateValidity()) { // Thêm kiểm tra ngày hợp lệ ở đây
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
      this.sweetAlertService.fireAlert('Lỗi khi truy vấn!', 'Ngày bắt đầu phải lớn hơn ngày kết thúc', 'error');
      return;
      // Thực hiện các hành động khác khi ngày không hợp lệ (hiển thị thông báo, xử lý lỗi...)
    }
  }

  toggleTable() {
    this.showTable = !this.showTable; // Khi nhấn nút, giá trị của biến showTable sẽ đảo ngược (ẩn nếu đang hiển thị và hiển thị nếu đang ẩn)
  }

  checkDateValidity(): boolean {
    // Kiểm tra nếu startDate và endDate không rỗng và startDate không lớn hơn endDate
    return !!this.startDate && !!this.endDate && this.startDate <= this.endDate;
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





  getProductById(id: number): Product | null {
    const found = this.products.find(data => data.menuItemId === id);
    return found || null;
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

    // if (!this.roles) {
    //   this.sweetAlertService.showTimedAlert('403', 'Bạn không có quyền truy cập', 'error', 1500);
    // }

    // // Ensure that this.roles is not null before using the includes method
    // if (this.roles && this.roles.length > 0) {
    //   const predefinedRoles = ['USER', 'MANAGER', 'ADMIN'];
    //   let foundRole: string | null = null;

    //   for (const role of predefinedRoles) {
    //     if (this.roles.includes(role)) {
    //       foundRole = role;
    //       console.log(foundRole);
    //     } else {
    //       // Nếu không tìm thấy, thoát vòng lặp
    //       break;
    //     }
    //   }
    // } else {
    //   // Handle the case where this.roles is null or empty
    //   this.sweetAlertService.showTimedAlert('403', 'Bạn không có quyền truy cập', 'error', 1500);
    // }
  }



}
interface TransformedData {
  menuItemId: number;
  quantity: number;
}

export interface ProductBest{
  menuItemId?: number;
    name: string;
    description: string;
    unitPrice: number;
    imageUrl: string;
    categoryId: number;
    status: boolean;
    quantityBuy: number;
}