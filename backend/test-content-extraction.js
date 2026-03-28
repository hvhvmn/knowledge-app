import fetch from 'node-fetch';

async function testContentExtraction() {
    try {
        console.log('🧪 Testing Content Extraction API...');

        // Test URL for content extraction
        const testUrl = 'https://example.com';
        const testTitle = 'Example Domain';

        // Make the request to add item (you'll need to replace with actual JWT token)
        const response = await fetch('http://localhost:3000/api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add your JWT token here
                // 'Authorization': 'Bearer YOUR_JWT_TOKEN'
            },
            body: JSON.stringify({
                title: testTitle,
                url: testUrl,
                type: 'Article',
                tags: ['test', 'content-extraction']
            })
        });

        const result = await response.json();

        if (response.ok) {
            console.log('✅ Item created successfully!');
            console.log('📄 Response:', result);

            const itemId = result.data._id;
            console.log(`⏳ Waiting for background processing of item ${itemId}...`);

            // Wait a bit for processing
            await new Promise(resolve => setTimeout(resolve, 10000));

            // Check if item was processed
            const checkResponse = await fetch(`http://localhost:3000/api/items/${itemId}`, {
                headers: {
                    // Add your JWT token here
                    // 'Authorization': 'Bearer YOUR_JWT_TOKEN'
                }
            });

            const checkResult = await checkResponse.json();

            if (checkResponse.ok) {
                console.log('📊 Processed item data:');
                console.log('- Title:', checkResult.data.title);
                console.log('- Extracted Title:', checkResult.data.extractedTitle);
                console.log('- Content Length:', checkResult.data.content?.length || 0);
                console.log('- Description:', checkResult.data.description);
                console.log('- Tags:', checkResult.data.tags);
                console.log('- Processing Status:', checkResult.data.processing);
            } else {
                console.log('❌ Failed to check processed item:', checkResult);
            }

        } else {
            console.log('❌ Item creation failed:', result);
        }

    } catch (error) {
        console.error('❌ Test error:', error.message);
    }
}

// Run the test
testContentExtraction();