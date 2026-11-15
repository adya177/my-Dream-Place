import { Component } from "react";
import PropTypes from "prop-types";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Keep a recoverable fallback on screen without leaking details to users.
  }

  render() {
    if (this.state.hasError) {
      return <main className="hotel-details-page flex min-h-[70vh] items-center justify-center px-5 py-16"><section className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[.04] p-8 text-center shadow-2xl"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-amber-300/20 bg-amber-300/10 text-amber-200"><AlertTriangle size={24}/></span><h1 className="mt-5 text-2xl font-bold text-zinc-100">This page hit a snag</h1><p className="mt-2 text-sm leading-6 text-zinc-400">Your session is safe. Refresh this page to try again.</p><button type="button" onClick={() => window.location.reload()} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-500"><RotateCcw size={16}/> Refresh page</button></section></main>;
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = { children: PropTypes.node.isRequired };
