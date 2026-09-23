import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="page empty" style={{ paddingTop: 100 }}>
          <p className="eyebrow">SOMETHING WENT WRONG</p>
          <h1 style={{ fontSize: 42 }}>Unexpected error</h1>
          <p style={{ color: 'var(--muted)', marginBottom: 28 }}>
            We're sorry — something didn't load correctly.
          </p>
          <button
            className="button"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = '/';
            }}
          >
            Return home
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}
