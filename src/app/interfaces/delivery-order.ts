export interface DeliveryOrder {
    deliveryOrderId?: number;
    user: number;
    deliveryAddress: string;
    deliveryrestaurantId: number;
    deliveryOrderTypeId: number;
    deliveryOrderStatusId: number;
    active: boolean;
}