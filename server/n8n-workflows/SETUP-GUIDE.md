# OwnSangeet AI Blog Agent - Setup Guide v2

## 🎯 Overview

This enhanced n8n workflow automatically generates daily SEO-optimized blog posts for OwnSangeet.com with:

- **📋 Memory Bank** - Store your blog topic ideas (rotates daily)
- **🔍 AI Research** - Perplexity searches for relevant news
- **🖼️ Dual Image Search** - Unsplash + Pexels for high-quality images
- **✍️ AI Writing** - Gemini generates SEO content
- **🚀 Auto Publish** - Posts directly to OwnSangeet with images
- **🔔 SEO Ping** - Notifies Google & Bing of new content

---

## 📝 Memory Bank - Add Your Blog Topics

The workflow includes a **Memory Bank** node where you can store blog topic ideas. Edit the `📝 Blog Topics Memory Bank` node to add your topics:

```javascript
const blogTopics = [
  {
    topic: "Latest Bollywood songs released",
    keywords: ["bollywood", "hindi songs", "new releases"],
    priority: "high",
    category: "Music News"
  },
  {
    topic: "Trending wedding sangeet songs",
    keywords: ["sangeet", "wedding songs", "dance songs"],
    priority: "high",
    category: "Wedding Music"
  },
  // Add more topics here!
];
```

The workflow automatically rotates through topics based on the day of the week.

---

## 🔧 Setup Instructions

### Step 1: Import Workflow

1. Open n8n → **Workflows** → **Import from file**
2. Select `ownsangeet-ai-blog-agent.json`
3. Click **Import**

### Step 2: Configure Credentials

#### 2.1 Perplexity API Key
```
Credential Type: HTTP Header Auth
Name: Perplexity API Key
Header Name: Authorization
Header Value: Bearer YOUR_PERPLEXITY_KEY
```
Get key: https://www.perplexity.ai/settings/api

#### 2.2 Google Gemini API
```
Credential Type: Google Gemini API
Name: Google Gemini API
API Key: YOUR_GEMINI_KEY
```
Get key: https://makersuite.google.com/app/apikey

#### 2.3 Unsplash API Key
```
Credential Type: HTTP Query Auth
Name: Unsplash API Key
Parameter Name: client_id
Parameter Value: YOUR_UNSPLASH_ACCESS_KEY
```
Get key: https://unsplash.com/developers

#### 2.4 Pexels API Key (Optional Backup)
```
Credential Type: HTTP Header Auth
Name: Pexels API Key
Header Name: Authorization
Header Value: YOUR_PEXELS_KEY
```
Get key: https://www.pexels.com/api/

#### 2.5 OwnSangeet API Key
```
Credential Type: HTTP Header Auth
Name: OwnSangeet API Key
Header Name: x-api-key
Header Value: YOUR_OWNSANGEET_API_KEY
```
Generate from: OwnSangeet Admin Panel → API Keys

### Step 3: Set Environment Variables

In n8n settings or workflow variables:
```
OWNSANGEET_API_URL=https://api.ownsangeet.com
```
For local dev:
```
OWNSANGEET_API_URL=http://localhost:5000
```

---

## 🖼️ Image Handling

The workflow searches for images using:

1. **Unsplash** (Primary) - High-quality free images
2. **Pexels** (Backup) - Alternative source

Images are:
- Selected based on relevance to topic
- Featured image used as blog cover
- Additional images inserted into content
- Full URL stored in `featuredImageUrl` field

---

## 🔄 Workflow Flow

```
Schedule/Manual Trigger
        ↓
📋 Read Blog Topics Memory
        ↓
📝 Memory Bank (YOUR TOPICS HERE!)
        ↓
🔍 Perplexity Research
        ↓
📊 Parse Research Results
        ↓
    ┌───────┴───────┐
    ↓               ↓
🖼️ Unsplash    🖼️ Pexels
    ↓               ↓
    └───────┬───────┘
            ↓
🎨 Process & Select Images
            ↓
✍️ Gemini: Write Content
            ↓
📦 Format Final Post
            ↓
🚀 Publish to OwnSangeet API
            ↓
        Success?
       ↓       ↓
      YES     NO
       ↓       ↓
📗 Success  📕 Error
       ↓
🔔 Ping Google/Bing
       ↓
🎉 Complete!
```

---

## ⚙️ Customization

### Change Topics
Edit the `📝 Blog Topics Memory Bank` node and modify the `blogTopics` array.

### Change Image Queries
In the same node, modify the `imageSearchQueries` array:
```javascript
const imageSearchQueries = [
  "music concert stage lights",
  "bollywood dance performance",
  "wedding sangeet celebration india",
  // Add your custom queries
];
```

### Change Schedule
Edit the `Schedule Trigger` node:
- Default: 9 AM IST daily
- Modify `triggerAtHour` to change time

### Adjust Content Length
In `✍️ Gemini: Write Blog Content`:
- Modify the word count in the prompt
- Adjust `maxOutputTokens` in options

---

## 🐛 Troubleshooting

### Images not appearing in blog
- Check Unsplash/Pexels API keys
- Verify `featuredImageUrl` is being passed
- Check browser console for blocked images

### 401 Unauthorized on API
- Verify OwnSangeet API key
- Check header is `x-api-key` (not `Authorization`)
- Confirm key has `blog:write` permission

### Empty research content
- Check Perplexity API credits
- Verify search queries are generating
- Try manual trigger to test

### Gemini returning empty
- Check API key validity
- Verify model (`gemini-1.5-flash`) is available
- Check for rate limiting

---

## 📊 API Endpoint

**OwnSangeet Blog Webhook:**
```http
POST /api/v1/webhooks/blog-generation
Headers:
  x-api-key: YOUR_API_KEY
  Content-Type: application/json

Body:
{
  "title": "Blog Title",
  "slug": "blog-slug",
  "content": "Markdown content with embedded images...",
  "excerpt": "Short description",
  "tags": "tag1, tag2, tag3",
  "featuredImageUrl": "https://images.unsplash.com/..."
}

Response:
{
  "success": true,
  "post": {
    "id": "uuid",
    "slug": "blog-slug",
    "title": "Blog Title",
    ...
  }
}
```

---

## ✅ Testing Checklist

- [ ] Import workflow successfully
- [ ] All credentials configured
- [ ] Memory Bank has your topics
- [ ] Manual trigger works
- [ ] Research returns content
- [ ] Images are fetched
- [ ] Blog is written
- [ ] Post appears in admin panel
- [ ] Featured image displays
- [ ] Activate for daily automation

---

## 📞 Support

- **n8n issues**: n8n Community Forums
- **API issues**: Check server logs
- **Content quality**: Adjust Gemini prompts
