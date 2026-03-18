const LoadingScreen = () => (
  <div className="flex min-h-screen items-center justify-center bg-white">
    <div className="text-center">
      <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-500" />
      <p className="text-sm font-medium text-gray-500">로딩 중...</p>
    </div>
  </div>
);

export default LoadingScreen;
