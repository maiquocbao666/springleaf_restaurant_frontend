export interface User {
  userId?: number;
  fullName: string;
  username: string;
  password: string;
  phone: string;
  email: string;
  address: string; 
  image: string;
  managerId: number;
  restaurantBranchId: number; 
  status: boolean;
}
