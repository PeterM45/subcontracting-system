"use client";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { SubcontractorInfo } from "~/app/_components/subcontractors/details/subcontractor-info";
import { RatesTable } from "~/app/_components/subcontractors/details/individual-rates-table";
import { api } from "~/trpc/react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import type { Subcontractor, Rate, UpdateSubcontractorForm } from "~/lib/types";

export function PageContent({
  subcontractor,
  initialRates,
}: {
  subcontractor: Subcontractor;
  initialRates: Rate[];
}) {
  const router = useRouter();
  const { data: rates } = api.rate.getBySubcontractor.useQuery(
    { subcontractorId: subcontractor.id },
    { initialData: initialRates },
  );

  const [isEditing, setIsEditing] = useState(false);
  const utils = api.useUtils();
  const updateMutation = api.subcontractor.update.useMutation({
    onSuccess: async () => {
      // Invalidate both the individual query and the list query
      await Promise.all([
        utils.subcontractor.getById.invalidate({ id: subcontractor.id }),
        utils.subcontractor.getAll.invalidate(),
      ]);
      setIsEditing(false);
    },
  });
  const deleteMutation = api.subcontractor.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Deleted",
        description: "Subcontractor has been deleted",
      });
      void router.push("/subcontractors");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  // Use the query to get real-time updates
  const { data: updatedSubcontractor } = api.subcontractor.getById.useQuery(
    { id: subcontractor.id },
    {
      initialData: subcontractor,
    },
  );

  const onSubmit = async (data: UpdateSubcontractorForm) => {
    try {
      await updateMutation.mutateAsync({
        id: subcontractor.id,
        ...data,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update subcontractor",
        variant: "destructive",
      });
    }
  };

  const Map = useMemo(
    () =>
      dynamic(
        () => import("~/app/_components/subcontractors/details/location-map"),
        {
          loading: () => <p>A map is loading</p>,
          ssr: false,
        },
      ),
    [],
  );

  const position: [number, number] = [
    Number(updatedSubcontractor?.latitude),
    Number(updatedSubcontractor?.longitude),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-5">
        <BackButton />
        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              if (
                confirm("Are you sure? This will delete all associated rates.")
              ) {
                deleteMutation.mutate({ id: subcontractor.id });
              }
            }}
            disabled={deleteMutation.status === "pending"}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <SubcontractorInfo
        subcontractor={updatedSubcontractor ?? subcontractor}
        isEditing={isEditing}
        onSubmit={onSubmit}
      />
      <div className="relative z-0 h-[400px] w-full">
        <Map
          posix={position}
          subcontractor={updatedSubcontractor ?? subcontractor}
          zoom={15}
        />
      </div>
      <RatesTable rates={rates} subcontractor={subcontractor} />
    </div>
  );
}
