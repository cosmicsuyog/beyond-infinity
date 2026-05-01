import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function DocsLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <div className="docs-container py-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
