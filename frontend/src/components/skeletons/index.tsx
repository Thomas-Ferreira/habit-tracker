const SkeletonBlock = ({ className = "" }: { className?: string }) => (
  <div aria-hidden="true" className={`animate-pulse rounded bg-gray-700/70 ${className}`} />
);

const StatSkeleton = ({ ring = false }: { ring?: boolean }) => (
  <div
    aria-hidden="true"
    className={`flex h-40 w-40 shrink-0 flex-col items-center justify-center gap-3 rounded-full border border-gray-800 bg-gray-900 p-4 ${ring ? "relative" : ""}`}
  >
    {ring && <div className="absolute inset-2 rounded-full border-4 border-gray-700" />}
    <SkeletonBlock className="h-7 w-16" />
    <SkeletonBlock className="h-3 w-20" />
  </div>
);

const HabitCardSkeleton = () => (
  <div aria-hidden="true" className="flex min-h-56 flex-col gap-4 rounded-xl border border-gray-800 bg-gray-900/80 p-4">
    <div className="flex items-start justify-between gap-3">
      <div className="flex flex-1 flex-col gap-2">
        <SkeletonBlock className="h-5 w-2/3" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-4/5" />
      </div>
      <SkeletonBlock className="h-7 w-20 rounded-full" />
    </div>
    <div className="flex gap-2">
      <SkeletonBlock className="h-6 w-16 rounded-full" />
      <SkeletonBlock className="h-6 w-20 rounded-full" />
    </div>
    <SkeletonBlock className="mt-auto h-10 w-full rounded-lg" />
  </div>
);

export const HabitListSkeleton = () => (
  <div role="status" aria-label="Chargement des habitudes" aria-busy="true" className="flex flex-col gap-6">
    <div aria-hidden="true" className="rounded-xl border border-gray-800 bg-gray-900/80 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <SkeletonBlock className="h-3 w-16" />
          <SkeletonBlock className="h-7 w-56" />
        </div>
        <SkeletonBlock className="h-4 w-28" />
      </div>
      <SkeletonBlock className="h-2.5 w-full rounded-full" />
    </div>
    <div aria-hidden="true" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }, (_, index) => <HabitCardSkeleton key={index} />)}
    </div>
    <span className="sr-only">Chargement des habitudes…</span>
  </div>
);

export const DashboardSkeleton = () => (
  <div role="status" aria-label="Chargement du tableau de bord" aria-busy="true">
    <SkeletonBlock className="h-8 w-44" />
    <div className="mt-4 flex flex-col gap-3 rounded-lg p-4 shadow-lg">
      <div aria-hidden="true" className="flex flex-col gap-4 rounded-xl bg-gray-900 p-4 md:flex-row">
        <StatSkeleton ring />
        <StatSkeleton />
        <StatSkeleton />
      </div>
      <div aria-hidden="true" className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg bg-gray-950 p-4 shadow-lg">
          <SkeletonBlock className="mb-4 h-6 w-40" />
          <div className="flex h-[300px] items-end gap-3 px-3 pb-4">
            {[35, 58, 42, 75, 50, 88, 64].map((height, index) => (
              <div key={index} className="flex h-full flex-1 items-end">
                <div className="w-full" style={{ height: `${height}%` }}>
                  <SkeletonBlock className="h-full w-full rounded-t" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
          {[0, 1, 2, 3, 4].map((row) => (
            <div key={row} className="flex items-center gap-4 border-b border-gray-800 p-4">
              <SkeletonBlock className="h-4 flex-1" />
              <SkeletonBlock className="h-4 w-20" />
              <SkeletonBlock className="h-4 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
    <span className="sr-only">Chargement du tableau de bord…</span>
  </div>
);
