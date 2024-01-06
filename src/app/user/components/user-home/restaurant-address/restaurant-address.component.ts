import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader'

@Component({
  selector: 'app-restaurant-address',
  templateUrl: './restaurant-address.component.html',
  styleUrls: ['./restaurant-address.component.css']
})
export class RestaurantAddressComponent {

  private map: google.maps.Map | undefined;

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {
    let loader = new Loader({
      apiKey: 'AIzaSyA2RgLSEt0AMVaW-Vj5ehMd60ItXkXsvEs',
    });

    loader.load().then(() => {
      const mapElement = this.renderer.selectRootElement('#map');

      if (mapElement) {
        this.map = new google.maps.Map(mapElement, {
          center: { lat: 10.25495094762458, lng: 105.9632437480188 },
          zoom: 20,
          styles: [],
        });

        // Thêm sự kiện click cho bản đồ
        // this.map.addListener('click', (event: google.maps.KmlMouseEvent) => {
        //   this.handleMapClick(event);
        // });
      } else {
        console.error('Map element not found.');
      }
    });
  }

  // Xử lý sự kiện click trên bản đồ
  private handleMapClick(event: google.maps.KmlMouseEvent): void {
    // Lấy tọa độ từ sự kiện
    const clickedLatLng = event.latLng;

    console.log(clickedLatLng);

    if (!clickedLatLng) {
      return;
    }

    // Hiển thị thông báo với tọa độ đã click
    alert(`Clicked LatLng: ${clickedLatLng.lat()}, ${clickedLatLng.lng()}`);
    const centerLatLng = new google.maps.LatLng(clickedLatLng.lat(), clickedLatLng.lng());
    this.map?.setCenter(centerLatLng);
  }

  //Thay đổi tọa độ
  target() {
    const centerLatLng = new google.maps.LatLng(10.25495094762458, 105.9632437480188);
    this.map?.setCenter(centerLatLng);
  }

}
