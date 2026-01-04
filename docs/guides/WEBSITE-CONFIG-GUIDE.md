# Website Configuration & Deployment Guide

## Quick Overview
**Website:** amansuryavanshi.me | **Deployed on:** Vercel | **CMS:** Sanity.io | **Framework:** Next.js 13+

---

## DOMAIN CONFIGURATION

### 1. Primary Domain: amansuryavanshi.me
- **Status:** ✅ Active & Verified
- **DNS Provider:** Namecheap (using Vercel nameservers)
- **Vercel Config:** Valid Configuration
- **Google:** Verified via HTML file in GSC
- **URL:** https://amansuryavanshi.me/

### 2. Subdomain: www.amansuryavanshi.me  
- **Status:** ✅ Active (307 Temporary Redirect)
- **Redirect Target:** amansuryavanshi.me (apex domain)
- **Purpose:** Handles legacy www traffic
- **Vercel Config:** Valid Configuration

### 3. Fallback Domain: amansuryavanshi-dev.vercel.app
- **Status:** ✅ Active
- **Purpose:** Vercel default domain (backup access)
- **Vercel Config:** Valid Configuration
- **Use:** Only if custom DNS fails

---

## NAMESERVER CONFIGURATION (Namecheap)

### Current Setup (Custom DNS - Vercel Nameservers)
```
Nameserver 1: ns1.vercel-dns.com
Nameserver 2: ns2.vercel-dns.com
Nameserver 3: ns3.vercel-dns.com
Nameserver 4: ns4.vercel-dns.com
```

**Why Vercel Nameservers?**
- Vercel manages all DNS records automatically
- No manual A/CNAME records needed
- Auto SSL/HTTPS provisioning
- Best for Vercel-hosted projects

### How to Access Namecheap DNS Settings
1. Go to: https://ap.www.namecheap.com/domains/
2. Click on amansuryavanshi.me
3. Scroll to "Nameservers" section
4. Current: Custom DNS (Vercel nameservers configured)

---

## VERCEL DEPLOYMENT CONFIGURATION

### Environment Variables (Critical)
**Location:** Vercel > Project Settings > Environment Variables

```
NEXT_PUBLIC_SITE_URL = https://amansuryavanshi.me
```

**Why This Matters:**
- Used by sitemap.ts to generate correct domain URLs
- Used by robots.txt links
- Used by meta tags and canonical URLs

**Note:** Changing env vars requires redeployment

### Vercel Domain Configuration
**Location:** Vercel > Project Settings > Domains

| Domain | Type | Status | Env |
|--------|------|--------|-----|
| amansuryavanshi.me | Apex | Valid | Production |
| www.amansuryavanshi.me | WWW | Valid | Production |
| amansuryavanshi-dev.vercel.app | Vercel | Valid | Production |

---

## SEO & CRAWLER CONFIGURATION

### 1. robots.txt
**Location:** /public/robots.txt  
**Generated At:** https://amansuryavanshi.me/robots.txt  
**Status:** ✅ Active

**Content Summary:**
```
User-Agent: * 
Allow: /
Disallow: /private/ /api/admin/
Sitemap: https://amansuryavanshi.me/sitemap.xml
Host: https://amansuryavanshi.me
```

**What It Does:**
- Tells Google what to crawl/skip
- Points to sitemap location
- Prevents indexing of private routes

### 2. sitemap.ts
**Location:** /src/app/sitemap.ts  
**Generated At:** https://amansuryavanshi.me/sitemap.xml  
**Status:** ✅ Active (10 pages discovered)

**Pages Included:**
1. Homepage (/)
2. /projects
3. /blogs
4. /projects/aviators-training-centre
5. /projects/barkat-enterprise
6. /projects/av-newsstream
7. /projects/foodah
8. /projects/n8n-automation-suite
9. /projects/portfolio-website
10. /projects/ecommerce-platform

**How It Works:**
- Dynamically generated from Next.js routes
- Auto-updates when new projects added
- Uses NEXT_PUBLIC_SITE_URL env var for domain
- Submitted to Google Search Console

---

## GOOGLE SEARCH CONSOLE (GSC)

### Verification Status: ✅ VERIFIED
**Domain:** https://amansuryavanshi.me/  
**Verification Method:** HTML file  
**Status:** Active

### Sitemap Status: ✅ SUCCESS
**URL:** /sitemap.xml  
**Type:** Sitemap  
**Submitted:** Jan 4, 2026  
**Last Read:** Jan 4, 2026  
**Status:** Success ✅  
**Pages Discovered:** 10  
**Videos:** 0  

### Link to GSC
https://search.google.com/search-console?resource_id=https://amansuryavanshi.me/

---

## HOW EVERYTHING WORKS TOGETHER

```
User Types Domain
        ↓
    ↙─ ─ ─ ─ ─ ┐
   /          \ 
.me domain    www.me domain → [307 Redirect] → .me domain
   \          /
    ╲─ ─ ─ ─ ─
        ↓
   amansuryavanshi.me
   (Primary Domain)
        ↓
  Vercel Deployment
        ↓
   ┌─ ─ ─ ─ ─ ┬─ ─ ─ ─ ─┐
   ↓          ↓          ↓
robots.txt  sitemap.ts  Next.js App
   ↓          ↓          ↓
Google  Discovery   Content Delivery
 Crawl  Auto-index    SEO Optimized
```

---

## TRAFFIC FLOW & ANALYTICS

### Where Traffic Goes
1. **amansuryavanshi.me** → Direct to Vercel deployment
2. **www.amansuryavanshi.me** → 307 Redirect to amansuryavanshi.me
3. **vercel-app.com** → Fallback (same deployment)

**Result:** All traffic consolidates to PRIMARY domain (amansuryavanshi.me)

### SEO Benefit
- No duplicate content penalties
- Single authority source
- All metrics tracked in ONE GSC property
- Better ranking potential

---

## DEPLOYMENT PROCESS

### GitHub → Vercel (Automatic)
1. Push code to `main` branch
2. Vercel auto-detects changes
3. Runs build & tests
4. Deploys to production
5. Domain updates automatically

### Manual Deployment
**Vercel Dashboard:** https://vercel.com/amansuryavanshi1s-projects/amansuryavanshi.dev
- Click "Deployments" tab
- Click "Redeploy" for specific deployment
- Or click "GitHub" to trigger from latest commit

---

## TROUBLESHOOTING GUIDE

### Issue: "Domain shows Invalid Configuration" ❌
**Solution:**
1. Check Namecheap → Domain → DNS Records
2. Verify Vercel nameservers are set
3. Wait 24-48 hours for DNS propagation
4. In Vercel, click "Refresh" button

### Issue: "Sitemap not found in GSC" 🔍
**Solution:**
1. Check: https://amansuryavanshi.me/sitemap.xml (must return XML)
2. Verify env var: NEXT_PUBLIC_SITE_URL is set in Vercel
3. Verify robots.txt has sitemap URL
4. Resubmit sitemap in GSC Sitemaps section

### Issue: "www domain not redirecting" ➡️
**Solution:**
1. Vercel > Domains > Edit www.amansuryavanshi.me
2. Ensure "Redirect to Another Domain" is selected
3. Set to: amansuryavanshi.me
4. Save and wait ~5 minutes

### Issue: "Pages not appearing in Google Search" 🔎
**Solution:**
1. Give 7-14 days for initial indexing
2. Use GSC "URL Inspection" tool to request indexing
3. Ensure robots.txt allows crawling (Allow: /)
4. Check Core Web Vitals in GSC
5. Add internal links from homepage

---

## IMPORTANT FILES & LOCATIONS

### Core Files
| File | Location | Purpose |
|------|----------|----------|
| robots.txt | /public/robots.txt | Crawler instructions |
| sitemap.ts | /src/app/sitemap.ts | URL discovery for Google |
| layout.tsx | /src/app/layout.tsx | Master metadata (SEO) |
| next.config.ts | /next.config.ts | Next.js build config |

### GitHub Repository
https://github.com/AmanSuryavanshi-1/AmanSuryavanshi.dev

### Live Website
https://amansuryavanshi.me/

---

## MONITORING & UPDATES

### Daily
- Website accessibility
- Error logs in Vercel

### Weekly  
- Google Search Console performance
- Core Web Vitals
- New page indexing status

### Monthly
- SEO rankings
- Traffic analysis
- Domain authority
- Backlink profile

### Quarterly
- Update sitemap manually if robots.ts not capturing all pages
- Review GSC coverage report
- Check for indexing errors
- Update robots.txt if new private routes added

---

## FUTURE IMPROVEMENTS

### Quick Wins (No Code Needed)
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Add Google Analytics 4
- [ ] Set up Google Business Profile
- [ ] Submit to other search engines (Yandex, Baidu)

### Medium Priority (Code Changes)
- [ ] Add schema.org structured data (projects, author)
- [ ] Implement breadcrumb markup
- [ ] Add Open Graph meta tags for social sharing
- [ ] Optimize images for Core Web Vitals

### Long Term (SEO Growth)
- [ ] Build backlinks (guest posts, directory submissions)
- [ ] Create high-value content (blog posts)
- [ ] Optimize meta descriptions
- [ ] Improve internal linking strategy
- [ ] Add FAQ schema markup

---

## QUICK LINKS

**Domain Management:**
- Namecheap: https://www.namecheap.com/ → Dashboard → Domains
- Vercel Domains: https://vercel.com/amansuryavanshi1s-projects/amansuryavanshi.dev/settings/domains

**SEO Monitoring:**
- Google Search Console: https://search.google.com/search-console?resource_id=https://amansuryavanshi.me/
- Google Analytics: https://analytics.google.com/
- Vercel Deployments: https://vercel.com/amansuryavanshi1s-projects/amansuryavanshi.dev/deployments

**GitHub:**
- Repository: https://github.com/AmanSuryavanshi-1/AmanSuryavanshi.dev
- Commits: https://github.com/AmanSuryavanshi-1/AmanSuryavanshi.dev/commits/main
- Settings: https://github.com/AmanSuryavanshi-1/AmanSuryavanshi.dev/settings

---

## VERSION HISTORY

| Date | Changes | Status |
|------|---------|--------|
| Jan 4, 2026 | Domain verified, SEO setup complete | ✅ Live |
| Jan 4, 2026 | Sitemap indexed by Google (10 pages) | ✅ Success |
| Jan 4, 2026 | All three domains configured | ✅ Active |

---

**Last Updated:** Jan 4, 2026, 9 PM IST  
**Maintained By:** Aman Suryavanshi  
**Status:** All Systems Operational ✅
