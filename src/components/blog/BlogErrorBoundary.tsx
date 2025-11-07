'use client';

import React from 'react';

interface BlogErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface BlogErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

/**
 * Error Boundary for Blog Components
 * Catches and handles errors in blog-related components gracefully
 */
export class BlogErrorBoundary extends React.Component<
  BlogErrorBoundaryProps,
  BlogErrorBoundaryState
> {
  constructor(props: BlogErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): BlogErrorBoundaryState {
    console.error('BlogErrorBoundary caught an error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Blog component error details:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Replace with your error tracking service
      // logErrorToService(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent 
          error={this.state.error} 
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback Component
 */
function DefaultErrorFallback({ 
  error, 
  resetError 
}: { 
  error?: Error; 
  resetError: () => void; 
}) {
  return (
    <div className="my-8 p-6 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center mb-4">
        <svg 
          className="h-6 w-6 text-red-600 mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
          />
        </svg>
        <h3 className="text-lg font-medium text-red-800">
          Something went wrong
        </h3>
      </div>
      
      <p className="text-red-700 mb-4">
        We encountered an error while loading this content. Please try refreshing the page.
      </p>
      
      {process.env.NODE_ENV === 'development' && error && (
        <details className="mb-4">
          <summary className="text-sm text-red-600 cursor-pointer">
            Error Details (Development)
          </summary>
          <pre className="mt-2 text-xs text-red-800 bg-red-100 p-2 rounded overflow-auto">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}
      
      <button
        onClick={resetError}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

/**
 * Image Error Fallback Component
 */
export function ImageErrorFallback({ 
  error, 
  resetError,
  alt = 'Image'
}: { 
  error?: Error; 
  resetError: () => void;
  alt?: string;
}) {
  return (
    <div className="my-8 flex items-center justify-center">
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center max-w-md">
        <div className="text-gray-400 mb-2">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-sm text-gray-500 mb-3">
          {alt} could not be loaded
        </p>
        <button
          onClick={resetError}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

/**
 * HOC to wrap components with error boundary
 */
export function withBlogErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
) {
  return function WrappedComponent(props: P) {
    return (
      <BlogErrorBoundary fallback={fallback}>
        <Component {...props} />
      </BlogErrorBoundary>
    );
  };
}