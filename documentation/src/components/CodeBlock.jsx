import { useEffect, useRef, useState } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-python'

export default function CodeBlock({ code, language = 'javascript', title = '' }) {
  const codeRef = useRef(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [code, language])

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-slate-200 bg-white shadow-card">
      {title && (
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">{title}</span>
        </div>
      )}
      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 px-3 py-1 bg-slate-700 hover:bg-slate-800 text-white text-xs font-medium rounded transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
        <pre className="!m-0">
          <code
            ref={codeRef}
            className={`language-${language}`}
          >
            {code}
          </code>
        </pre>
      </div>
    </div>
  )
}
