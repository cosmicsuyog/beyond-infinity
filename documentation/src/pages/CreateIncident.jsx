import CodeBlock from '../components/CodeBlock'
import Section from '../components/Section'

export default function CreateIncident() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="mb-2">Create Incident</h1>
        <p className="text-slate-600">POST /api/incidents</p>
        <p className="text-lg text-slate-600 mt-4">
          Report a new incident or error to OpsPulse for analysis and tracking.
        </p>
      </div>

      <Section>
        <h2>Description</h2>
        <p>
          Use this endpoint to send error or incident data to OpsPulse. The system will automatically aggregate related incidents, extract tags, generate summaries, and suggest root causes.
        </p>
      </Section>

      <Section>
        <h2>Request Body</h2>
        <CodeBlock
          code={`{
  "title": "Database Connection Timeout",
  "message": "Connection to database timed out after 30s",
  "stackTrace": "Error: connect ETIMEDOUT at Connection.connect...",
  "severity": "high",
  "timestamp": "2024-05-01T10:30:00Z",
  "userId": "user_123",
  "metadata": {
    "environment": "production",
    "version": "1.2.3",
    "endpoint": "/api/users",
    "method": "GET"
  }
}`}
          language="json"
          title="Request Body"
        />

        <h3 className="mt-6">Request Fields</h3>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Field</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Required</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-blue-600">title</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">Yes</td>
                <td className="py-3 px-4">Short description of the incident</td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-blue-600">message</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">Yes</td>
                <td className="py-3 px-4">Detailed error message</td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-blue-600">stackTrace</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 px-4">Full stack trace</td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-blue-600">severity</td>
                <td className="py-3 px-4">enum</td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 px-4">low, medium, high, critical</td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-blue-600">timestamp</td>
                <td className="py-3 px-4">ISO 8601</td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 px-4">When the error occurred</td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-blue-600">userId</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 px-4">Affected user ID</td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-blue-600">metadata</td>
                <td className="py-3 px-4">object</td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 px-4">Additional context data</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <h2>Response</h2>
        <CodeBlock
          code={`{
  "id": "incident_abc123",
  "title": "Database Connection Timeout",
  "message": "Connection to database timed out after 30s",
  "status": "open",
  "severity": "high",
  "createdAt": "2024-05-01T10:30:00Z",
  "tags": ["database", "timeout", "critical"],
  "summary": "Database connection issue occurring in production environment",
  "rootCauseSuggestions": [
    "Database server might be overloaded",
    "Network connectivity issues",
    "Connection pool exhausted"
  ]
}`}
          language="json"
          title="Successful Response (201)"
        />
      </Section>

      <Section>
        <h2>Code Examples</h2>

        <h3>cURL</h3>
        <CodeBlock
          code={`curl -X POST https://api.opspulse.dev/api/incidents \\
  -H "x-api-key: ops_live_xxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Database Connection Timeout",
    "message": "Connection to database timed out after 30s",
    "severity": "high",
    "timestamp": "2024-05-01T10:30:00Z",
    "metadata": {
      "environment": "production",
      "version": "1.2.3"
    }
  }'`}
          language="bash"
          title="cURL"
        />

        <h3>JavaScript (Fetch)</h3>
        <CodeBlock
          code={`const createIncident = async () => {
  const response = await fetch(
    'https://api.opspulse.dev/api/incidents',
    {
      method: 'POST',
      headers: {
        'x-api-key': 'ops_live_xxxxx',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Database Connection Timeout',
        message: 'Connection to database timed out after 30s',
        severity: 'high',
        timestamp: new Date().toISOString(),
        metadata: {
          environment: 'production',
          version: '1.2.3'
        }
      })
    }
  );

  const data = await response.json();
  console.log(data);
};

createIncident();`}
          language="javascript"
          title="JavaScript Fetch"
        />

        <h3>JavaScript (Axios)</h3>
        <CodeBlock
          code={`const axios = require('axios');

const createIncident = async () => {
  try {
    const response = await axios.post(
      'https://api.opspulse.dev/api/incidents',
      {
        title: 'Database Connection Timeout',
        message: 'Connection to database timed out after 30s',
        severity: 'high',
        timestamp: new Date().toISOString(),
        metadata: {
          environment: 'production',
          version: '1.2.3'
        }
      },
      {
        headers: {
          'x-api-key': 'ops_live_xxxxx',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

createIncident();`}
          language="javascript"
          title="JavaScript Axios"
        />

        <h3>Python</h3>
        <CodeBlock
          code={`import requests
from datetime import datetime

api_key = 'ops_live_xxxxx'
url = 'https://api.opspulse.dev/api/incidents'

payload = {
    'title': 'Database Connection Timeout',
    'message': 'Connection to database timed out after 30s',
    'severity': 'high',
    'timestamp': datetime.now().isoformat() + 'Z',
    'metadata': {
        'environment': 'production',
        'version': '1.2.3'
    }
}

headers = {
    'x-api-key': api_key,
    'Content-Type': 'application/json'
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`}
          language="python"
          title="Python"
        />
      </Section>

      <Section>
        <h2>Error Responses</h2>
        <p className="mb-4">See the <a href="/errors" className="text-blue-600 hover:text-blue-700 font-semibold">Error Handling</a> page for common error codes.</p>
      </Section>
    </div>
  )
}
