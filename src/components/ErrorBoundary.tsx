import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-white px-6">
          <div className="text-center">
            <p className="mb-2 text-lg font-bold text-gray-900">앗, 문제가 발생했어요</p>
            <p className="mb-6 text-sm text-gray-500">
              {this.state.error?.message || "알 수 없는 오류"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white"
            >
              다시 시도
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
