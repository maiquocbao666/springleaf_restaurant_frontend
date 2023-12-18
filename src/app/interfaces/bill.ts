export interface Bill {
    billId?: number;
    userId: number;
    orderId: number;
    billTime: string;
    totalAmount: number;
    paymentMethod: number;
    address: string;
    bankNumber: string;
}
