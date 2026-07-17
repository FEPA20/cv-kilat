export default function LightningCard({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        relative
        rounded-2xl
        bg-white/90
        backdrop-blur-xl
        border
        border-slate-200
        shadow-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-2xl
        ${className}
      `}
    >
      {children}
    </div>
  );
}