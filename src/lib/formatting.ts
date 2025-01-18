export const formatServiceType = (type: "rolloff" | "frontend") =>
  ({
    rolloff: "Roll Off",
    frontend: "Front End",
  })[type];

export const formatMaterialType = (
  type: "waste" | "recycling" | "concrete" | "dirt" | "mixed",
) =>
  ({
    waste: "Waste",
    recycling: "Recycling",
    concrete: "Concrete",
    dirt: "Dirt",
    mixed: "Mixed",
  })[type];

export const formatCurrency = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD",
  }).format(amount);
};
