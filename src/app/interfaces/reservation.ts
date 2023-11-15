export interface Reservation {
    reservationId?: number;
    restaurantTableId: number;
    userId: number;
    reservationDate: Date;
    numberOfGuests: number;
}