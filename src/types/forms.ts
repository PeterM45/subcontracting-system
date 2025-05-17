import { z } from "zod";
import { ServiceTypeValues, MaterialTypeValues } from "./constants";

export const updateSubcontractorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contact: z.string().min(1, "Contact is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  location: z.string().min(1, "Location is required"),
  latitude: z.string(), // Keep as string for form input, convert/validate elsewhere if needed
  longitude: z.string(), // Keep as string for form input, convert/validate elsewhere if needed
});

export type UpdateSubcontractorForm = z.infer<typeof updateSubcontractorSchema>;

export const rateFormSchema = z
  .object({
    binSize: z.coerce.number().positive("Bin size must be positive"),
    serviceType: z.enum(ServiceTypeValues),
    materialType: z.enum(MaterialTypeValues),

    // To handle the either/or logic for rate types
    rateType: z.enum(["flat", "base_dump"], {
      message: "Rate type is required",
    }),
    flatRate: z.coerce.number().positive().optional(),
    liftRate: z.coerce.number().positive().optional(),
    dumpFee: z.coerce.number().nonnegative().optional(), // Can be 0

    rentalRate: z.coerce
      .number()
      .nonnegative("Rental rate must be non-negative")
      .optional(),

    additionalCosts: z
      .array(
        z.object({
          name: z.string().min(1, "Cost name is required"),
          amount: z.coerce.number().nonnegative("Amount must be non-negative"),
          isPercentage: z.boolean(),
          description: z.string().optional(),
        }),
      )
      .optional()
      .default([]),

    effectiveDate: z.string().refine((val) => val && !isNaN(Date.parse(val)), {
      message: "Effective date is required",
    }),
    // Allow empty string for optional clearable field, then refine
    expiryDate: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined || val === "" || (val && !isNaN(Date.parse(val))),
        {
          message: "Invalid date format for expiry date",
        },
      ),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.rateType === "flat") {
      if (data.flatRate === undefined || data.flatRate === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Flat rate is required when rate type is 'flat'",
          path: ["flatRate"],
        });
      }
      // Ensure liftRate and dumpFee are not set if flatRate is chosen
      if (data.liftRate !== undefined || data.dumpFee !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Lift rate and dump fee should not be set when rate type is 'flat'. Clear these fields or change rate type.",
          path: ["rateType"], // General path as it concerns the choice
        });
      }
    } else if (data.rateType === "base_dump") {
      if (data.liftRate === undefined || data.liftRate === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Lift rate is required when rate type is 'base_dump'",
          path: ["liftRate"],
        });
      }
      // Dump fee can be optional (e.g. 0) with base_dump
      // Ensure flatRate is not set if base_dump is chosen
      if (data.flatRate !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Flat rate should not be set when rate type is 'base_dump'. Clear this field or change rate type.",
          path: ["rateType"], // General path as it concerns the choice
        });
      }
    }
  });

export type RateFormData = z.infer<typeof rateFormSchema>;
