import CodeBlock from '../components/CodeBlock'
import Section from '../components/Section'

export default function ErrorHandling() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="mb-4">Error Handling</h1>
        <p className="text-lg text-slate-600">
          Understand OpsPulse API error codes and how to handle them gracefully.
        </p>
      </div>

      <Section>
        <h2>Error Response Format</h2>
        <p className="mb-4">
          All error responses follow a consistent format:
        </p>
        <CodeBlock
          code={`{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "The provided API key is invalid or expired",
    "status": 401,
    "timestamp": "2024-05-01T10:30:00Z",
    "requestId": "req_abc123xyz789"
  }
}`}
          language="json"
          title="Error Response Format"
        />
      </Section>

      <Section>
        <h2>HTTP Status Codes</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-600 pl-4 py-2">
            <p className="font-semibold text-slate-900">200 - OK</p>
            <p className="text-slate-600">Request succeeded</p>
          </div>
          <div className="border-l-4 border-blue-600 pl-4 py-2">
            <p className="font-semibold text-slate-900">201 - Created</p>
            <p className="text-slate-600">Resource created successfully</p>
          </div>
          <div className="border-l-4 border-yellow-600 pl-4 py-2">
            <p className="font-semibold text-slate-900">400 - Bad Request</p>
            <p className="text-slate-600">Invalid request parameters or malformed JSON</p>
          </div>
          <div className="border-l-4 border-red-600 pl-4 py-2">
            <p className="font-semibold text-slate-900">401 - Unauthorized</p>
            <p className="text-slate-600">Missing or invalid API key</p>
          </div>
          <div className="border-l-4 border-red-600 pl-4 py-2">
            <p className="font-semibold text-slate-900">403 - Forbidden</p>
            <p className="text-slate-600">API key doesn't have permission</p>
          </div>
          <div className="border-l-4 border-red-600 pl-4 py-2">
            <p className="font-semibold text-slate-900">404 - Not Found</p>
            <p className="text-slate-600">Resource not found</p>
          </div>
          <div className="border-l-4 border-red-600 pl-4 py-2">
            <p className="font-semibold text-slate-900">429 - Too Many Requests</p>
            <p className="text-slate-600">Rate limit exceeded</p>
          </div>
          <div className="border-l-4 border-red-600 pl-4 py-2">
            <p className="font-semibold text-slate-900">500 - Internal Server Error</p>
            <p className="text-slate-600">Server-side error</p>
          </div>
        </div>
      </Section>

      <Section>
        <h2>Common Error Codes</h2>

        <h3>Authentication Errors</h3>
        <div className="space-y-3">
          <div className="card">
            <p className="font-mono font-semibold text-red-600">INVALID_API_KEY</p>
            <p className="text-slate-600 mt-1">The API key is invalid or doesn't exist.</p>
            <p className="text-sm text-slate-500 mt-2"><strong>Status:</strong> 401</p>
            <p className="text-sm text-slate-500"><strong>Solution:</strong> Generate a new API key from the dashboard.</p>
          </div>

          <div className="card">
            <p className="font-mono font-semibold text-red-600">EXPIRED_API_KEY</p>
            <p className="text-slate-600 mt-1">The API key has expired.</p>
            <p className="text-sm text-slate-500 mt-2"><strong>Status:</strong> 401</p>
            <p className="text-sm text-slate-500"><strong>Solution:</strong> Regenerate the API key from the dashboard.</p>
          </div>

          <div className="card">
            <p className="font-mono font-semibold text-red-600">MISSING_API_KEY</p>
            <p className="text-slate-600 mt-1">The x-api-key header is missing.</p>
            <p className="text-sm text-slate-500 mt-2"><strong>Status:</strong> 401</p>
            <p className="text-sm text-slate-500"><strong>Solution:</strong> Include the x-api-key header in all requests.</p>
          </div>

          <div className="card">
            <p className="font-mono font-semibold text-red-600">PERMISSION_DENIED</p>
            <p className="text-slate-600 mt-1">The API key doesn't have permission for this action.</p>
            <p className="text-sm text-slate-500 mt-2"><strong>Status:</strong> 403</p>
            <p className="text-sm text-slate-500"><strong>Solution:</strong> Check API key permissions in the dashboard.</p>
          </div>
        </div>

        <h3>Validation Errors</h3>
        <div className="space-y-3 mt-6">
          <div className="card">
            <p className="font-mono font-semibold text-red-600">INVALID_REQUEST</p>
            <p className="text-slate-600 mt-1">The request body is malformed or missing required fields.</p>
            <p className="text-sm text-slate-500 mt-2"><strong>Status:</strong> 400</p>
            <p className="text-sm text-slate-500"><strong>Solution:</strong> Check the request format and ensure all required fields are present.</p>
          </div>

          <div className="card">
            <p className="font-mono font-semibold text-red-600">INVALID_JSON</p>
            <p className="text-slate-600 mt-1">The request body contains invalid JSON.</p>
            <p className="text-sm text-slate-500 mt-2"><strong>Status:</strong> 400</p>
            <p className="text-sm text-slate-500"><strong>Solution:</strong> Validate your JSON using a JSON validator.</p>
          </div>

          <div className="card">
            <p className="font-mono font-semibold text-red-600">INVALID_PARAMETER</p>
            <p className="text-slate-600 mt-1">One or more query parameters are invalid.</p>
            <p className="text-sm text-slate-500 mt-2"><strong>Status:</strong> 400</p>
            <p className="text-sm text-slate-500"><strong>Solution:</strong> Review the API documentation for valid parameter values.</p>
          </div>
        </div>

        <h3>Rate Limiting</h3>
        <div className="space-y-3 mt-6">
          <div className="card">
            <p className="font-mono font-semibold text-red-600">RATE_LIMIT_EXCEEDED</p>
            <p className="text-slate-600 mt-1">Too many requests. Rate limit has been exceeded.</p>
            <p className="text-sm text-slate-500 mt-2"><strong>Status:</strong> 429</p>
            <p className="text-sm text-slate-500"><strong>Solution:</strong> Wait before making additional requests. Check the Retry-After header.</p>
          </div>
        </div>

        <h3>Server Errors</h3>
        <div className="space-y-3 mt-6">
          <div className="card">
            <p className="font-mono font-semibold text-red-600">INTERNAL_ERROR</p>
            <p className="text-slate-600 mt-1">An unexpected server error occurred.</p>
            <p className="text-sm text-slate-500 mt-2"><strong>Status:</strong> 500</p>
            <p className="text-sm text-slate-500"><strong>Solution:</strong> Retry the request. If the issue persists, contact support.</p>
          </div>

          <div className="card">
            <p className="font-mono font-semibold text-red-600">SERVICE_UNAVAILABLE</p>
            <p className="text-slate-600 mt-1">The service is temporarily unavailable.</p>
            <p className="text-sm text-slate-500 mt-2"><strong>Status:</strong> 503</p>
            <p className="text-sm text-slate-500"><strong>Solution:</strong> Wait and retry. Check the status page for updates.</p>
          </div>
        </div>

        <h3>Resource Errors</h3>
        <div className="space-y-3 mt-6">
          <div className="card">
            <p className="font-mono font-semibold text-red-600">RESOURCE_NOT_FOUND</p>
            <p className="text-slate-600 mt-1">The requested resource doesn't exist.</p>
            <p className="text-sm text-slate-500 mt-2"><strong>Status:</strong> 404</p>
            <p className="text-sm text-slate-500"><strong>Solution:</strong> Check the resource ID and try again.</p>
          </div>
        </div>
      </Section>

      <Section>
        <h2>Error Handling Best Practices</h2>

        <h3>JavaScript (Fetch)</h3>
        <CodeBlock
          code={`async function callAPI(endpoint, options = {}) {
  try {
    const response = await fetch(
      \`https://api.opspulse.dev/api\${endpoint}\`,
      {
        ...options,
        headers: {
          'x-api-key': 'ops_live_xxxxx',
          'Content-Type': 'application/json',
          ...options.headers
        }
      }
    );

    // Handle error status codes
    if (!response.ok) {
      const error = await response.json();
      
      // Handle specific error codes
      if (response.status === 401) {
        console.error('Invalid API key');
        // Refresh API key or redirect to login
      } else if (response.status === 429) {
        console.error('Rate limited. Retrying in 60 seconds...');
        setTimeout(() => callAPI(endpoint, options), 60000);
      } else if (response.status >= 500) {
        console.error('Server error. Retrying...');
        setTimeout(() => callAPI(endpoint, options), 5000);
      }
      
      throw new Error(error.error.message);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
}

// Usage
try {
  const incidents = await callAPI('/incidents');
  console.log(incidents);
} catch (error) {
  // Handle error
}`}
          language="javascript"
          title="Error Handling Pattern"
        />

        <h3>Python</h3>
        <CodeBlock
          code={`import requests
import time
from requests.exceptions import RequestException

def call_api(endpoint, method='GET', data=None, max_retries=3):
    api_key = 'ops_live_xxxxx'
    url = f'https://api.opspulse.dev/api{endpoint}'
    headers = {
        'x-api-key': api_key,
        'Content-Type': 'application/json'
    }
    
    for attempt in range(max_retries):
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            
            # Check for errors
            if response.status_code == 401:
                print('Invalid API key')
                break
            elif response.status_code == 429:
                # Rate limited
                wait_time = int(response.headers.get('Retry-After', 60))
                print(f'Rate limited. Waiting {wait_time} seconds...')
                time.sleep(wait_time)
                continue
            elif response.status_code >= 500:
                # Server error - retry
                if attempt < max_retries - 1:
                    wait_time = 5 * (attempt + 1)
                    print(f'Server error. Retrying in {wait_time} seconds...')
                    time.sleep(wait_time)
                    continue
            
            response.raise_for_status()
            return response.json()
            
        except RequestException as e:
            print(f'Request failed: {e}')
            if attempt < max_retries - 1:
                time.sleep(5)
                continue
            raise
    
    return None

# Usage
try:
    incidents = call_api('/incidents')
    print(incidents)
except Exception as e:
    print(f'Error: {e}')`}
          language="python"
          title="Python Error Handling"
        />
      </Section>

      <Section>
        <h2>Retry Strategy</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="font-semibold text-blue-900">Recommended Retry Logic:</p>
          <ul className="list-disc list-inside text-blue-800 space-y-2 mt-3">
            <li>Retry on 429 (rate limit) and 5xx errors</li>
            <li>Use exponential backoff: wait 1s, 2s, 4s, etc.</li>
            <li>Maximum 3-5 retry attempts</li>
            <li>Check the <code>Retry-After</code> header for rate limits</li>
            <li>Don't retry on 4xx errors (except 429)</li>
          </ul>
        </div>
      </Section>
    </div>
  )
}
