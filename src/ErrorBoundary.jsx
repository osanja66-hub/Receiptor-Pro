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
    // keep the info so it can be shown in the UI, and log to console
    console.error('ErrorBoundary caught:', error, info);
    this.setState({ info });
    // Optional: forward to your logging service here (Sentry, LogRocket, etc.)
  }

  render() {
    const { error, info } = this.state;
    if (error) {
      return (
        <div style={{
          padding: 20,
          background: '#fff',
          color: '#111',
          fontFamily: 'monospace'
        }}>
          <h2>Application error</h2>
          <div><strong>Error:</strong>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{String(error && error.toString())}</pre>
          </div>
          <div><strong>Component stack:</strong>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{info && info.componentStack}</pre>
          </div>
          <div>Open DevTools Console for more details.</div>
        </div>
      );
    }
    return this.props.children;
  }
}
