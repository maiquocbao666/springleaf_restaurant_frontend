export interface Discount {
    discountId?: number;
    userId : number;
    limitValue: number;
    discountValue: number;
    startDate: string;
    endDate: string;
    discountCode: string;
    active: boolean;
}
