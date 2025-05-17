export const ServiceTypeValues = ["rolloff"] as const;
export const MaterialTypeValues = [
  "waste",
  "recycling",
  "concrete",
  "dirt",
  "mixed_waste",
] as const;

export type ServiceType = (typeof ServiceTypeValues)[number];
export type MaterialType = (typeof MaterialTypeValues)[number];

export const ServiceTypeMap: Record<ServiceType, string> = {
  rolloff: "Roll Off",
};

export const MaterialTypeMap: Record<MaterialType, string> = {
  waste: "Waste",
  recycling: "Recycling",
  concrete: "Concrete",
  dirt: "Dirt",
  mixed_waste: "Mixed Waste",
};
