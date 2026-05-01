import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { name: 'Introduction', path: '/' },
  { name: 'Authentication', path: '/authentication' },
  {
    name: 'API Reference',
    children: [
      { name: 'Create Incident', path: '/api/create-incident' },
      { name: 'Get Incidents', path: '/api/get-incidents' },
      { name: 'AI Endpoints', path: '/api/ai-endpoints' },
    ]
  },
  { name: 'Error Handling', path: '/errors' },
]

export default function Sidebar() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <aside className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto w-64 bg-white border-r border-slate-200 p-4 hidden lg:block">
      <nav className="space-y-1">
        {navItems.map((item, idx) => (
          <div key={idx}>
            {item.path ? (
              <Link
                to={item.path}
                className={`sidebar-link ${
                  isActive(item.path) ? 'sidebar-link-active' : ''
                }`}
              >
                {item.name}
              </Link>
            ) : (
              <>
                <div className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-4 mb-2">
                  {item.name}
                </div>
                <div className="space-y-1 ml-2">
                  {item.children?.map((child, childIdx) => (
                    <Link
                      key={childIdx}
                      to={child.path}
                      className={`sidebar-link text-sm ${
                        isActive(child.path) ? 'sidebar-link-active' : ''
                      }`}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </nav>

      {/* Quick Links */}
      <div className="mt-8 pt-8 border-t border-slate-200">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Resources
        </div>
        <div className="space-y-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-link text-sm"
          >
            → GitHub Repository
          </a>
          <a
            href="#support"
            className="sidebar-link text-sm"
          >
            → Support
          </a>
        </div>
      </div>
    </aside>
  )
}
