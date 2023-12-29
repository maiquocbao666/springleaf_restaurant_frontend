import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { District } from 'src/app/interfaces/address/District';
import { Province } from 'src/app/interfaces/address/Province';
import { Ward } from 'src/app/interfaces/address/Ward';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  @Input() userUpdate: User | undefined;
  profileForm: FormGroup;

  user: User | null = null;

  ProvincesAPI: any = [];
  Provinces: any = [];
  selectedProvince: number | null = null;
  DisTrictsFromAPI: any = [];
  Districts: any = [];
  selectedDistrict: number | null = null;
  WardsFromAPI: any = [];
  Wards: any = [];
  selectedWard: number | null = null;
  showAddressInput = true;
  // địa chỉ người dùng
  userAddressHouse: string = '';
  userProvince: Province | null = null;
  userDistrict: District | null = null;
  userWard: Ward | null = null;
  // địa chỉ nhà hàng của người dùng
  userRestaurantAddress: string = '';
  userRestaurantProvince: Province | null = null;
  userRestaurantDistrict: District | null = null;
  userRestaurantWard: Ward | null = null;
  restaurants: Restaurant[] | null = null;
  userRestaurant: Restaurant | null = null;
  roles: String[] | null = null;
  userRole: string | null = null;

  @ViewChild('imageUpload') imageUpload!: ElementRef<HTMLInputElement>;
  @ViewChild('imagePreview') imagePreview!: ElementRef<HTMLImageElement>;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastService: ToastService,
    private cartService: CartService,
    private authService: AuthenticationService,
    private restaurantSerivce: RestaurantService,
    private http: HttpClient,
  ) {
    // Lấy danh sách Thành phố từ localstorage
    const provincesString = localStorage.getItem('Provinces');
    if (provincesString) {
      const parsedProvince: Province[] = JSON.parse(provincesString);
      this.Provinces = parsedProvince;
    } else {
      console.error('No products found in local storage or the value is null.');
    }
    this.profileForm = this.formBuilder.group({
      addressHouse: [null, [Validators.nullValidator]],
      fullName: [null, [this.customFullNameValidator]],
      username: [null, [Validators.nullValidator]],
      email: [null, [this.customEmailValidator]],
      phone: [null, [this.customPhoneValidator]],
      address: [null, [Validators.nullValidator]],
      imageUrl: ['', [Validators.required]],
      selectedRestaurant: [null, Validators.required],
      provinceChange: '',
      districtChange: '',
      wardChange: ''
    });

    this.authService.getUserCache().subscribe((data) => {
      this.user = data;
    });
    this.authService.roleCacheData$.subscribe((data) => {
      this.roles = data;
    });

    if (this.roles && this.roles.length > 0) {
      const predefinedRoles = ['USER', 'MANAGER', 'ADMIN'];

      for (const role of predefinedRoles) {
        if (this.roles.includes(role)) {
          this.userRole = role;
        } else {
          break;
        }
      }
      console.log(this.userRole);
    }

    this.initUserAddress();
  }

  initUserAddress() {
    if (this.user) {
      if (this.user.address) {
        const address = this.user.address.toString();
        const splittedStrings = address.split('-');
        const addressHouse = splittedStrings[0];
        this.userAddressHouse = addressHouse;
        const addressWard = splittedStrings[1];
        const addressDistrict = parseInt(splittedStrings[2], 10);
        const addresssProvince = parseInt(splittedStrings[3], 10);

        for (const province of this.Provinces) {
          if (province.ProvinceID === addresssProvince) {
            this.userProvince = province;
            break;
          }
        }

        if (this.userProvince) {
          this.getDistrict(this.userProvince.ProvinceID).then(() => {
            for (const district of this.Districts) {
              if (district.DistrictID === addressDistrict) {
                this.userDistrict = district;
                if (this.userDistrict) {
                  this.getWard(this.userDistrict.DistrictID).then(() => {
                    for (const ward of this.Wards) {
                      if (ward.WardCode === addressWard) {
                        this.userWard = ward;
                        break;
                      }
                    }
                    this.setValue();
                  });

                }
                break;
              }
            }
          });
        }
      } else {
        this.userAddressHouse = '';
        this.userProvince = null;
        this.userDistrict = null;
        this.userWard = null;
        this.setValue();
      }
    }
  }

  ngOnInit() {
    this.getRestaurants();
    this.cartService.getProvince();
    // this.cartService.provinceData$.subscribe(data => {
    //   this.ProvincesAPI = Object.values(data);
    // });
    // this.cartService.districtData$.subscribe(data => {
    //   this.DisTrictsFromAPI = Object.values(data);
    // });
    // this.cartService.wardData$.subscribe(data => {
    //   this.WardsFromAPI = Object.values(data);
    // });

  }

  getRestaurants(): void {
    this.restaurantSerivce.getCache().subscribe(
      (cached: any[]) => {
        this.restaurants = cached;
      }
    );
  }

  setValue() {
    if (this.user) {
      this.profileForm.patchValue({
        fullName: this.user.fullName,
        username: this.user.username,
        password: this.user.password,
        email: this.user.email,
        phone: this.user.phone,
        
        selectedRestaurant: this.user.restaurantBranchId
      });
      
      if (this.userProvince && this.userDistrict && this.userWard) {
        this.profileForm.patchValue({
          address: `${this.userAddressHouse}, ${this.userWard.WardName}, ${this.userDistrict.DistrictName}, ${this.userProvince.ProvinceName}`,
        });
      }
      if (!this.userProvince && !this.userDistrict && !this.userWard) {
        this.profileForm.patchValue({
          address: `Bạn chưa cập nhật địa chỉ`,
        });
      }

      if (this.userRestaurant) {
        this.profileForm.patchValue({
          selectedRestaurant: `${this.userRestaurant.restaurantName}`,
        });
      }
      this.profileForm.patchValue({
        imageUrl: this.user.image,
      });
      
    }
    this.updateImagePreview();
  }

  toggleAddressInput() {
    if (
      this.profileForm.get('addressHouse')?.value !== null
      && this.profileForm.get('provinceChange')?.value !== ''
      && this.profileForm.get('districtChange')?.value !== ''
      && this.profileForm.get('wardChange')?.value !== '') {
        
      this.profileForm.patchValue({
        address: `${this.profileForm.get('addressHouse')?.value}-${this.profileForm.get('wardChange')?.value}-${this.profileForm.get('districtChange')?.value}-${this.profileForm.get('provinceChange')?.value}`,
      });
    }
    this.showAddressInput = !this.showAddressInput;
  }
  CancelChangeAdress() {
    this.initUserAddress();
    this.showAddressInput = !this.showAddressInput;
  }



  onProvinceChange() {
    console.log('onProvinceChange called');
    if (typeof this.profileForm.get('provinceChange')?.value === 'number') {
      this.cartService.getDistrict(this.profileForm.get('provinceChange')?.value);
    }
    console.log(this.profileForm.get('provinceChange')?.value); // In ra giá trị tỉnh/thành phố đã chọn
  }

  onDistrictChange() {
    console.log('onDistrictChange called');
    if (typeof this.profileForm.get('districtChange')?.value === 'number') {
      this.cartService.getWard(this.profileForm.get('districtChange')?.value);

    }
    console.log(this.profileForm.get('districtChange')?.value); // In ra giá trị tỉnh/thành phố đã chọn
  }

  public getDistrict(ProvinceId: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const token = 'd6f64767-329b-11ee-af43-6ead57e9219a';

      const httpOptions = {
        headers: new HttpHeaders({
          'token': token
        })
      };

      const districtUrl = "https://online-gateway.ghn.vn/shiip/public-api/master-data/district";

      const requestBody = {
        province_id: ProvinceId
      };

      this.http.post<any>(districtUrl, requestBody, httpOptions).subscribe(response => {
        if (response && response.data) {
          this.Districts = response.data;
          resolve();
        } else {
          console.error('Invalid response format');
          reject('Invalid response format');
        }
      }, error => {
        console.error('Error fetching districts:', error);
        reject(error);
      });
    });
  }

  public getWard(selectedDistrictId: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const token = 'd6f64767-329b-11ee-af43-6ead57e9219a';

      const httpOptions = {
        headers: new HttpHeaders({
          'token': token
        })
      };

      const requestBody = {
        district_id: selectedDistrictId
      };

      const wardUrl = "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward";

      this.http.post<any>(wardUrl, requestBody, httpOptions).subscribe(response => {
        if (response && response.data) {
          this.Wards = response.data;
          console.log(response)
          resolve(); // Giải quyết Promise khi dữ liệu đã được lấy
        } else {
          console.error('Invalid response format');
          reject('Invalid response format'); // Từ chối Promise nếu có lỗi định dạng phản hồi
        }
      }, error => {
        console.error('Error fetching wards:', error);
        reject(error); // Từ chối Promise nếu có lỗi
      });
    });
  }



  updateProfile() {
    if (this.user && this.profileForm.valid) {
      let addressChange = '';
      if (
        this.profileForm.get('addressHouse')?.value !== null
        && this.profileForm.get('provinceChange')?.value !== ''
        && this.profileForm.get('districtChange')?.value !== ''
        && this.profileForm.get('wardChange')?.value !== '') {
        addressChange = `${this.profileForm.get('addressHouse')?.value} -${this.profileForm.get('wardChange')?.value}-${this.profileForm.get('districtChange')?.value}-${this.profileForm.get('provinceChange')?.value}`;
      } else {
        addressChange = this.user.address;
      }
      const userUpdate: User = {
        userId: this.user.userId,
        fullName: this.profileForm.get('fullName')?.value,
        username: this.user.username,
        password: this.user.password,
        email: this.profileForm.get('email')?.value,
        address: addressChange,
        phone: this.profileForm.get('phone')?.value,
        restaurantBranchId: this.profileForm.get('selectedRestaurant')?.value,
        // image: this.profileForm.get('image')?.value || this.user.image,
        image: this.selectedFileName || this.profileForm.get('imageUrl')?.value,
        status: this.user.status,
      };
      this.userService.updateProfile(userUpdate)
        .subscribe(
          (response) => {
            if (response.error === 'Email cannot update') {
              this.toastService.showTimedAlert('Email đã được sử dụng', '', 'error', 1500);
            }
            else if (response.error === 'Phone cannot update') {
              this.toastService.showTimedAlert('Số điện thoại đã được sử dụng', '', 'error', 1500);
            }
            else if(response.user){
              // Update user cache and handle success
              this.authService.setUserCache(response.user);
              this.initUserAddress();
              this.onUpload();
              this.toastService.showTimedAlert('Cập nhật thành công', '', 'success', 1500);
            }
          },
          (error) => {
            console.error('Error updating profile:', error);
          }
        );
    }
  }

  ngAfterViewInit() {
    this.imageUpload.nativeElement.addEventListener('change', (event) => {
      this.readImgUrlAndPreview(event.target!);
    });
  }

  readImgUrlAndPreview(input: EventTarget) {
    const fileInput = input as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview.nativeElement.src = e.target.result;
        this.imagePreview.nativeElement.style.opacity = '1';
      };
      reader.readAsDataURL(fileInput.files[0]);
    }
  }

  selectedFileName: string | undefined;

  selectedFile: File | undefined;
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
    this.selectedFileName = this.selectedFile?.name;
    this.profileForm.get('imageUrl')?.setValue(this.selectedFileName);
    console.log("Tên ảnh của bạn là" + this.selectedFileName)
  }

  onUpload() {
    if (this.selectedFile) {
      this.userService.uploadImage(this.selectedFile)
        .subscribe(response => {
          // Xử lý phản hồi từ server nếu cần
          console.log('Phản hồi từ server:', response);
        }, error => {
          // Xử lý lỗi nếu có
          console.error('Lỗi khi tải lên:', error);
        });
    }
  }

  imageUrlValue: string = '';
  updateImagePreview() {
    const imageUrl = this.profileForm.get('imageUrl')?.value;
    if (imageUrl) {
      this.imageUrlValue = 'http://localhost:8080/public/getImage/' + imageUrl;
      console.log('Giá trị của imageUrlValue:', this.imageUrlValue);
    } else {
      this.imageUrlValue = '';
    }
  }

  customFullNameValidator(control: AbstractControl) {
    const fullName = control.value;
    if (!fullName) {
      return { 'required': true, 'message': 'Họ tên không được để trống' };
    }
    if (fullName.length > 50) {
      return { 'required': true, 'message': 'Họ tên quá dài' };
    }
    const specialCharacterRegex = /[^a-zA-ZÀ-ỹ ]/;

    // Kiểm tra xem chuỗi có chứa ký tự đặc biệt không
    if (specialCharacterRegex.test(fullName)) {
      return { 'required': true, 'message': 'Không được chứa ký tự đặc biệt' };
    }
    if (/\d/.test(fullName)) {
      return { 'required': true, 'message': 'Không được chứa số' };
    }

    return true;
  }

  customEmailValidator(control: AbstractControl) {
    const email = control.value;

    if (!email) {
      return { 'required': true, 'message': 'Email không được để trống' };
    }

    // Sử dụng một biểu thức chính quy đơn giản để kiểm tra định dạng email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      return { 'required': true, 'message': 'Định dạng email không hợp lệ' };
    }

    return null;  // Trả về null nếu không có lỗi
  }

  customPhoneValidator(control: AbstractControl) {
    const phone = control.value;

    if (!phone) {
      return { 'required': true, 'message': 'Số điện thoại không được để trống' };
    }

    // Kiểm tra xem số điện thoại có chứa ký tự không phải số không
    if (/[^0-9]/.test(phone)) {
      return { 'required': true, 'message': 'Số điện thoại không được chứa ký tự đặc biệt hoặc chữ' };
    }

    // Kiểm tra xem số điện thoại có đủ 11 số không
    if (phone.length !== 10) {
      return { 'required': true, 'message': 'Số điện thoại phải có đủ 11 số' };
    }

    return null; // Trả về null nếu không có lỗi
  };

}




