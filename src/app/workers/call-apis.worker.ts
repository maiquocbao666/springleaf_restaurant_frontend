/// <reference lib="webworker" />

addEventListener('message', async ({ data }) => {
        console.log("Call Apis Worker Works", data);
        const domain = 'https://springleafrestaurantbackend.onrender.com/api';
        if (data === 'start') {
                try {
                        const endpoints = [
                                'categories',
                                'products',
                                'cartDetails',
                                'combos',
                                'events',
                                'restaurantTables',
                                'restaurants',
                                'suppliers',
                                'tableStatuses',
                                'ingredients',
                                'bills',
                                'billDetails',
                                'carts',
                                'comboDetails',
                                'deliveries',
                                'deliveryDetails',
                                'deliveryOrders',
                                'deliveryOrderStatuses',
                                'deliveryOrderDetails',
                                'favorites',
                                'inventories',
                                'inventoryBranches',
                                'menuItemIngredients',
                                'orderThresholds',
                                'mergeTables',
                                'orderTypes',
                                'payments',
                                'ratings',
                                'receipts',
                                'receiptDetails',
                                'reservations',
                                'tableTypes',
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