import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Discount } from 'src/app/interfaces/discount';
import { Product } from 'src/app/interfaces/product';
import { DiscountProductInfo } from 'src/app/user/components/user-home/user-discounts/user-discounts.component';
import { ProductDiscount } from 'src/app/interfaces/product-discounts';
import { ProductDiscountService } from 'src/app/services/product-discount.service';

@Component({
  selector: 'app-location-restaurant',
  templateUrl: './location-restaurant.component.html',
  styleUrls: ['./location-restaurant.component.css']
})
export class LocationRestaurantComponent {

  restaurants: Restaurant[] | null = null;
  discounts: Discount[] = [];
  products: Product[] = [];
  productDiscounts: ProductDiscount[] = [];
  discountInfo: DiscountProductInfo[] = []

  chooseRestaurantFrom: FormGroup;
  user: User | null = null;
  constructor(
    private sweetAlertService: ToastService,
    private restaurantSerivce: RestaurantService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    public activeModal: NgbActiveModal,
    private productDiscountService: ProductDiscountService
  ) {
    this.chooseRestaurantFrom = this.formBuilder.group({
      selectedRestaurant: [null, Validators.required],
    })
    this.authService.getUserCache().subscribe((data) => {
      this.user = data;
    });
  }

  ngOnInit() {
    this.getRestaurants();
    const productsString = localStorage.getItem('products');
    if (productsString) {
      const parsedProducts: Product[] = JSON.parse(productsString);
      this.products = parsedProducts;
    } else {
      console.error('No products found in local storage or the value is null.');
    }
    const discountsString = localStorage.getItem('discounts');
    if (discountsString) {
      const parsedDiscounts: Discount[] = JSON.parse(discountsString);
      this.discounts = parsedDiscounts;
    } else {
      console.error('No products found in local storage or the value is null.');
    }
    console.log(this.products!, this.discounts!)
  }

  getRestaurants(): void {
    this.restaurantSerivce.getCache().subscribe(
      (cached: any[]) => {
        this.restaurants = cached;
      }
    );
  }

  onSubmit() {
    if (this.chooseRestaurantFrom.valid && this.user) {
      const selectedRestaurantValue = this.chooseRestaurantFrom.value.selectedRestaurant;

      const updateUser: User = {
        userId: this.user.userId,
        username: this.user.username,
        password: this.user.password,
        fullName: this.user.fullName,
        email: this.user.email,
        address: this.user.address,
        image: this.user.image,
        phone: this.user.phone,
        restaurantBranchId: selectedRestaurantValue,
        status: this.user.status,
      };

      this.userService.updateRestaurant(updateUser).subscribe({
        next: (response) => {
          this.sweetAlertService.showTimedAlert('Cập nhật thành công!', 'Chúc bạn có những trải nhiệm vui vẻ', 'success', 2000);

          this.authService.setUserCache(response);
          this.activeModal.close();
        },
        error: (error) => {
          console.error('Update failed', error);
          this.sweetAlertService.showTimedAlert('Cập nhật nhà hàng thất bại', 'Vui lòng liên hệ nhân viên quản lý', 'error', 1500);
        }
      });
    }
  }

  getProductDiscounts(): void {
    let restaurantId = this.chooseRestaurantFrom.get('selectedRestaurant')?.value;
    this.productDiscountService.getCache().subscribe(
      (cached: ProductDiscount[]) => {
        this.productDiscounts = cached.filter(discount => discount.restaurantId === restaurantId);

        for (let product of this.products!) {
          for (let discount of this.productDiscounts) {
            if (discount.menuItemId === product.menuItemId) {
              let newDiscount: DiscountProductInfo = {
                productDiscountId: discount.productDiscountId,
                discountValue: discount.discountValue,
                restaurantId: discount.restaurantId,
                menuItemId: product.menuItemId!,
                startDate: discount.startDate,
                endDate: discount.endDate,
                productName: product.name,
                imageUrl: product.imageUrl,
                unitPrice: product.unitPrice,
                active: discount.active
              }
              this.discountInfo.push(newDiscount);
              break;
            }
          }
        }
        console.log(this.discountInfo)

      }
    );
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }
}
