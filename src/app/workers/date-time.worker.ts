/// <reference lib="webworker" />

self.addEventListener('message', (event: MessageEvent) => {
    if (event.data === 'start') {
        setInterval(() => {
            const utcTimeString = new Date();
            self.postMessage(utcTimeString);
        }, 1000);
    }
});