export interface DeliveryOrder {
    deliveryOrderId: number;
    user: number;
    orderDate: Date;
    deliveryAddress: string;
    totalAmount: number;
    order: number;
    status: number;
}