export interface User {
  userId: number;
  fullName: string;
  username: string;
  password: string;
  phone: string;
  email: string;
  address: number; // Kiểu dữ liệu này phụ thuộc vào kiểu dữ liệu bạn sử dụng trong Spring Boot
  image: string;
  managerId: number;
  restaurantBranchId: number; // Sử dụng tên trường giống với entity Spring Boot
  roleId: number;
  
}
