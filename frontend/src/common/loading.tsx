export const Loading = () => {
  return (
    <div
      role="status"
      aria-label="Chargement en cours"
      className="flex min-h-screen items-center justify-center bg-gray-950"
    >
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-emerald-400/20" />
        <div className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-t-emerald-400 border-r-emerald-300" />
        <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />
      </div>
    </div>
  )
}
