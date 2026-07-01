export function tabClass(active: boolean) {
  return `
    flex-1 px-4 py-4 text-center text-sm sm:text-base font-medium
    border-r border-white/10 last:border-r-0
    transition-all duration-200 cursor-pointer
    ${
      active
        ? "bg-blue-500/20 text-blue-300 shadow-inner"
        : "text-slate-300 hover:bg-white/5 hover:text-white"
    }
  `;
}
