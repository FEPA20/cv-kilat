export default function LightningButton({
  children,
  type = "button",
  onClick,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        bg-yellow-400
        hover:bg-yellow-500
        text-slate-900
        font-semibold
        px-6
        py-3
        rounded-xl
        transition-all
        duration-300
        shadow-lg
        hover:shadow-xl
        hover:-translate-y-1
        ${className}
      `}
    >
      {children}
    </button>
  );
}