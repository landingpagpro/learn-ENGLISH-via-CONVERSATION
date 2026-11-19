import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryState {
  hasError: boolean;
}

class AppErrorBoundary extends React.Component<{children: React.ReactNode}, ErrorBoundaryState> {
  state: ErrorBoundaryState = {hasError: false};

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {hasError: true};
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh flex items-center justify-center bg-[#F1F4F9] p-6 text-center">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200/80 shadow-xs">
            <h1 className="font-display text-base font-bold text-slate-900 mb-2">Learn Italian via Conversation</h1>
            <p className="text-xs text-slate-500 mb-4">
              Something went wrong loading the conversation view.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-[#1E3A8A] hover:bg-[#1E40AF] text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);
