export interface Reservation {
    reservationId?: number;
    restaurantTableId: number;
    userId: number;
    reservationDate: string;
    outTime: string;
    numberOfGuests: number;
    reservationStatusId: number;
}