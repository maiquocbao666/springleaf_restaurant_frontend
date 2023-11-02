import { Component, HostListener, OnDestroy } from "@angular/core";
import { BillDetailService } from "./services/bill-detail.service";
import { BillService } from "./services/bill.service";
import { CartDetailService } from "./services/cart-detail.service";
import { CartService } from "./services/cart.service";
import { CategoryService } from "./services/category.service";
import { ComboDetailService } from "./services/combo-detail.service";
import { ComboService } from "./services/combo.service";
import { DeliveryDetailService } from "./services/delivery-detail.service";
import { DeliveryOrderDetailService } from "./services/delivery-order-detail.service";
import { DeliveryOrderStatusService } from "./services/delivery-order-status.service";
import { DeliveryOrderService } from "./services/delivery-order.service";
import { DeliveryService } from "./services/delivery.service";
import { EventService } from "./services/event.service";
import { FavoriteService } from "./services/favorite.service";
import { IngredientService } from "./services/ingredient.service";
import { InventoryBranchService } from "./services/inventory-branch.service";
import { InventoryService } from "./services/inventory.service";
import { MenuItemIngredientService } from "./services/menu-Item-ingredient.service";
import { MergeTableService } from "./services/merge-table.service";
import { OrderThresholdService } from "./services/order-threshold.service";
import { OrderTypeService } from "./services/order-type.service";
import { PaymentService } from "./services/payment.service";
import { ProductService } from "./services/product.service";
import { RatingService } from "./services/rating.service";
import { ReceiptDetailService } from "./services/receipt-detail.service";
import { ReceiptService } from "./services/receipt.service";
import { ReservationService } from "./services/reservation.service";
import { RestaurantTableService } from "./services/restaurant-table.service";
import { RestaurantService } from "./services/restaurant.service";
import { RoleFunctionService } from "./services/role-function.service";
import { RoleService } from "./services/role.service";
import { SupplierService } from "./services/supplier.service";
import { TableStatusService } from "./services/table-status.service";
import { TableTypeService } from "./services/table-type.service";

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
    private categoriesService: CategoryService,
    private productsService: ProductService,
    private cartDetailsService: CartDetailService,
    private combosService: ComboService,
    private eventsService: EventService,
    private restaurantTablesService: RestaurantTableService,
    private restaurantsService: RestaurantService,
    private suppliersService: SupplierService,
    private tableStatusesService: TableStatusService,
    private ingredientsService: IngredientService,
    private rolesService: RoleService,
    private roleFunctionsService: RoleFunctionService,
    private billsService: BillService,
    private billDetailsService: BillDetailService,
    private cartsService: CartService,
    private comboDetailsService: ComboDetailService,
    private deliveriesService: DeliveryService,
    private deliveryDetailsService: DeliveryDetailService,
    private deliveryOrdersService: DeliveryOrderService,
    private deliveryOrderStatusesService: DeliveryOrderStatusService,
    private deliveryOrderDetailsService: DeliveryOrderDetailService,
    private favoritesService: FavoriteService,
    private inventoriesService: InventoryService,
    private inventoryBranchesService: InventoryBranchService,
    private menuItemIngredientsService: MenuItemIngredientService,
    private orderThresholdsService: OrderThresholdService,
    private mergeTablesService: MergeTableService,
    private orderTypesService: OrderTypeService,
    private paymentsService: PaymentService,
    private ratingsService: RatingService,
    private receiptsService: ReceiptService,
    private receiptDetailsService: ReceiptDetailService,
    private reservationsService: ReservationService,
    private tableTypesService: TableTypeService
  ) {
    this.services = {
      categories: { cache: this.categoriesService.categoriesCache, localStorageKey: 'categories' },
      products: { cache: this.productsService.productsCache, localStorageKey: 'products' },
      cartDetails: { cache: this.cartDetailsService.cartDetailsCache, localStorageKey: 'cartDetails' },
      combos: { cache: this.combosService.combosCache, localStorageKey: 'combos' },
      events: { cache: this.eventsService.eventsCache, localStorageKey: 'events' },
      restaurantTables: { cache: this.restaurantTablesService.restaurantTablesCache, localStorageKey: 'restaurantTables' },
      restaurants: { cache: this.restaurantsService.restaurantsCache, localStorageKey: 'restaurants' },
      suppliers: { cache: this.suppliersService.suppliersCache, localStorageKey: 'suppliers' },
      tableStatuses: { cache: this.tableStatusesService.tableStatusesCache, localStorageKey: 'tableStatuses' },
      ingredients: { cache: this.ingredientsService.ingredientsCache, localStorageKey: 'ingredients' },
      roles: { cache: this.rolesService.rolesCache, localStorageKey: 'roles' },
      roleFunctions: { cache: this.roleFunctionsService.roleFunctionsCache, localStorageKey: 'roleFunctions' },
      bills: { cache: this.billsService.billsCache, localStorageKey: 'bills' },
      billDetails: { cache: this.billDetailsService.billDetailsCache, localStorageKey: 'billDetails' },
      carts: { cache: this.cartsService.cartsCache, localStorageKey: 'carts' },
      comboDetails: { cache: this.comboDetailsService.comboDetailsCache, localStorageKey: 'comboDetails' },
      deliveries: { cache: this.deliveriesService.deliveriesCache, localStorageKey: 'deliveries' },
      deliveryDetails: { cache: this.deliveryDetailsService.deliveryDetailsCache, localStorageKey: 'deliveryDetails' },
      deliveryOrders: { cache: this.deliveryOrdersService.deliveryOrdersCache, localStorageKey: 'deliveryOrders' },
      deliveryOrderStatuses: { cache: this.deliveryOrderStatusesService.deliveryOrderStatusesCache, localStorageKey: 'deliveryOrderStatuses' },
      deliveryOrderDetails: { cache: this.deliveryOrderDetailsService.deliveryOrderDetailsCache, localStorageKey: 'deliveryOrderDetails' },
      favorites: { cache: this.favoritesService.favoritesCache, localStorageKey: 'favorites' },
      inventories: { cache: this.inventoriesService.inventoriesCache, localStorageKey: 'inventories' },
      inventoryBranches: { cache: this.inventoryBranchesService.inventoryBranchesCache, localStorageKey: 'inventoryBranches' },
      menuItemIngredients: { cache: this.menuItemIngredientsService.menuItemIngredientsCache, localStorageKey: 'menuItemIngredients' },
      orderThresholds: { cache: this.orderThresholdsService.orderThresholdsCache, localStorageKey: 'orderThresholds' },
      mergeTables: { cache: this.mergeTablesService.mergeTablesCache, localStorageKey: 'mergeTables' },
      orderTypes: { cache: this.orderTypesService.orderTypesCache, localStorageKey: 'orderTypes' },
      payments: { cache: this.paymentsService.paymentsCache, localStorageKey: 'payments' },
      ratings: { cache: this.ratingsService.ratingsCache, localStorageKey: 'ratings' },
      receipts: { cache: this.receiptsService.receiptsCache, localStorageKey: 'receipts' },
      receiptDetails: { cache: this.receiptDetailsService.receiptDetailsCache, localStorageKey: 'receiptDetails' },
      reservations: { cache: this.reservationsService.reservationsCache, localStorageKey: 'reservations' },
      tableTypes: { cache: this.tableTypesService.tableTypesCache, localStorageKey: 'tableTypes' }
    };

    this.getDatasFromLocalStorageWorker = new Worker(new URL('./workers/get-datas-from-local-storage.worker', import.meta.url));

    this.callAPIsWorker = new Worker(new URL('./workers/call-apis.worker', import.meta.url));
  }

  ngOnInit(): void {
    this.getAllDatasFromLocalStorage();
    this.callAllApis();
  }

  getAllDatasFromLocalStorage() {
    this.getDatasFromLocalStorageWorker.postMessage('start');
    this.getDatasFromLocalStorageWorker.onmessage = ({ data }) => {
      //console.log("bruh")
      Object.keys(this.services).forEach((type: string) => {

        const { cache, localStorageKey } = this.services[type];

        if (localStorage.getItem(localStorageKey)) {
          this.services[type].cache = JSON.parse(localStorage.getItem(localStorageKey) || 'null');
          //console.log(`Lấy dữ liệu ${type} từ Local Storage`);
          (this as any)[`${type}Service`][`${type}Cache`] = this.services[type].cache;
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
          //console.log(`Lấy dữ liệu ${type} từ Local Storage`);
        } else {
          // Cập nhật từ dữ liệu API và lưu vào Local Storage
          this.services[type].cache = data[type];
          localStorage.setItem(localStorageKey, JSON.stringify(data[type]));
          //console.log(`Lấy dữ liệu ${type} từ API`);
        }
        //}

        // Cập nhật dữ liệu vào caches tương ứng sử dụng dynamic property
        (this as any)[`${type}Service`][`${type}Cache`] = this.services[type].cache;

        //console.log(`Received ${type}:`, this.services[type].cache);
      });

      this.dataLoaded = true;
    };
  }

  ngOnDestroy(): void {
    this.callAPIsWorker.terminate();
  }
}