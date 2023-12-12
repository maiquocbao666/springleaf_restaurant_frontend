import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ToastService } from 'src/app/services/toast.service';
import { CartService } from 'src/app/services/cart.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Province } from 'src/app/interfaces/address/Province';
import { District } from 'src/app/interfaces/address/District';
import { Ward } from 'src/app/interfaces/address/Ward';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  @Input() userUpdate: User | undefined;
  userData: any = {};
  profileForm: FormGroup;
  
  user: User | null = null;

  ProvincesAPI : any = [];
  Provinces: any = [];
  selectedProvince: number | null = null;
  DisTrictsFromAPI : any = [];
  Districts: any = [];
  selectedDistrict: number | null = null;
  WardsFromAPI : any = [];
  Wards: any = [];
  selectedWard: number | null = null;
  showAddressInput = true;

  userProvince : Province | null = null;
  userDistrict : District | null = null;
  userWard: Ward | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastService : ToastService,
    private cartService : CartService,
    private authService: AuthenticationService,
    private http : HttpClient,
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
      fullName: [null, [Validators.nullValidator]],
      username: [null, [Validators.nullValidator]],
      email: [null, [Validators.nullValidator]],
      phone: [null, [Validators.nullValidator]],
      address: [null, [Validators.nullValidator]],
      provinceChange: '',
      districtChange: '',
      wardChange: '',
    });
    this.authService.getUserCache().subscribe((data) => {
      this.user = data;
    });
    
    
    this.initUserAddress();
  }

  initUserAddress(){
    if (this.user) {
      if(this.user.address){
      const address = this.user.address.toString(); 
      const splittedStrings = address.split('-');
      const addressWard = splittedStrings[0];
      const addressDistrict = parseInt(splittedStrings[1], 10);
      const addresssProvince = parseInt(splittedStrings[2], 10);
    
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
              if(this.userDistrict) {
                console.log('here')
                this.getWard(this.userDistrict.DistrictID).then(() => {
                  for(const ward of this.Wards){
                    if(ward.WardCode === addressWard) {
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
      }else{
        this.setValue();
      }
      
    }
  }
  
  ngOnInit() {
    this.cartService.getProvince();
    this.cartService.provinceData$.subscribe(data => {
      this.ProvincesAPI = Object.values(data);
    });
    this.cartService.districtData$.subscribe(data => {
      this.DisTrictsFromAPI = Object.values(data);
    });
    this.cartService.wardData$.subscribe(data => {
      this.WardsFromAPI = Object.values(data);
    });
  }

  setValue() {
    if (this.user) {
      if(this.userProvince && this.userDistrict && this.userWard){
        this.profileForm.patchValue({
          fullName: this.user.fullName,
          username: this.user.username,
          password: this.user.password,
          email : this.user.email,
          phone : this.user.phone,
          address : `${this.userProvince.ProvinceName} - ${this.userDistrict.DistrictName} - ${this.userWard.WardName}`,
        });
      }else{
        this.profileForm.patchValue({
          fullName: this.user.fullName,
          username: this.user.username,
          password: this.user.password,
          email : this.user.email,
          phone : this.user.phone,
          address : this.user.address,
        });
      }
      
    }
  }

  toggleAddressInput() {
    this.setValue();
    this.showAddressInput = !this.showAddressInput;
  }
  CancelChangeAdress(){
    this.initUserAddress();
    this.showAddressInput = !this.showAddressInput;
  }

  updateProfile() {
    let addressChange = '';
    if (this.selectedDistrict !== null && this.selectedWard !== null) {
      addressChange = `${this.selectedWard}-${this.selectedDistrict}-${this.selectedProvince}`;
    }else{
      addressChange = this.userData.address;
    }
    if (this.userData) {
      const userUpdate: User = {
        userId: this.userData.userId,
        fullName: this.profileForm.get('fullName')?.value,
        username: this.userData.username,
        password : this.userData.password,
        email: this.profileForm.get('email')?.value,
        address: addressChange,
        phone: this.profileForm.get('phone')?.value,
        restaurantBranchId: this.userData.restaurantBranchId,
        image: this.userData.image,
        managerId: this.userData.managerId,
        status: this.userData.status,
      };
  
      this.userService.updateProfile(userUpdate).subscribe(
        () => {
          this.authService.setUserCache(userUpdate);
          this.initUserAddress();
          this.toastService.showTimedAlert('Cập nhật thành công','','success',1500)
        },
        (error) => {
          console.error('Error updating profile:', error);
  
        }
      );
    }
  }
  
  onProvinceChange() {
    console.log('onProvinceChange called');
    if (typeof this.selectedProvince === 'number') {
      this.cartService.getDistrict(this.selectedProvince);
    }
    console.log(this.selectedProvince); // In ra giá trị tỉnh/thành phố đã chọn
  }

  onDistrictChange() {
    console.log('onDistrictChange called');
    if (typeof this.selectedDistrict === 'number') {
      this.cartService.getWard(this.selectedDistrict);

    }
    console.log(this.selectedDistrict); // In ra giá trị tỉnh/thành phố đã chọn
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
  
  
  
}

  


