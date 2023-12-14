import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
import { AdminUsersDetailComponent } from '../admin-users-detail/admin-users-detail.component';

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
    private http: HttpClient
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

}
