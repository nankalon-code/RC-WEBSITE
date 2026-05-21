import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("WebGL/Component Crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-[500px] flex flex-col items-center justify-center border border-surface rounded-3xl bg-panel">
          <div className="text-white text-lg font-bold mb-2">Interactive Scene Failed to Load</div>
          <p className="text-textMuted text-sm">Please enable WebGL in your browser to view the 3D environment.</p>
        </div>
      );
    }
    return this.props.children; 
  }
}

export default ErrorBoundary;
