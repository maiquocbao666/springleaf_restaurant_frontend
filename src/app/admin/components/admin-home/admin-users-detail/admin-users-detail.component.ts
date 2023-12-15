import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-users-detail',
  templateUrl: './admin-users-detail.component.html',
  styleUrls: ['./admin-users-detail.component.css']
})
export class AdminUsersDetailComponent {

  @Input() user: User | undefined;
  @Output() userSaved: EventEmitter<void> = new EventEmitter<void>();
  users: User[] = [];
  userForm: FormGroup;
  fieldNames: string[] = [];
  isSubmitted = false;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
  ) {
    this.userForm = this.formBuilder.group({
      userId: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required]],
      image: ['', [Validators.required]],
      status: [, [Validators.required]],
      restaurantBranchId: [, [Validators.required]],
      address: [, [Validators.required]],
    });
  }

  ngOnInit() {
    this.setValue();
  }

  setValue() {
    if (this.user) {
      this.userForm.patchValue({
        menuItemId: this.user.userId,
        fullName: this.user.fullName,
        username: this.user.username,
        phone: this.user.phone,
        email: this.user.email,
        status: this.user.status,
        image: this.user.image,
        restaurantBranchId: this.user.restaurantBranchId,

      });

      this.updateImagePreview(); // Gọi hàm cập nhật ảnh sau khi gán giá trị
    }
  }


  @ViewChild('imageUpload') imageUpload!: ElementRef<HTMLInputElement>;
  @ViewChild('imagePreview') imagePreview!: ElementRef<HTMLImageElement>;


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
    const imageUrl = this.userForm.get('image')?.value;
    if (imageUrl) {
      this.imageUrlValue = 'http://localhost:8080/public/getImage/' + imageUrl;
      console.log('Giá trị của imageUrlValue:', this.imageUrlValue);
    } else {
      this.imageUrlValue = '';
    }
  }

}
