import { Injectable } from "@angular/core";
import { NgToastService } from 'ng-angular-popup';
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: 'root'
})
export class ToastService {



    constructor(
        private ngToastService: NgToastService,
        private toastr: ToastrService,
    ) { }

    showSuccess(message: string) {
        this.toastr.success(message);
    }

    showWarn(messge: string) {
        this.toastr.warning(messge);
    }

    showError(message: string) {
        this.toastr.error(message);
    }

    showInfo(message: string) {
        this.toastr.info(message);
    }

    // showSuccess(message: string) {
    //     this.ngToastService.success({ detail: "SUCCESS", summary: message, sticky: false, position: 'topRight', duration: 5000 });
    // }

    // showError(message: string) {
    //     this.ngToastService.error({ detail: "ERROR", summary: message, sticky: false, position: 'topRight', duration: 5000 });
    // }

    // showInfo(message: string) {
    //     this.ngToastService.info({ detail: "INFO", summary: message, sticky: false, position: 'topRight', duration: 5000 });
    // }

    // showWarn(message: string) {
    //     this.ngToastService.warning({ detail: "WARN", summary: message, sticky: false, position: 'topRight', duration: 5000 });
    // }

}