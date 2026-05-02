# 🔥 OpsPulse API Documentation

Welcome to OpsPulse — a Smart Incident Response Platform API.
This API allows you to create, manage, and track incidents programmatically.

---

## 🔐 Authentication

All API requests must include your API key in the header:

```
x-api-key: YOUR_API_KEY
```

Example:

```
x-api-key: ops_live_abc123
```

---

## 📌 Base URL

```
https://your-api.com/api
```

---

# 🚨 Create Incident

### Endpoint

```
POST /incidents
```

### Description

Create a new incident in the system.

### Headers

```
Content-Type: application/json
x-api-key: YOUR_API_KEY
```

### Request Body

```json
{
  "title": "Payment API Down",
  "description": "Timeout errors increasing rapidly",
  "severity": "high",
  "service": "payment-service"
}
```

### Response

```json
{
  "message": "Incident created successfully",
  "incident": {
    "_id": "12345",
    "title": "Payment API Down",
    "status": "open",
    "severity": "high",
    "createdAt": "2026-04-29T10:00:00Z"
  }
}
```

---

# 📋 Get All Incidents

### Endpoint

```
GET /incidents
```

### Description

Fetch all incidents for the authenticated user.

### Response

```json
{
  "incidents": [
    {
      "_id": "12345",
      "title": "Payment API Down",
      "status": "open",
      "severity": "high"
    }
  ]
}
```

---

# 🔍 Get Single Incident

### Endpoint

```
GET /incidents/:id
```

### Description

Fetch details of a specific incident.

---

# ✏️ Update Incident

### Endpoint

```
PATCH /incidents/:id
```

### Description

Update incident status or details.

### Request Body

```json
{
  "status": "resolved"
}
```

---

# 🧾 Add Timeline Update

### Endpoint

```
POST /incidents/:id/updates
```

### Description

Add a new update to the incident timeline.

### Request Body

```json
{
  "message": "Investigating issue",
  "status": "in-progress"
}
```

---

# 🤖 Generate AI Summary

### Endpoint

```
POST /incidents/:id/ai-summary
```

### Description

Generate an AI-based summary and possible root cause.

### Response

```json
{
  "summary": "The issue appears to be caused by a spike in API latency.",
  "possibleCauses": [
    "Server overload",
    "Database connection delay"
  ]
}
```

---

# 🌍 Public Status Page

### Endpoint

```
GET /status
```

### Description

Fetch public system status and ongoing incidents.

---

# ⚠️ Error Responses

### Unauthorized

```json
{
  "message": "Invalid API key"
}
```

### Validation Error

```json
{
  "message": "Title is required"
}
```

---

# 🔁 Rate Limiting (Optional)

* 100 requests per minute per API key

---

# 📦 Example (cURL)

```bash
curl -X POST https://your-api.com/api/incidents \
  -H "x-api-key: ops_live_abc123" \
  -H "Content-Type: application/json" \
  -d '{"title":"Server Crash","severity":"critical"}'
```

---

# 💡 Best Practices

* Store API keys securely
* Do not expose keys in frontend code
* Rotate keys regularly

---

# 🚀 Summary

OpsPulse API helps you:

* Automate incident reporting
* Track system failures
* Improve response time
* Maintain transparency with users

---
