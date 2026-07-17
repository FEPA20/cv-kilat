export default function HeroBadge() {
  return (
    <div
      className="
        inline-flex
        items-center
        gap-2
        rounded-full
        bg-yellow-100
        px-4
        py-2
        font-medium
        text-yellow-700
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >
      <span>⚡</span>
      <span>ATS Friendly</span>
    </div>
  );
}