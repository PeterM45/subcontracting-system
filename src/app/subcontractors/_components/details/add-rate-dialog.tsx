import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "~/trpc/react";
import type { Subcontractor } from "@/types/index";
import {
  ServiceTypeValues,
  MaterialTypeValues,
  ServiceTypeMap,
  MaterialTypeMap,
} from "@/types/constants";
import { type RateFormData, rateFormSchema } from "@/types/forms";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";

export function AddRateDialog({
  subcontractor,
}: {
  subcontractor: Subcontractor;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<RateFormData>({
    resolver: zodResolver(rateFormSchema),
    defaultValues: {
      binSize: undefined,
      serviceType: undefined,
      materialType: undefined,
      rateType: "base_dump",
      flatRate: undefined,
      liftRate: undefined,
      dumpFee: undefined,
      rentalRate: undefined,
      additionalCosts: [],
      effectiveDate: "",
      expiryDate: "",
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "additionalCosts",
  });

  const utils = api.useUtils();
  const watchedRateType = form.watch("rateType");

  const addRateMutation = api.rate.create.useMutation({
    onSuccess: async () => {
      await utils.rate.getBySubcontractor.invalidate({
        subcontractorId: subcontractor.id,
      });
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.error("Failed to add rate:", error);
    },
  });

  const onSubmit = (data: RateFormData) => {
    const rateStructurePayload: {
      flatRate?: number;
      liftRate?: number;
      dumpFee?: number;
      rentalRate?: number;
      additionalCosts: typeof data.additionalCosts;
    } = {
      rentalRate: data.rentalRate,
      additionalCosts: data.additionalCosts.map((cost) => ({
        ...cost,
        amount: cost.amount,
      })),
    };

    if (data.rateType === "flat") {
      rateStructurePayload.flatRate = data.flatRate;
    } else {
      rateStructurePayload.liftRate = data.liftRate;
      if (data.dumpFee !== undefined && data.dumpFee !== null) {
        rateStructurePayload.dumpFee = data.dumpFee;
      }
    }

    addRateMutation.mutate({
      subcontractorId: subcontractor.id,
      binSize: data.binSize,
      serviceType: data.serviceType,
      materialType: data.materialType,
      rateStructure: rateStructurePayload,
      effectiveDate: new Date(data.effectiveDate),
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
      notes: data.notes,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Rate</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Rate</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="binSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bin Size (Yards)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 20"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : parseFloat(e.target.value),
                          )
                        }
                        value={field.value ?? ""}
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

            <FormField
              control={form.control}
              name="rateType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (value === "flat") {
                        form.setValue("liftRate", undefined);
                        form.setValue("dumpFee", undefined);
                        form.clearErrors(["liftRate", "dumpFee"]);
                      } else if (value === "base_dump") {
                        form.setValue("flatRate", undefined);
                        form.clearErrors("flatRate");
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rate type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="flat">Flat Rate</SelectItem>
                      <SelectItem value="base_dump">Base + Dump Fee</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchedRateType === "flat" && (
              <FormField
                control={form.control}
                name="flatRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flat Rate</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter flat rate"
                        {...field}
                        value={field.value ?? ""} // Ensure string for input value if undefined/null
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(
                            val === "" ? undefined : parseFloat(val),
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {watchedRateType === "base_dump" && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="liftRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lift Rate</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter lift rate"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(
                              val === "" ? undefined : parseFloat(val),
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
                          placeholder="Enter dump fee"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(
                              val === "" ? undefined : parseFloat(val),
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <FormField
              control={form.control}
              name="rentalRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Rental Rate (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter daily rental rate"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(
                          val === "" ? undefined : parseFloat(val),
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Additional Costs Section */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-medium">Additional Costs</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      name: "",
                      amount: 0, // Stays undefined, Zod coerces to 0
                      isPercentage: false,
                      description: "",
                    })
                  }
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Cost
                </Button>
              </div>
              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No additional costs defined.
                </p>
              )}
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="mt-3 space-y-3 rounded-md border p-4"
                >
                  <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`additionalCosts.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Fuel Surcharge"
                              {...field}
                            />
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
                              placeholder="Enter amount"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                field.onChange(
                                  val === "" ? undefined : parseFloat(val),
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`additionalCosts.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of the cost"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center justify-between pt-2">
                    <FormField
                      control={form.control}
                      name={`additionalCosts.${index}.isPercentage`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              id={`additionalCosts.${index}.isPercentage`}
                            />
                          </FormControl>
                          <FormLabel
                            htmlFor={`additionalCosts.${index}.isPercentage`}
                            className="!mt-0 cursor-pointer text-sm font-normal"
                          >
                            {watchedRateType === "flat"
                              ? "Percentage of Flat Rate"
                              : watchedRateType === "base_dump"
                                ? "Percentage of Lift Rate + Dump Fee"
                                : "Is Percentage"}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="mr-1 h-4 w-4" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <FormField
              control={form.control}
              name="effectiveDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Effective Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expiry Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                        }
                      />
                    </PopoverContent>
                  </Popover>
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
                    <Textarea
                      placeholder="Any additional notes for this rate..."
                      className="resize-none"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={addRateMutation.isPending}>
                {addRateMutation.isPending ? "Adding..." : "Add Rate"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
