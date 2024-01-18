export interface ProductDiscount {
    productDiscountId?  : number;
    menuItemId : number;
    restaurantId : number;
    discountValue : number;
    startDate : string;
    endDate : string ;
    active : boolean ;
}