export interface Discount {
    discountId?: number;
    menuItemId: number;
    discountType: string;
    discountValue: number;
    startDate: string;
    endDate: string;
    discountCode: string;
    active: boolean;
}
