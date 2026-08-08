export default function PageLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5fbfb]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#4f8c89]" />
        <p className="text-sm font-medium text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
