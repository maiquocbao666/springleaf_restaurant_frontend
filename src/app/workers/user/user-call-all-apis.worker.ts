/// <reference lib="webworker" />

addEventListener('message', async (event) => {
    const { type, loginData, token, tokenUser, email, password, typeCode } = event.data;
    console.log("Call all this User Apis Worker Works", type);
    const domain = 'https://springleafrestaurantbackend.onrender.com/auth';
    //const domain = 'http://localhost:8080/auth';
    if (type === 'check_access_token') {
        const  accessToken  = token;
        try {
            const responses = await Promise.all([
                fetch(`${domain}/auto-login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}` // Thêm tiêu đề Authorization với token Bearer
                    }
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
                checkTokenRespone: responseData[0],
            }
            postMessage(dataMap);
        } catch {
            // Xử lý lỗi nếu cần
        }
    };
    if (type === 'logout') {
        const  accessToken  = token;
        try {
            const responses = await Promise.all([
                fetch(`https://springleafrestaurantbackend.onrender.com/auth2/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}` 
                    }
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
                logoutRespone: responseData[0],
            }
            postMessage(dataMap);
            console.log('Data Map: ' + JSON.stringify(dataMap));
        } catch {
            // Xử lý lỗi nếu cần
        }
    };
    if (type === 'login') {
        const { userName, password } = loginData;
        try {
            const responses = await Promise.all([
                fetch(`${domain}/authenticate`, {
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
                loginResponse: responseData[0],
            }
            postMessage(dataMap);

        } catch {

        }
    };
    if (type === 'config-password') {
        const accessToken = token;
        try {
            const responses = await Promise.all([
                fetch(`${domain}/config-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: password,
                }),

            ]);
            
            const responseData = await Promise.all(responses.map(async (response) => {
                if (response.ok) {
                    return await response.text();
                } else {
                    return null;
                }
            }));

            const dataMap = {
                configPasswordResponse: responseData[0],
            }
            postMessage(dataMap);
        } catch {

        }
    };
    if (type === 'change-password') {
        const accessToken = token;
        try {
            const responses = await Promise.all([
                fetch(`${domain}/change-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: password,
                }),

            ]);
            
            const responseData = await Promise.all(responses.map(async (response) => {
                if (response.ok) {
                    return await response.text();
                } else {
                    return null;
                }
            }));

            const dataMap = {
                changePasswordResponse: responseData[0],
            }
            postMessage(dataMap);
        } catch {

        }
    };
    if (type === 'forgot-password') {
        const accessToken = token;
        try {
            const responses = await Promise.all([
                fetch(`${domain}/forgot-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: password,
                }),

            ]);
            
            const responseData = await Promise.all(responses.map(async (response) => {
                if (response.ok) {
                    return await response.text();
                } else {
                    return null;
                }
            }));

            const dataMap = {
                forgotPasswordResponse: responseData[0],
            }
            postMessage(dataMap);
        } catch {

        }
    };
    if (type === 'login-with-google') {
        
        try {
            const responses = await Promise.all([
                fetch(`https://springleafrestaurantbackend.onrender.com/abc`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    
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
                loginResponse: responseData[0],
            }
            postMessage(dataMap);

        } catch {

        }
    };
    if (type === 'get-access-code') {
        try {
            const emailRequest = email;
            const responses = await Promise.all([
                fetch(`${domain}/access-code?email=${emailRequest}&typeCode=${typeCode}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    
                }),
            ]);
            const responseData = await Promise.all(responses.map(async (response) => {
                if (response.ok) {
                    return await response.text();
                } else {
                    console.error('Error getting access code:', response.status, response.statusText);
                    throw new Error('Error getting access code');
                }
            }));
    
            const dataMap = {
                accessCodeRespone: responseData[0],
            };
            postMessage(dataMap);
            console.log('AccessCode: ' + responseData[0]);
        } catch(error) {
            console.error('Error during fetch:', error);
        }
    }
    
    if (type === 'provinces') {
        const token = "d6f64767-329b-11ee-af43-6ead57e9219a";
        try {
            const responses = await Promise.all([

                fetch(`https://online-gateway.ghn.vn/shiip/public-api/master-data/province`, {
                    method: 'GET',
                    headers: {
                        'token': token,
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
        } catch {

        }
    };

    if (type === 'profile') {
        const token = tokenUser; // Sử dụng token được cung cấp bởi worker
        try {
            const response = await fetch(`${domain}/your-profile`, {
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
