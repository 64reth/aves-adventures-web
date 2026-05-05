import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Game crashed:", error, info);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="game-error-card">
          <h2>Oops — this game hit a wobble!</h2>
          <p>The rest of the site is still safe.</p>
          <button type="button" onClick={this.reset}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}