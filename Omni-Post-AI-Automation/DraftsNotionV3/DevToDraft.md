# How I Fixed the "Empty Email" Bug in n8n (And Saved My Reputation)

**TL;DR:**
- I solved a 40% failure rate in booking confirmation emails caused by empty webhook payloads.
- JavaScript treats empty objects `{}` as truthy, which bypasses standard n8n `IF` nodes.
- I built a 3-layer validation system that boosted reliability to 99.7%.

<<IMAGE_1>>

## The Embarrassing Reality of "Hi ,"

Few things feel as unprofessional as an automated email that fails to populate. For two days, 40% of my booking confirmations were reaching users with blank fields. 

Instead of a warm welcome, they saw: *"Hi , your meeting is scheduled for ."*

I initially thought it was an email template error. I was wrong. After digging into the **n8n execution logs**, I found a silent killer: the empty object.

---

## Prerequisites

To follow this guide, you should have:
- A basic understanding of **n8n workflows**.
- Familiarity with **JavaScript** (specifically how it handles objects).
- Experience working with **webhooks** (I used Cal.com for this case study).

---

## The Problem: The Silent Truthiness of `{}`

My automation was triggered by **Cal.com** webhooks. I discovered that Cal.com sends payloads for both successful bookings and cancellations. 

Here is where it gets tricky: 
1. For certain cancellation events, the payload returned was an **empty object `{}`**.
2. In n8n, many nodes have `alwaysOutputData: true` enabled by default.
3. In JavaScript, an empty object `{}` is **truthy**. 
4. My `IF` nodes saw the empty object, assumed it was valid data, and passed it to the email node.

Because the object existed but contained no fields like `name` or `startTime`, the email template rendered blank spaces.

---

## What I Tried First (That Failed)

Before landing on the final solution, I went through several failed iterations. You might recognize these patterns:

**Attempt 1: Checking Array Length**
```javascript
// This fails because [{}] still has a length of 1
if (items.length > 0) return items;
```

**Attempt 2: The Direct Truthy Check**
```javascript
// This fails because {} evaluates to true in JavaScript
if (items[0]) return items;
```

**Attempt 3: Direct Property Access**
```javascript
// This crashed the workflow with a "Cannot read property of undefined" error
if (items[0].json.id) return items;
```

<<IMAGE_2>>

---

## The Solution: 3-Layer Validation Architecture

I realized I needed a defensive strategy that checked for data integrity at multiple levels. I replaced my standard `IF` nodes with a **Code Node** that runs this 3-layer check:

### Layer 1: Structure Integrity
I check if the input actually contains data and matches the expected n8n JSON structure. This catches `null` or `undefined` responses.

### Layer 2: ID Validation
I verify that a unique identifier exists and follows the correct format (e.g., Airtable IDs starting with 'rec'). This filters out the empty `{}` objects sent by cancellations.

### Layer 3: Meaningful Data Check
I ensure the object has more than one key and contains the specific fields required for the email (name, email, startTime).

---

## The Implementation

Here is the exact function I used inside an n8n Code Node to filter out bad data while preserving the workflow's momentum:

```javascript
// n8n Code Node: Validation Logic
function isValidLead(lead) {
  // Layer 1: Check basic structure
  if (!lead || !lead.json) return false;

  // Layer 2: Check ID exists and matches format
  // This stops the empty {} objects from Cal.com
  if (!lead.json.id || !lead.json.id.startsWith('rec')) return false;

  // Layer 3: Check for actual content
  // Ensures we have more than just a metadata ID
  if (Object.keys(lead.json).length <= 1) return false;

  return true;
}

const validLeads = items.filter(isValidLead);

if (validLeads.length === 0) {
  // We use a semantic indicator to tell downstream nodes to stop
  return [{ json: { _noLeadsFound: true } }]; 
}

return validLeads;
```

### Why I Use Semantic Indicators
Instead of just returning an empty array, I return an object with `_noLeadsFound: true`. This allows downstream nodes to check for this specific flag and exit gracefully rather than throwing an error or sending a blank email.

---

## The Results

Since deploying this 3-layer system, the results speak for themselves:

- **Reliability:** Jumped from 60% to **99.7%**.
- **Blank Emails:** Reduced to **0%**.
- **Debugging Time:** Cut from hours to minutes, as the semantic indicators make it obvious why a workflow stopped.

In production, this system successfully processed 42 consecutive checks across Cal.com and Firebase triggers without a single false positive.

---

## Key Takeaways for Your Workflows

1. **Never trust webhooks:** Treat every incoming payload as potentially broken.
2. **{} is Truthy:** Always check `Object.keys(data).length` if you suspect empty objects.
3. **Layer your logic:** Don't rely on a single check. Validate the structure, the ID, and the content.
4. **Use Indicators:** Use flags like `_noLeadsFound` to maintain control over your data flow.

---

## Discussion Question

I chose to use a **Code Node** for this validation because it gives me granular control, but I've seen others use a chain of multiple **Filter Nodes**. 

Which approach do you prefer for complex validation? Is the Code Node too much overhead, or is it cleaner than a "spaghetti" of Filter nodes? I'd love to hear your thoughts in the comments!

---

*I'm documenting my journey building reliable automations and Next.js apps. If you found this helpful, follow me here on Dev.to for more deep dives into n8n and workflow architecture.*

**Connect with me:**
- [Portfolio](https://amansuryavanshi.me/)
- [GitHub](https://github.com/AmanSuryavanshi-1)
- [LinkedIn](https://www.linkedin.com/in/amansuryavanshi-ai/)