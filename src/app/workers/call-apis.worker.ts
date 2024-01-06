/// <reference lib="webworker" />

addEventListener('message', async ({ data }) => {
        console.log("Call Apis Worker Works", data);
        // const domain = 'https://springleafrestaurantbackend.onrender.com/public';
        const domain = 'http://localhost:8080/public';
        if (data === 'start') {
                try {
                        const endpoints = [
                                'categories',
                                'combos',
                                'comboDetails',
                                //'deliveries',
                                //'deliveryDetails',
                                'deliveryOrders',
                                'deliveryOrderStatuses',
                                'discounts',
                                'carts',
                                'cartDetails',
                                'events',
                                'favorites',
                                'restaurantTables',
                                'restaurants',
                                'ingredients',
                                'inventories',
                                'goodsReceipts',
                                // 'goodsReceiptDetailss',
                                'inventoryBranches',
                                'products',
                                'menuItemIngredients',
                                'mergeTables',
                                'orderThresholds',
                                'suppliers',
                                'tableStatuses',
                                //'orderTypes',
                                'payments',
                                'inventoryBranchIngredients',
                                'ratings',
                                'receipts',
                                'receiptDetails',
                                'reservations',
                                'reservationStatuses',
                                'tableTypes',
                                'bills',
                                'billDetails',
                                'carts',
                        ];

                        const responses = await Promise.all(endpoints.map(async (endpoint) => {
                                const response = await fetch(`${domain}/${endpoint}`);
                                if (response.ok) {
                                        return await response.json();
                                } else {
                                        console.error(`Network response was not ok for ${endpoint}.`);
                                        return null;
                                }
                        }));

                        const dataMap: Record<string, any> = {};

                        endpoints.forEach((endpoint, index) => {
                                dataMap[endpoint] = responses[index];
                        });

                        postMessage(dataMap);

                } catch (error) {
                        console.error(error);
                }
        }
});