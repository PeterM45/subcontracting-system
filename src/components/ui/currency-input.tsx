import * as React from "react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChange?: (value: number | null) => void;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, onChange, value, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      if (!value) {
        onChange?.(null);
        return;
      }

      // Remove all non-numeric characters except decimal point
      const cleaned = value.replace(/[^\d.-]/g, "");

      // Ensure only one decimal point and valid number format
      if (/^-?\d*\.?\d{0,2}$/.test(cleaned)) {
        const numValue = parseFloat(cleaned);
        if (!isNaN(numValue)) {
          onChange?.(numValue);
        }
      }
    };

    // Format the display value
    const displayValue =
      value != null
        ? typeof value === "number"
          ? value.toFixed(2)
          : value
        : "";

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          $
        </span>
        <Input
          {...props}
          ref={ref}
          type="text"
          inputMode="decimal"
          value={displayValue}
          className={cn(
            "pl-6 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            className,
          )}
          onChange={handleChange}
        />
      </div>
    );
  },
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
