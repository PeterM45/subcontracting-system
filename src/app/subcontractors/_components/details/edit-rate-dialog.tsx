import { useState, useEffect, useCallback } from "react"; // Added useCallback
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFieldArray, useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import type { Rate } from "~/types";
import {
  ServiceTypeValues,
  MaterialTypeValues,
  ServiceTypeMap,
  MaterialTypeMap,
} from "~/types/constants";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Form validation schema (same as AddRateDialog)
const additionalCostSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.number().min(0, "Amount must be positive"),
  isPercentage: z.boolean(),
  description: z.string().optional(),
});

const formSchema = z
  .object({
    binSize: z.number().min(1, "Bin size is required"),
    serviceType: z.enum(ServiceTypeValues),
    materialType: z.enum(MaterialTypeValues),
    rateType: z.enum(["flat", "liftAndDump"]),
    flatRate: z.number().optional(),
    liftRate: z.number().optional(),
    dumpFee: z.number().optional(),
    rentalRate: z.number().optional(),
    additionalCosts: z.array(additionalCostSchema),
    effectiveDate: z.string().min(1, "Effective date is required"),
    expiryDate: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.rateType === "flat") {
        return data.flatRate !== undefined;
      } else {
        return data.liftRate !== undefined;
      }
    },
    {
      message: "Please provide the required rate information",
      path: ["rateType"],
    },
  );

type FormData = z.infer<typeof formSchema>;

export function EditRateDialog({ rate }: { rate: Rate }) {
  const [open, setOpen] = useState(false);

  // Create defaultValues helper function, memoized with useCallback
  const getDefaultValues = useCallback((): FormData => {
    const rateStructure = rate.rateStructure;
    return {
      binSize: rate.binSize,
      serviceType: rate.serviceType,
      materialType: rate.materialType,
      rateType: rateStructure.flatRate !== undefined ? "flat" : "liftAndDump",
      flatRate: rateStructure.flatRate,
      liftRate: rateStructure.liftRate,
      dumpFee: rateStructure.dumpFee,
      rentalRate: rateStructure.rentalRate,
      additionalCosts: rateStructure.additionalCosts,
      effectiveDate: rate.effectiveDate?.toISOString().split("T")[0] ?? "",
      expiryDate: rate.expiryDate
        ? rate.expiryDate.toISOString().split("T")[0]
        : undefined,
      notes: rate.notes ?? undefined,
    };
  }, [rate]); // Dependency: rate

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(), // Call it here for initial default values
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "additionalCosts",
  });

  // Reset form when dialog opens or rate changes, using memoized getDefaultValues
  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues());
    }
  }, [open, form, getDefaultValues]); // Dependencies: open, form, getDefaultValues

  const utils = api.useUtils();
  const rateType = form.watch("rateType");

  const editRate = api.rate.update.useMutation({
    onSuccess: async () => {
      await utils.rate.getBySubcontractor.invalidate({
        subcontractorId: rate.subcontractorId,
      });
      setOpen(false);
    },
  });

  const onSubmit = (data: FormData) => {
    // Construct the rate structure based on form data
    const rateStructure = {
      ...(data.rateType === "flat"
        ? { flatRate: data.flatRate }
        : {
            liftRate: data.liftRate,
            dumpFee: data.dumpFee,
          }),
      rentalRate: data.rentalRate,
      additionalCosts: data.additionalCosts,
    };

    editRate.mutate({
      id: rate.id,
      binSize: data.binSize,
      serviceType: data.serviceType,
      materialType: data.materialType,
      rateStructure,
      effectiveDate: new Date(data.effectiveDate),
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
      notes: data.notes,
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
            {/* Basic Information */}
            <div className="space-y-4">
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
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                        {ServiceTypeValues.map((type) => (
                          <SelectItem key={type} value={type}>
                            {ServiceTypeMap[type]}
                          </SelectItem>
                        ))}
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
                        {MaterialTypeValues.map((type) => (
                          <SelectItem key={type} value={type}>
                            {MaterialTypeMap[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Rate Type Selection */}
            <FormField
              control={form.control}
              name="rateType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Rate Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="flat" id="flat" />
                        <Label htmlFor="flat">Flat Rate</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="liftAndDump" id="liftAndDump" />
                        <Label htmlFor="liftAndDump">
                          Lift Rate + Dump Fee
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rate Fields */}
            {rateType === "flat" ? (
              <FormField
                control={form.control}
                name="flatRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flat Rate</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="liftRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lift Rate</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
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
                      <FormLabel>Dump Fee</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Rental Rate */}
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
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Costs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Additional Costs</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({ name: "", amount: 0, isPercentage: false })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Cost
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent className="pt-6">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`additionalCosts.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`additionalCosts.${index}.amount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <FormField
                          control={form.control}
                          name={`additionalCosts.${index}.isPercentage`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Percentage
                                </FormLabel>
                                <FormDescription>
                                  Is this a percentage of the base amount?
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Dates and Notes */}
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
