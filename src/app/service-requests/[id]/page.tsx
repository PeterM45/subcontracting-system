"use client";

import { use } from "react";
import { api } from "~/trpc/react";
import { Card } from "~/components/ui/card";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { formatCurrency } from "~/lib/formatting";
import GeneratePDFButton from "~/app/service-requests/_components/subcontractor-agreement/generate-pdf-button";

export default function ServiceRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: request, isLoading } = api.serviceRequest.getById.useQuery(
    parseInt(resolvedParams.id),
  );

  // Rest of the component remains the same
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!request) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="mb-6 text-2xl font-bold">Service Request Details</h1>
        <GeneratePDFButton serviceRequest={request} />
      </div>

      <div className="space-y-6">
        {/* Customer Information */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Customer Information</h2>
          <div className="grid gap-2">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {request.customer?.name ?? "Unknown"}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {request.customer?.email ?? "N/A"}
            </p>
            <p>
              <span className="font-medium">Phone:</span>{" "}
              {request.customer?.phone ?? "N/A"}
            </p>
            {request.customer?.notes && (
              <p>
                <span className="font-medium">Notes:</span>{" "}
                {request.customer.notes}
              </p>
            )}
          </div>
        </Card>

        {/* Service Details */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Service Details</h2>
          <div className="grid gap-2">
            <p>
              <span className="font-medium">Service Type:</span>{" "}
              {request.serviceType}
            </p>
            <p>
              <span className="font-medium">Material Type:</span>{" "}
              {request.materialType}
            </p>
            <p>
              <span className="font-medium">Bin Size:</span> {request.binSize}{" "}
              yards
            </p>
            <p>
              <span className="font-medium">Address:</span> {request.address}
            </p>
            <p>
              <span className="font-medium">Scheduled Start:</span>{" "}
              {new Date(request.scheduledStart).toLocaleDateString()}
            </p>
            {request.scheduledRemoval && (
              <p>
                <span className="font-medium">Scheduled Removal:</span>{" "}
                {new Date(request.scheduledRemoval).toLocaleDateString()}
              </p>
            )}
            {request.specialInstructions && (
              <p>
                <span className="font-medium">Special Instructions:</span>{" "}
                {request.specialInstructions}
              </p>
            )}
          </div>
        </Card>

        {/* Rate Information */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Rate Information</h2>
          <div className="grid gap-2">
            {request.appliedRateStructure.flatRate !== undefined ? (
              <p>
                <span className="font-medium">Flat Rate:</span>{" "}
                {formatCurrency(request.appliedRateStructure.flatRate)}
              </p>
            ) : (
              <>
                <p>
                  <span className="font-medium">Lift Rate:</span>{" "}
                  {formatCurrency(request.appliedRateStructure.liftRate)}
                </p>
                {request.appliedRateStructure.dumpFee && (
                  <p>
                    <span className="font-medium">Dump Fee:</span>{" "}
                    {formatCurrency(request.appliedRateStructure.dumpFee)}
                  </p>
                )}
              </>
            )}

            {request.appliedRateStructure.rentalRate && (
              <p>
                <span className="font-medium">Rental Rate:</span>{" "}
                {formatCurrency(request.appliedRateStructure.rentalRate)}
              </p>
            )}

            {request.appliedRateStructure.additionalCosts.length > 0 && (
              <>
                <span className="font-medium">Additional Costs:</span>
                <ul className="ml-6 list-disc">
                  {request.appliedRateStructure.additionalCosts.map(
                    (cost, index) => (
                      <li key={index}>
                        {cost.name}:{" "}
                        {cost.isPercentage
                          ? `${cost.amount}%`
                          : formatCurrency(cost.amount)}
                        {cost.description && ` - ${cost.description}`}
                      </li>
                    ),
                  )}
                </ul>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
