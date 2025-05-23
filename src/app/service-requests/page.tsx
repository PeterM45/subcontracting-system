"use client";

import { api } from "~/trpc/react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export default function ServiceRequestsPage() {
  const { data: serviceRequests, isLoading } =
    api.serviceRequest.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Service Requests</h1>
          <Button asChild>
            <Link href="/service-requests/new">
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Service Requests</h1>
        <Button asChild>
          <Link href="/service-requests/new">
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Link>
        </Button>
      </div>
      {!serviceRequests?.length ? (
        <Card className="p-6">
          <p className="text-center text-muted-foreground">
            No service requests found
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {serviceRequests.map((request) => (
            <Link
              href={`/service-requests/${request.id}`}
              key={request.id}
              className="block"
            >
              <Card className="p-6 transition-colors hover:bg-accent">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">
                      {request.customer?.name ?? "Unknown Customer"} -{" "}
                      {request.binSize}yd³ {request.serviceType}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {request.address}
                    </p>
                    <div className="mt-2 text-sm">
                      <span className="text-muted-foreground">
                        Start:{" "}
                        {new Date(request.scheduledStart).toLocaleDateString()}
                      </span>
                      {request.scheduledRemoval && (
                        <span className="ml-4 text-muted-foreground">
                          Removal:{" "}
                          {new Date(
                            request.scheduledRemoval,
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {request.appliedRateStructure.flatRate !== undefined
                        ? `${formatCurrency(request.appliedRateStructure.flatRate)} Flat`
                        : formatCurrency(
                            request.appliedRateStructure.liftRate!,
                          )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {request.appliedRateStructure.flatRate !== undefined
                        ? "Flat Rate"
                        : "Lift Rate"}
                    </p>
                    {request.appliedRateStructure.additionalCosts.length >
                      0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        +{request.appliedRateStructure.additionalCosts.length}{" "}
                        additional costs
                      </p>
                    )}
                  </div>
                </div>
                {request.specialInstructions && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Note: {request.specialInstructions}
                  </p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
