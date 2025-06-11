import React from 'react';
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error in PostCard:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-600">Something went wrong in PostCard.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;