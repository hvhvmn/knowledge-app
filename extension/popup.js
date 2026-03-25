const BACKEND_URL = 'http://localhost:3000/api/items';

let currentUrl = '';
let tags = [];

// Get current tab URL on popup load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Get current active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        currentUrl = tab.url;
        const pageTitle = tab.title;

        // Display URL
        document.getElementById('urlDisplay').textContent = currentUrl;

        // Auto-fill title from page title
        if (pageTitle) {
            document.getElementById('title').value = pageTitle;
        }

        // Determine type based on URL
        const type = detectType(currentUrl);
        if (type) {
            document.getElementById('type').value = type;
        }
    } catch (error) {
        console.error('Error getting current tab:', error);
        showMessage('Error getting page URL', 'error');
    }

    // Setup event listeners
    setupEventListeners();
});

// Detect item type based on URL
function detectType(url) {
    if (url.includes('youtube.com') || url.includes('vimeo.com') || url.includes('youtu.be')) {
        return 'Video';
    }
    if (url.includes('twitter.com') || url.includes('x.com')) {
        return 'Tweet';
    }
    if (url.includes('.pdf')) {
        return 'Pdf';
    }
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return 'Image';
    }
    return 'Article'; // Default
}

// Setup all event listeners
function setupEventListeners() {
    // Tag input - Add tag on Enter
    document.getElementById('tagInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const input = e.target;
            const tagValue = input.value.trim();
            
            if (tagValue && !tags.includes(tagValue)) {
                tags.push(tagValue);
                input.value = '';
                renderTags();
            }
        }
    });

    // Save button
    document.getElementById('saveBtn').addEventListener('click', saveItem);

    // Cancel button
    document.getElementById('cancelBtn').addEventListener('click', () => {
        window.close();
    });
}

// Render tags
function renderTags() {
    const container = document.getElementById('tagsContainer');
    
    // Clear existing tags (keep input field)
    const existingTags = container.querySelectorAll('.tag');
    existingTags.forEach(tag => tag.remove());

    // Add tags back
    const input = container.querySelector('.tag-input-field');
    tags.forEach(tag => {
        const tagEl = document.createElement('div');
        tagEl.className = 'tag';
        tagEl.innerHTML = `
            #${tag}
            <button type="button" data-tag="${tag}">×</button>
        `;
        container.insertBefore(tagEl, input);

        // Remove tag on button click
        tagEl.querySelector('button').addEventListener('click', (e) => {
            e.preventDefault();
            tags = tags.filter(t => t !== tag);
            renderTags();
        });
    });
}

// Save item to backend
async function saveItem() {
    try {
        // Validate
        if (!currentUrl) {
            showMessage('URL not found', 'error');
            return;
        }

        const type = document.getElementById('type').value;
        if (!type) {
            showMessage('Please select a type', 'error');
            return;
        }

        // Show loading state
        document.getElementById('form').style.display = 'none';
        document.getElementById('loading').style.display = 'block';

        // Prepare payload
        const payload = {
            url: currentUrl,
            title: document.getElementById('title').value || 'Saved from ' + new URL(currentUrl).hostname,
            type: type,
            notes: document.getElementById('notes').value,
            tags: tags
        };

        // Send to backend
        const response = await fetch(BACKEND_URL + '/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for auth
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Show success
        document.getElementById('loading').style.display = 'none';
        document.getElementById('form').style.display = 'flex';
        document.getElementById('form').style.flexDirection = 'column';
        
        showMessage('✅ Item saved successfully!', 'success');

        // Reset form
        setTimeout(() => {
            window.close();
        }, 1500);

    } catch (error) {
        console.error('Error saving item:', error);
        
        // Hide loading, show form
        document.getElementById('loading').style.display = 'none';
        document.getElementById('form').style.display = 'flex';
        document.getElementById('form').style.flexDirection = 'column';

        showMessage(`Error: ${error.message}`, 'error');
    }
}

// Show message
function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';

    if (type === 'success') {
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    }
}
