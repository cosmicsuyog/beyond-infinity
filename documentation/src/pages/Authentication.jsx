import CodeBlock from '../components/CodeBlock'
import Section from '../components/Section'

export default function Authentication() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="mb-4">Authentication</h1>
        <p className="text-lg text-slate-600">
          Learn how to authenticate requests to the OpsPulse API using API keys.
        </p>
      </div>

      <Section>
        <h2>API Keys</h2>
        <p>
          All requests to the OpsPulse API must be authenticated using an API key. You can generate API keys from your dashboard.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
          <p className="text-amber-900 font-semibold">⚠️ Important</p>
          <p className="text-amber-800 mt-2">
            Keep your API keys confidential. If a key is compromised, regenerate it immediately from the dashboard.
          </p>
        </div>
      </Section>

      <Section>
        <h2>How to Authenticate</h2>
        <p className="mb-4">
          Include your API key in the <code>x-api-key</code> header for every request:
        </p>
        <CodeBlock
          code={`curl -X GET https://api.opspulse.dev/api/incidents \\
  -H "x-api-key: ops_live_xxxxx" \\
  -H "Content-Type: application/json"`}
          language="bash"
          title="cURL Example"
        />
      </Section>

      <Section>
        <h2>SDK Examples</h2>

        <h3>Node.js (Axios)</h3>
        <CodeBlock
          code={`const axios = require('axios');

const client = axios.create({
  baseURL: 'https://api.opspulse.dev/api',
  headers: {
    'x-api-key': 'ops_live_xxxxx',
    'Content-Type': 'application/json'
  }
});

// Make a request
client.get('/incidents')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));`}
          language="javascript"
          title="Node.js with Axios"
        />

        <h3>Node.js (Fetch)</h3>
        <CodeBlock
          code={`const apiKey = 'ops_live_xxxxx';

fetch('https://api.opspulse.dev/api/incidents', {
  method: 'GET',
  headers: {
    'x-api-key': apiKey,
    'Content-Type': 'application/json'
  }
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`}
          language="javascript"
          title="Node.js with Fetch"
        />

        <h3>Python</h3>
        <CodeBlock
          code={`import requests

api_key = 'ops_live_xxxxx'
headers = {
    'x-api-key': api_key,
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.opspulse.dev/api/incidents',
    headers=headers
)

print(response.json())`}
          language="python"
          title="Python with Requests"
        />

        <h3>JavaScript (Fetch)</h3>
        <CodeBlock
          code={`const apiKey = 'ops_live_xxxxx';

fetch('https://api.opspulse.dev/api/incidents', {
  method: 'GET',
  headers: {
    'x-api-key': apiKey,
    'Content-Type': 'application/json'
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`}
          language="javascript"
          title="JavaScript Fetch"
        />
      </Section>

      <Section>
        <h2>Rate Limiting</h2>
        <p>
          The OpsPulse API implements rate limiting to ensure fair usage across all users:
        </p>
        <div className="mt-4 space-y-3">
          <div className="border-l-4 border-blue-600 pl-4 py-2">
            <p className="font-semibold text-slate-900">Standard Plan</p>
            <p className="text-slate-600">1,000 requests per minute</p>
          </div>
          <div className="border-l-4 border-green-600 pl-4 py-2">
            <p className="font-semibold text-slate-900">Professional Plan</p>
            <p className="text-slate-600">5,000 requests per minute</p>
          </div>
          <div className="border-l-4 border-purple-600 pl-4 py-2">
            <p className="font-semibold text-slate-900">Enterprise Plan</p>
            <p className="text-slate-600">Custom rate limits</p>
          </div>
        </div>
      </Section>

      <Section>
        <h2>Headers</h2>
        <p className="mb-4">
          All API requests must include the following headers:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Header</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Value</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Required</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-blue-600">x-api-key</td>
                <td className="py-3 px-4">Your API key</td>
                <td className="py-3 px-4">Yes</td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-blue-600">Content-Type</td>
                <td className="py-3 px-4">application/json</td>
                <td className="py-3 px-4">Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <h2>Generating API Keys</h2>
        <ol className="space-y-3 list-decimal list-inside text-slate-700">
          <li>Log in to your OpsPulse dashboard</li>
          <li>Navigate to Settings → API Keys</li>
          <li>Click "Create New Key"</li>
          <li>Give it a name (e.g., "Production API")</li>
          <li>Copy and store the key securely</li>
        </ol>
      </Section>
    </div>
  )
}
