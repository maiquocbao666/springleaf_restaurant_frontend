import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private route: ActivatedRoute,
    private cartService: CartService
  ) {
    window.addEventListener('storage', (event) => {
      if (event.key && event.oldValue !== null) {
        localStorage.setItem(event.key, event.oldValue);
      }
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
    this.cartDetailsService.getCartDetails()
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
