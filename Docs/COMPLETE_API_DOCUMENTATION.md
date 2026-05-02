# OpsPulse Backend API Documentation

> **Smart Incident Response Platform** - Complete REST API + Real-time Socket.IO Events

## Table of Contents
1. [Authentication](#authentication)
2. [Error Handling](#error-handling)
3. [API Endpoints](#api-endpoints)
4. [Real-time Events](#real-time-events)
5. [Data Models](#data-models)

---

## Authentication

### JWT Authentication
Used for user dashboard/admin endpoints.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Token Details:**
- Expires: 7 days
- Stored in: HttpOnly cookie + Authorization header
- Blacklisted on logout via Redis

### API Key Authentication
Used for error intake endpoints from client systems.

**Headers:**
```
X-API-Key: ops_<40_hex_chars>
```

**Format:**
- Prefix: `ops_`
- Key ID: First 16 chars
- Hash: Remaining 24 chars (bcrypt verified)

---

## Error Handling

All endpoints return standardized JSON responses:

### Success Response
```json
{
  "success": true,
  "data": { /* response payload */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ /* validation errors */ ]
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request (validation failed)
- `401` - Unauthorized (auth failed)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

---

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST /register
Register new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "organizationId": "org_id_here"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "responder"
  }
}
```

---

#### POST /login
Authenticate user and get JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": { /* user object */ }
  }
}
```

---

### Error Intake Routes (`/api/errors`)

#### POST /intake
Report error from client system (API key required).

**Request:**
```json
{
  "service": "payment-service",
  "error": "Connection timeout to database",
  "statusCode": 500,
  "stackTrace": "at connectDB (db.js:42:15)",
  "metadata": {
    "userId": "user_123",
    "endpoint": "/api/checkout"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "errorId": "error_id",
    "fingerprint": "sha256_hash",
    "service": "payment-service",
    "aggregation": {
      "groupCount": 5,
      "shouldCreateIncident": true,
      "suggestedSeverity": "high"
    }
  }
}
```

**Query Parameters:**
- `service` (required) - Service name
- `error` (required) - Error message
- `statusCode` (optional) - HTTP status code
- `stackTrace` (optional) - Stack trace
- `metadata` (optional) - Additional context
- `timestamp` (optional) - When error occurred

---

#### GET /recent
Get recent errors (JWT required).

**Query Parameters:**
- `limit` (default: 50, max: 500)
- `skip` (default: 0)
- `service` (optional) - Filter by service
- `processed` (optional) - true/false

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [ /* error objects */ ],
  "total": 150,
  "limit": 50,
  "skip": 0
}
```

---

### Incident Routes (`/api/incidents`)

#### POST /
Create new incident (manual).

**Request:**
```json
{
  "title": "Database Connection Failure",
  "description": "Production DB server not responding",
  "service": "database-service",
  "severity": "critical",
  "tags": ["database", "infra", "critical"]
}
```

**Response:** `201 Created`

---

#### GET /
List incidents with filters.

**Query Parameters:**
- `limit` (default: 50)
- `skip` (default: 0)
- `status` - one of: open, investigating, identified, resolved, archived
- `severity` - one of: low, medium, high, critical
- `service` - Filter by service
- `tags` - Comma-separated tag list
- `startDate`, `endDate` - ISO date range

**Response:**
```json
{
  "success": true,
  "data": [ /* incidents */ ],
  "total": 42,
  "limit": 50
}
```

---

#### GET /:id
Get incident details.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "incident_id",
    "title": "Database Connection Failure",
    "status": "open",
    "severity": "critical",
    "tags": ["database", "infra"],
    "assignedTo": [ /* user objects */ ],
    "aiAnalysis": {
      "summary": "...",
      "tags": [ /* extracted tags */ ],
      "possibleCauses": [ /* AI suggestions */ ],
      "severity": "critical"
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

#### PUT /:id/status
Update incident status.

**Request:**
```json
{
  "status": "resolved"
}
```

**Valid Statuses:**
- `open` - Newly created
- `investigating` - Being actively worked
- `identified` - Root cause identified
- `resolved` - Fixed/closed
- `archived` - Historical record

---

#### POST /:id/assign
Assign incident to responders.

**Auto-Assign Mode:**
```json
{
  "autoAssign": true
}
```

Endpoint will score available responders and select best match.

**Manual Assignment:**
```json
{
  "autoAssign": false,
  "userIds": ["user_id_1", "user_id_2"]
}
```

**Scoring Formula:**
```
score = (skillMatch × 40) - (workload × 30) + (performance × 20) + (availability × 10)
```

---

### Health Routes (`/api/health`)

#### GET /
Get health for all services.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "health_id",
      "service": "payment-service",
      "status": "up",
      "metrics": {
        "uptime": 99.98,
        "responseTime": 145,
        "errorRate": 0.02,
        "cpu": 25,
        "memory": 512
      },
      "lastReportedAt": "2024-01-15T10:35:00Z"
    }
  ]
}
```

---

#### GET /:service
Get health for specific service.

---

#### POST /report
Report service health (internal endpoint).

**Request:**
```json
{
  "service": "payment-service",
  "status": "up",
  "metrics": {
    "uptime": 99.98,
    "responseTime": 145,
    "errorRate": 0.02,
    "cpu": 25,
    "memory": 512
  },
  "message": "All systems operational",
  "details": { /* optional */ }
}
```

---

### Dashboard Routes (`/api/dashboard`)

#### GET /stats
Get comprehensive dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "incidents": {
      "total": 156,
      "open": 12,
      "critical": 3,
      "resolvedLast7Days": 28,
      "avgResolutionTime": 142,
      "bySeverity": [
        { "_id": "critical", "count": 3 },
        { "_id": "high", "count": 8 }
      ],
      "byStatus": [
        { "_id": "open", "count": 12 }
      ]
    },
    "errors": {
      "total": 1247,
      "last24h": 89,
      "byService": [
        { "_id": "payment-service", "count": 345 },
        { "_id": "database", "count": 234 }
      ]
    },
    "topResponders": [
      {
        "_id": "user_id",
        "resolved": 28,
        "user": { "name": "John Doe", "email": "john@example.com" }
      }
    ],
    "timestamp": "2024-01-15T10:35:00Z"
  }
}
```

---

#### GET /trends
Get incident trend data for charts.

**Query Parameters:**
- `days` (default: 7, max: 90)

**Response:**
```json
{
  "success": true,
  "data": [
    { "_id": "2024-01-09", "count": 12 },
    { "_id": "2024-01-10", "count": 15 },
    { "_id": "2024-01-11", "count": 8 }
  ],
  "period": "7 days"
}
```

---

### Organization Routes (`/api/organizations`)

#### GET /:id
Get organization details.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "org_id",
    "name": "ACME Corp",
    "description": "E-commerce platform",
    "contactEmail": "admin@acme.com",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

#### PUT /:id
Update organization (admin only).

**Request:**
```json
{
  "name": "ACME Corp Updated",
  "description": "Global e-commerce platform",
  "contactEmail": "contact@acme.com"
}
```

---

### API Key Routes (`/api/keys`)

#### POST /
Create new API key.

**Request:**
```json
{
  "name": "Production Key",
  "description": "For production error intake"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "key_id",
    "key": "ops_abc123def456...",
    "name": "Production Key",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "⚠️ Store this key safely - it won't be shown again"
}
```

---

#### GET /
List all API keys (masked).

#### DELETE /:id
Revoke API key (soft delete).

---

## Real-time Events

### Socket.IO Connection

**Join organization room:**
```javascript
socket.emit('join_org', { organizationId: 'org_id' });
```

**Leave organization room:**
```javascript
socket.emit('leave_org', { organizationId: 'org_id' });
```

---

### Incident Events

#### incident:created
New incident created.
```javascript
socket.on('incident:created', (data) => {
  console.log(data.incident); // Full incident object
  console.log(data.timestamp);
});
```

#### incident:updated
Incident data changed.
```javascript
socket.on('incident:updated', (data) => {
  console.log(data.incident);
});
```

#### incident:status_changed
Incident status updated.
```javascript
socket.on('incident:status_changed', (data) => {
  console.log(data.incidentId, data.status);
});
```

#### incident:assigned
Incident assigned to responders.
```javascript
socket.on('incident:assigned', (data) => {
  console.log(data.incidentId, data.assignedTo);
});
```

---

### Error Events

#### error:aggregated
Error group aggregated.
```javascript
socket.on('error:aggregated', (data) => {
  console.log(data.groupCount, data.severity);
});
```

#### alert:threshold_reached
Error group reached incident threshold.
```javascript
socket.on('alert:threshold_reached', (data) => {
  console.log('Critical error spike detected!', data);
});
```

---

## Data Models

### Incident Schema
```javascript
{
  title: String,
  description: String,
  service: String,
  severity: "low" | "medium" | "high" | "critical",
  status: "open" | "investigating" | "identified" | "resolved" | "archived",
  tags: [String],
  organizationId: ObjectId,
  createdBy: ObjectId,
  assignedTo: [ObjectId],
  aiAnalysis: {
    summary: String,
    tags: [String],
    severity: String,
    possibleCauses: [String],
    confidence: Number,
    analyzedAt: Date
  },
  errorCount: Number,
  fingerprint: String,
  source: "api" | "manual" | "monitoring",
  createdAt: Date,
  resolvedAt: Date,
  resolutionTime: Number
}
```

### Error Schema
```javascript
{
  organizationId: ObjectId,
  service: String,
  error: String,
  statusCode: Number,
  stackTrace: String,
  metadata: Object,
  fingerprint: String,
  apiKeyId: ObjectId,
  incidentId: ObjectId,
  source: "api" | "manual" | "monitoring",
  processed: Boolean,
  errorTimestamp: Date,
  createdAt: Date (TTL: 30 days)
}
```

### User Schema
```javascript
{
  email: String,
  password: String (hashed),
  name: String,
  role: "admin" | "responder" | "viewer",
  organizationId: ObjectId,
  skills: [String],
  isAvailable: Boolean,
  activeIncidents: Number,
  performanceScore: Number,
  createdAt: Date
}
```

---

## Error Aggregation Engine

### Fingerprint Generation
```
fingerprint = SHA256(organizationId | service | error_message)
```

Deterministic grouping - identical errors always map to same fingerprint.

### Thresholds (Configurable)
```javascript
const AGGREGATION_THRESHOLDS = {
  LOW: 5,      // 5 errors → LOW incident
  MEDIUM: 10,  // 10 errors → MEDIUM incident
  HIGH: 20,    // 20 errors → HIGH incident
  CRITICAL: 50 // 50+ errors → CRITICAL incident
}
```

### Time Window
Default: 3600 seconds (1 hour)

Error groups automatically expire if no new errors in window.

---

## Assignment Algorithm

### Scoring Components
1. **Skill Match** (0-40 points)
   - Ratio of incident tags matching responder skills

2. **Workload** (-30 to 0 points)
   - Penalty: activeIncidents / maxCapacity

3. **Performance** (0-20 points)
   - Historical resolution score (0-1 scale)

4. **Availability** (0-10 points)
   - Boolean bonus if responder available

### Formula
```
score = max(0, (skillMatch × 40) - (workload × 30) + (performance × 20) + (availability × 10))
```

If all scores ≤ 0, selects responder with lowest active incidents.

---

## Rate Limiting (Recommended)

Configure in production:
- Error intake: 100 req/min per API key
- Dashboard queries: 60 req/min per user
- Incident operations: 30 req/min per user

---

## Example Client Usage

### Error Reporting (JavaScript)
```javascript
const API_KEY = 'ops_...';

async function reportError(error) {
  const response = await fetch('https://api.opspulse.com/api/errors/intake', {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      service: 'my-app',
      error: error.message,
      stackTrace: error.stack,
      statusCode: 500
    })
  });

  const data = await response.json();
  console.log('Error reported:', data.data.errorId);
}
```

### Real-time Dashboard (Socket.IO)
```javascript
import io from 'socket.io-client';

const socket = io('https://api.opspulse.com', {
  auth: { token: JWT_TOKEN }
});

socket.emit('join_org', { organizationId: ORG_ID });

socket.on('incident:created', (data) => {
  console.log('New incident!', data.incident);
  // Update dashboard UI
});

socket.on('incident:assigned', (data) => {
  console.log('Incident assigned:', data.incidentId);
});
```

---

**Last Updated:** January 2024  
**Version:** 1.0.0
