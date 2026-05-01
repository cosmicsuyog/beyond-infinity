import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-soft">
      <div className="docs-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:bg-blue-700 transition-colors">
              OP
            </div>
            <span className="text-xl font-bold text-slate-900">OpsPulse</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="nav-link text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            >
              Docs
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            >
              GitHub
            </a>
            <a
              href="#api"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              API
            </a>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg">
              ☰
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
