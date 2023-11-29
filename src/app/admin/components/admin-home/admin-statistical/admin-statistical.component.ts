import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Ingredient } from 'src/app/interfaces/ingredient';
import { MenuItemIngredient } from 'src/app/interfaces/menu-item-ingredient';
import { Product } from 'src/app/interfaces/product';
import { IngredientService } from 'src/app/services/ingredient.service';
import { ProductService } from 'src/app/services/product.service';
import { StatisticsService } from 'src/app/services/statistical.service';

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

  reservations: any[] = [];
  selectedDate: string = '';
  topItems: any[] = [];

  constructor(
    private statisticsService: StatisticsService,
    private productService: ProductService,
    private ingredientService: IngredientService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.getProducts();
    this.getIngredients();
    this.getTop5OrderedItems();
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

  getProductById(id: number): Product | null {
    const found = this.products.find(data => data.menuItemId === id);
    return found || null;
  }

  getProducts(): void {
    this.productService.getCache().subscribe(
      (cached: any[]) => {
        this.products = cached;
      }
    );
  }

  getIngredients(): void {
    this.ingredientService.getCache().subscribe(
      (cached: any[]) => {
        this.ingredients = cached;
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
          // Xử lý dữ liệu nhận được từ API ở đây
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
        console.log(data); // Hiển thị dữ liệu nhận được từ API trong console log
      },
      (error) => {
        // Xử lý lỗi nếu có
        console.error(error);
      }
    );
  }
}
