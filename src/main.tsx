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
        <div className="min-h-dvh flex items-center justify-center bg-[#F3EFE6] p-6 text-center">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-[#1E3A8A]/15 shadow-xs">
            <h1 className="font-display text-lg font-bold text-[#141B2D] mb-2">
              Français par la conversation
            </h1>
            <p className="text-xs text-[#475569] mb-4">
              Something went wrong loading the conversation view.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-[#1E3A8A] text-white text-xs font-semibold cursor-pointer"
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
