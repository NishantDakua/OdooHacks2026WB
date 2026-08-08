function Toast({ type = "success", message, onClose }) {
  if (!message) return null;

  const typeStyles = {
    success: {
      bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
      icon: (
        <svg className="h-5 w-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      ),
    },
    error: {
      bg: "bg-red-50 border-red-200 text-red-800",
      icon: (
        <svg className="h-5 w-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    warning: {
      bg: "bg-amber-50 border-amber-200 text-amber-800",
      icon: (
        <svg className="h-5 w-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    info: {
      bg: "bg-blue-50 border-blue-200 text-blue-800",
      icon: (
        <svg className="h-5 w-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const current = typeStyles[type] || typeStyles.info;

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur transition-all duration-300 ${current.bg}`}
      role="alert"
    >
      {current.icon}
      <p className="text-xs font-semibold">{message}</p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-auto p-1 text-gray-400 hover:text-gray-700 transition"
          aria-label="Close notification"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default Toast;
