---
inclusion: always
---

# Environment Variables Security Rules

## CRITICAL SECURITY REQUIREMENTS

### 🚨 NEVER TOUCH ACTUAL ENVIRONMENT FILES
- **NEVER** modify `.env.local`, `.env`, or any actual environment files containing real values
- **NEVER** read or access actual environment files to copy values
- **NEVER** hardcode actual API keys, tokens, or credentials in any code

### ✅ ALLOWED ACTIONS
- **ONLY** modify `.env.example` to add new required variables
- **ONLY** reference environment variables using `process.env.VARIABLE_NAME` in code
- **ALWAYS** use placeholder values in code examples like:
  ```typescript
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "ADD_YOUR_API_KEY_HERE";
  ```

### 📋 WHEN ADDING NEW ENVIRONMENT VARIABLES
1. Add the variable to `.env.example` with descriptive placeholder
2. Document what the variable is for and where to get it
3. Use placeholder values in code, never real credentials
4. Ensure the actual env file is in `.gitignore`

### 🔒 SECURITY CHECKLIST
- [ ] No real API keys or tokens in code
- [ ] All sensitive files in `.gitignore`
- [ ] Only placeholder values in examples
- [ ] Clear documentation for user to add real values

### 📝 COMMUNICATION PATTERN
When environment variables are needed:
1. "I need to add a new environment variable for [feature]"
2. "Please add `VARIABLE_NAME=your_actual_value` to your `.env.local` file"
3. "You can get this value from [specific source/dashboard]"
4. Never assume or use actual values

## EXAMPLE IMPLEMENTATIONS

### ✅ CORRECT - Using placeholders
```typescript
const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "ADD_YOUR_GA_ID_HERE";
```

### ❌ WRONG - Using real values
```typescript
const googleAnalyticsId = "G-XXXXXXXXXX"; // Never do this
```

This rule ensures all credentials remain secure and under user control.