import type { RouterOutputs } from "~/trpc/react";

export type Rate = RouterOutputs["rate"]["getBySubcontractor"][0];
export type Subcontractor = NonNullable<
  RouterOutputs["subcontractor"]["getById"]
>;
export type SubcontractorFormData = {
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
