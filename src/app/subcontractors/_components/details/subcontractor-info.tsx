"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Subcontractor, GeocoderResult } from "~/types";
import {
  updateSubcontractorSchema,
  type UpdateSubcontractorForm,
} from "~/types/forms";
import type { ComponentType } from "react";
import type { GeocoderProps } from "@mapbox/search-js-react/dist/components/Geocoder";

import { api } from "~/trpc/react";

const Geocoder = dynamic(
  () =>
    import("@mapbox/search-js-react").then((mod) => mod.Geocoder) as Promise<
      ComponentType<GeocoderProps>
    >,
  { ssr: false },
);

export function SubcontractorInfo({
  subcontractor,
  isEditing,
  onSubmit,
}: {
  subcontractor: Subcontractor;
  isEditing: boolean;
  onSubmit: (data: UpdateSubcontractorForm) => Promise<void>;
}) {
  const form = useForm<UpdateSubcontractorForm>({
    resolver: zodResolver(updateSubcontractorSchema),
    defaultValues: {
      name: subcontractor.name,
      contact: subcontractor.contact ?? "",
      phone: subcontractor.phone ?? "",
      email: subcontractor.email ?? "",
      location: subcontractor.location,
      latitude: subcontractor.latitude ?? "",
      longitude: subcontractor.longitude ?? "",
    },
  });

  const handleRetrieve = (res: GeocoderResult) => {
    const {
      full_address,
      coordinates: { latitude, longitude },
    } = res.properties;
    form.setValue("location", full_address);
    form.setValue("latitude", latitude.toString());
    form.setValue("longitude", longitude.toString());
  };

  const updateMutation = api.subcontractor.update.useMutation();

  if (!isEditing) {
    return (
      <>
        <div>
          <h1 className="text-2xl font-bold">{subcontractor.name}</h1>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Contact: {subcontractor.contact}
              </p>
              <p className="text-sm text-muted-foreground">
                Phone: {subcontractor.phone}
              </p>
              <p className="text-sm text-muted-foreground">
                Email: {subcontractor.email}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {subcontractor.location}
              </p>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">
                  Lat: {subcontractor.latitude}, Long: {subcontractor.longitude}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} className="text-2xl font-bold" />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Geocoder
                        accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ""}
                        value={field.value}
                        onChange={field.onChange}
                        onRetrieve={handleRetrieve}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end space-x-4">
          <Button type="submit" disabled={updateMutation.status === "pending"}>
            {updateMutation.status === "pending" ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
