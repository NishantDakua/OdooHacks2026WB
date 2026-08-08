export default function ProductCardSkeleton() {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:shadow-lg">
      <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <div className="mb-2 flex items-center justify-between">
          <div className="h-5 w-16 animate-pulse rounded-md bg-gray-200" />
          <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />

        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
    </article>
  );
}
