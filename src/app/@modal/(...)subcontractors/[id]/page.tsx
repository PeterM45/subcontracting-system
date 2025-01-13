"use client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { PageContent } from "@/app/subcontractors/[id]/page-content";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { use } from "react";

export default function SubcontractorModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);

  const { data: subcontractor, isLoading } = api.subcontractor.getById.useQuery(
    { id: Number(resolvedParams.id) },
  );
  const { data: initialRates } = api.rate.getBySubcontractor.useQuery({
    subcontractorId: Number(resolvedParams.id),
  });

  if (isLoading || !subcontractor || !initialRates) {
    return null;
  }

  return (
    <Sheet open onOpenChange={() => router.back()} modal={true}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-xl md:max-w-2xl"
      >
        <PageContent
          subcontractor={subcontractor}
          initialRates={initialRates}
        />
      </SheetContent>
    </Sheet>
  );
}
