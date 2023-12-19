import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-restaurant-detail',
  templateUrl: './admin-restaurant-detail.component.html',
  styleUrls: ['./admin-restaurant-detail.component.css']
})
export class AdminRestaurantDetailComponent {
  @Input() restaurant: Restaurant | undefined;
  @Output() restaurantSaved: EventEmitter<void> = new EventEmitter<void>();
  fieldNames: string[] = [];
  restaurants: Restaurant[] = [];
  restaurantForm: FormGroup;
  isSubmitted = false;

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
      phone: ['', [Validators.required, Validators.pattern('^\\d{10,11}$')]],
      email: ['', [Validators.required, Validators.email]],
      statusId: ['', [Validators.required]],
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
        statusId: this.restaurant.statusId,
      });
    }
  }

  updateRestaurant(): void {
    this.isSubmitted = true;

    if (this.restaurantForm.valid) {
      const updatedRestaurant: Restaurant = {
        restaurantId: +this.restaurantForm.get('restaurantId')?.value,
        restaurantName: this.restaurantForm.get('restaurantName')?.value,
        address: this.restaurantForm.get('address')?.value,
        phone: this.restaurantForm.get('phone')?.value,
        email: this.restaurantForm.get('email')?.value,
        statusId: this.restaurantForm.get('statusId')?.value,
      };

      this.restaurantService.update(updatedRestaurant).subscribe(
        () => {
          Swal.fire('Thành công', 'Cập nhật thành công!', 'success');
          this.activeModal.close('Close after saving');
          this.restaurantForm.reset();

        },
        (error) => {
          Swal.fire('Thất bại', 'Cập nhật thất bại!', 'warning');
          console.error('Cập nhật không thành công:', error);
        }
      );
    } else
      Swal.fire('Thất bại', 'Cập nhật không thành công!', 'warning');
  }

}
