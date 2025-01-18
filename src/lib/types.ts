import { z } from "zod";
import type { RouterOutputs } from "~/trpc/react";

export type Rate = RouterOutputs["rate"]["getBySubcontractor"][0];
export type Subcontractor = NonNullable<
  RouterOutputs["subcontractor"]["getById"]
>;

export const updateSubcontractorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contact: z.string().min(1, "Contact is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  location: z.string().min(1, "Location is required"),
  latitude: z.string(),
  longitude: z.string(),
});

export type RateFormData = {
  binSize: number;
  serviceType: "rolloff" | "frontend";
  materialType: "waste" | "recycling" | "concrete" | "dirt" | "mixed";
  baseRate: number;
  dumpFee?: number;
  rentalRate?: number;
  additionalCost?: number;
  effectiveDate: string;
  expiryDate?: string;
  notes?: string;
};

export type UpdateSubcontractorForm = z.infer<typeof updateSubcontractorSchema>;

export type GeocoderResult = {
  properties: {
    full_address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
};

export const ServiceType = ["rolloff", "frontend"] as const;
export const MaterialType = [
  "waste",
  "recycling",
  "concrete",
  "dirt",
  "mixed",
] as const;

export type ServiceType = (typeof ServiceType)[number];
export type MaterialType = (typeof MaterialType)[number];

export type AdditionalCostType = {
  name: string;
  amount: number;
  isPercentage: boolean;
  description?: string;
};

// Types for the rate structure
export type RateStructure = {
  // If flatRate is present, baseRate and dumpFee should not be
  flatRate?: number;
  // If baseRate is present, flatRate should not be
  baseRate?: number;
  dumpFee?: number;
  // Optional rental rate
  rentalRate?: number;
  // Array of additional costs
  additionalCosts: AdditionalCostType[];
};
