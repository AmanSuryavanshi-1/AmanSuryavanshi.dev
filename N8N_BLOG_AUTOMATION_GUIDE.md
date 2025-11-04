# n8n Blog Automation Setup Guide

## Updated Sanity Schema Information

### Document Schema
- **Schema Name:** `post`
- **Portable Text Field:** `body` (type: `blockContent`)

### Required Fields
```json
{
  "title": "string (required)",
  "slug": {
    "current": "auto-generated from title",
    "_type": "slug"
  },
  "status": "draft | published | needs-review (required, default: draft)"
}
```

### Optional Fields
```json
{
  "excerpt": "text (max 160 chars, for SEO)",
  "author": "reference to author document",
  "mainImage": {
    "asset": "image reference",
    "alt": "string (required if image present, max 100 chars)"
  },
  "categories": ["array of category references"],
  "tags": ["array of strings"],
  "publishedAt": "datetime",
  "seoTitle": "string (max 60 chars)",
  "seoDescription": "text (max 160 chars)",
  "body": "blockContent (Portable Text)",
  "viewCount": "number (default: 0)"
}
```

### Custom Block Types in Content
- **image:** With `alt` (required) and `caption` (optional)
- **video:** With `videoFile`, `caption`, and `alt` (required)
- **code:** With `code`, `language`, and `filename`
- **Text annotations:** `color`, `link`, `indent`

---

## n8n Configuration Answers

### 1. Field Mapping + Requirements

**Auto-fill recommendations:**
```javascript
{
  "status": "draft",  // or "published" for auto-publish
  "publishedAt": "{{$now}}",  // current timestamp
  "viewCount": 0,
  "slug": {
    "current": "{{$json.title.toLowerCase().replace(/\s+/g, '-')}}",
    "_type": "slug"
  }
}
```

**Mandatory fields:**
- `title` (string)
- `slug.current` (string, auto-generate from title)
- `status` (string: "draft", "published", or "needs-review")

**Recommended fields to populate:**
- `excerpt` (for SEO and previews)
- `mainImage` with `alt` text
- `publishedAt` (if status is "published")
- `tags` (array of strings)

### 2. Image Handling

**Cover Image:**
- Field: `mainImage`
- Required subfield: `alt` (max 100 characters)
- Upload image to Sanity assets first, then reference

**Content Images:**
- Embedded in `body` array
- Required: `alt` text
- Optional: `caption`
- Full-width by default, supports hotspot cropping

**n8n Image Upload Flow:**
1. Upload image to Sanity assets API
2. Get asset reference ID
3. Add to `mainImage` or `body` with required `alt` text

### 3. Author/Identity

**Field:** `author` (Sanity reference)
- Type: Reference to `author` document
- Single author per post
- Can be auto-filled with default author ID or left empty

**n8n Setup:**
```javascript
{
  "author": {
    "_type": "reference",
    "_ref": "YOUR_DEFAULT_AUTHOR_ID"  // Get from Sanity Studio
  }
}
```

### 4. Categories/Tags

**Categories:**
- Field: `categories` (array of references)
- Must reference existing category documents
- Multiple categories supported

**Tags:**
- Field: `tags` (array of strings)
- No pre-creation needed
- Can be auto-detected or manually set

**n8n Setup:**
```javascript
{
  "categories": [
    {
      "_type": "reference",
      "_ref": "CATEGORY_ID_1",
      "_key": "unique-key-1"
    }
  ],
  "tags": ["react", "javascript", "tutorial"]
}
```

### 5. SEO & Display

**SEO Fields:**
- `seoTitle` (max 60 chars, fallback to `title`)
- `seoDescription` (max 160 chars, fallback to `excerpt`)
- `excerpt` (max 160 chars, used for previews)
- `tags` (used as keywords in meta tags)

**n8n Recommendation:**
```javascript
{
  "excerpt": "{{$json.description}}",
  "seoTitle": "{{$json.title}}",
  "seoDescription": "{{$json.description}}",
  "tags": ["tag1", "tag2"]
}
```

### 6. Approval/Workflow

**Status Field Options:**
- `"draft"` - Not visible on website (default)
- `"published"` - Visible on website
- `"needs-review"` - For manual approval workflow

**n8n Workflow Options:**

**Option A - Auto-publish:**
```javascript
{
  "status": "published",
  "publishedAt": "{{$now}}"
}
```

**Option B - Draft for review:**
```javascript
{
  "status": "draft"
  // No publishedAt needed
}
```

**Option C - Needs review:**
```javascript
{
  "status": "needs-review"
  // Send notification to review
}
```

### 7. Error Recovery/Redelivery

**Recommendations:**
- Use n8n's built-in retry mechanism (3 retries with exponential backoff)
- Log failures to a separate database/sheet
- Send email/Slack notification on failure
- Store failed payloads for manual recovery

### 8. Frontend/Website Integration

**Current Setup:**
- Next.js with ISR (Incremental Static Regeneration)
- Only "published" posts are shown on website
- Advanced rendering supported: code blocks, videos, images with captions

**After n8n Post:**
- Website will auto-update on next request (ISR)
- For immediate update, trigger revalidation endpoint (optional)

### 9. Sanity Schema Changes

**✅ Already Updated:**
- `excerpt` field for SEO
- `status` field for workflow
- `tags` field separate from categories
- `seoTitle` and `seoDescription` fields

**Backward Compatibility:**
- All new fields are optional
- Existing posts will work without changes
- Default values set where needed

---

## Sample n8n Payload

```json
{
  "_type": "post",
  "title": "Your Blog Post Title",
  "slug": {
    "current": "your-blog-post-title",
    "_type": "slug"
  },
  "excerpt": "A compelling description of your post in 150-160 characters for SEO.",
  "status": "published",
  "publishedAt": "2024-11-04T10:00:00Z",
  "mainImage": {
    "_type": "image",
    "asset": {
      "_type": "reference",
      "_ref": "image-ASSET_ID"
    },
    "alt": "Descriptive alt text for the image"
  },
  "body": [
    {
      "_type": "block",
      "style": "normal",
      "children": [
        {
          "_type": "span",
          "text": "Your blog content here..."
        }
      ]
    }
  ],
  "categories": [
    {
      "_type": "reference",
      "_ref": "CATEGORY_ID",
      "_key": "unique-key"
    }
  ],
  "tags": ["react", "javascript", "tutorial"],
  "author": {
    "_type": "reference",
    "_ref": "AUTHOR_ID"
  },
  "seoTitle": "Custom SEO Title",
  "seoDescription": "Custom SEO description for search engines",
  "viewCount": 0
}
```

---

## n8n Workflow Steps

1. **Trigger:** Webhook/Schedule/Manual
2. **Transform Data:** Map source to Sanity format
3. **Upload Images:** (if needed) Upload to Sanity assets
4. **Create/Update Post:** Use Sanity HTTP node
5. **Error Handling:** Catch errors, log, notify
6. **Optional:** Trigger website revalidation

---

## Sanity API Endpoints

**Create Post:**
```
POST https://YOUR_PROJECT_ID.api.sanity.io/v2024-01-01/data/mutate/YOUR_DATASET
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "mutations": [
    {
      "create": {
        "_type": "post",
        // ... your post data
      }
    }
  ]
}
```

---

## Important Notes

1. **Status Filter:** Website only shows posts with `status: "published"`
2. **Slug Uniqueness:** Ensure slugs are unique to avoid conflicts
3. **Image Alt Text:** Always required for accessibility and SEO
4. **Tags vs Categories:** Tags are strings, categories are references
5. **SEO Fallbacks:** If `seoTitle`/`seoDescription` empty, uses `title`/`excerpt`

---

## Testing Checklist

- [ ] Post created with "draft" status (not visible on site)
- [ ] Post created with "published" status (visible on site)
- [ ] Images uploaded with alt text
- [ ] Categories and tags properly assigned
- [ ] SEO fields populated correctly
- [ ] Author reference working
- [ ] Slug auto-generated correctly
- [ ] Error handling working
- [ ] Website displays post correctly
