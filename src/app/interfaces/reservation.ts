export interface Reservation {
    reservationId?: number;
    restaurantTableId: number;
    userId: number;
    reservationDate: String;
    numberOfGuests: number;
}