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


  constructor(
    private statisticsService: StatisticsService,
    private productService: ProductService,
    private ingredientService: IngredientService,) { }

  ngOnInit(): void {
    this.getProducts();
    this.getIngredients();
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

  getProducts(): void {
    this.productService.gets();
    this.productService.cache$
      .subscribe(() => {
        this.products = JSON.parse(localStorage.getItem(this.productsUrl) || 'null');
      });
  }

  getIngredients(): void {
    this.ingredientService.gets();
    this.ingredientService.cache$
      .subscribe(ingredients => {
        this.ingredientService.gets();
        this.ingredients = JSON.parse(localStorage.getItem(this.ingredientsUrl) || 'null')
      });
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
}
