# 🚀 Best Practices for Managing Web Assets (Images & Videos)

A quick reference guide on how to handle large assets in web projects to ensure high performance and a clean repository.

## 1. The Golden Rule ⚠️
**Never push large files (>50MB) to GitHub.**
It bloats the repository, makes cloning slow, and causes push rejections (as seen with the "Shipping Box" incident).

---

## 2. Handling Videos 🎥
**🏆 Recommendation: Host Externally (Cloudinary)**

| Option | Pros | Cons | Verdict |
| :--- | :--- | :--- | :--- |
| **Cloudinary** | Free tier (25GB), professional streaming, no ads/logos, direct `.mp4` link. | Bandwidth limits if viral. | **✅ BEST FOR PORTFOLIOS** |
| **YouTube** | Unlimited free hosting. | Ads, YouTube branding, heavy iframe player (slows page). | **⚠️ Good for long demos only** |
| **Git/Local** | None. | Slows down site, bloats repo, hard to stream. | **❌ AVOID** |

### How to Implement (Cloudinary)
1.  Upload video to Cloudinary (Free Account).
2.  Copy the URL (ensure it ends in `.mp4`).
3.  Use a standard HTML `<video>` tag or your custom component.
    ```tsx
    // Example usage in code
    <video 
      src="https://res.cloudinary.com/.../demo.mp4" 
      autoPlay 
      muted 
      loop 
      playsInline 
    />
    ```

---

## 3. Handling Images 🖼️
**🏆 Recommendation: Hybrid Approach**

| Scenario | Strategy | Why? |
| :--- | :--- | :--- |
| **Standard Images (< 2MB)** | **Keep in `public/` folder** | Next.js `<Image />` component automatically optimizes them (WebP, lazy load). Fastest dev experience. |
| **Huge Images (> 5MB)** | **Cloudinary** | Git doesn't like large binaries. Cloudinary auto-compresses them (`f_auto,q_auto`). |
| **Images in other Repos** | **Copy to `public/`** | "Raw" GitHub links are slow, uncached, and unprofessional. Just copy the file to your project! |

### How to Implement (Local)
```tsx
import Image from 'next/image';
// Next.js automatically optimizes this!
<Image src="/my-image.png" width={800} height={600} alt="Description" />
```

---

## 4. FAQ (Frequently Asked Questions)

**Q: Can I use Sanity (Free Tier)?**
> **A:** Yes, but it has lower limits (10GB bandwidth) compared to Cloudinary (25GB). It's great for blog images but less ideal for heavy video hosting.

**Q: Can I use Cloudinary images in my GitHub README?**
> **A:** **Yes!** It's a pro move. It keeps your repo small and serves high-quality images fast.
> ```markdown
> ![Demo](https://res.cloudinary.com/.../screenshot.png?w=1200&q=auto&f=auto)
> ```

**Q: Do I need to manually convert images to WebP?**
> **A:** No.
> *   **Next.js** does it automatically for local images.
> *   **Cloudinary** does it automatically if you add `f_auto,q_auto` to the URL.

**Q: How do I play videos only when they are on screen?**
> **A:** Use an `IntersectionObserver` (like in your `AutoPlayVideo.tsx` component). It detects when the video enters the viewport and calls `.play()`, saving bandwidth when the user isn't looking.

---
*Created by Antigravity | December 2025*
