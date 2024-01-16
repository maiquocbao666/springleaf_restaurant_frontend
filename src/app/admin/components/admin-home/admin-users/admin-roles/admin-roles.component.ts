import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Role } from "src/app/interfaces/role";
import { RoleService } from "src/app/services/role.service";
import { ToastService } from "src/app/services/toast.service";

@Component({
    selector: 'app-admin-roles',
    templateUrl: './admin-roles.component.html',
    styleUrls: ['./admin-roles.component.css']
})
export class AdminRolesComponent {
    @Input() role: Role | undefined;
    @Output() roleSaved: EventEmitter<void> = new EventEmitter<void>();
    roleForm!: FormGroup;
    roles: Role[] = []
    page: number = 1;
    count: number = 0;
    tableSize: number = 5;
    tableSizes: any = [5, 10, 15, 20];
    isSubmitted = false;
    constructor(
        private roleService: RoleService,
        private formBuilder: FormBuilder,
        private modalService: NgbModal,
        private sweetAlertService: ToastService,
        private http: HttpClient
    ) {
        this.roleForm = this.formBuilder.group({
            roleName: [null, [Validators.nullValidator]],
            description: [null, [Validators.nullValidator]],
          });
    }

    ngOnInit(): void {
        this.getRoles();
        console.log(this.roles);
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

    

}