# Obsidian MCP Server — Setup, Daily Use & Cloud Migration

## Architecture

![Obsidian MCP Local Network Topology](https://cdn.jsdelivr.net/gh/AmanSuryavanshi-1/portfolio-assets@main/OMNI-POST-AI-Assets/obsidian-mcp-network-topology.webp)


```
YOUR WINDOWS MACHINE (local, free)
├── Obsidian App (vault + Local REST API plugin on port 27124)
├── obsidian-mcp-server (HTTP on port 3010, translates MCP ↔ REST)
├── Docker
│   └── n8n container (connects to MCP via host.docker.internal:3010)
└── Cloudflare Tunnel (exposes n8n UI only, NOT the MCP server)
```

Security: Port 3010 is only accessible from your machine + Docker containers.
Windows Firewall blocks all external access. Cloudflare tunnel only routes n8n (port 5678).
The MCP server is invisible to the internet.

---

## One-Time Setup

### 1. Install prerequisites (already done if Claude Code works)
```powershell
# Verify Node.js and npx are available
node -v
npx -v
```

### 2. Create the .env config file
```powershell
cd "a:\_Coding_Notes_Projects_IMP_\MAJOR PROJECTS\AmanSuryavanshi.dev\Omni-Post-AI-Automation"
copy .env.obsidian-mcp.example .env.obsidian-mcp
```

Edit `.env.obsidian-mcp` and paste your Obsidian API key:
- Open Obsidian > Settings > Community Plugins > Local REST API > copy the API Key
- Replace `PASTE_YOUR_OBSIDIAN_API_KEY_HERE` with your actual key

### 3. Ensure Docker can reach the host
Check your `docker-compose.yml` has:
```yaml
services:
  n8n:
    # ... your existing config ...
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

Docker Desktop on Windows usually has this by default, but add it explicitly.

### 4. Configure n8n MCP Client Tool node
In n8n, on the MCP Client Tool node attached to your Obsidian AI Agent:

| Setting | Value |
|---------|-------|
| Endpoint | `http://host.docker.internal:3010/mcp` |
| Server Transport | `HTTP Streamable` |
| Authentication | `None` |
| Tools to Include | `Selected` → pick read-only tools |

### 5. First test
1. Open Obsidian
2. Double-click `start-obsidian-mcp.bat`
3. Wait for: `StreamableHttp endpoint: http://localhost:3010/mcp`
4. Optional health check (same terminal or another shell):
```powershell
curl http://localhost:3010/healthz
```
Expected response: `ok`
4. In n8n, open the MCP Client Tool node — tools should now list in the dropdown
5. Run the Obsidian AI Agent node — it should fetch vault context

---

## Daily Commands (3 terminals)

Every time you start your workflow:

### Terminal 1: Start Obsidian MCP Server (recommended: watchdog)
```powershell
# First: open Obsidian manually (needs to be running)
# Then start watchdog for auto-recovery:
powershell -NoProfile -ExecutionPolicy Bypass -File "A:\.n8n\n8n-local-docker\scripts\watch-obsidian-mcp.ps1"
```
Watchdog will health-check `/healthz` and auto-restart bridge on repeated failures.

Alternative (manual, no watchdog):
```powershell
cd "a:\_Coding_Notes_Projects_IMP_\MAJOR PROJECTS\AmanSuryavanshi.dev\Omni-Post-AI-Automation"
.\start-obsidian-mcp.bat
```

### Terminal 2: Start n8n Docker
```powershell
# Your existing n8n Docker command
docker compose up -d
# or: docker start <your-n8n-container-name>
```

### Terminal 3: Start Cloudflare Tunnel
```powershell
# Your existing Cloudflare tunnel command
cloudflared tunnel run <your-tunnel-name>
```

### Order matters:
1. Obsidian must be open FIRST (REST API needs the app)
2. MCP server starts SECOND (needs Obsidian REST API)
3. n8n starts THIRD (needs MCP server to list tools)
4. Cloudflare tunnel can start anytime (only routes n8n UI)

### Shutdown:
- Ctrl+C in Terminal 1 (stops MCP server)
- `docker compose down` in Terminal 2 (stops n8n)
- Ctrl+C in Terminal 3 (stops tunnel)
- Close Obsidian whenever

---

## Security Model

### Local (current setup) — already secure

| Layer | Protection |
|-------|-----------|
| Windows Firewall | Blocks port 3010 from external access by default |
| Docker bridge network | Only containers on the same Docker network can reach host.docker.internal |
| Cloudflare Tunnel | Only routes port 5678 (n8n), NOT port 3010 (MCP) |
| Obsidian REST API | Requires API key (MCP server uses it internally) |

Nobody on the internet can reach your MCP server. It's local-only.

### Cloud (when you migrate) — add JWT auth

When moving to cloud, uncomment these in `.env.obsidian-mcp`:
```
MCP_AUTH_MODE=jwt
MCP_AUTH_SECRET_KEY=<your-32-char-random-string>
```

Then in n8n:
- MCP Client Tool > Authentication > Bearer Auth
- Create credential with the JWT token

---

## Cloud Migration Guide

### When you'd move to cloud
- You want 24/7 uptime (workflows run while your PC is off)
- You want to trigger workflows from webhooks without your PC being on

### The hard constraint
Obsidian MCP server needs the **Obsidian desktop app running** (for the Local REST API).
This means cloud deployment requires either:

### Option A: Keep MCP local, move only n8n to cloud (recommended, free)

```
CLOUD (VPS / Oracle Free Tier)
├── n8n (Docker)
└── Cloudflare Tunnel (exposes n8n)

YOUR PC (local)
├── Obsidian (must be open)
├── obsidian-mcp-server (HTTP mode)
└── Tailscale (private VPN, free tier)
     └── n8n connects to MCP via Tailscale IP
```

**Why this works:**
- Oracle Cloud Free Tier: 4 ARM CPUs, 24GB RAM, always free
- Tailscale: free for personal use (up to 100 devices)
- Your MCP server stays on your PC, only accessible via Tailscale private network
- n8n on cloud calls `http://<your-tailscale-ip>:3010/mcp`

**Limitation:** Your PC must be on for the Obsidian overlay to work.
- If your PC is off, the overlay fails gracefully and n8n uses [Portfolio API](./12-Portfolio-API-Reference.md) only.

**Setup steps:**
1. Get Oracle Cloud Free Tier account
2. Create an ARM instance (Ampere A1, 4 OCPUs, 24GB RAM)
3. Install Docker + n8n on the instance
4. Install Tailscale on both your PC and the cloud instance
5. Update n8n MCP Client Tool endpoint to: `http://<pc-tailscale-ip>:3010/mcp`
6. Enable JWT auth on MCP server (since traffic crosses the network now)
7. Set up Cloudflare tunnel on the cloud instance for n8n UI

### Option B: Full cloud with vault sync (advanced, free)

```
CLOUD (VPS)
├── n8n (Docker)
├── obsidian-mcp-server (Docker sidecar)
├── Obsidian vault files (synced via Git)
└── File-based vault reader (no Obsidian app needed)
```

**Approach:**
Instead of depending on the Obsidian desktop app, sync your vault files to the cloud via Git:
1. Push vault to a private GitHub repo (or use Obsidian Git plugin)
2. Clone the vault on the cloud instance
3. Use a file-based MCP server that reads markdown directly
   (e.g., `stevenstavrakis/obsidian-mcp` which can work with raw files)
4. Set up a cron job to `git pull` every 10 minutes

**Tradeoff:** You lose real-time vault access (10-min delay) but gain full independence from your PC.

### Option C: Hybrid — Portfolio API for cloud, Obsidian overlay when local

This is what we already built. The workflow runs fine with just Portfolio API.
When your PC is on and MCP server is running, the overlay adds fresh vault context.
When your PC is off, the overlay silently falls back.

**This is the recommended default.** Zero cloud cost. Zero risk. Full quality when local.

---

## Free Tier Reference

| Service | Free Tier | What to use it for |
|---------|-----------|-------------------|
| Oracle Cloud | 4 ARM CPUs, 24GB RAM, 200GB disk, always free | n8n + Docker hosting |
| Tailscale | 100 devices, free for personal | Private VPN between PC and cloud |
| Cloudflare Tunnel | Free, unlimited | Expose n8n UI publicly |
| GitHub | Free private repos | Vault sync (Option B) |
| Render | 750 hours/month free (spins down) | Alternative to Oracle if no ARM support needed |
| Fly.io | 3 shared VMs free | Alternative lightweight hosting |

---

## Troubleshooting

### MCP server won't start
- Is Obsidian open? The Local REST API plugin needs the app running.
- Is the API key correct in `.env.obsidian-mcp`?
- Is port 3010 already in use? Check: `netstat -ano | findstr :3010`

### n8n can't connect to MCP server
- Is the MCP server running? Check Terminal 1 for the StreamableHttp endpoint line.
- Is Docker Desktop running? `host.docker.internal` needs Docker Desktop.
- Check health endpoint from host: `curl http://localhost:3010/healthz` (must return `ok`).
- Try from inside Docker:
  - `docker exec -it <n8n-container> curl http://host.docker.internal:3010/healthz`
  - `docker exec -it <n8n-container> curl http://host.docker.internal:3010/mcp`
- If you see intermittent timeout (`MCP error -32001`):
  1. If watchdog is running, wait one cycle (~20-60s) for auto-restart.
  2. If no recovery, restart Obsidian app.
  3. Restart watchdog or rerun `start-obsidian-mcp.ps1`.

### Tools not listing in n8n dropdown
- Connection must work first (see above)
- Try switching Tools to Include to "All", save, then switch back to "Selected"
- Close and reopen the MCP Client Tool node

### Obsidian overlay skipped in workflow output
- Check `_meta.obsidianOverlay` in the Personal Context Builder output
- If it says `skipped`: MCP server was unreachable or returned empty data
- This is safe — workflow continues with Portfolio API only
