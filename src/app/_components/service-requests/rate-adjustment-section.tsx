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
import type { Control } from "react-hook-form";
import type { FormValues } from "./new-service-request-form";

interface RateAdjustmentSectionProps {
  control: Control<FormValues>;
}

export function RateAdjustmentSection({ control }: RateAdjustmentSectionProps) {
  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold">Rate Details</h2>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="appliedBaseRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base Rate *</FormLabel>
                <FormControl>
                  <CurrencyInput
                    placeholder="0.00"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Base rate for the service request
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

          <FormField
            control={control}
            name="appliedAdditionalCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Costs</FormLabel>
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
