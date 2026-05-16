# 06. API and Infrastructure

This document outlines the authentication strategy, rate limiting mechanisms, and the zero-cost architecture powering Omni-Post AI.

## Free-Tier API Strategy

**How Costs are Kept at $0/Month:**

| Service | Free Tier | Expected Usage | Cost |
|---------|-----------|----------|------|
| **Gemini (Flash)** | 1500 requests/day | High volume nodes | $0 |
| **Gemini (Pro)** | ~100 requests/day | ~20-30/day | $0 |
| **Tavily API** | 1000 credits/month | ~40-60 credits/mo | $0 |
| **Twitter API** | 450 posts/month | ~20-30/month | $0 |
| **LinkedIn API** | ~100 req/24hrs | ~20-30/month | $0 |
| **Threads API** | Rate limited | ~20-30/month | $0 |
| **Dev.to** | ~30 req/30sec | ~20-30/month | $0 |
| **Hashnode** | 500 req/min | ~20-30/month | $0 |
| **Google Drive** | 1TB storage | <1GB | $0 |
| **Notion API** | 3 requests/sec | ~100 requests/day | $0 |
| **Sanity CMS** | 100K requests/month | ~30/month | $0 |
| **Cloudflare Tunnel**| Unlimited | 24/7 | $0 |
| **Obsidian MCP** | Local compute | Unlimited | $0 |

**Scalability**: This setup handles 100+ content pieces/month comfortably before hitting any free-tier limits.

## OAuth2 Implementation

Omni-Post relies on n8n's built-in OAuth2 handling for all connected platforms.

**Twitter/X API:**
- Flow: 3-Legged OAuth2
- Tier: Free tier (450 posts/month, 50 requests/15 minutes)
- Scopes: `tweet.write`, `tweet.read`

**LinkedIn API:**
- Flow: 3-Legged OAuth2
- Tier: Free tier (organic posts only, 100 req/24 hours)
- Scopes: `w_member_social`
- Note: Enforces a strict 1-image maximum (API fails silently on >1).

**Reliability Strategy:**
Critical posting nodes use `retryOnFail: true`. n8n handles token refreshes automatically upon encountering a 401 Unauthorized response. Manual re-authentication is available via the n8n UI if the refresh token expires.

## Rate Limiting & Quotas

### Current Approach
Rate limits are currently handled via n8n's built-in retry mechanisms:
```javascript
{
  "retryOnFail": true,
  "maxTries": 3,
  "waitBetweenTries": 2000 // 2 seconds
}
```

### Future Enhancement: Proactive Token Refresh & Exponential Backoff
For scaled production systems, future developments will include:
1. **Scheduled Preemptive Refresh:** A cron-triggered workflow running every 4 hours to preemptively refresh tokens before expiry.
2. **Exponential Backoff Custom Functions:** Instead of linear retries, implement `delay = Math.pow(2, attempt) * 1000` (e.g., 1s, 2s, 4s, 8s, 16s) to handle HTTP 429 errors from high-traffic platforms.

## Internal Network Connectivity
- **n8n Hosting**: Running via a self-hosted Docker container, exposed securely via Cloudflare Tunnel.
- **Obsidian MCP Bridge**: Connects over `http://host.docker.internal:3010/mcp` to the locally running MCP server. The Obsidian application must be open for the MCP context overlay to successfully return data; otherwise, the workflow gracefully degrades to the static [Portfolio API](./12-Portfolio-API-Reference.md) logic.
