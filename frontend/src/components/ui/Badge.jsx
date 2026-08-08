function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-[#e9f6f5] px-3 py-1 text-xs font-semibold text-[#4f8c89] ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;