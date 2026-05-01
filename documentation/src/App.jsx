import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DocsLayout from './layout/DocsLayout'
import Introduction from './pages/Introduction'
import Authentication from './pages/Authentication'
import CreateIncident from './pages/CreateIncident'
import GetIncidents from './pages/GetIncidents'
import AIEndpoints from './pages/AIEndpoints'
import ErrorHandling from './pages/ErrorHandling'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DocsLayout><Introduction /></DocsLayout>} />
        <Route path="/authentication" element={<DocsLayout><Authentication /></DocsLayout>} />
        <Route path="/api/create-incident" element={<DocsLayout><CreateIncident /></DocsLayout>} />
        <Route path="/api/get-incidents" element={<DocsLayout><GetIncidents /></DocsLayout>} />
        <Route path="/api/ai-endpoints" element={<DocsLayout><AIEndpoints /></DocsLayout>} />
        <Route path="/errors" element={<DocsLayout><ErrorHandling /></DocsLayout>} />
        </Routes>
      </Router>
  )
}

export default App
