I reduced our booking confirmation errors from 40% to 0% by building a 3-layer validation system.

40% of my booking emails were sending with blank data. No names. No meeting times. Just empty fields. It looked unprofessional and risked losing customers. After two days of deep-diving into n8n execution logs, I found the silent killer: empty objects.

Cal.com sends webhooks for both bookings and cancellations. For cancellations, the payload is an empty object {}. Because n8n’s IF nodes often have 'alwaysOutputData' enabled, these empty objects pass through as 'truthy' values. The email template then tries to map undefined fields, resulting in a blank message.

I solved this by architecting a 3-layer validation system inside the workflow:


1. Array Length Check: I verify if the booking data actually exists before proceeding.
2. ID Field Validation: I check if the 'id' field is present and correctly formatted (e.g., starting with 'rec'). This catches the {} objects that pass the first check.
3. Required Fields Check: I ensure critical data like name, email, and startTime are all present.

I also implemented 'Semantic Indicators.' If no valid data is found, the node returns a specific flag: {_noLeadsFound: true}. This allows downstream nodes to handle the state gracefully instead of crashing or sending junk.

The results were immediate:


• Reliability jumped from 60% to 99.7%.
• Blank emails dropped to 0%.
• 42 production checks across my ATC_CAL.com and Firebase triggers passed with zero errors.

Empty objects are the silent killers of automation. [{}] looks like valid data to a basic check, but it contains nothing useful. Never trust a webhook payload—validate every layer.

Bookmark this breakdown—you'll need it the next time you're debugging 'truthy' empty objects in your automation workflows.

What's the most annoying 'silent killer' bug you've found in a webhook payload? I'm curious if anyone else has been bitten by the empty object trap.

#n8n #automation #debugging #workflow #reliability

<<IMAGE_1>>