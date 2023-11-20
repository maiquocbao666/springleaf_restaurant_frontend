
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Reservation } from '../interfaces/reservation';


@Injectable({
    providedIn: 'root'
})
export class ReservationService {

    private reservationsUrl = 'reservations';
    private reservationUrl = 'reservation';
    reservationsCache!: Reservation[];

    constructor(private apiService: ApiService) { }

    getReservations(): Observable<Reservation[]> {

        if (this.reservationsCache) {

            return of(this.reservationsCache);

        }

        const reservationsObservable = this.apiService.request<Reservation[]>('get', this.reservationsUrl);


        reservationsObservable.subscribe(data => {

            this.reservationsCache = data;

        });

        return reservationsObservable;

    }

    // Hàm kiểm tra xem đã có đặt bàn trong khoảng giờ đã đặt hay chưa
    private isTimeOverlapping(newReservation: Reservation): boolean {
        // Lấy thời gian bắt đầu và kết thúc của đặt bàn mới
        const newReservationStartTime = new Date(newReservation.reservationDate).getTime();
        const newReservationEndTime = new Date(newReservation.outTime).getTime();

        // Lặp qua danh sách các đặt bàn và kiểm tra xem có đặt bàn nào trùng lịch không
        const overlappingReservation = this.reservationsCache.find(reservation => {
            const existingReservationStartTime = new Date(reservation.reservationDate).getTime();
            const existingReservationEndTime = new Date(reservation.outTime).getTime();

            // Kiểm tra xem thời gian bắt đầu hoặc kết thúc của đặt bàn mới có nằm trong khoảng thời gian của đặt bàn đã có không
            return (
                (newReservationStartTime >= existingReservationStartTime && newReservationStartTime <= existingReservationEndTime) ||
                (newReservationEndTime >= existingReservationStartTime && newReservationEndTime <= existingReservationEndTime)
            );
        });

        // Trả về true nếu có trùng lịch, ngược lại trả về false
        return !!overlappingReservation;
    }

    // addReservation(newReservation: Reservation): Observable<Reservation> {
    //     // Tạo một Observable bằng cách sử dụng phương thức 'request' từ 'apiService'
    //     return this.apiService.request<Reservation>('post', this.reservationUrl, newReservation).pipe(
    //       // Sử dụng toán tử 'tap' để thực hiện các hành động không ảnh hưởng đến dữ liệu chính của Observable
    //       tap((addedReservation: Reservation) => {
    //         // Kiểm tra xem đã có đặt bàn trong khoảng giờ đã đặt hay chưa
    //         const isOverlapping = this.isTimeOverlapping(newReservation);
    
    //         if (!isOverlapping) {
    //           // Nếu không có trùng lịch, thêm đặt bàn mới vào mảng 'reservationsCache'
    //           this.reservationsCache.push(addedReservation);
    //           // Lưu mảng 'reservationsCache' vào localStorage dưới dạng JSON
    //           localStorage.setItem(this.reservationsUrl, JSON.stringify(this.reservationsCache));
    //         } else {
    //           // Nếu có trùng lịch, có thể thông báo hoặc xử lý tùy thuộc vào yêu cầu của bạn
    //           console.log('Đã có đặt bàn trong khoảng giờ đã đặt.');
    //         }
    //       })
    //     );
    //   }

      //Chạy được
    addReservation(newReservation: Reservation): Observable<Reservation> {
        // Tạo một Observable bằng cách sử dụng phương thức 'request' từ 'apiService'
        return this.apiService.request<Reservation>('post', 'reservation', newReservation).pipe(
            // Sử dụng toán tử 'tap' để thực hiện các hành động không ảnh hưởng đến dữ liệu chính của Observable
            tap((addedReservation: Reservation) => {
                // Thêm đặt bàn mới vào mảng 'reservationsCache'
                this.reservationsCache.push(addedReservation);

                // Lưu mảng 'reservationsCache' vào localStorage dưới dạng JSON
                localStorage.setItem(this.reservationsUrl, JSON.stringify(this.reservationsCache));
            })
        );
    }

    updateReservation(updatedReservation: Reservation): Observable<any> {

        const url = `${this.reservationUrl}/${updatedReservation.reservationId}`;

        return this.apiService.request('put', url, updatedReservation).pipe(

            tap(() => {

                const index = this.reservationsCache!.findIndex(reservation => reservation.reservationId === updatedReservation.reservationId);

                if (index !== -1) {

                    this.reservationsCache![index] = updatedReservation;
                    localStorage.setItem(this.reservationsUrl, JSON.stringify(this.reservationsCache));

                }

            })

        );

    }


    deleteReservation(id: number): Observable<any> {

        const url = `${this.reservationUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.reservationsCache.findIndex(reservation => reservation.reservationId === id);

                if (index !== -1) {

                    this.reservationsCache.splice(index, 1);
                    localStorage.setItem(this.reservationsUrl, JSON.stringify(this.reservationsCache));

                }

            })
        );

    }

    // Tìm kiếm tất cả reservation theo restaurantTableId
    getReservationsByTableId(restaurantTableId: number): Observable<Reservation[]> {
        if (this.reservationsCache) {
            // If cache exists, filter reservations based on restaurantTableId
            const filteredReservations = this.reservationsCache.filter(reservation => reservation.restaurantTableId === restaurantTableId);
            return of(filteredReservations);
        }

        const reservationsObservable = this.apiService.request<Reservation[]>('get', this.reservationsUrl);

        return reservationsObservable.pipe(
            // Filter reservations based on restaurantTableId
            map(reservations => {
                this.reservationsCache = reservations;
                return reservations.filter(reservation => reservation.restaurantTableId === restaurantTableId);
            })
        );
    }

    // Hàm để kiểm tra xem reservationStatus có được sử dụng trong các đặt chỗ không
    isReservationStatusUsed(reservationStatusId: number): boolean {
        // Lặp qua danh sách các đặt chỗ và kiểm tra xem có đặt chỗ nào sử dụng trạng thái này không
        const filteredReservation = this.reservationsCache.find(reservation => reservation.reservationStatusId === reservationStatusId);
        if (filteredReservation) {
            return true;
        }
        return false; // Trạng thái đặt chỗ không được sử dụng
    }

}