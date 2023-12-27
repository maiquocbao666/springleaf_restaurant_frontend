import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-location-restaurant',
  templateUrl: './location-restaurant.component.html',
  styleUrls: ['./location-restaurant.component.css']
})
export class LocationRestaurantComponent {

  restaurants: Restaurant[] | null = null;

  chooseRestaurantFrom: FormGroup;
  user: User | null = null;
  constructor(
    private sweetAlertService: ToastService,
    private restaurantSerivce: RestaurantService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    public activeModal: NgbActiveModal,
  ){
    this.chooseRestaurantFrom = this.formBuilder.group({
      selectedRestaurant: [null, Validators.required],
    })
  }

  ngOnInit() {
    this.getRestaurants();
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
}
