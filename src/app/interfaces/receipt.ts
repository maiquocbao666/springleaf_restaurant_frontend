
export interface Receipt {
    receiptId: number;
    userId: number;
    supplier: number;
    date: Date;
    totalAmount: number;
    inventory: number;
}