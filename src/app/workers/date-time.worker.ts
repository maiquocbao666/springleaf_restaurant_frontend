/// <reference lib="webworker" />

self.addEventListener('message', (event: MessageEvent) => {
    if (event.data === 'start') {
        setInterval(() => {
            const utcTimeString = new Date().toISOString(); // Lấy thời gian UTC
            const utcTimeDate = new Date(utcTimeString); // Chuyển đổi chuỗi thành đối tượng Date

            self.postMessage(utcTimeDate); // Gửi thời gian UTC về luồng chính
        }, 1000);
    }
});