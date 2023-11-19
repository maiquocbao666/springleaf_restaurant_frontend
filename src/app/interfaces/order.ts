// order.interface.ts

export interface Order {
  orderId: number;
  combo: number;
  reservationId: number;
  deliveryOrderId: number;
  orderDate: string;
  totalAmount: number;
  staffId: number;
  status: boolean;
}
