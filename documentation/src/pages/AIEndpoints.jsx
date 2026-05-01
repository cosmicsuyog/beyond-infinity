import CodeBlock from '../components/CodeBlock'
import Section from '../components/Section'

export default function AIEndpoints() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="mb-4">AI Endpoints</h1>
        <p className="text-lg text-slate-600">
          Leverage OpsPulse AI capabilities to analyze incidents and extract insights.
        </p>
      </div>

      <Section>
        <h2>Overview</h2>
        <p>
          OpsPulse includes powerful AI endpoints that automatically analyze incident data, generate summaries, extract tags, and suggest root causes. These endpoints are invoked automatically when you report incidents, but you can also call them directly for custom analysis.
        </p>
      </Section>

      <Section>
        <h2>Generate Summary</h2>
        <p className="mb-4">
          POST /api/ai/analyze/summary
        </p>
        <p>
          Generate a concise summary from raw error data using AI.
        </p>

        <h3>Request</h3>
        <CodeBlock
          code={`{
  "title": "Database Connection Timeout",
  "message": "Connection to database timed out after 30s",
  "stackTrace": "Error: connect ETIMEDOUT...",
  "metadata": {
    "environment": "production",
    "endpoint": "/api/users"
  }
}`}
          language="json"
          title="Request Body"
        />

        <h3>Response</h3>
        <CodeBlock
          code={`{
  "summary": "Database connection timeout occurring in production API endpoint during peak traffic, likely due to connection pool exhaustion or database server performance degradation.",
  "confidence": 0.92
}`}
          language="json"
          title="Response"
        />

        <h3>Example - cURL</h3>
        <CodeBlock
          code={`curl -X POST https://api.opspulse.dev/api/ai/analyze/summary \\
  -H "x-api-key: ops_live_xxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Database Connection Timeout",
    "message": "Connection to database timed out after 30s",
    "metadata": {
      "environment": "production"
    }
  }'`}
          language="bash"
          title="cURL"
        />
      </Section>

      <Section>
        <h2>Extract Tags</h2>
        <p className="mb-4">
          POST /api/ai/analyze/tags
        </p>
        <p>
          Automatically extract relevant tags from incident data for better categorization.
        </p>

        <h3>Request</h3>
        <CodeBlock
          code={`{
  "title": "Out of Memory Exception in Payment Service",
  "message": "Failed to allocate 2GB memory for array buffer",
  "stackTrace": "OutOfMemoryError: Java heap space at..."
}`}
          language="json"
          title="Request Body"
        />

        <h3>Response</h3>
        <CodeBlock
          code={`{
  "tags": [
    "memory-leak",
    "payment",
    "critical",
    "java",
    "performance"
  ],
  "confidence": 0.88
}`}
          language="json"
          title="Response"
        />

        <h3>Example - JavaScript</h3>
        <CodeBlock
          code={`const axios = require('axios');

const extractTags = async (incident) => {
  try {
    const response = await axios.post(
      'https://api.opspulse.dev/api/ai/analyze/tags',
      incident,
      {
        headers: {
          'x-api-key': 'ops_live_xxxxx',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Extracted tags:', response.data.tags);
    return response.data;
  } catch (error) {
    console.error('Error extracting tags:', error);
  }
};

// Usage
extractTags({
  title: 'Database Connection Timeout',
  message: 'Connection to database timed out after 30s'
});`}
          language="javascript"
          title="JavaScript"
        />
      </Section>

      <Section>
        <h2>Suggest Root Cause</h2>
        <p className="mb-4">
          POST /api/ai/analyze/root-cause
        </p>
        <p>
          Get AI-powered suggestions for the root cause of an incident.
        </p>

        <h3>Request</h3>
        <CodeBlock
          code={`{
  "title": "API Response Time Degradation",
  "message": "Average response time increased from 200ms to 5000ms",
  "stackTrace": "Timeout in database query at...",
  "metadata": {
    "environment": "production",
    "affectedEndpoints": ["/api/users", "/api/products"],
    "timeStarted": "2024-05-01T10:30:00Z",
    "metrics": {
      "cpuUsage": "92%",
      "memoryUsage": "88%",
      "diskUsage": "95%"
    }
  }
}`}
          language="json"
          title="Request Body"
        />

        <h3>Response</h3>
        <CodeBlock
          code={`{
  "rootCauses": [
    {
      "cause": "Disk space exhaustion limiting database write performance",
      "confidence": 0.94,
      "recommendations": [
        "Check disk usage and free up space",
        "Archive old logs and data",
        "Increase storage capacity"
      ]
    },
    {
      "cause": "Database connection pool exhaustion",
      "confidence": 0.87,
      "recommendations": [
        "Increase connection pool size",
        "Optimize long-running queries",
        "Implement connection timeout policies"
      ]
    },
    {
      "cause": "External service dependency timeout",
      "confidence": 0.72,
      "recommendations": [
        "Check third-party service status",
        "Implement circuit breaker pattern",
        "Add fallback mechanism"
      ]
    }
  ]
}`}
          language="json"
          title="Response"
        />

        <h3>Example - Python</h3>
        <CodeBlock
          code={`import requests
import json

api_key = 'ops_live_xxxxx'
url = 'https://api.opspulse.dev/api/ai/analyze/root-cause'

incident = {
    'title': 'API Response Time Degradation',
    'message': 'Average response time increased from 200ms to 5000ms',
    'metadata': {
        'environment': 'production',
        'cpuUsage': '92%',
        'memoryUsage': '88%',
        'diskUsage': '95%'
    }
}

headers = {
    'x-api-key': api_key,
    'Content-Type': 'application/json'
}

response = requests.post(url, json=incident, headers=headers)
data = response.json()

print('Root Cause Analysis:')
for cause in data['rootCauses']:
    print(f"- {cause['cause']} (Confidence: {cause['confidence']*100}%)")
    for rec in cause['recommendations']:
        print(f"  • {rec}")`}
          language="python"
          title="Python"
        />
      </Section>

      <Section>
        <h2>Best Practices</h2>
        <div className="space-y-4 mt-6">
          <div className="border-l-4 border-green-600 pl-4 py-2">
            <p className="font-semibold text-slate-900">Provide Context</p>
            <p className="text-slate-600">Include metadata, environment info, and metrics for better analysis.</p>
          </div>
          <div className="border-l-4 border-green-600 pl-4 py-2">
            <p className="font-semibold text-slate-900">Use Stack Traces</p>
            <p className="text-slate-600">Full stack traces help AI identify patterns and correlations.</p>
          </div>
          <div className="border-l-4 border-green-600 pl-4 py-2">
            <p className="font-semibold text-slate-900">Include Timestamps</p>
            <p className="text-slate-600">Precise timing information enables correlation analysis.</p>
          </div>
          <div className="border-l-4 border-green-600 pl-4 py-2">
            <p className="font-semibold text-slate-900">Review Suggestions</p>
            <p className="text-slate-600">AI suggestions are meant to guide investigation, not replace human judgment.</p>
          </div>
        </div>
      </Section>

      <Section>
        <h2>Rate Limiting for AI</h2>
        <p>
          AI endpoints have additional rate limiting to manage computational resources:
        </p>
        <div className="mt-4 space-y-3">
          <div className="bg-slate-100 rounded-lg p-4">
            <p className="font-semibold text-slate-900">Summary Analysis</p>
            <p className="text-slate-600">10 requests per minute</p>
          </div>
          <div className="bg-slate-100 rounded-lg p-4">
            <p className="font-semibold text-slate-900">Tag Extraction</p>
            <p className="text-slate-600">50 requests per minute</p>
          </div>
          <div className="bg-slate-100 rounded-lg p-4">
            <p className="font-semibold text-slate-900">Root Cause Analysis</p>
            <p className="text-slate-600">5 requests per minute</p>
          </div>
        </div>
      </Section>
    </div>
  )
}
