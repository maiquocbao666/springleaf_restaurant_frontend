import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";

@Injectable({
    providedIn: 'root'
  })
export class UpLoadFileService {

    private uploadUrl = "http://localhost:8080";

    constructor(private http: HttpClient, private apiService: ApiService) {}

    uploadFile(file: File, path: string) {
      // Tạo FormData để chứa file và các biến khác
      const formData = new FormData();
      formData.append('file', file, file.name);
    
      // Tạo đường dẫn API sử dụng template string
      const apiUrl = `/api/upload?path=${path}`;
      // Gửi yêu cầu POST đến API
      this.http.post(apiUrl, formData).subscribe({
        next: response => {
          // Xử lý phản hồi từ API
          console.log(response);
        }
      });
    }
}