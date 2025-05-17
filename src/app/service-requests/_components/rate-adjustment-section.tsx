"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "~/components/ui/form";
import { Card } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { CurrencyInput } from "~/components/ui/currency-input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useWatch } from "react-hook-form";
import type { Control } from "react-hook-form";
import type { FormValues } from "./new-service-request-form";

interface RateAdjustmentSectionProps {
  control: Control<FormValues>;
}

export function RateAdjustmentSection({ control }: RateAdjustmentSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "appliedAdditionalCosts",
  });

  const rateType = useWatch({
    control,
    name: "rateType",
    defaultValue: "liftAndDump",
  });

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold">Rate Details</h2>
      <div className="space-y-6">
        {/* Rate Type Selection */}
        <FormField
          control={control}
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
                    <Label htmlFor="liftAndDump">Lift Rate + Dump Fee</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Rate Fields */}
        <div className="grid gap-4 md:grid-cols-2">
          {rateType === "flat" ? (
            <FormField
              control={control}
              name="appliedFlatRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Flat Rate *</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      placeholder="0.00"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    All-inclusive rate for the service
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <>
              <FormField
                control={control}
                name="appliedLiftRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lift Rate *</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        placeholder="0.00"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Lift rate for the service request
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="appliedDumpFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dump Fee</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        placeholder="0.00"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={control}
            name="appliedRentalRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Daily Rental Rate</FormLabel>
                <FormControl>
                  <CurrencyInput
                    placeholder="0.00"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
            <Card key={field.id} className="p-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`appliedAdditionalCosts.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`appliedAdditionalCosts.${index}.amount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <CurrencyInput
                            placeholder="0.00"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <FormField
                    control={control}
                    name={`appliedAdditionalCosts.${index}.isPercentage`}
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
            </Card>
          ))}
        </div>

        {/* Special Instructions */}
        <FormField
          control={control}
          name="specialInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Instructions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any special instructions or notes..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Card>
  );
}
