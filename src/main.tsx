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
        <div className="min-h-dvh flex items-center justify-center bg-[#EDF2EE] p-6 text-center">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-[#DCE4DD] shadow-xs">
            <h1 className="text-base font-bold text-[#111C18] mb-2">Impara l'Italiano Parlando</h1>
            <p className="text-xs text-[#4A5C55] mb-4">
              Si è verificato un problema durante il caricamento della conversazione.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-[#0F5E4B] hover:bg-[#0A4638] text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              Ricarica app
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
