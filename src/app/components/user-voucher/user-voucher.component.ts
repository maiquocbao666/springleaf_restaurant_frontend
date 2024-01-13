import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Discount } from "src/app/interfaces/discount";
import { User } from "src/app/interfaces/user";
import { AuthenticationService } from "src/app/services/authentication.service";
import { DiscountService } from "src/app/services/discount.service";

@Component({
    selector: 'app-profile',
    templateUrl: './user-voucher.component.html',
    styleUrls: ['./user-voucher.component.css']
})
export class UserVoucherComponent {

    user: User | null = null;
    discounts: Discount[] = [];
    constructor(
        private authService: AuthenticationService,
        private discountService: DiscountService,
        public activeModal: NgbActiveModal,
    ) {
        this.authService.getUserCache().subscribe(
            (data) => {
                this.user = data;
            }
        );
    }

    ngOnInit(): void {
        this.getVoucher();
        console.log(this.discounts);
      }
    
      getVoucher() {
        this.discountService.getCache().subscribe(
          (cached: Discount[]) => {
            // Lọc danh sách theo userId
            this.discounts = cached.filter(discount => discount.userId === this.user?.userId);
          }
        );
      }
}