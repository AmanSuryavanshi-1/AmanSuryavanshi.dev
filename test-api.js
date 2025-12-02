async function testApi() {
    try {
        const response = await fetch('http://localhost:5000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from_name: 'Test User',
                reply_to: 'test@example.com',
                message: 'This is a test message longer than 10 characters.',
            }),
        });

        const contentType = response.headers.get('content-type');
        console.log('Status:', response.status);
        console.log('Content-Type:', contentType);

        const text = await response.text();
        if (contentType && contentType.includes('application/json')) {
            console.log('Response JSON:', JSON.parse(text));
        } else {
            console.log('Response Text (First 500 chars):', text.substring(0, 500));
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

testApi();
