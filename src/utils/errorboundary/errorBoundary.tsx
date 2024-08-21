import React, { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface ErrorBoundaryProps {
  children: ReactNode;
  error?: AxiosError;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error:', error);
    console.error('Error info:', errorInfo);

    // Log the error to a logging service
    // For example, using Sentry or Rollbar
    // logErrorToSentry(error, errorInfo);

    // Display a user-friendly message
    toast.error('An unexpected error occurred. Please try again later.');
  }

  handleRefresh = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-bold mb-4">Oops! Something went wrong.</h3>
            <p className="mb-6">
              We're sorry, but an unexpected error has occurred. Please try again
              later.
            </p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-150"
              onClick={this.handleRefresh}
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;