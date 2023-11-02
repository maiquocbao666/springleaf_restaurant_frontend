/// <reference lib="webworker" />

// Trong worker script (call-apis.worker.ts)
addEventListener('message', async ({ data }) => {
    console.log("Get all data from local storage worker works", data);
    postMessage("Get all datas from local storage")
});