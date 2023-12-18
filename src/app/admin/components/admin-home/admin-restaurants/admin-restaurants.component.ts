import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { ToastService } from 'src/app/services/toast.service';
import Swal from 'sweetalert2';
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
  isSubmitted = false;
  isNewlyAdded = false;
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  constructor(
    private restaurantService: RestaurantService, // Đổi tên service nếu cần
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private sweetAlertService: ToastService

  ) {
    this.restaurantForm = new FormGroup({
      // restaurantId: new FormControl('', Validators.required),
      restaurantName: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required, Validators.pattern('^\\d{10,11}$')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      statusId: new FormControl('',[Validators.required]),
    });

  }

  ngOnInit(): void {
    this.getRestaurants();
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  getRestaurants(): void {
    this.restaurantService.getCache().subscribe(
      (cached: any[]) => {
        this.restaurants = cached;
      }
    );
  }

  addRestaurant(): void {
    this.isSubmitted = true;
    if (this.restaurantForm.valid) {

      const restaurantName = this.restaurantForm.get('restaurantName')?.value?.trim() ?? '';
      const address = this.restaurantForm.get('address')?.value;
      const phone = this.restaurantForm.get('phone')?.value;
      const email = this.restaurantForm.get('email')?.value;
      const statusId = this.restaurantForm.get('statusId')?.value;

      const newRestaurant: Restaurant = {
        restaurantName: restaurantName,
        address: address,
        phone: phone,
        email: email,
        statusId: "Đang hoạt động"
      }

      this.restaurantService.add(newRestaurant)
        .subscribe(restaurant => {
          this.restaurantForm.reset();
          this.isSubmitted = false;
          this.sweetAlertService.showCustomAnimatedAlert('Thành công', 'success', 'Thêm thành công')

        });

    } else
      this.sweetAlertService.showCustomAnimatedAlert('Thất bại', 'warning', 'Thêm thất bại')


  }

  deleteRestaurant(restaurant: Restaurant): void {
    if (restaurant.restaurantId) {
      this.sweetAlertService
        .showConfirmAlert('Bạn có muốn xóa ' + restaurant.restaurantName + '?', 'Không thể lưu lại!', 'warning')
        .then((result) => {
          if (result.isConfirmed) {
            this.restaurantService.delete(restaurant.restaurantId!).subscribe(() => {
              console.log('Đã xóa nhà hàng!');
              Swal.fire('Thành công', 'Xóa ' + restaurant.restaurantName + ' thành công!', 'success');
              this.isSubmitted = false;
            });
          }
        });
    } else {
      Swal.fire('Thất bại', 'Không thể xóa nhà hàng với mã không xác định!', 'warning');
    }
  }


  openRestaurantDetailModal(restaurant: Restaurant) {
    const modalRef = this.modalService.open(AdminRestaurantDetailComponent, { size: 'lg' });
    modalRef.componentInstance.restaurant = restaurant;
    modalRef.componentInstance.restaurantSaved.subscribe(() => {
    });
  }

  sort(field: keyof Restaurant, ascending: boolean): void {
    this.restaurantService
      .sortEntities(this.restaurants, field, ascending)
      .subscribe(
        (data) => {
          this.restaurants = data;
        },
        (error) => {
          // Handle error if necessary
        }
      );
  }

  search() {
    if (this.keywords.trim() === '') {
      this.getRestaurants();
    } else {
      this.restaurantService.searchByKeywords(this.keywords, this.fieldName).subscribe(
        (data) => {
          this.restaurants = data;
        }
      );
    }
  }

  fieldName!: keyof Restaurant;
  changeFieldName(event: any) {
    this.fieldName = event.target.value;
    this.search();
  }

  keywords = '';
  changeSearchKeyWords(event: any){
    this.keywords = event.target.value;
    this.search();
  }

}
