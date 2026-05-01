export default function Section({ children, className = '' }) {
  return (
    <section className={`mb-12 ${className}`}>
      {children}
    </section>
  )
}
