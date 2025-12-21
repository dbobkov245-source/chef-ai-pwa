'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // Here you could send to error tracking service like Sentry
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-text-main mb-2">
            Что-то пошло не так
          </h2>
          <p className="text-text-secondary mb-6 max-w-sm">
            Произошла ошибка при загрузке. Попробуйте обновить страницу.
          </p>
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 bg-primary text-text-main px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors"
          >
            <RefreshCcw size={18} />
            Попробовать снова
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="mt-4 p-4 bg-gray-100 rounded-lg text-left text-xs overflow-auto max-w-full text-red-600">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
