# From Cloudinary Quota Exhaustion to Unlimited Free CDN 🚀

A complete guide on how I migrated my portfolio's media assets from Cloudinary to a **free, unlimited bandwidth solution** using GitHub + jsDelivr CDN for images and YouTube for videos.

---

## 📋 Table of Contents

1. [The Problem: Cloudinary Quota Exhaustion](#the-problem-cloudinary-quota-exhaustion)
2. [Why Cloudinary Got Exhausted So Fast](#why-cloudinary-got-exhausted-so-fast)
3. [Alternatives Considered](#alternatives-considered)
4. [The Final Solution](#the-final-solution)
5. [Implementation Details](#implementation-details)
6. [Traffic Capacity & Scalability](#traffic-capacity--scalability)
7. [Cost Comparison](#cost-comparison)
8. [How to Replicate This Setup](#how-to-replicate-this-setup)

---

## 🚨 The Problem: Cloudinary Quota Exhaustion

### What Happened

I was using **Cloudinary** to host all my portfolio images and videos. Everything worked great initially — fast loading, automatic optimization, easy API.

Then I received a quota warning email: **31 GB used out of 25 GB limit**.

Cloudinary had allowed a small grace buffer, but my assets were about to be **paused/blocked** until the next billing cycle.

### The Numbers

| Metric | Cloudinary Free Tier | My Usage |
|--------|---------------------|----------|
| Bandwidth | 25 GB/month | **31 GB** ❌ |
| Storage | 25 GB | ~2 GB ✓ |
| Transformations | 25,000/month | ~5,000 ✓ |

The bottleneck was **bandwidth**, not storage or transformations.

---

## 🔍 Why Cloudinary Got Exhausted So Fast

### Root Causes

1. **Videos are Bandwidth Killers**
   - 5 project walkthrough videos (~50-100 MB each)
   - Every video autoplay = full download
   - No streaming optimization on free tier

2. **Full Page Loads = Heavy Bandwidth**
   - ~25 images per full site load
   - Average image: 500 KB - 2 MB (even optimized)
   - Total per visitor: **~50-100 MB** for full experience

3. **Re-uploads During Development**
   - Each upload/delete consumes bandwidth
   - Testing different versions = multiple downloads
   - Development traffic adds up

4. **No CDN Caching Layer**
   - Cloudinary serves directly (no edge caching on free tier)
   - Every request hits their bandwidth quota

### The Math That Broke It

```
Per full page load ≈ 100 MB (with video autoplay)
25 GB limit ÷ 100 MB = ~250 full loads before quota exhaustion
```

With just **250 complete site visits**, the free tier was exhausted. That's not even accounting for development, testing, and partial loads.

---

## 🤔 Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Cloudinary Paid** | Easy migration, same API | $89/month for 225 GB | ❌ Too expensive |
| **AWS S3 + CloudFront** | Scalable, reliable | Complex, pay-per-use | ❌ Overkill |
| **Vercel Blob** | Native Next.js | Uses Vercel bandwidth (100 GB limit) | ❌ Same problem |
| **Sanity CDN** | Already using Sanity | Only 10 GB/month free | ❌ Even worse |
| **Bunny.net CDN** | Fast, cheap | No permanent free tier | ❌ Not free |
| **GitHub + jsDelivr** | **FREE unlimited**, fast CDN | Static files only | ✅ Perfect for images |
| **YouTube (unlisted)** | **FREE unlimited**, best streaming | External embed | ✅ Perfect for videos |

---

## ✅ The Final Solution

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PORTFOLIO WEBSITE                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   IMAGES                          VIDEOS                    │
│   ───────                         ──────                    │
│   GitHub Repo ──► jsDelivr CDN    YouTube (Unlisted)        │
│   (portfolio-assets)              - Infinite bandwidth      │
│   - Unlimited storage             - Best compression        │
│   - Global CDN                    - Adaptive streaming      │
│   - Free forever                  - Free forever            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│   Fallback Chain: CDN ──► Cloudinary ──► SVG Placeholder    │
└─────────────────────────────────────────────────────────────┘
```

### Why This is Better

| Feature | Cloudinary | GitHub + jsDelivr + YouTube |
|---------|------------|------------------------------|
| **Bandwidth** | 25 GB/month | **Unlimited** |
| **Cost** | $0 → $89/month if exceeded | **$0 forever** |
| **Video Streaming** | Basic (no adaptive) | **Adaptive bitrate** |
| **Global CDN** | Yes | Yes (jsDelivr + YouTube) |
| **Uptime** | 99.9% | GitHub: 99.95%, YouTube: 99.99% |
| **Image Optimization** | Auto (counts as transforms) | Pre-optimized WebP |

---

## 🛠 Implementation Details

### 1. GitHub Repository for Images

Created a dedicated repository: `AmanSuryavanshi-1/portfolio-assets`

```
portfolio-assets/
├── AviatorsTrainingCentre/
│   ├── Docs_Assets/
│   └── *.webp
├── BarkatEnterprise/
├── Foodah/
├── OmniPostAI/
└── ...
```

### 2. jsDelivr CDN URLs

jsDelivr provides a free CDN for GitHub repositories:

```
https://cdn.jsdelivr.net/gh/USERNAME/REPO@BRANCH/PATH/TO/FILE
```

Example:
```
https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/AviatorsTrainingCentre/homepage.webp
```

### 3. YouTube Embed Component

Created a custom `YouTubeEmbed.tsx` component with:

- **Autoplay when in viewport** (IntersectionObserver)
- **Privacy-enhanced mode** (`youtube-nocookie.com`)
- **Object-cover CSS** to eliminate letterboxing
- **Poster image overlay** to hide YouTube's loading spinner

```tsx
// Key features
<iframe
  src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1`}
  className="min-w-[300%] min-h-[300%]" // Object-cover effect
/>
```

### 4. Centralized Asset Management

Created `src/data/centralized-assets.json`:

```json
{
  "AviatorsTrainingCentre": {
    "assets": [
      {
        "id": "homepage",
        "filename": "homepage.webp",
        "cdnUrl": "https://cdn.jsdelivr.net/.../homepage.webp",
        "cloudinaryUrl": "https://res.cloudinary.com/...", // Fallback
        "type": "image"
      }
    ],
    "youtubeUrl": "https://youtube.com/watch?v=7NSVxMqWUGU"
  }
}
```

### 5. Next.js Configuration

Added jsDelivr to allowed image domains in `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
    { protocol: 'https', hostname: 'res.cloudinary.com' }, // Fallback
  ]
}
```

### 6. Image Optimization Pipeline

Before uploading to GitHub:

1. **Convert to WebP** (80% quality for standard, 90% for zoomable)
2. **Resize to max 1920px width**
3. **Remove metadata** (EXIF, etc.)

Used a custom Node.js script with Sharp:

```javascript
sharp(inputPath)
  .webp({ quality: 80 })
  .resize({ width: 1920, withoutEnlargement: true })
  .toFile(outputPath);
```

---

## 📊 Traffic Capacity & Scalability

### Current Setup Capacity

| Service | Limit | Capacity |
|---------|-------|----------|
| **jsDelivr** | No enforced limit | **Unlimited** (fair use) |
| **YouTube** | No limit | **Unlimited** |
| **GitHub LFS** | 1 GB storage free | 2 GB available |

### Realistic Traffic Estimates

| Monthly Visitors | Image Bandwidth | Video Bandwidth | Total | Status |
|------------------|-----------------|-----------------|-------|--------|
| 1,000 | ~10 GB | 0 (YouTube) | 10 GB | ✅ Easy |
| 10,000 | ~100 GB | 0 (YouTube) | 100 GB | ✅ Fine |
| 100,000 | ~1 TB | 0 (YouTube) | 1 TB | ✅ jsDelivr handles it |

**Key insight**: YouTube handles ALL video bandwidth independently. Your only bandwidth consideration is images via jsDelivr, which has no enforced limits for open-source projects.

---

## 💰 Cost Comparison

### Monthly Costs at 10,000 Visitors

| Solution | Images | Videos | Total |
|----------|--------|--------|-------|
| **Cloudinary** | $89+ (exceeded) | Included | **$89+/month** |
| **AWS S3 + CloudFront** | ~$5 | ~$10 | **~$15/month** |
| **Vercel Blob** | Pro plan $20 | N/A | **$20/month** |
| **GitHub + jsDelivr + YouTube** | $0 | $0 | **$0/month** |

### 5-Year Projection

| Solution | Year 1 | Years 2-5 | Total |
|----------|--------|-----------|-------|
| Cloudinary (if traffic grows) | $1,068 | $4,272 | **$5,340** |
| GitHub + jsDelivr + YouTube | $0 | $0 | **$0** |

---

## 📝 How to Replicate This Setup

### Step 1: Create Asset Repository

```bash
# Create a new public repo for assets
gh repo create portfolio-assets --public
```

### Step 2: Optimize Images

```bash
# Install sharp
npm install sharp glob

# Create optimization script
node scripts/optimize-images.js
```

### Step 3: Upload to GitHub

```bash
cd portfolio-assets
git add .
git commit -m "Add optimized assets"
git push origin main
```

### Step 4: Use jsDelivr URLs

```typescript
// In your code
const imageUrl = `https://cdn.jsdelivr.net/gh/YOUR_USERNAME/portfolio-assets@main/path/to/image.webp`;
```

### Step 5: Upload Videos to YouTube

1. Upload as **Unlisted** (not public, not private)
2. Copy video ID from URL
3. Store IDs in your data file

### Step 6: Create YouTube Embed Component

See `src/components/ui/YouTubeEmbed.tsx` or `ProjectMediaCarousel.tsx` for implementation.

---

## 📁 Files Changed in This Migration

| File | Purpose |
|------|---------|
| `src/data/centralized-assets.json` | Asset registry with CDN + YouTube URLs |
| `src/data/portfolio.tsx` | Project data with `videoYouTubeId` fields |
| `src/components/ui/YouTubeEmbed.tsx` | YouTube embed with autoplay |
| `src/components/projects/ProjectMediaCarousel.tsx` | Media carousel with lightbox |
| `next.config.ts` | Added jsDelivr to allowed domains |
| `scripts/optimize-images.js` | Image optimization pipeline |
| `scripts/add-cdn-urls.js` | CDN URL generation script |

---

## 🎯 Key Takeaways

1. **Cloudinary free tier is not for video-heavy portfolios** — 25 GB bandwidth exhausts quickly
2. **YouTube is the best free video host** — unlimited bandwidth, adaptive streaming, globally cached
3. **jsDelivr + GitHub = unlimited free image CDN** — perfect for portfolios and documentation
4. **Pre-optimize images** — WebP at 80% quality saves bandwidth and loads faster
5. **Always have a fallback chain** — CDN → Cloudinary → Placeholder prevents broken images

---

## 🔗 Related Resources

- [jsDelivr Documentation](https://www.jsdelivr.com/documentation)
- [YouTube Embed API](https://developers.google.com/youtube/iframe_api_reference)
- [Sharp Image Optimization](https://sharp.pixelplumbing.com/)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)

---

**Author**: Aman Suryavanshi  
**Portfolio**: [amansuryavanshi.me](https://amansuryavanshi.me)  
**GitHub**: [@AmanSuryavanshi-1](https://github.com/AmanSuryavanshi-1)

*Last Updated: December 2024*
