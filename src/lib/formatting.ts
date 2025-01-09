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
