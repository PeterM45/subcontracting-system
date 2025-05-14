export const ServiceTypeValues = ["rolloff", "frontend"] as const;
export const MaterialTypeValues = [
  "waste",
  "recycling",
  "concrete",
  "dirt",
  "mixed",
] as const;

export type ServiceType = (typeof ServiceTypeValues)[number];
export type MaterialType = (typeof MaterialTypeValues)[number];

export const ServiceTypeMap: Record<ServiceType, string> = {
  rolloff: "Roll Off",
  frontend: "Front End",
};

export const MaterialTypeMap: Record<MaterialType, string> = {
  waste: "Waste",
  recycling: "Recycling",
  concrete: "Concrete",
  dirt: "Dirt",
  mixed: "Mixed",
};
