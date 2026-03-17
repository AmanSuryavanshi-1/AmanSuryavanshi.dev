# 🖼️ Image Tasklist for: ATC-04

**Reason:** This content has 4 visual proof points that significantly increase credibility and shareability: (1) Cost comparison chart makes the $1,199 savings instantly graspable, (2) n8n workflow screenshot from the video proves the production implementation is real, (3) Feature comparison table creates a bookmarkable reference asset, (4) Code snippet comparison visually demonstrates why JavaScript matters. Without these visuals, the content is just text claims. With them, it becomes visual proof of competence.

---

## Asset 1: Makes the cost argument instantly visual and shareable. This is the 'stop the scroll' image for LinkedIn and the 'screenshot and retweet' asset for Twitter.

**➡️ Action Required:**
- **Type:** 🤖 Generative AI (Midjourney/DALL-E)
- **Description:** Create a bar chart comparing 5-year automation costs. X-axis: Zapier Pro ($1,199.40), Make.com Pro ($960), n8n Self-Hosted ($0). Y-axis: Total cost in USD. Use a clean, professional design with the n8n bar highlighted in green. Add a callout: 'Savings: $1,199+'. This should be simple enough to read on mobile.
- **Placement:** After the cost comparison paragraph in all platforms. On Twitter: Tweet 2. On LinkedIn: Paragraph 3. On Blog: Immediately after 'Comparison Results' section.
- **Marker:** `<<IMAGE_1>>`

**💡 GenAI Prompt:**
> A clean, modern bar chart visualization showing automation tool cost comparison over 5 years. Three vertical bars: Zapier Pro at $1,199.40 (red/orange), Make.com Pro at $960 (blue), and n8n Self-Hosted at $0 (bright green, highlighted). Y-axis labeled 'Total Cost (USD)', X-axis shows tool names. Include a green callout box pointing to n8n bar with text 'Savings: $1,199+'. Minimalist design, sans-serif font, white background, professional business aesthetic. Chart should be mobile-readable with high contrast.

---## Asset 2: Visual proof of production implementation. This transforms 'I built 3 workflows' from a claim into evidence. Critical for the Velocity Hire Frame - hiring managers need to see the actual work.

**➡️ Action Required:**
- **Type:** 📸 Real Asset (Screenshot/File)
- **Description:** Take a screenshot from your YouTube video (timestamp 2:40) showing the n8n Lead Processing workflow (Workflow A). Capture the full canvas with all nodes visible: webhook trigger, validation nodes, Airtable connections, email nodes. Make sure the execution path is clear. Annotate with arrows or labels if needed: 'Webhook Trigger', 'JavaScript Validation', 'Airtable Update', 'Email Send'. This proves the production implementation is real.
- **Placement:** After explaining the technical implementation. On Twitter: Tweet 6. On LinkedIn: Paragraph 4 (production results). On Blog: In 'Technical Deep Dive' section before code examples.
- **Marker:** `<<IMAGE_2>>`

---

## Asset 3: Creates a bookmarkable reference asset. This is the 'save trigger' - readers will bookmark this for future automation decisions or client pitches.**➡️ Action Required:**
- **Type:** 🤖 Generative AI (Midjourney/DALL-E)
- **Description:** Create a feature comparison table with 3 columns (Zapier, Make, n8n) and 6 rows (Custom Code, Webhooks, Self-Host, Execution Logs, Complex Logic, Free Tier). Use checkmarks and X marks. Zapier: Limited code, Yes webhooks, No self-host, Basic logs, Limited logic, 100 tasks. Make: Basic code, Yes webhooks, No self-host, Good logs, Moderate logic, 1000 ops. n8n: Full JavaScript (highlight this), Yes webhooks, Yes self-host (highlight this), Excellent logs, Unlimited logic (highlight this), Unlimited (highlight this). Use green highlights for n8n's advantages.
- **Placement:** After the feature discussion. On Twitter: Not included (too detailed for thread). On LinkedIn: Paragraph 5 or as a carousel slide. On Blog: In 'Comparison Results' section.
- **Marker:** `<<IMAGE_3>>`

**💡 GenAI Prompt:**
> A clean comparison table with 3 columns and 6 rows. Header row: 'Feature | Zapier | Make | n8n'. Rows: 'Custom Code' (Limited | Basic | Full JavaScript in green), 'Webhooks' (checkmarks for all), 'Self-Host' (X | X | checkmark in green), 'Execution Logs' (Basic | Good | Excellent in green), 'Complex Logic' (Limited | Moderate | Unlimited in green), 'Free Tier' (100 tasks | 1000 ops | Unlimited in green). Use checkmarks (✓) and X marks (✗). Green highlights on n8n's superior features. Professional table design, sans-serif font, alternating row colors for readability. Mobile-friendly layout.

---

## Asset 4: Visually demonstrates the technical depth argument. This is the 'share trigger' for developer audiences - sharing this makes them look technically competent because they understand why code flexibility matters for production automation.**➡️ Action Required:**
- **Type:** 🤖 Generative AI (Midjourney/DALL-E)
- **Description:** Create a side-by-side code comparison. Left side: 'Zapier Code Step (Limited)' with a simple code snippet showing the 10-second timeout warning and limited modules. Right side: 'n8n JavaScript Node (Full)' with the isValidLead() function from the source content. Use syntax highlighting. Add a red warning icon on Zapier side: 'Timeout: 10s, Limited modules'. Add a green checkmark on n8n side: 'No limits, Full Node.js'. This visually demonstrates why JavaScript matters.
- **Placement:** After explaining why JavaScript code nodes matter. On Twitter: Tweet 4. On LinkedIn: Paragraph 5 (the code reveal). On Blog: In 'Technical Deep Dive' section under 'JavaScript Code Nodes'.
- **Marker:** `<<IMAGE_4>>`

**💡 GenAI Prompt:**
> A split-screen code comparison image. Left panel (40% width): Header 'Zapier Code Step' with red warning icon. Shows simplified JavaScript code with a red overlay text 'Timeout: 10 seconds | Limited modules'. Right panel (60% width): Header 'n8n JavaScript Node' with green checkmark. Shows the full isValidLead() function: 'function isValidLead(lead) { if (!lead || !lead.json) return false; if (!lead.json.id?.startsWith('rec')) return false; return Object.keys(lead.json).length > 1; }'. Use dark mode code editor aesthetic with syntax highlighting (keywords in purple, strings in green, comments in gray). Add green overlay text on right: 'No limits | Full Node.js'. Professional developer tool aesthetic.

---

