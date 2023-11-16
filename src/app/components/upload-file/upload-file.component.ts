import { Component } from "@angular/core";

@Component({
    selector: 'app-profile',
    templateUrl: './upload-file.component.html',
    styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent {
    DTO_FOLDER: any[] = []; // Thay thế bằng dữ liệu thật từ API hoặc service của bạn
    selectedFolder: string = '';
    fileUpload: any;
    shared: boolean = true;

    submitForm() {
        // Thực hiện các thao tác cần thiết khi nhấn nút Submit
        console.log('Selected Folder:', this.selectedFolder);
        console.log('File:', this.fileUpload);
        console.log('Shared:', this.shared);
        // Gọi API hoặc xử lý dữ liệu theo logic của bạn ở đây
    }
}
