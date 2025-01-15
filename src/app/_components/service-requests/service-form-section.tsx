"use client";

import { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Card } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ServiceType, MaterialType } from "~/lib/types";
import { NumberInput } from "~/components/ui/number-input";
import { Badge } from "~/components/ui/badge";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { GeocoderProps } from "@mapbox/search-js-react/dist/components/Geocoder";
import type { Control } from "react-hook-form";
import type { FormValues } from "./new-service-request-form";
import type { GeocoderResult, Rate } from "~/lib/types";
import { useWatch, type UseFormReturn } from "react-hook-form";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";

const Geocoder = dynamic(
  () =>
    import("@mapbox/search-js-react").then((mod) => mod.Geocoder) as Promise<
      ComponentType<GeocoderProps>
    >,
  { ssr: false },
);

interface ServiceFormSectionProps {
  control: Control<FormValues>;
  form: UseFormReturn<FormValues>;
  onAddressRetrieve: (res: GeocoderResult) => void;
}

export function ServiceFormSection({
  control,
  form,
  onAddressRetrieve,
}: ServiceFormSectionProps) {
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<
    number | null
  >(null);
  const formValues = useWatch({ control });

  // Query nearby subcontractors as soon as location is set
  const { data: nearbySubcontractors, isLoading: isLoadingSubcontractors } =
    api.subcontractor.getNearbyWithRates.useQuery(
      {
        latitude: 0,
        longitude: 0,
        binSize: 0,
        serviceType: "rolloff",
        materialType: "waste",
      },
      {
        enabled: true, // Always enabled since we're not depending on location anymore
      },
    );
  // Query all rates for selected subcontractor
  const { data: subcontractorRates, isLoading: isLoadingRates } =
    api.rate.getBySubcontractor.useQuery(
      { subcontractorId: selectedSubcontractor ?? 0 },
      {
        enabled: !!selectedSubcontractor,
        refetchOnWindowFocus: false,
      },
    );

  const applyRate = (rate: Rate) => {
    form.setValue("rateId", rate.id);
    form.setValue("appliedBaseRate", Number(rate.baseRate));
    form.setValue("appliedDumpFee", rate.dumpFee ? Number(rate.dumpFee) : null);
    form.setValue(
      "appliedRentalRate",
      rate.rentalRate ? Number(rate.rentalRate) : null,
    );
    form.setValue(
      "appliedAdditionalCost",
      rate.additionalCost ? Number(rate.additionalCost) : null,
    );
  };

  // Filter and sort rates based on form values
  const filteredRates = subcontractorRates
    ?.filter((rate) => {
      if (!rate.expiryDate || new Date(rate.expiryDate) > new Date()) {
        return true;
      }
      return false;
    })
    .sort((a, b) => {
      // Sort by match relevance
      const aMatch =
        (a.binSize === formValues.binSize ? 1 : 0) +
        (a.serviceType === formValues.serviceType ? 1 : 0) +
        (a.materialType === formValues.materialType ? 1 : 0);
      const bMatch =
        (b.binSize === formValues.binSize ? 1 : 0) +
        (b.serviceType === formValues.serviceType ? 1 : 0) +
        (b.materialType === formValues.materialType ? 1 : 0);
      return (
        bMatch - aMatch ||
        new Date(b.effectiveDate).getTime() -
          new Date(a.effectiveDate).getTime()
      );
    });

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold">Service Information</h2>
      <div className="space-y-4">
        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Location *</FormLabel>
              <FormControl>
                <Geocoder
                  accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ""}
                  value={field.value}
                  onChange={field.onChange}
                  onRetrieve={onAddressRetrieve}
                  placeholder="Enter service location"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={control}
            name="binSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bin Size *</FormLabel>
                <FormControl>
                  <NumberInput
                    placeholder="Size in yards"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Type *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ServiceType.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="materialType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material Type *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select material type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MaterialType.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Subcontractors Section */}
      <div className="mt-6">
        <h3 className="mb-4 text-lg font-semibold">Available Subcontractors</h3>
        {!formValues.latitude || !formValues.longitude ? (
          <p className="text-sm text-muted-foreground">
            Please enter a service location to see available subcontractors
          </p>
        ) : isLoadingSubcontractors ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : nearbySubcontractors?.length ? (
          <div className="space-y-4">
            {nearbySubcontractors.map((sub) => (
              <Card
                key={sub.subcontractor.id}
                className={cn(
                  "cursor-pointer p-4 transition-colors hover:bg-accent",
                  selectedSubcontractor === sub.subcontractor.id &&
                    "border-primary",
                )}
                onClick={() => {
                  setSelectedSubcontractor(sub.subcontractor.id);
                  form.setValue("subcontractorId", sub.subcontractor.id);
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{sub.subcontractor.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {sub.subcontractor.location}
                    </p>
                  </div>
                  {sub.subcontractor.contact && (
                    <div className="text-sm text-muted-foreground">
                      Contact: {sub.subcontractor.contact}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No subcontractors available in this area
          </p>
        )}
      </div>

      {/* Rates Section */}
      {selectedSubcontractor && (
        <div className="mt-6">
          <h3 className="mb-4 text-lg font-semibold">Available Rates</h3>
          {isLoadingRates ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredRates?.length ? (
            <div className="space-y-3">
              {filteredRates.map((rate) => (
                <Card
                  key={rate.id}
                  className={cn(
                    "cursor-pointer p-3 transition-colors hover:bg-accent",
                    formValues.rateId === rate.id && "border-primary bg-accent",
                  )}
                  onClick={() => applyRate(rate)}
                >
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {rate.binSize}yd³ {rate.serviceType} -{" "}
                          {rate.materialType}
                        </p>
                        {rate.effectiveDate && (
                          <p className="text-sm text-muted-foreground">
                            Effective:{" "}
                            {new Date(rate.effectiveDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={
                          formValues.rateId === rate.id ? "default" : "outline"
                        }
                      >
                        ${Number(rate.baseRate).toFixed(2)}
                      </Badge>
                    </div>
                    {(rate.dumpFee ??
                      rate.rentalRate ??
                      rate.additionalCost) && (
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        {rate.dumpFee && (
                          <span>
                            Dump Fee: ${Number(rate.dumpFee).toFixed(2)}
                          </span>
                        )}
                        {rate.rentalRate && (
                          <span>
                            • Rental: ${Number(rate.rentalRate).toFixed(2)}/day
                          </span>
                        )}
                        {rate.additionalCost && (
                          <span>
                            • Additional: $
                            {Number(rate.additionalCost).toFixed(2)}
                          </span>
                        )}
                      </div>
                    )}
                    {rate.notes && (
                      <p className="text-sm text-muted-foreground">
                        {rate.notes}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No rates available for this subcontractor
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
