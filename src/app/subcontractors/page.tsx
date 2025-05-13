import { Suspense } from "react";
import { CreateSubcontractorDialog } from "~/app/_components/subcontractors/list/create-subcontractor-dialog";
import { SubcontractorGrid } from "~/app/_components/subcontractors/list/subcontractor-grid";
import { Skeleton } from "~/components/ui/skeleton";

function SubcontractorGridSkeleton() {
  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-48 w-full" />
      ))}
    </div>
  );
}

export default function SubcontractorsPage() {
  return (
    <main className="container mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Subcontractors</h1>
        <CreateSubcontractorDialog />
      </div>
      <Suspense fallback={<SubcontractorGridSkeleton />}>
        <SubcontractorGrid />
      </Suspense>
    </main>
  );
}
