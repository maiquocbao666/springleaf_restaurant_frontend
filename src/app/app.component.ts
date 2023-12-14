
import { Component, OnDestroy } from "@angular/core";
import { AuthenticationService } from "./services/authentication.service";
import { CategoryService } from "./services/category.service";
import { ComboDetailService } from "./services/combo-detail.service";
import { ComboService } from "./services/combo.service";
// import { DeliveryDetailService } from "./services/delivery-detail.service";
import { BillDetailService } from "./services/bill-detail.service";
import { BillService } from "./services/bill.service";
import { CartDetailService } from "./services/cart-detail.service";
import { CartService } from "./services/cart.service";
import { DeliveryOrderDetailService } from "./services/delivery-order-detail.service";
import { DeliveryOrderStatusService } from "./services/delivery-order-status.service";
import { DeliveryOrderService } from "./services/delivery-order.service";
import { EventService } from "./services/event.service";
import { FavoriteService } from "./services/favorite.service";
import { GoodsReceiptDetailService } from "./services/goods-receipt-detail.service";
import { GoodsReceiptService } from "./services/goods-receipt.service";
import { IngredientService } from "./services/ingredient.service";
import { InventoryBranchService } from "./services/inventory-branch.service";
import { InventoryService } from "./services/inventory.service";
import { MenuItemIngredientService } from "./services/menu-Item-ingredient.service";
import { MergeTableService } from "./services/merge-table.service";
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
import { OrderThresholdService } from "./services/order-threshold.service";
import { DiscountService } from "./services/discount.service";
import { CookieService } from "ngx-cookie-service";
import { SwUpdate } from "@angular/service-worker";


interface DataService<T> {
  cache: T[] | null;
  localStorageKey: string;
}

interface ServiceMap {
  [key: string]: DataService<any>;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  title = 'springleaf_restaurant';
  dataLoaded = false;
  getDatasFromLocalStorageWorker: Worker;
  callAPIsWorker: Worker;
  services: ServiceMap;

  constructor(
    private swUpdate: SwUpdate,
    private authentication: AuthenticationService,
    private categoriesService: CategoryService,
    private productsService: ProductService,
    private cartsService: CartService,
    private cartDetailsService: CartDetailService,
    private ordersService: OrderService,
    private combosService: ComboService,
    private comboDetailService: ComboDetailService,
    private eventsService: EventService,
    private restaurantTablesService: RestaurantTableService,
    private restaurantsService: RestaurantService,
    private suppliersService: SupplierService,
    private tableStatusesService: TableStatusService,
    private ingredientsService: IngredientService,
    private billsService: BillService,
    private billDetailsService: BillDetailService,
    private comboDetailsService: ComboDetailService,
    private goodsReceiptsService: GoodsReceiptService,
    private goodsReceiptDetailsService: GoodsReceiptDetailService,
    private deliveryOrdersService: DeliveryOrderService,
    private deliveryOrderStatusesService: DeliveryOrderStatusService,
    private deliveryOrderDetailsService: DeliveryOrderDetailService,
    private favoritesService: FavoriteService,
    private inventoriesService: InventoryService,
    private inventoryBranchesService: InventoryBranchService,
    private menuItemIngredientsService: MenuItemIngredientService,
    private orderThresholdsService: OrderThresholdService,
    private mergeTablesService: MergeTableService,
    //private orderTypesService: OrderTypeService,
    private paymentsService: PaymentService,
    private ratingsService: RatingService,
    private receiptsService: ReceiptService,
    private receiptDetailsService: ReceiptDetailService,
    private reservationsService: ReservationService,
    private tableTypesService: TableTypeService,
    private reservationStatusesService: ReservationStatusService,
    private discountsService : DiscountService,
    private cookieService: CookieService,
  ) {

    window.addEventListener('storage', (event) => {
      if (event.key && event.oldValue !== null) {
        localStorage.setItem(event.key, event.oldValue);
      }
    });

    this.services = {
      categories: { cache: this.categoriesService.cache, localStorageKey: 'categories' },

      products: { cache: this.productsService.cache, localStorageKey: 'products' },

      cartDetails: { cache: this.cartDetailsService.cache, localStorageKey: 'cartDetails' },
      carts: { cache: this.cartsService.cache, localStorageKey: 'carts' },

      combos: { cache: this.combosService.cache, localStorageKey: 'combos' },
      events: { cache: this.eventsService.cache, localStorageKey: 'events' },

      restaurantTables: { cache: this.restaurantTablesService.cache, localStorageKey: 'restaurantTables' },
      restaurants: { cache: this.restaurantsService.cache, localStorageKey: 'restaurants' },

      suppliers: { cache: this.suppliersService.cache, localStorageKey: 'suppliers' },

      tableStatuses: { cache: this.tableStatusesService.cache, localStorageKey: 'tableStatuses' },

      ingredients: { cache: this.ingredientsService.cache, localStorageKey: 'ingredients' },
      bills: { cache: this.billsService.cache, localStorageKey: 'bills' },
      billDetails: { cache: this.billDetailsService.cache, localStorageKey: 'billDetails' },
      comboDetails: { cache: this.comboDetailsService.cache, localStorageKey: 'comboDetails' },

      goodsReceipts: { cache: this.goodsReceiptsService.cache, localStorageKey: ' goodsReceipts' },
      // goodsReceiptDetailss: { cache: this.goodsReceiptDetailsService.cache, localStorageKey: 'goodsReceiptDetailss' },

      deliveryOrders: { cache: this.deliveryOrdersService.cache, localStorageKey: 'deliveryOrders' },
      deliveryOrderStatuses: { cache: this.deliveryOrderStatusesService.cache, localStorageKey: 'deliveryOrderStatuses' },

      

      favorites: { cache: this.favoritesService.cache, localStorageKey: 'favorites' },
      inventories: { cache: this.inventoriesService.cache, localStorageKey: 'inventories' },
      inventoryBranches: { cache: this.inventoryBranchesService.cache, localStorageKey: 'inventoryBranches' },

      menuItemIngredients: { cache: this.menuItemIngredientsService.cache, localStorageKey: 'menuItemIngredients' },
      orderThresholds: { cache: this.orderThresholdsService.cache, localStorageKey: 'orderThresholds' },

      mergeTables: { cache: this.mergeTablesService.cache, localStorageKey: 'mergeTables' },

      // orderTypes: { cache: this.orderTypesService.orderTypesCache, localStorageKey: 'orderTypes' },

      payments: { cache: this.paymentsService.cache, localStorageKey: 'payments' },
      ratings: { cache: this.ratingsService.cache, localStorageKey: 'ratings' },
      receipts: { cache: this.receiptsService.cache, localStorageKey: 'receipts' },
      receiptDetails: { cache: this.receiptDetailsService.cache, localStorageKey: 'receiptDetails' },
      reservations: { cache: this.reservationsService.cache, localStorageKey: 'reservations' },
      tableTypes: { cache: this.tableTypesService.cache, localStorageKey: 'tableTypes' },
      reservationStatuses: { cache: this.reservationStatusesService.cache, localStorageKey: 'reservationStatuses' },
      discounts: { cache: this.discountsService.cache , localStorageKey : 'discounts'},

    };

    this.getDatasFromLocalStorageWorker = new Worker(new URL('./workers/get-datas-from-local-storage.worker', import.meta.url));
    this.callAPIsWorker = new Worker(new URL('./workers/call-apis.worker', import.meta.url));

  }

  ngOnInit(): void {

    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('Có bản vá mới. Bạn có muốn tải lại ứng dụng không?')) {
          this.swUpdate.activateUpdate().then(() => document.location.reload());
        }
      });
    }
    
    //var accessToken = localStorage.getItem('access_token'); // lấy từ cookie
    var accessToken = this.cookieService.get('access_token');
    var userSession = sessionStorage.getItem('userCache'); // lấy từ sessionStorage
    
    if(userSession !== '' && userSession){
      this.authentication.setUserCache(JSON.parse(userSession));
    }else{
      if (accessToken) {
        this.authentication.checkUserByAccessToken(accessToken);
        console.log('Tự động đăng nhập')
      }
    }

    // Lấy role Cache từ session storage
    var userRoleSession = sessionStorage.getItem('userRoles');
    console.log(userRoleSession)
    if(userRoleSession !== '' && userRoleSession){
      this.authentication.setRoleCache(JSON.parse(userRoleSession));
    }
    this.getAllDatasFromLocalStorage();
    this.callAllApis();
    
  }

  getAllDatasFromLocalStorage() {
    this.getDatasFromLocalStorageWorker.postMessage('start');
    this.getDatasFromLocalStorageWorker.onmessage = ({ data }) => {

      Object.keys(this.services).forEach((type: string) => {

        const { cache, localStorageKey } = this.services[type];

        if (localStorage.getItem(localStorageKey)) {
          this.services[type].cache = JSON.parse(localStorage.getItem(localStorageKey) || 'null');
          //console.log(`Lấy dữ liệu ${type} từ Local Storage`);
          (this as any)[`${type}Service`][`cache`] = this.services[type].cache;
          //console.log(`[get-datas-from-local-storage.worker.ts] Received ${type}:`, this.services[type].cache);
        }

      });
      this.dataLoaded = true;
      console.log("Lấy tất cả dữ liệu từ get-datas-from-local-storage.worker.ts thành công");
    };
  }

  callAllApis(): void {
    this.callAPIsWorker.postMessage('start');
    this.callAPIsWorker.onmessage = ({ data }) => {
      Object.keys(this.services).forEach((type: string) => {

        const { cache, localStorageKey } = this.services[type];

        if (JSON.stringify(JSON.parse(localStorage.getItem(localStorageKey) || 'null')) === JSON.stringify(data[type])) {
          // Cập nhật từ Local Storage
          this.services[type].cache = JSON.parse(localStorage.getItem(localStorageKey) || 'null');
          // console.log(`Lấy dữ liệu ${type} từ Local Storage`);
          //console.log(`Lấy dữ liệu ${type} từ Local Storage`);
        } else {
          // Cập nhật từ dữ liệu API và lưu vào Local Storage

          if (data[type] === null) {
            console.log(`Không gọi được api ${type} hoặc là đang offline`)
          } else {
            this.services[type].cache = data[type];
            localStorage.setItem(localStorageKey, JSON.stringify(data[type]));
            // Cập nhật từ dữ liệu API và lưu vào Cookie
            //console.log(`Lấy dữ liệu ${type} từ API`);
          }

        }
        //}

        // Cập nhật dữ liệu vào caches tương ứng sử dụng dynamic property
        (this as any)[`${type}Service`][`cache`] = this.services[type].cache;

        //console.log(`Received ${type}:`, this.services[type].cache);
      });

      this.dataLoaded = true;
    };
  }

  ngOnDestroy(): void {
    this.callAPIsWorker.terminate();
  }
}