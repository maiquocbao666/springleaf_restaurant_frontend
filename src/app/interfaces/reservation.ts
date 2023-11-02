export interface Reservation {
    reservationId: number;
    table: number;
    order: number;
    user: number;
    reservationDate: Date;
    numberOfGuests: number;
}