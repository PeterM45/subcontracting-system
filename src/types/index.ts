import { z } from "zod";
import type { RouterOutputs } from "~/trpc/react";
import type { ServiceType, MaterialType } from "./constants";

// Zod schema for AdditionalCostType
export const additionalCostSchema = z.object({
  name: z.string().min(1, "Cost name is required"),
  amount: z.number().nonnegative("Amount must be non-negative"),
  isPercentage: z.boolean(),
  description: z.string().optional(),
});
export type AdditionalCostType = z.infer<typeof additionalCostSchema>;

// Zod schema for RateStructure
export const rateStructureSchema = z
  .object({
    flatRate: z.number().positive("Flat rate must be positive").optional(),
    baseRate: z.number().positive("Base rate must be positive").optional(),
    dumpFee: z.number().nonnegative("Dump fee must be non-negative").optional(),
    rentalRate: z
      .number()
      .nonnegative("Rental rate must be non-negative")
      .optional(),
    additionalCosts: z.array(additionalCostSchema).default([]),
  })
  .superRefine((data, ctx) => {
    const hasFlatRate = data.flatRate !== undefined && data.flatRate !== null;
    const hasBaseRate = data.baseRate !== undefined && data.baseRate !== null;

    if (hasFlatRate && hasBaseRate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cannot define both flatRate and baseRate. Choose one.",
        path: ["flatRate"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cannot define both flatRate and baseRate. Choose one.",
        path: ["baseRate"],
      });
    }

    if (!hasFlatRate && !hasBaseRate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either flatRate or baseRate must be defined.",
        path: ["baseRate"],
      });
    }

    if (hasFlatRate && data.dumpFee !== undefined && data.dumpFee !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Dump fee should not be defined separately when a flatRate is provided.",
        path: ["dumpFee"],
      });
    }
  });
export type RateStructure = z.infer<typeof rateStructureSchema>;

export type Rate = RouterOutputs["rate"]["getBySubcontractor"][0];
export type Subcontractor = NonNullable<
  RouterOutputs["subcontractor"]["getById"]
>;

export type GeocoderResult = {
  properties: {
    full_address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
};

export type ServiceRequestData = {
  id: number;
  address: string;
  binSize: number;
  serviceType: ServiceType;
  materialType: MaterialType;
  scheduledStart: Date;
  scheduledRemoval: Date | null;
  specialInstructions: string | null;
  appliedRateStructure: RateStructure;
  serviceStartDate: Date;
  customer: {
    name: string;
    email: string | null;
    phone: string | null;
  };
  subcontractor: {
    name: string;
    contact: string | null;
    phone: string | null;
    email: string | null;
  };
};
