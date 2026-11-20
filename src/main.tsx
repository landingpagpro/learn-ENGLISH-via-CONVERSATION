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
        <div className="min-h-dvh flex items-center justify-center bg-[#EEF2F6] p-6 text-center">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-xs">
            <h1 className="text-base font-bold text-[#0F172A] mb-2">Learn English via Conversation</h1>
            <p className="text-xs text-[#475569] mb-4">
              Something went wrong while loading the conversation.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-[#1E40AF] text-white text-xs font-semibold cursor-pointer"
            >
              Reload app
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
