import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback UI (overrides default) */
  fallback?: ReactNode;
  /** Optional custom reset handler (e.g., state reset). Defaults to window.location.reload() */
  onReset?: () => void;
  /** Optional custom error logging function */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console (or your reporting service)
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);

    // Call custom error reporter if provided
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = (): void => {
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default professional error UI (matches your CSS theme)
      const errorMessage = this.state.error?.message || 'An unexpected error occurred. Our team has been notified.';

      return (
        <div className="error-container">
          <div className="error-card">
            <div className="error-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3 className="error-title">Application Error</h3>
            <p className="error-message">{errorMessage}</p>
            <button className="btn btn-primary error-retry-btn" onClick={this.handleRetry}>
              <i className="fas fa-sync-alt me-2"></i>
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}