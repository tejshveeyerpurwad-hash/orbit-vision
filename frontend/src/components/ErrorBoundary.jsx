import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4 py-12">
          <svg className="h-10 w-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
          <h2 className="text-lg font-semibold text-slate-200">{this.props.title || 'Something went wrong'}</h2>
          <p className="text-sm text-slate-500 text-center max-w-md">{this.props.message || 'An unexpected error occurred. Please try refreshing the page.'}</p>
          <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }} className="mt-2 rounded-lg border border-white/[0.06] bg-white/[0.04] px-4 py-2 text-xs text-slate-300 hover:bg-white/[0.08] transition-colors">
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
