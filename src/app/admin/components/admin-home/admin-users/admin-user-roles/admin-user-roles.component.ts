import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Role } from "src/app/interfaces/role";
import { RoleService } from "src/app/services/role.service";
import { ToastService } from "src/app/services/toast.service";

@Component({
    selector: 'app-admin-user-roles-types',
    templateUrl: './admin-user-roles.component.html',
    styleUrls: ['./admin-user-roles.component.css']
})
export class AdminUserRolesComponent {


    page: number = 1;
    count: number = 0;
    tableSize: number = 5;
    tableSizes: any = [5, 10, 15, 20];
    constructor(
        private roleService: RoleService,
        private formBuilder: FormBuilder,
        private modalService: NgbModal,
        private sweetAlertService: ToastService,
        private http: HttpClient

    ) {

    }


    ngOnInit(): void {

    }

    onTableDataChange(event: any) {
        this.page = event;
    }

    onTableSizeChange(event: any): void {
        this.tableSize = event.target.value;
        this.page = 1;
    }

}