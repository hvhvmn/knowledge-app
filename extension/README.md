# Ethereal AI Browser Extension

Save web pages, articles, videos, and more directly to your Ethereal AI knowledge base.

## Features

✅ **One-Click Save** - Save any webpage instantly with a single click
✅ **Auto-Detect Type** - Automatically detects if it's an article, video, tweet, etc.
✅ **Pre-filled Title** - Uses the page title automatically
✅ **Add Tags** - Organize items with custom tags
✅ **Notes** - Add your thoughts or summary while saving
✅ **Fast & Lightweight** - Minimal performance impact

## Installation

### Step 1: Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Navigate to and select the `extension` folder
5. The extension should now appear in your extensions list

### Step 2: Make Sure Backend is Running

```bash
cd backend
npm start
```

The extension connects to `http://localhost:3000` by default.

### Step 3: Log in First

1. Make sure you're logged into your Ethereal AI account in your browser
2. The extension will use your session cookies for authentication

## Usage

### Saving from Any Website

1. Click the **Ethereal AI extension icon** in your browser toolbar
2. A popup will appear with:
   - **URL** - The current page URL (auto-filled)
   - **Title** - Page title (auto-filled, edit if needed)
   - **Type** - Select: Article, Video, Tweet, Image, PDF, or Other
   - **Notes** - Optional notes/summary
   - **Tags** - Add tags by typing and pressing Enter

3. Click **"Save Item"**
4. Item will be saved to your knowledge base ✅

### Examples

**Save a YouTube Video:**
- Go to any YouTube video
- Click extension
- Type is auto-detected as "Video"
- Add tags like `#learning` `#tutorial`
- Click Save

**Save an Article:**
- Go to any article webpage
- Click extension
- Title is auto-filled from page title
- Type auto-detects as "Article"
- Add notes about why you're saving it
- Click Save

**Save a Tweet:**
- Go to any tweet/X post
- Click extension
- Type auto-detects as "Tweet"
- Click Save

## File Structure

```
extension/
├── manifest.json    # Extension config
├── popup.html       # Extension UI
├── popup.js         # Extension logic
└── README.md        # This file
```

## How It Works

1. **Get Current URL** - Extension reads the URL of the current tab
2. **Show Popup** - Displays save form with auto-filled data
3. **Send to Backend** - POST request to `/api/items/save`
4. **Save Item** - Backend saves to database with user ID
5. **Confirm** - Shows success message and closes

## Troubleshooting

### "Not signed in" error
- Login to Ethereal AI in your browser first
- The extension uses your browser session

### "Connection refused" error
- Make sure backend is running: `npm start` in backend folder
- Check backend is on `http://localhost:3000`

### Extension doesn't appear
- Check `chrome://extensions/` is showing it
- Try reloading the extension
- Clear browser cache

### "Missing permissions" error
- In `manifest.json`, extension needs:
  - `activeTab` - Read current tab
  - `scripting` - Inject scripts
  - `cookies` - Read session cookies

## Customization

To change backend URL, edit `popup.js` line 1:

```javascript
const BACKEND_URL = 'http://localhost:3000/api/items';
```

Change to your deployed backend URL when you go live.

## Future Enhancements

- [ ] Auto-extract content from webpage
- [ ] Batch save multiple pages
- [ ] Keyboard shortcut (Ctrl+Shift+S)
- [ ] Save to specific collection directly
- [ ] Screenshot/highlight capture
- [ ] Sync across devices

## Support

Need help? Check the main app for features and support!
