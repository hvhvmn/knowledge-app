import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

async function testFileUpload() {
    try {
        console.log('🧪 Testing File Upload API...');

        // Create a simple test file
        const testContent = 'This is a test PDF content';
        const testFilePath = '/tmp/test-file.txt';
        fs.writeFileSync(testFilePath, testContent);

        // Create form data
        const form = new FormData();
        form.append('file', fs.createReadStream(testFilePath), {
            filename: 'test-document.txt',
            contentType: 'text/plain'
        });
        form.append('title', 'Test Upload Document');
        form.append('notes', 'This is a test upload');
        form.append('tags', JSON.stringify(['test', 'upload']));

        // Make the request (you'll need to replace with actual JWT token)
        const response = await fetch('http://localhost:3000/api/items/upload', {
            method: 'POST',
            body: form,
            headers: {
                // Add your JWT token here
                // 'Cookie': 'token=YOUR_JWT_TOKEN'
            }
        });

        const result = await response.json();

        if (response.ok) {
            console.log('✅ File upload successful!');
            console.log('📄 Response:', result);
        } else {
            console.log('❌ File upload failed:', result);
        }

        // Clean up
        fs.unlinkSync(testFilePath);

    } catch (error) {
        console.error('❌ Test error:', error.message);
    }
}

// Run the test
testFileUpload();