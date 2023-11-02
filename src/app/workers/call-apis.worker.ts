/// <reference lib="webworker" />


// Trong worker script (call-apis.worker.ts)
addEventListener('message', async ({ data }) => {
        console.log("Call Apis Worker Works", data);
        const domain = 'http://localhost:8080/api';
        if (data === 'start') {
                try {
                        const responses = await Promise.all([
                                fetch(`${domain}/categories`),
                                fetch(`${domain}/products`),
                                fetch(`${domain}/cartDetails`),
                                fetch(`${domain}/combos`),
                                fetch(`${domain}/events`),
                                fetch(`${domain}/restaurantTables`),
                                fetch(`${domain}/restaurants`),
                                fetch(`${domain}/suppliers`),
                                fetch(`${domain}/tableStatuses`),
                                fetch(`${domain}/ingredients`),
                                fetch(`${domain}/roles`),
                                fetch(`${domain}/roleFunctions`),
                                fetch(`${domain}/bills`),
                                fetch(`${domain}/billDetails`),
                                fetch(`${domain}/carts`),
                                fetch(`${domain}/comboDetails`),
                                fetch(`${domain}/deliveries`),
                                fetch(`${domain}/deliveryDetails`),
                                fetch(`${domain}/deliveryOrders`),
                                fetch(`${domain}/deliveryOrderStatuses`),
                                fetch(`${domain}/deliveryOrderDetails`),
                                fetch(`${domain}/favorites`),
                                fetch(`${domain}/inventories`),
                                fetch(`${domain}/inventoryBranches`),
                                fetch(`${domain}/menuItemIngredients`),
                                fetch(`${domain}/orderThresholds`),
                                fetch(`${domain}/mergeTables`),
                                fetch(`${domain}/orderTypes`),
                                fetch(`${domain}/payments`),
                                fetch(`${domain}/ratings`),
                                fetch(`${domain}/receipts`),
                                fetch(`${domain}/receiptDetails`),
                                fetch(`${domain}/reservations`),
                                fetch(`${domain}/tableTypes`),
                                
                        ]);

                        const responseData = await Promise.all(responses.map(async (response) => {
                                if (response.ok) {
                                        return await response.json();
                                } else {
                                        throw new Error('Network response was not ok.');
                                }
                        }));

                        const dataMap = {
                                categories: responseData[0],
                                products: responseData[1],
                                cartDetails: responseData[2],
                                combos: responseData[3],
                                events: responseData[4],
                                restaurantTables: responseData[5],
                                restaurants: responseData[6],
                                suppliers: responseData[7],
                                tableStatuses: responseData[8],
                                ingredients: responseData[9],
                                roles: responseData[10],
                                roleFunctions: responseData[11],
                                bills: responseData[12],
                                billDetails: responseData[13],
                                carts: responseData[14],
                                comboDetails: responseData[15],
                                deliveries: responseData[16],
                                deliveryDetails: responseData[17],
                                deliveryOrders: responseData[18],
                                deliveryOrderStatuses: responseData[19],
                                deliveryOrderDetails: responseData[20],
                                favorites: responseData[21],
                                inventories: responseData[22],
                                inventoryBranches: responseData[23],
                                menuItemIngredients: responseData[24],
                                orderThresholds: responseData[25],
                                mergeTables: responseData[26],
                                orderTypes: responseData[27],
                                payments: responseData[28],
                                ratings: responseData[29],
                                receipts: responseData[30],
                                receiptDetails: responseData[31],
                                reservations: responseData[32],
                                tableTypes: responseData[33],
                        };

                        postMessage(dataMap);

                } catch (error) {
                        console.log(error)
                }
        }
});
