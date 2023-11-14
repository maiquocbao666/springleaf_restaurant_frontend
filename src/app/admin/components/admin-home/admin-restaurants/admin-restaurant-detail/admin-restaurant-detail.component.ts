import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';

@Component({
  selector: 'app-admin-restaurant-detail',
  templateUrl: './admin-restaurant-detail.component.html',
  styleUrls: ['./admin-restaurant-detail.component.css']
})
export class AdminRestaurantDetailComponent {
  @Input() restaurant: Restaurant | undefined;
  fieldNames: string[] = [];
  restaurants: Restaurant[] = [];
  restaurantForm: FormGroup;
  
  constructor(
    private restaurantService: RestaurantService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
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
    this.setValue();
  }
  
  setValue() {
    if (this.restaurant) {
      this.restaurantForm.patchValue({
        restaurantId: this.restaurant.restaurantId,
        restaurantName: this.restaurant.restaurantName,
        address: this.restaurant.address,
        phone: this.restaurant.phone,
        email: this.restaurant.email,
      });
    }
  }
  
  updateRestaurant(): void {
    this.activeModal.close('Close after saving');
    if (this.restaurantForm.valid) {
      const updatedRestaurant: Restaurant = {
        restaurantId: this.restaurantForm.get('restaurantId')?.value,
        restaurantName: this.restaurantForm.get('restaurantName')?.value,
        address: this.restaurantForm.get('address')?.value,
        phone: this.restaurantForm.get('phone')?.value,
        email: this.restaurantForm.get('email')?.value,
      };
  
      this.restaurantService.updateRestaurant(updatedRestaurant).subscribe(() => {
        // Cập nhật cache
        this.restaurantService.updateRestaurantCache(updatedRestaurant);
      });
    }
  }
  
}
