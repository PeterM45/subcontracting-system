"use client";
import { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Card } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ServiceType, MaterialType } from "~/lib/types";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { GeocoderProps } from "@mapbox/search-js-react/dist/components/Geocoder";
import type { Control } from "react-hook-form";
import type { FormValues } from "./new-service-request-form";
import type { GeocoderResult, Subcontractor, Rate } from "~/lib/types";
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

type SubcontractorWithRate = {
  subcontractor: Subcontractor;
  rate: Rate;
};

export function ServiceFormSection({
  control,
  form,
  onAddressRetrieve,
}: ServiceFormSectionProps) {
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<
    number | null
  >(null);
  const formValues = useWatch({ control });

  // Query nearby subcontractors when location and service details are set
  const { data: nearbySubcontractors } =
    api.subcontractor.getNearbyWithRates.useQuery<SubcontractorWithRate[]>(
      {
        latitude: formValues.latitude ?? 0,
        longitude: formValues.longitude ?? 0,
        binSize: formValues.binSize ?? 0,
        serviceType: formValues.serviceType ?? "rolloff",
        materialType: formValues.materialType ?? "waste",
      },
      {
        enabled: !!(
          formValues.latitude &&
          formValues.longitude &&
          formValues.binSize &&
          formValues.serviceType &&
          formValues.materialType
        ),
      },
    );

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
                  <Input
                    type="number"
                    placeholder="Size in yards"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
      {(nearbySubcontractors ?? []).length > 0 && (
        <div className="mt-6">
          <h3 className="mb-4 text-lg font-semibold">
            Available Subcontractors
          </h3>
          <div className="space-y-4">
            {nearbySubcontractors?.map((sub) => (
              <Card
                key={sub.subcontractor.id}
                className={cn(
                  "cursor-pointer p-4 transition-colors",
                  selectedSubcontractor === sub.subcontractor.id &&
                    "border-primary",
                )}
                onClick={() => {
                  setSelectedSubcontractor(sub.subcontractor.id);
                  if (sub.rate) {
                    form.setValue("baseRate", Number(sub.rate.baseRate));
                    form.setValue(
                      "dumpFee",
                      sub.rate.dumpFee ? Number(sub.rate.dumpFee) : null,
                    );
                    form.setValue(
                      "rentalRate",
                      sub.rate.rentalRate ? Number(sub.rate.rentalRate) : null,
                    );
                    form.setValue(
                      "additionalCost",
                      sub.rate.additionalCost
                        ? Number(sub.rate.additionalCost)
                        : null,
                    );
                    form.setValue("subcontractorId", sub.subcontractor.id);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{sub.subcontractor.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {sub.subcontractor.location}
                    </p>
                  </div>
                  {sub.rate && (
                    <div className="text-right">
                      <p className="font-medium">
                        ${parseFloat(sub.rate.baseRate).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">Base Rate</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
