"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
// import { Geocoder } from "@mapbox/search-js-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "~/hooks/use-toast";
import { useState } from "react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { GeocoderProps } from "@mapbox/search-js-react/dist/components/Geocoder";
import type { GeocoderResult } from "~/lib/types";

const Geocoder = dynamic(
  () =>
    import("@mapbox/search-js-react").then((mod) => mod.Geocoder) as Promise<
      ComponentType<GeocoderProps>
    >,
  { ssr: false },
);

const formSchema = z.object({
  name: z.string().min(1, "Required"),
  contact: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  location: z.string().min(1, "Please enter a valid address"),
  latitude: z.number(),
  longitude: z.number(),
  notes: z.string().optional(),
});

export function CreateSubcontractorDialog() {
  const { toast } = useToast();
  const utils = api.useContext();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact: "",
      phone: "",
      email: "",
      location: "",
      latitude: 0,
      longitude: 0,
      notes: "",
    },
  });

  const { mutate, status } = api.subcontractor.create.useMutation({
    onSuccess: async () => {
      toast({ description: "Subcontractor created" });
      form.reset();
      await utils.subcontractor.getAll.invalidate();
      setOpen(false);
    },
    onError: (error) => {
      toast({ variant: "destructive", description: error.message });
    },
  });

  const handleRetrieve = (res: GeocoderResult) => {
    const {
      full_address,
      coordinates: { latitude, longitude },
    } = res.properties;
    form.setValue("location", full_address);
    form.setValue("latitude", latitude);
    form.setValue("longitude", longitude);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Subcontractor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Subcontractor</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => mutate(data))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name * </FormLabel>
                  <FormControl>
                    <Input placeholder="Company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="Primary contact name" {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <Input placeholder="Phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location *</FormLabel>
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

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={status === "pending"}>
                {status === "pending" ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
