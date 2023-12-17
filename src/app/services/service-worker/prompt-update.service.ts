import { Injectable } from "@angular/core";
import { SwUpdate, VersionReadyEvent } from "@angular/service-worker";
import { filter } from "rxjs";

@Injectable({providedIn: 'root'})
export class PromptUpdateService {

    constructor(swUpdate: SwUpdate) {
        swUpdate.versionUpdates
          .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
          .subscribe(evt => {
            if (this.promptUser(evt)) {
              // Reload the page to update to the latest version.
              document.location.reload();
            }
          });
      }
      
      private promptUser(evt: VersionReadyEvent): boolean {
        // Thực hiện các bước tương tác với người dùng, hiển thị hộp thoại, v.v.
        // Trong trường hợp đơn giản, bạn có thể trả về true để tự động làm mới trang.
        // Hoặc trả về false nếu bạn muốn người dùng xác nhận cập nhật.
        return true;
      }

}