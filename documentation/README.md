# OpsPulse API Documentation

A professional, minimal, and developer-friendly API documentation website built with React and Tailwind CSS. Designed with inspiration from modern SaaS docs like Stripe and Firebase.

## Features

✨ **Clean, Minimal Design** - Focus on content with minimal distractions  
🎨 **Beautiful UI** - Professional styling with Tailwind CSS  
📱 **Fully Responsive** - Works seamlessly on all devices  
🔗 **Smart Navigation** - Sticky sidebar with active section highlighting  
💻 **Code Highlighting** - Syntax highlighting with Prism.js  
📋 **Copy to Clipboard** - One-click code copying with visual feedback  
🚀 **Fast Performance** - Built with Vite for optimal build speed  

## Tech Stack

- **React 19** - UI library
- **Vite 6** - Build tool
- **React Router 7** - Client-side routing
- **Tailwind CSS 3** - Utility-first CSS framework
- **Prism.js** - Syntax highlighting
- **JavaScript** - Pure JS, no TypeScript

## Project Structure

```
documentation/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Top navigation bar
│   │   ├── Sidebar.jsx         # Left sidebar navigation
│   │   ├── CodeBlock.jsx       # Reusable code block with highlighting
│   │   └── Section.jsx         # Content section wrapper
│   ├── pages/
│   │   ├── Introduction.jsx    # Getting started guide
│   │   ├── Authentication.jsx  # API authentication guide
│   │   ├── CreateIncident.jsx  # POST /api/incidents endpoint
│   │   ├── GetIncidents.jsx    # GET /api/incidents endpoint
│   │   ├── AIEndpoints.jsx     # AI analysis endpoints
│   │   └── ErrorHandling.jsx   # Error codes and handling
│   ├── layout/
│   │   └── DocsLayout.jsx      # Main layout wrapper
│   ├── App.jsx                 # Router setup
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
cd documentation
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:5173/`

### Production Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Documentation Pages

### 📘 Introduction
Overview of OpsPulse, key features, quick start guide, and basic API info.

### 🔐 Authentication
API key management, authentication methods with examples in multiple languages (cURL, Node.js, Python, JavaScript).

### ✨ API Reference

- **Create Incident** - POST /api/incidents - Report new errors
- **Get Incidents** - GET /api/incidents - Retrieve incidents with filters
- **AI Endpoints** - Summary generation, tag extraction, root cause analysis

### ⚠️ Error Handling
Comprehensive error codes, HTTP status explanations, and error handling best practices with code examples.

## Features Explained

### Code Block Component
- Syntax highlighting for multiple languages
- Copy-to-clipboard functionality
- Visual feedback on copy action
- Clean, dark theme styling

### Navigation
- **Sticky Navbar** - Always accessible header
- **Sticky Sidebar** - Fixed left navigation
- **Active Link Highlighting** - Current page indicator
- **Responsive Design** - Sidebar hides on mobile

### Typography
- Professional font hierarchy
- Optimal line height and spacing
- Proper contrast ratios
- Readable code examples

## Styling

All styles use Tailwind CSS utility classes with custom extensions for:
- `shadow-soft` - Subtle shadows
- `shadow-card` - Card shadows
- Custom color palette
- Responsive spacing and sizing

## Git Workflow

This project follows atomic commit practices for clean git history.

## Performance Optimizations

- Code splitting with React Router
- Lazy syntax highlighting initialization
- Minimal CSS output with Tailwind purging
- Optimized image assets
- Fast dev server with HMR

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Deployment

Built with Vite, easily deployable to Vercel, Netlify, GitHub Pages, or traditional servers.
