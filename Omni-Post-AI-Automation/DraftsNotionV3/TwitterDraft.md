Tweet 1/6

40% of my booking emails were sending with blank data. No name. No time. Just empty fields. I built a 3-layer validation system that hit 99.7% reliability. This is how I killed the empty object bug.

<<IMAGE_1>>

---

Tweet 2/6

The villain: Javascript’s truthy values. Cal.com sends empty objects {} for cancellations. n8n sees {} and thinks it’s valid. My email node then tries to pull missing fields. Result: Blank emails.

---

Tweet 3/6

Layer 1: Check array length. `bookingData.length > 0` catches nulls. Layer 2: Check the ID. {} has a length of 1 but no ID. Checking for `bookingData[0].id` stops the ghost data. But one final check remains:

---

Tweet 4/6

Layer 3: Required fields. I check for name, email, and startTime. If a lead is missing, I use a semantic indicator: `_noLeadsFound: true`. This preserves data flow without triggering errors.

<<IMAGE_2>>

---

Tweet 5/6

Every n8n workflow running in production without explicit validation is a ticking time bomb. Never trust webhook data. [{}] looks like data, but it’s just a shell. Validate every single node.

---

Tweet 6/6

Results: 99.7% reliability. 0% blank emails. 42 production checks passed with zero errors. Reliability isn’t a feature; it’s a requirement. Bookmark this for your next n8n build. #n8n #automation #debugging #workflow #reliability