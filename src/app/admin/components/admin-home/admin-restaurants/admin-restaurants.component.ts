import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { AdminRestaurantDetailComponent } from './admin-restaurant-detail/admin-restaurant-detail.component';

@Component({
  selector: 'app-admin-restaurants',
  templateUrl: './admin-restaurants.component.html',
  styleUrls: ['./admin-restaurants.component.css']
})
export class AdminRestaurantsComponent {
  restaurants: Restaurant[] = [];
  restaurantForm: FormGroup;
  restaurant: Restaurant | undefined;
  fieldNames: string[] = [];

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  constructor(
    private restaurantService: RestaurantService, // Đổi tên service nếu cần
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) {
    window.addEventListener('storage', (event) => {
      if (event.key && event.oldValue !== null) {
        localStorage.setItem(event.key, event.oldValue);
      }
    });
    this.restaurantForm = this.formBuilder.group({
      restaurantId: ['', [Validators.required]],
      restaurantName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.getRestaurants();
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getRestaurants();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getRestaurants();
  }

  getRestaurants(): void {
    this.restaurantService.getRestaurants()
      .subscribe(restaurants => this.restaurants = restaurants);
  }

  addRestaurant(): void {

    try {
      const restaurantName = this.restaurantForm.get('restaurantName')?.value?.trim() ?? '';
      const address = this.restaurantForm.get('address')?.value;
      const phone = this.restaurantForm.get('phone')?.value;
      const email = this.restaurantForm.get('email')?.value;

      const newRestaurant: Restaurant = {
        restaurantName: restaurantName,
        address: address,
        phone: phone,
        email: email,
      }

      this.restaurantService.addRestaurant(newRestaurant)
        .subscribe(restaurant => {
          this.getRestaurants();
          this.restaurantForm.reset();
        });
    } catch (error) {
      console.log("Thêm nhà hàng: Lỗi");
    }
  }

  deleteRestaurant(restaurant: Restaurant): void {

    if (restaurant.restaurantId) {
      this.restaurants = this.restaurants.filter(r => r !== restaurant);
      this.restaurantService.deleteRestaurant(restaurant.restaurantId).subscribe();
    } else {
      console.log("Không có restaurantId");
    }


  }

  openRestaurantDetailModal(restaurant: Restaurant) {
    const modalRef = this.modalService.open(AdminRestaurantDetailComponent, { size: 'lg' });
    modalRef.componentInstance.restaurant = restaurant;
  }
}
