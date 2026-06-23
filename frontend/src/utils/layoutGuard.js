export function initLayoutGuard() {
  if (typeof window === 'undefined') return
  const orig = window.requestAnimationFrame
  let warned = false
  const check = () => {
    if (warned) return
    const doc = document.documentElement
    if (doc.scrollWidth > window.innerWidth) {
      console.warn(
        `%c⚠ LAYOUT OVERFLOW: document is ${doc.scrollWidth}px wide (viewport: ${window.innerWidth}px)`,
        'background:#7c3aed;color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold'
      )
      const root = document.querySelector('[data-layout-root]')
      if (root) {
        root.style.outline = '2px solid #ef4444'
        root.style.outlineOffset = '-2px'
      }
      const els = document.querySelectorAll('body *')
      const offenders = []
      for (let i = 0; i < els.length; i++) {
        const el = els[i]
        const rect = el.getBoundingClientRect()
        if (rect.right > window.innerWidth + 2 && rect.width > 0) {
          const tag = el.tagName.toLowerCase()
          const id = el.id ? `#${el.id}` : ''
          const cls = el.className && typeof el.className === 'string'
            ? `.${el.className.split(' ').filter(Boolean).join('.')}`.substring(0, 80)
            : ''
          offenders.push(`${tag}${id}${cls} — right:${Math.round(rect.right)}px, width:${Math.round(rect.width)}px`)
          if (offenders.length >= 5) break
        }
      }
      if (offenders.length) {
        console.warn(`%cTop ${offenders.length} overflow element(s):`, 'color:#ef4444;font-weight:bold')
        offenders.forEach((o, i) => console.warn(`  ${i + 1}. ${o}`))
      }
      warned = true
      setTimeout(() => { warned = false }, 3000)
    }
  }
  const interval = setInterval(check, 2000)
  check()
  return () => clearInterval(interval)
}
