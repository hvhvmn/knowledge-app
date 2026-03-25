# 🤖 AI Auto-Tagging Setup Guide

Your Ethereal AI app now automatically generates tags for saved items using Google Gemini AI!

## ✨ How It Works

When a user saves an item:
1. **Item Created** - Item is saved with user's title, URL, type, notes
2. **AI Analysis** - Gemini AI reads the title and notes
3. **Tags Generated** - AI suggests 3-5 relevant tags
4. **Merge Tags** - AI tags + user tags are combined (no duplicates)
5. **Save** - Item saved with all tags to database
6. **Display** - Tags shown as beautiful tags on item cards

## Example

**User saves:**
- Title: "How to build AI startup"
- Notes: "Great insights on scaling with AI"

**AI generates:** `["AI", "startup", "business", "technology"]`

**Result:** Item tagged with all 4 tags automatically ✅

---

## 🔧 Setup Instructions

### Step 1: Add Gemini API Key

The API key is already embedded in the code, but to use your own:

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Get a free API key
3. Add to `.env` file in backend:

```bash
cp .env.example .env
```

Edit `.env`:
```
GEMINI_API_KEY=your-api-key-here
```

### Step 2: Backend Setup

```bash
cd backend
npm install  # Already done ✅
npm run dev
```

### Step 3: Test It

1. Save an item via the web app or extension
2. Check the console for tag generation
3. Tags will appear on the item card

---

## 📁 Files Changed

### Backend

**New File:** `src/services/aiService.js`
- `generateTags(text)` - Generates 3-5 tags using Gemini
- Uses Gemini Pro model
- Cleans and deduplicates tags

**Modified:** `src/controllers/items.controller.js`
- `saveItems()` now calls AI tagging
- Merges user tags with AI tags
- Falls back gracefully if AI fails

**Modified:** `package.json`
- Added `@google/generative-ai` dependency

### Frontend

**Modified:** `src/features/items/components/ItemsCard.jsx`
- Enhanced tag styling with purple background
- Shows up to 3 tags + "+X more" button
- Better hover effects

---

## 🎯 Tag Generation Details

### Gemini Model Used
- **Model:** `gemini-pro`
- **Input:** Title + Notes
- **Output:** JSON array of 3-5 tags
- **Features:**
  - Case-insensitive
  - Removes special characters
  - Deduplicates tags
  - Falls back gracefully if AI fails

### Example Prompts

**Video Title:** "How computers think"
- Generated: `["AI", "machine learning", "technology", "education"]`

**Article:** "Building a startup with React"
- Generated: `["startup", "React", "web development", "JavaScript"]`

**Tweet:** "Just launched my AI app!"
- Generated: `["AI", "startup", "launch", "technology"]`

---

## 🛠️ Troubleshooting

### Error: "Could not generate tags"
**Solution:** AI generation failed gracefully, item saved without AI tags. User tags still work.

### Tags not showing
- Check browser console for errors
- Verify Gemini API key in `.env`
- Restart backend server

### Same tags every time
- Different content generates different tags
- Try saving items with more distinctive titles/notes

### Too many tags
- Currently shows 3 tags + "+X more"
- Click item to see all tags
- Can adjust limit in ItemsCard.jsx

---

## 📊 Tag Statistics

Tags help with:
- **Search:** Find items by tag
- **Organization:** Group similar content
- **Discovery:** See trending topics
- **Categorization:** Automatic sorting

---

## 🚀 Future Enhancements

- [ ] User can edit AI-generated tags
- [ ] Preferred tag categories
- [ ] Tag-based collections
- [ ] Tag suggestions in search
- [ ] ML model fine-tuning
- [ ] Multi-language support

---

## Need Help?

Check the main README or contact support!
