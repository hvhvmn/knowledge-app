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

    // Screenshot button
    document.getElementById('screenshotBtn').addEventListener('click', takeScreenshot);

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

function getSaveMode() {
    const selected = document.querySelector('input[name="saveMode"]:checked');
    return selected ? selected.value : 'link';
}

async function captureAndUploadScreenshot() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = await chrome.tabs.captureVisibleTab(null, { format: 'png' });

    const response = await fetch(url);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append('file', blob, `screenshot-${Date.now()}.png`);
    formData.append('title', document.getElementById('title').value || `Screenshot of ${tab.title}`);
    formData.append('notes', document.getElementById('notes').value || `Screenshot from ${currentUrl}`);
    formData.append('tags', JSON.stringify(tags));
    formData.append('url', currentUrl); // preserve original page link

    const uploadResponse = await fetch(BACKEND_URL + '/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
    });

    if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
    }

    return await uploadResponse.json();
}

// Save item to backend
async function saveItem() {
    try {
        if (!currentUrl) {
            showMessage('URL not found', 'error');
            return;
        }

        const mode = getSaveMode();
        const type = document.getElementById('type').value;
        if (!type && mode !== 'screenshot') {
            showMessage('Please select a type', 'error');
            return;
        }

        document.getElementById('form').style.display = 'none';
        document.getElementById('loading').style.display = 'block';

        if (mode === 'screenshot') {
            document.querySelector('#loading p').textContent = 'Permission granted — taking screenshot...';
            const result = await captureAndUploadScreenshot();

            document.querySelector('#loading p').textContent = 'Saved screenshot!';
            showImageResult(result.item.fileUrl || result.item.url, '📸 Screenshot saved successfully!');
            return;
        }

        if (mode === 'both') {
            document.querySelector('#loading p').textContent = 'Taking screenshot and saving link...';
            const uploaded = await captureAndUploadScreenshot();

            const payload = {
                url: currentUrl,
                title: document.getElementById('title').value || `Saved from ${new URL(currentUrl).hostname}`,
                type: type || 'Article',
                notes: document.getElementById('notes').value,
                tags: tags,
                fileUrl: uploaded?.item?.fileUrl || uploaded?.item?.url,
            };

            const saveResponse = await fetch(BACKEND_URL + '/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            if (!saveResponse.ok) {
                throw new Error(`Link save failed: ${saveResponse.status}`);
            }

            showImageResult(uploaded.item.fileUrl || uploaded.item.url, '📸✅ Screenshot + Link saved!');
            return;
        }

        // default link only
        document.querySelector('#loading p').textContent = 'Saving link...';

        const payload = {
            url: currentUrl,
            title: document.getElementById('title').value || `Saved from ${new URL(currentUrl).hostname}`,
            type,
            notes: document.getElementById('notes').value,
            tags
        };

        const response = await fetch(BACKEND_URL + '/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        showMessage('✅ Item saved successfully!', 'success');
        setTimeout(() => window.close(), 2000);

    } catch (error) {
        console.error('Error saving item:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('form').style.display = 'flex';
        document.getElementById('form').style.flexDirection = 'column';
        showMessage(`Error: ${error.message}`, 'error');
    }
}

// Take screenshot and upload (button action)
async function takeScreenshot() {
    try {
        document.getElementById('form').style.display = 'none';
        document.getElementById('loading').style.display = 'block';
        document.querySelector('#loading p').textContent = 'Taking screenshot...';

        const result = await captureAndUploadScreenshot();

        document.querySelector('#loading p').textContent = 'Saved screenshot!';
        showImageResult(result.item.fileUrl || result.item.url, '📸 Screenshot saved successfully!');

    } catch (error) {
        console.error('Screenshot error:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('form').style.display = 'flex';
        document.getElementById('form').style.flexDirection = 'column';
        showMessage(`Screenshot failed: ${error.message}`, 'error');
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

// Show image result with clickable URL
function showImageResult(imageUrl, message) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('form').style.display = 'flex';
    document.getElementById('form').style.flexDirection = 'column';

    const messageEl = document.getElementById('message');
    messageEl.innerHTML = `
        <div style="text-align: center;">
            <p style="margin: 0 0 10px 0; color: #22C55E;">${message}</p>
            <a href="${imageUrl}" target="_blank" style="color: #A78BFA; text-decoration: underline; word-break: break-all;">View Screenshot</a>
            <br>
            <small style="color: #888; font-size: 11px;">Click to open image in new tab</small>
        </div>
    `;
    messageEl.className = 'message success';
    messageEl.style.display = 'block';

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.cssText = `
        margin-top: 10px;
        padding: 5px 15px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 5px;
        color: #E0E0E0;
        cursor: pointer;
        font-size: 12px;
    `;
    closeBtn.onclick = () => window.close();
    messageEl.appendChild(closeBtn);
}
