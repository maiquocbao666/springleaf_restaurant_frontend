import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { User } from "src/app/interfaces/user";
import { AuthenticationService } from "src/app/services/authentication.service";

@Component({
    selector: 'app-choosemenuitem',
    templateUrl: './bill-info.component.html',
    styleUrls: ['./bill-info.component.css']
})
export class BillInfoComponent {

    @Input() selected: any;
    @Input() totalPrice: any;
    user: User | null = null;
    billInfo : string = '';
    billPrice: number = 0;
    billTime: string = '';
    billDetail : string = '';
    constructor(
        public activeModal: NgbActiveModal,
        private authService: AuthenticationService
    ) {
        this.authService.getUserCache().subscribe(
            (data: any | null) => {
                this.user = data;
            }
        );
    }

    ngOnInit(): void {
        
        if (this.selected === "CartPayment") {
            this.billInfo = "Thanh toán hóa đơn mua hàng";
            this.billPrice = Number(this.totalPrice);
            this.billTime = this.getCurrentTimeFormatted();
            this.billDetail = "Thanh toán hóa đơn đặt món mang đi";
        }
        if (this.selected === "ReservationPaymentReservationOrderItem") {
            this.billInfo = "Thanh toán phí đặt bàn";
            this.billPrice = Number(this.totalPrice);
            this.billTime = this.getCurrentTimeFormatted();
            this.billDetail = "Thanh toán hóa đơn đặt trước bàn ăn và món ăn";
        }
        if (this.selected === "ReservationPaymentReservationDeposit") {
            this.billInfo = "Thanh toán đặt bàn";
            this.billPrice = Number(this.totalPrice);
            this.billTime = this.getCurrentTimeFormatted();
            this.billDetail = "Thanh toán hóa đơn đặt trước bàn ăn";
        }
        if(this.selected === "CartPaymentCOD"){
            this.billInfo = "Thanh toán hóa đơn mua hàng";
            this.billPrice = Number(this.totalPrice);
            this.billTime = this.getCurrentTimeFormatted();
            this.billDetail = "Thanh toán COD hóa đơn đặt món mang đi";
        }

    }


    formatAmount(amount: number): string {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    truncateString(inputString: string): string {
        // Tìm vị trí của khoảng trắng đầu tiên từ bên phải
        const firstSpaceIndex = inputString.lastIndexOf(' ');

        if (firstSpaceIndex !== -1) {
            // Cắt chuỗi từ bên phải đến khoảng trắng đầu tiên
            return inputString.slice(firstSpaceIndex + 1);
        } else {
            // Trường hợp không có khoảng trắng
            return inputString;
        }
    }

    getCurrentTimeFormatted(): string {
        const currentTime = new Date();

        // Lấy thông tin ngày, tháng, năm, giờ, phút, giây
        const day = currentTime.getDate();
        const month = currentTime.getMonth() + 1; // Tháng bắt đầu từ 0
        const year = currentTime.getFullYear();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const seconds = currentTime.getSeconds();

        // Định dạng theo yêu cầu "dd/mm/yyyy hh:mm:ss"
        const formattedTime = `${this.padZero(day)}/${this.padZero(month)}/${year} ${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;

        return formattedTime;
    }

    padZero(value: number): string {
        // Hàm này thêm số 0 phía trước nếu giá trị là một chữ số
        return value < 10 ? `0${value}` : `${value}`;
    }

}