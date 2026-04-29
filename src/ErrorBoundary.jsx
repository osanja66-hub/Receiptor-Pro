import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Log to console and persist the info object
    console.error('ErrorBoundary caught:', error, info);
    this.setState({ info });
  }

  render() {
    const { error, info } = this.state;
    if (error) {
      // Show the full error object, message and stack so we can diagnose in production
      return (
        <div style={{
          padding: 20,
          background: '#fff',
          color: '#111',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap'
        }}>
          <h2>Application error (detailed)</h2>

          <div style={{ marginTop: 8 }}>
            <strong>error.toString():</strong>
            <pre>{String(error && error.toString())}</pre>
          </div>

          <div style={{ marginTop: 8 }}>
            <strong>error.message:</strong>
            <pre>{error && error.message}</pre>
          </div>

          <div style={{ marginTop: 8 }}>
            <strong>error.stack:</strong>
            <pre>{error && error.stack}</pre>
          </div>

          <div style={{ marginTop: 8 }}>
            <strong>component stack (React):</strong>
            <pre>{info && info.componentStack}</pre>
          </div>

          <div style={{ marginTop: 12 }}>
            <strong>Full error object (JSON):</strong>
            <pre>{JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}</pre>
          </div>

          <div style={{ marginTop: 12, color: '#666' }}>
            Copy the text above and paste it here so I can map it back to your source.
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
