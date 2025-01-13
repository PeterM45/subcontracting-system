import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-5">
        <Skeleton className="h-9 w-24" /> {/* Back button */}
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" /> {/* Edit button */}
          <Skeleton className="h-9 w-9" /> {/* Delete button */}
        </div>
      </div>

      {/* SubcontractorInfo skeleton */}
      <div>
        <Skeleton className="h-8 w-64" /> {/* Name */}
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <Skeleton className="mb-6 h-6 w-40" /> {/* Card title */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
        <div className="rounded-lg border p-6">
          <Skeleton className="mb-6 h-6 w-40" /> {/* Card title */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      {/* Map skeleton */}
      <Skeleton className="h-[400px] w-full" />

      {/* Rates table skeleton */}
      <div className="rounded-lg border">
        <Skeleton className="m-4 h-6 w-40" /> {/* Table title */}
        <div className="p-4">
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
