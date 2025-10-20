// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-ERROR-001
// User Story: Error boundary to catch and display React component errors
// Acceptance Criteria: 
//   - Catch React component errors
//   - Display user-friendly error message
//   - Log errors for debugging
//   - Provide error recovery option
// GxP Impact: YES - Error logging for audit trail
// Risk Level: MEDIUM
// ============================================================================

import React from 'react';

// PUBLIC_INTERFACE
/**
 * ErrorBoundary component to catch and handle React errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error for debugging and audit
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // TODO: Send error to logging service for audit trail
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-primary)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            maxWidth: '600px',
            padding: '30px',
            backgroundColor: 'var(--surface)',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ color: 'var(--error)', marginBottom: '20px' }}>
              Something went wrong
            </h1>
            <p style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>
              We're sorry, but an unexpected error occurred. Please try refreshing the page.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ 
                marginBottom: '20px', 
                textAlign: 'left',
                padding: '15px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                overflow: 'auto'
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
                  Error Details
                </summary>
                <pre style={{ fontSize: '12px', margin: 0 }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              style={{
                padding: '12px 24px',
                backgroundColor: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
