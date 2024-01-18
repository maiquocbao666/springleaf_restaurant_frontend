import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
import { AdminUsersDetailComponent } from '../admin-users-detail/admin-users-detail.component';
import { Province } from 'src/app/interfaces/address/Province';
import { District } from 'src/app/interfaces/address/District';
import { Ward } from 'src/app/interfaces/address/Ward';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent {

  users: User[] = [];

  @Input() user: User | undefined;
  @Output() userSaved: EventEmitter<void> = new EventEmitter<void>();
  userForm!: FormGroup;
  fieldNames: string[] = [];
  isSubmitted = false;
  page: number = 1;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 20];
  codeCache: string | null = null;
  code: string = '';

  Provinces: any = [];
  selectedProvince: number | null = null;
  Districts: any = [];
  selectedDistrict: number | null = null;
  Wards: any = [];
  selectedWard: number | null = null;

  userAddressHouse: string = '';
  userProvince: Province | null = null;
  userDistrict: District | null = null;
  userWard: Ward | null = null;

  userRestaurantAddress: string = '';
  userRestaurantProvince: Province | null = null;
  userRestaurantDistrict: District | null = null;
  userRestaurantWard: Ward | null = null;

  errorMessage: string | undefined;

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private sweetAlertService: ToastService,
    private http: HttpClient,
    private authService : AuthenticationService
  ) {
    this.userForm = this.formBuilder.group({
      fullName: [null, [Validators.nullValidator]],
      username: [null, [Validators.nullValidator]],
      password: [null, [this.customPasswordValidator]],
      repassword: [null, [Validators.nullValidator, this.passwordMatchValidator()]],
      phone: [null, [Validators.nullValidator]],
      email: [null, [Validators.nullValidator]],
      code: [null, [Validators.nullValidator]],
    });

    // const provincesString = localStorage.getItem('Provinces');
    // if (provincesString) {
    //   const parsedProvince: Province[] = JSON.parse(provincesString);
    //   this.Provinces = parsedProvince;
    // } else {
    //   console.error('No products found in local storage or the value is null.');
    // }
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.gets().subscribe(
      (cached: any[]) => {
        this.users = cached;
      }
    )
  }
  compareInputWithCodeCache(): boolean {
    if (this.code === this.codeCache) {
      this.sweetAlertService.showTimedAlert('Xác nhận thành công!', '', 'success', 2000);
      this.userForm.get('fullName')?.enable();
      this.userForm.get('username')?.enable();
      this.userForm.get('phone')?.enable();
      this.userForm.get('password')?.enable();
      this.userForm.get('repassword')?.enable();
      return true;
    } else {
      this.sweetAlertService.showTimedAlert('Xác nhận thất bại!', '', 'error', 2000);
      return false;
    }
  }
  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const repassword = control.get('repassword')?.value;
      return password === repassword ? null : { 'Xác nhận mật khẩu sai': true };
    };
  }

  customPasswordValidator(control: AbstractControl) {
    const password = control.value;
    if (!password) {
      return { 'required': true, 'message': 'Mật khẩu không được để trống' };
    }

    if (password.length < 6) {
      return { 'minLength': true, 'message': 'Mật khẩu phải ít nhất 6 ký tự' };
    }

    if (password.length > 12) {
      return { 'maxLength': true, 'message': 'Mật khẩu tối đa 12 ký tự' };
    }

    if (!/[A-Z]/.test(password)) {
      return { 'uppercase': true, 'message': 'Mật khẩu phải có ký tự viết hoa' };
    }

    if (!/\d/.test(password)) {
      return { 'digit': true, 'message': 'Mật khẩu phải ít nhất 1 ký tự số' };
    }
    return null;
  }

  openProductDetailModal(user: User) {
    const modalRef = this.modalService.open(AdminUsersDetailComponent, { size: 'lg' });
    modalRef.componentInstance.user = user;
    modalRef.componentInstance.userSaved.subscribe(() => {
    });
  }

  upperCase(str: string): string {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  register() {
    if (this.userForm.valid) {
      const fullname = this.userForm.get('fullName')?.value;
      const username = this.userForm.get('username')?.value;
      const password = this.userForm.get('password')?.value;
      const email = this.userForm.get('email')?.value;
      const phone = this.userForm.get('phone')?.value;
      const fullName = this.upperCase(fullname);

      this.authService.register2(fullName, username, password, phone, email)
        .subscribe(
          (response) => {
            if (response.error === 'Role not found') {
              console.log(response.error);
              this.errorMessage = response.error;
              this.sweetAlertService.showTimedAlert('Lỗi quyền hạn', '', 'error', 2000);
            }
            else if (response.error === 'User with this email already exists') {
              console.log(response.error);
              this.errorMessage = response.error;
              this.sweetAlertService.showTimedAlert('Đăng ký thất bại', 'Email đã được sử dụng', 'error', 2000);
            } else if (response.error === 'User with this username already exists') {
              console.log(response.error);
              this.errorMessage = response.error;
              this.sweetAlertService.showTimedAlert('Đăng ký thất bại', 'Username đã được sử dụng', 'error', 2000);
            } else {
              console.log('Registration successful');
              this.sweetAlertService.showTimedAlert('Đăng ký thành công', '', 'success', 2000);
              const container = document.getElementById('container');
              if (container) {
                container.classList.remove('right-panel-active');
              }
            }
          }
        );
    } else {
      console.error('Vui lòng nhập tên đăng nhập, mật khẩu và tên.');

    }
  }

  // initUserAddress(userAddress : string ) : string {
  //       // In put
  //       const address = userAddress.toString();
  //       const splittedStrings = address.split('-');
  //       const addressHouse = splittedStrings[0];
  //       const addressWard = splittedStrings[1];
  //       const addressDistrict = parseInt(splittedStrings[2], 10);
  //       const addresssProvince = parseInt(splittedStrings[3], 10);
  //       // OutPut
  //       let homeReturn : string = '';
  //       let wardReturn : Ward | null = null;
  //       let districtReturn : District | null = null;
  //       let provinceReturn : Province | null = null;

  //       homeReturn = addressHouse;

  //       for (const province of this.Provinces) {
  //         if (province.ProvinceID === addresssProvince) {
  //           provinceReturn = province;
  //           break;
  //         }
  //       }

  //       if (this.userProvince) {
  //         this.getDistrict(provinceReturn!.ProvinceID).then(() => {
  //           for (const district of this.Districts) {
  //             if (district.DistrictID === addressDistrict) {
  //               districtReturn = district;
  //               if (districtReturn) {
  //                 this.getWard(districtReturn.DistrictID).then(() => {
  //                   for (const ward of this.Wards) {
  //                     if (ward.WardCode === addressWard) {
  //                       wardReturn = ward;
  //                       break;
  //                     }
  //                   }
  //                 });

  //               }
  //               break;
  //             }
  //           }
  //         });
  //       }

  //       return homeReturn + ", " + wardReturn!.WardName + ", " + districtReturn!.DistrictName + ", " + provinceReturn?.ProvinceName
  //       ;
  // }

  // onProvinceChange() {
  //   console.log('onProvinceChange called');
  //   if (typeof this.profileForm.get('provinceChange')?.value === 'number') {
  //     this.cartService.getDistrict(this.profileForm.get('provinceChange')?.value);
      
  //   }
  //   console.log(this.profileForm.get('provinceChange')?.value); // In ra giá trị tỉnh/thành phố đã chọn
  // }

  // onDistrictChange() {
  //   console.log('onDistrictChange called');
  //   if (typeof this.profileForm.get('districtChange')?.value === 'number') {
  //     this.cartService.getWard(this.profileForm.get('districtChange')?.value);
  //   }
  //   console.log(this.profileForm.get('districtChange')?.value); // In ra giá trị tỉnh/thành phố đã chọn
  // }

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


}
