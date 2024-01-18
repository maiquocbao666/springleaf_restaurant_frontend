import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Role } from "src/app/interfaces/role";
import { User } from "src/app/interfaces/user";
import { UserRole } from "src/app/interfaces/user-role";
import { RoleService } from "src/app/services/role.service";
import { ToastService } from "src/app/services/toast.service";
import { UserRoleService } from "src/app/services/user-role.service";
import { UserService } from "src/app/services/user.service";

@Component({
    selector: 'app-admin-user-roles-types',
    templateUrl: './admin-user-roles.component.html',
    styleUrls: ['./admin-user-roles.component.css']
})
export class AdminUserRolesComponent {

    users: User[] = [];
    roles: Role[] = [];
    userRoleForm !: FormGroup;

    page: number = 1;
    count: number = 0;
    tableSize: number = 5;
    tableSizes: any = [5, 10, 15, 20];
    isSubmitted = false;

    @Input() user: User | undefined;
    @Output() userSaved: EventEmitter<void> = new EventEmitter<void>();
    constructor(
        private roleService: RoleService,
        private formBuilder: FormBuilder,
        private modalService: NgbModal,
        private toast: ToastService,
        private http: HttpClient,
        private userService: UserService,
        private userRoleService : UserRoleService,
    ) {
        this.userRoleForm = this.formBuilder.group({
            userId: [null, [Validators.nullValidator]],
            roleId: [null, [Validators.nullValidator]],
        });
    }


    ngOnInit(): void {
        this.getUsers();
        this.getRoles();
        console.log(this.users);
        console.log(this.roles);
    }

    getUsers(): void {
        this.userService.gets().subscribe(
            (cached: any[]) => {
                this.users = cached;
            }
        )
    }

    getRoles(): void {
        this.roleService.getCache().subscribe(
            (cached: any[]) => {
                this.roles = cached;
            }
        )
    }

    onTableDataChange(event: any) {
        this.page = event;
    }

    onTableSizeChange(event: any): void {
        this.tableSize = event.target.value;
        this.page = 1;
    }

    openProductDetailModal(user : any){
        this.userRoleForm.get('userId')?.setValue(user.userId);

    }

    updateUserRole(): void {
        this.isSubmitted = true;
        if (this.userRoleForm.valid) {
          const userid = this.userRoleForm.get('userId')?.value;
          const roleId = this.userRoleForm.get('roleId')?.value;
    
          const newProduct: UserRole = {
            userId: userid,
            roleId: roleId,
            
          };
          this.userRoleService.add(newProduct)
            .subscribe(product => {
              this.toast.showCustomAnimatedAlert('Thêm thành công', 'success', 'animated tada');
              this.isSubmitted = false;
            });
        } else {
          this.toast.showCustomAnimatedAlert('Thất bại', 'warning', 'Thêm thất bại')
        }
      }

}