import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
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

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.profileForm = this.formBuilder.group({
      fullName: [null, [Validators.nullValidator]],
      username: [null, [Validators.nullValidator]],
      password: [null, [Validators.nullValidator]],
      email: [null, [Validators.nullValidator]],
      phone: [null, [Validators.nullValidator]],
      address: [null, [Validators.nullValidator]],
    });
  }

  ngOnInit() {
    this.userService.getProfile().subscribe({
      next: (data) => {
        this.userData = data;
        this.setValue();
      },
      error: (error) => {
        console.error('Lỗi khi lấy dữ liệu profile:', error);
      }
    });
  }

  setValue() {
    if (this.userData) {
      this.profileForm.patchValue({
        fullName: this.userData.fullName,
        username: this.userData.username,
        password: this.userData.password,
        email : this.userData.email,
        phone : this.userData.phone,
        address : this.userData.address,
      });
    }
  }

  updateProfile() {
    if (this.userData) {
      const userUpdate: User = {
        userId: this.userData.userId,
        fullName: this.profileForm.get('fullName')?.value,
        username: this.userData.username,
        password: "123",
        email: this.profileForm.get('email')?.value,
        address: this.profileForm.get('address')?.value,
        phone: this.profileForm.get('phone')?.value,
        restaurantBranchId: this.userData.restaurantBranchId,
        image: this.userData.image,
        managerId: this.userData.managerId,
        roleId: this.userData.roleId,
      };
  
      this.userService.updateProfile(userUpdate).subscribe(
        () => {
          // Xử lý khi cập nhật thành công
        },
        (error) => {
          console.error('Error updating profile:', error);
  
        }
      );
    }
  }
  
  
}

  


