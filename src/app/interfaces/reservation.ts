export interface Reservation {
    reservationId?: number;
    restaurantTableId: number;
    userId: number;
    reservationDate: string;
    outTime: string;
    numberOfGuests: number;
    reservationStatusName: string;
    reservationOrderStatus : boolean;
    username : string;
    userPhone : string;
    reservationDeposit: number;
}