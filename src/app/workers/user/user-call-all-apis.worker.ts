/// <reference lib="webworker" />

addEventListener('message', async (event) => {
    const { type, loginData, tokenUser } = event.data;
    console.log("Call all this User Apis Worker Works", type);
    const domain = 'https://springleafrestaurantbackend.onrender.com/api';

    if (type === 'login') {
        const { username, password } = loginData;
        try {
            const responses = await Promise.all([
                fetch(`${domain}/v1/auth/authenticate`, {
                    method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
                }),
                
            ]);

            const responseData = await Promise.all(responses.map(async (response) => {
                if (response.ok) {
                    return await response.json();
                } else {
                    return null;
                }
            }));

            const dataMap = {
                loginResponse : responseData[0],
            }
            postMessage(dataMap);
            
        }catch {

        }
    };

    if (type === 'cart') {
        const token = "d6f64767-329b-11ee-af43-6ead57e9219a";
        try {
            const responses = await Promise.all([
                
                fetch(`${domain}/auth/your-profile`, {
                    method: 'GET',
                headers: {
                    'token' : token,
                },

                })
            ]);

            const responseData = await Promise.all(responses.map(async (response) => {
                if (response.ok) {
                    return await response.json();
                } else {
                    return null;
                }
            }));

            const dataMap = {
                provinceResponse: responseData[0],
                
            }
            postMessage(dataMap);
            
        }catch {

        }
    };

    if (type === 'profile') {
        const token = tokenUser; // Sử dụng token được cung cấp bởi worker
        try {
            const response = await fetch(`${domain}/auth/your-profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const responseData = await response.json();
                const dataMap = {
                    profileResponse: responseData,
                };
                postMessage(dataMap);
            } else {
                // Xử lý trường hợp lỗi khi response không thành công
                const errorResponse = await response.json();
                console.error("On worker: Error Response", errorResponse);
                postMessage({ error: errorResponse });
            }
        } catch (error) {
            // Xử lý bất kỳ ngoại lệ nào xảy ra trong quá trình gửi yêu cầu
            console.error("On worker: Error", error);
            
        }
    }
});
