export interface Receipt {
    receiptId: number;
    userId: string;
    supplier: number;
    date: Date;
    totalAmount: Number;
    inventory: number;
}