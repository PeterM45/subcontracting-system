"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import { CustomerFormSection } from "./customer-form-section";
import { ServiceFormSection } from "./service-form-section";
import { ServiceType, MaterialType } from "~/lib/types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { GeocoderResult } from "~/lib/types";

const formSchema = z.object({
  // Customer Info
  name: z.string().min(1, "Required"),
  email: z.union([z.string().email(), z.string().length(0)]).optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  // Service Info
  address: z.string().min(1, "Please enter a valid address"),
  latitude: z.number(),
  longitude: z.number(),
  binSize: z.number().min(1, "Required"),
  serviceType: z.enum(ServiceType),
  materialType: z.enum(MaterialType),
});

export type FormValues = z.infer<typeof formSchema>;

export function NewServiceRequestForm() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      notes: "",
      address: "",
      latitude: 0,
      longitude: 0,
      binSize: 0,
      serviceType: "rolloff",
      materialType: "waste",
    },
  });

  const handleAddressRetrieve = (res: GeocoderResult) => {
    const {
      full_address,
      coordinates: { latitude, longitude },
    } = res.properties;
    form.setValue("address", full_address);
    form.setValue("latitude", latitude);
    form.setValue("longitude", longitude);
  };

  const { mutate, status } = api.serviceRequest.create.useMutation({
    onSuccess: (data) => {
      toast({ description: "Service request created successfully" });
      router.push(`/service-requests/${data.serviceRequestId}`);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    const { name, email, phone, notes, ...serviceData } = data;

    mutate({
      customerData: {
        name,
        email: email ?? undefined,
        phone: phone ?? undefined,
        notes: notes ?? undefined,
      },
      serviceData: {
        ...serviceData,
        latitude: serviceData.latitude.toString(),
        longitude: serviceData.longitude.toString(),
      },
    });
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CustomerFormSection control={form.control} />
          <ServiceFormSection
            control={form.control}
            form={form}
            onAddressRetrieve={handleAddressRetrieve}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
              disabled={status === "pending"}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={status === "pending"}>
              {status === "pending" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Service Request"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
