export default function HoverGlow() {
  return (
    <>
      {/* Hover Glow */}
      <div
        className="
            pointer-events-none
            absolute inset-0 opacity-0
            bg-linear-to-br
            from-blue-500/10
            via-transparent
            to-cyan-500/10
            transition-opacity duration-300
            group-hover:opacity-100
            hover:cursor-pointer
        "
      />
    </>
  );
}
