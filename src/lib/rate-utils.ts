import type { RateStructure } from "~/types/index";

export const calculateTotalCost = (rateStructure: RateStructure): number => {
  let baseAmount = 0;

  if (rateStructure.flatRate !== undefined) {
    baseAmount = rateStructure.flatRate;
  } else if (rateStructure.baseRate !== undefined) {
    baseAmount = rateStructure.baseRate + (rateStructure.dumpFee ?? 0);
  }

  if (rateStructure.rentalRate !== undefined) {
    baseAmount += rateStructure.rentalRate;
  }

  return rateStructure.additionalCosts.reduce((total, cost) => {
    const costAmount = cost.isPercentage
      ? baseAmount * (cost.amount / 100)
      : cost.amount;
    return total + costAmount;
  }, baseAmount);
};

export const validateRateStructure = (
  rateStructure: RateStructure,
): boolean => {
  if (
    rateStructure.flatRate !== undefined &&
    rateStructure.baseRate !== undefined
  ) {
    return false;
  }

  if (
    rateStructure.flatRate === undefined &&
    rateStructure.baseRate === undefined
  ) {
    return false;
  }

  return rateStructure.additionalCosts.every(
    (cost) =>
      typeof cost.amount === "number" &&
      typeof cost.isPercentage === "boolean" &&
      cost.amount >= 0,
  );
};
