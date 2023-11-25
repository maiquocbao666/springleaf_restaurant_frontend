import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CartDetail } from 'src/app/interfaces/cart-detail';
import { CartDetailService } from 'src/app/services/cart-detail.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-user-cart',
  templateUrl: './user-cart.component.html',
  styleUrls: ['./user-cart.component.css']
})
export class UserCartComponent implements OnInit {
  cartDetails: CartDetail[] = [];
  Provinces: any = [];
  selectedProvince: number | null = null;
  Districts: any = [];
  selectedDistrict: number | null = null;
  Wards: any = [];
  selectedWard: number | null = null;

  constructor(
    private cartDetailsService: CartDetailService,
    private cartService: CartService
  ) {

  }
  @ViewChild('likeBtn') likeBtn!: ElementRef;
  @ViewChild('minusBtn') minusBtn!: ElementRef;
  @ViewChild('plusBtn') plusBtn!: ElementRef;

  ngAfterViewInit() {
    this.likeButtonHandler();
    this.minusButtonHandler();
    this.plusButtonHandler();
  }

  likeButtonHandler() {
    this.likeBtn.nativeElement.addEventListener('click', () => {
      this.likeBtn.nativeElement.classList.toggle('is-active');
    });
  }

  minusButtonHandler() {
    this.minusBtn.nativeElement.addEventListener('click', (e: Event) => {
      e.preventDefault();
      const input = this.minusBtn.nativeElement.closest('div').querySelector('input');
      let value = parseInt((input as HTMLInputElement).value);

      if (value > 1) {
        value -= 1;
      } else {
        value = 0;
      }

      (input as HTMLInputElement).value = value.toString();
    });
  }

  plusButtonHandler() {
    this.plusBtn.nativeElement.addEventListener('click', (e: Event) => {
      e.preventDefault();
      const input = this.plusBtn.nativeElement.closest('div').querySelector('input');
      let value = parseInt((input as HTMLInputElement).value);

      if (value < 100) {
        value += 1;
      } else {
        value = 100;
      }

      (input as HTMLInputElement).value = value.toString();
    });
  }

  ngOnInit(): void {
    this.getCarts();
    this.cartService.getProvince();
    this.cartService.provinceData$.subscribe(data => {
      this.Provinces = Object.values(data);
      console.log(this.Provinces);
    });
    this.cartService.districtData$.subscribe(data => {
      this.Districts = Object.values(data);
    });
    this.cartService.wardData$.subscribe(data => {
      this.Wards = Object.values(data);
    });
  }

  getCarts(): void {
    this.cartDetailsService.gets()
      .subscribe(cartDetails => this.cartDetails = cartDetails);
  }

  onProvinceChange() {
    console.log('onProvinceChange called');
    if (typeof this.selectedProvince === 'number') {
      this.cartService.getDistrict(this.selectedProvince);
    }
    console.log(this.selectedProvince); // In ra giá trị tỉnh/thành phố đã chọn
  }

  onDistrictChange() {
    console.log('onDistrictChange called');
    if (typeof this.selectedDistrict === 'number') {
      this.cartService.getWard(this.selectedDistrict);
    }
    console.log(this.selectedDistrict); // In ra giá trị tỉnh/thành phố đã chọn
  }
}
