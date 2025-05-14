import {
  ServiceTypeMap,
  MaterialTypeMap,
  type ServiceType,
  type MaterialType,
} from "../types/constants";

export const formatServiceType = (type: ServiceType) => ServiceTypeMap[type];

export const formatMaterialType = (type: MaterialType) => MaterialTypeMap[type];

export const formatCurrency = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD",
  }).format(amount);
};
