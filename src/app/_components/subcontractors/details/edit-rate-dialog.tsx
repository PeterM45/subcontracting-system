import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil } from "lucide-react";
import { api } from "~/trpc/react";
import { useForm } from "react-hook-form";
import type { DefaultValues } from "react-hook-form";
import type { Rate, SubcontractorFormData } from "~/lib/types";
import { formatMaterialType, formatServiceType } from "~/lib/formatting";

export function EditRateDialog({ rate }: { rate: Rate }) {
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();

  // Create defaultValues helper function
  const getDefaultValues = () => ({
    binSize: rate.binSize,
    serviceType: rate.serviceType,
    materialType: rate.materialType,
    baseRate: Number(rate.baseRate),
    dumpFee: rate.dumpFee ? Number(rate.dumpFee) : undefined,
    rentalRate: rate.rentalRate ? Number(rate.rentalRate) : undefined,
    additionalCost: rate.additionalCost
      ? Number(rate.additionalCost)
      : undefined,
    effectiveDate: rate.effectiveDate.toISOString().split("T")[0],
    expiryDate: rate.expiryDate
      ? rate.expiryDate.toISOString().split("T")[0]
      : undefined,
    notes: rate.notes ?? undefined,
  });

  const form = useForm<SubcontractorFormData>({
    defaultValues: getDefaultValues() as DefaultValues<SubcontractorFormData>,
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues());
    }
  }, [open, rate]);

  const editRate = api.rate.update.useMutation({
    onSuccess: async () => {
      await utils.rate.getBySubcontractor.invalidate({
        subcontractorId: rate.subcontractorId,
      });
      setOpen(false);
    },
  });

  const onSubmit = (data: SubcontractorFormData) => {
    editRate.mutate({
      id: rate.id,
      ...data,
      effectiveDate: new Date(data.effectiveDate),
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
      baseRate: Number(data.baseRate),
      dumpFee: data.dumpFee ? Number(data.dumpFee) : undefined,
      rentalRate: data.rentalRate ? Number(data.rentalRate) : undefined,
      additionalCost: data.additionalCost
        ? Number(data.additionalCost)
        : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Rate</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="binSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bin Size</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value),
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
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
                      <SelectItem value="rolloff">
                        {formatServiceType("rolloff")}
                      </SelectItem>
                      <SelectItem value="frontend">
                        {formatServiceType("frontend")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="materialType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Type</FormLabel>
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
                      <SelectItem value="waste">
                        {formatMaterialType("waste")}
                      </SelectItem>
                      <SelectItem value="recycling">
                        {formatMaterialType("recycling")}
                      </SelectItem>
                      <SelectItem value="concrete">
                        {formatMaterialType("concrete")}
                      </SelectItem>
                      <SelectItem value="dirt">
                        {formatMaterialType("dirt")}
                      </SelectItem>
                      <SelectItem value="mixed">
                        {formatMaterialType("mixed")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="baseRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Rate</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value),
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dumpFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dump Fee (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value),
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rentalRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rental Rate (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value),
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Rate (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value),
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="effectiveDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Effective Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={editRate.status === "pending"}>
                {editRate.status === "pending" ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
