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
          this.discounts = cached.filter(discount => discount.userId === this.user?.userId);
        }
      );
    }

    formatDate(dateString: string): string {
      // Tách ngày, tháng và năm từ chuỗi
      const parts = dateString.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
    
      // Định dạng lại chuỗi thành "dd-mm-yyyy"
      const formattedDate = `${day}-${month}-${year}`;
    
      return formattedDate;
    }

    formatAmount(amount: number): string {
      return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
}