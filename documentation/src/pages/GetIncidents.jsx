import CodeBlock from '../components/CodeBlock'
import Section from '../components/Section'

export default function GetIncidents() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="mb-2">Get Incidents</h1>
        <p className="text-slate-600">GET /api/incidents</p>
        <p className="text-lg text-slate-600 mt-4">
          Retrieve a list of incidents with filtering and pagination options.
        </p>
      </div>

      <Section>
        <h2>Description</h2>
        <p>
          Fetch incidents from your OpsPulse account. You can filter by status, severity, date range, and more. Results are paginated for performance.
        </p>
      </Section>

      <Section>
        <h2>Query Parameters</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Parameter</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Default</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-blue-600">status</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">all</td>
                <td className="py-3 px-4">Filter by status: open, resolved, ignored</td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-blue-600">severity</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">all</td>
                <td className="py-3 px-4">Filter by severity: low, medium, high, critical</td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-blue-600">page</td>
                <td className="py-3 px-4">integer</td>
                <td className="py-3 px-4">1</td>
                <td className="py-3 px-4">Page number for pagination</td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-blue-600">limit</td>
                <td className="py-3 px-4">integer</td>
                <td className="py-3 px-4">20</td>
                <td className="py-3 px-4">Number of items per page (max 100)</td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-blue-600">startDate</td>
                <td className="py-3 px-4">ISO 8601</td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">Filter incidents after this date</td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-blue-600">endDate</td>
                <td className="py-3 px-4">ISO 8601</td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">Filter incidents before this date</td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-blue-600">tag</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">Filter by specific tag</td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-blue-600">search</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">Search in title and message</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <h2>Response</h2>
        <CodeBlock
          code={`{
  "data": [
    {
      "id": "incident_abc123",
      "title": "Database Connection Timeout",
      "message": "Connection to database timed out after 30s",
      "status": "open",
      "severity": "high",
      "tags": ["database", "timeout", "critical"],
      "summary": "Database connection issue occurring in production",
      "rootCauseSuggestions": [
        "Database server might be overloaded",
        "Network connectivity issues"
      ],
      "occurrenceCount": 45,
      "affectedUsers": 12,
      "createdAt": "2024-05-01T10:30:00Z",
      "updatedAt": "2024-05-01T14:20:00Z"
    },
    {
      "id": "incident_xyz789",
      "title": "API Rate Limit Exceeded",
      "message": "Too many requests from user_456",
      "status": "resolved",
      "severity": "medium",
      "tags": ["api", "rate-limit"],
      "summary": "API rate limiting triggered during peak traffic",
      "rootCauseSuggestions": [
        "Increase rate limit quota",
        "Implement client-side caching"
      ],
      "occurrenceCount": 23,
      "affectedUsers": 5,
      "createdAt": "2024-04-30T15:45:00Z",
      "updatedAt": "2024-05-01T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8
  }
}`}
          language="json"
          title="Successful Response (200)"
        />
      </Section>

      <Section>
        <h2>Code Examples</h2>

        <h3>cURL - Get All Incidents</h3>
        <CodeBlock
          code={`curl -X GET "https://api.opspulse.dev/api/incidents" \\
  -H "x-api-key: ops_live_xxxxx" \\
  -H "Content-Type: application/json"`}
          language="bash"
          title="cURL"
        />

        <h3>cURL - With Filters</h3>
        <CodeBlock
          code={`curl -X GET "https://api.opspulse.dev/api/incidents?status=open&severity=high&limit=50" \\
  -H "x-api-key: ops_live_xxxxx" \\
  -H "Content-Type: application/json"`}
          language="bash"
          title="cURL with Filters"
        />

        <h3>JavaScript (Fetch)</h3>
        <CodeBlock
          code={`const getIncidents = async (filters = {}) => {
  const queryString = new URLSearchParams(filters).toString();
  const url = \`https://api.opspulse.dev/api/incidents?\${queryString}\`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': 'ops_live_xxxxx',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Get high severity incidents from last 7 days
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

getIncidents({
  severity: 'high',
  startDate: sevenDaysAgo.toISOString(),
  limit: 50
});`}
          language="javascript"
          title="JavaScript Fetch"
        />

        <h3>JavaScript (Axios)</h3>
        <CodeBlock
          code={`const axios = require('axios');

const getIncidents = async (filters = {}) => {
  try {
    const response = await axios.get(
      'https://api.opspulse.dev/api/incidents',
      {
        headers: {
          'x-api-key': 'ops_live_xxxxx',
          'Content-Type': 'application/json'
        },
        params: filters
      }
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// Example: Get open incidents
getIncidents({
  status: 'open',
  severity: 'critical',
  limit: 100
});`}
          language="javascript"
          title="JavaScript Axios"
        />

        <h3>Python</h3>
        <CodeBlock
          code={`import requests
from datetime import datetime, timedelta

api_key = 'ops_live_xxxxx'
url = 'https://api.opspulse.dev/api/incidents'

# Prepare filters
seven_days_ago = (datetime.now() - timedelta(days=7)).isoformat() + 'Z'

params = {
    'status': 'open',
    'severity': 'high',
    'startDate': seven_days_ago,
    'limit': 50
}

headers = {
    'x-api-key': api_key,
    'Content-Type': 'application/json'
}

response = requests.get(url, params=params, headers=headers)
data = response.json()
print(data)`}
          language="python"
          title="Python"
        />
      </Section>

      <Section>
        <h2>Pagination</h2>
        <p>
          Results are paginated using <code>page</code> and <code>limit</code> parameters. The response includes pagination metadata:
        </p>
        <div className="bg-slate-100 rounded-lg p-4 mt-4 space-y-2">
          <p><span className="font-semibold">page:</span> Current page number</p>
          <p><span className="font-semibold">limit:</span> Items per page</p>
          <p><span className="font-semibold">total:</span> Total number of incidents</p>
          <p><span className="font-semibold">pages:</span> Total number of pages</p>
        </div>
      </Section>
    </div>
  )
}
