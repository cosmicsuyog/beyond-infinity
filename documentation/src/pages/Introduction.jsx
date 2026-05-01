import CodeBlock from '../components/CodeBlock'
import Section from '../components/Section'

export default function Introduction() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="mb-4">OpsPulse API Documentation</h1>
        <p className="text-lg text-slate-600">
          Welcome to OpsPulse - the smart incident response platform that automates error detection, analysis, and resolution.
        </p>
      </div>

      <Section>
        <h2>What is OpsPulse?</h2>
        <p>
          OpsPulse is an intelligent incident management platform designed for development teams. It automatically detects errors, groups related incidents, generates summaries, and suggests root causes using advanced AI.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <p className="text-blue-900 font-semibold">💡 Key Features:</p>
          <ul className="list-disc list-inside text-blue-800 space-y-2 mt-2">
            <li>Real-time error detection and aggregation</li>
            <li>AI-powered incident analysis and summarization</li>
            <li>Automatic root cause suggestions</li>
            <li>Smart tagging and classification</li>
            <li>Multi-team collaboration</li>
            <li>REST API for seamless integration</li>
          </ul>
        </div>
      </Section>

      <Section>
        <h2>Why Use OpsPulse?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-2">⚡ Faster Response</h3>
            <p className="text-slate-600">
              Automatically group related errors and get instant alerts so your team can respond faster.
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-2">🤖 AI-Powered</h3>
            <p className="text-slate-600">
              Leverage machine learning to get intelligent analysis and actionable insights.
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-2">🔌 Easy Integration</h3>
            <p className="text-slate-600">
              Simple REST API that works with any application or framework.
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-2">📊 Smart Dashboards</h3>
            <p className="text-slate-600">
              Get real-time insights with beautiful, intuitive dashboards.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <h2>Quick Start</h2>
        <p className="text-slate-600 mb-6">
          Here's a basic flow to get started:
        </p>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                1
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Get Your API Key</h3>
              <p className="text-slate-600">
                Generate an API key from your OpsPulse dashboard to authenticate requests.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                2
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Report Incidents</h3>
              <p className="text-slate-600">
                Send error data to OpsPulse using our REST API or SDKs.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                3
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Get AI Insights</h3>
              <p className="text-slate-600">
                OpsPulse analyzes incidents and provides summaries, tags, and root cause suggestions.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                4
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Collaborate & Resolve</h3>
              <p className="text-slate-600">
                Your team can view, comment, and resolve incidents through the dashboard.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <h2>API Basics</h2>
        <p className="text-slate-600 mb-4">
          All API requests must include your API key in the header:
        </p>
        <CodeBlock
          code={`Authorization: Bearer ops_live_xxxxx
Content-Type: application/json`}
          language="bash"
          title="Required Headers"
        />
        <p className="text-slate-600 mb-4">
          The base URL for all requests is:
        </p>
        <CodeBlock
          code={`https://api.opspulse.dev/api`}
          language="bash"
          title="Base URL"
        />
      </Section>

      <Section>
        <h2>Next Steps</h2>
        <p className="text-slate-600">
          Ready to get started? Check out the <a href="/authentication" className="text-blue-600 hover:text-blue-700 font-semibold">Authentication</a> guide to learn how to set up your API key, then explore our <a href="/api/create-incident" className="text-blue-600 hover:text-blue-700 font-semibold">API Reference</a> for detailed endpoint documentation.
        </p>
      </Section>
    </div>
  )
}
