import * as React from "react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

interface CurrencyInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  value?: number | null; // Allow undefined for initial state
  onChange?: (value: number | null) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void; // Allow passing onBlur
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, onChange, onBlur, value: propValue, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState<string>("");

    // Effect to update internal state when propValue changes
    React.useEffect(() => {
      if (propValue === null || propValue === undefined) {
        if (inputValue !== "") {
          setInputValue("");
        }
      } else if (typeof propValue === "number" && !isNaN(propValue)) {
        const targetFormattedValue = propValue.toFixed(2);
        if (inputValue !== targetFormattedValue) {
          setInputValue(targetFormattedValue);
        }
      }
    }, [propValue, inputValue]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const currentVal = event.target.value;
      setInputValue(currentVal);

      if (currentVal === "" || currentVal === "-") {
        onChange?.(null);
        return;
      }

      // Allow only numbers, one decimal point, and a leading minus sign
      const regex = /^-?\d*\.?\d{0,2}$/;
      if (regex.test(currentVal)) {
        const numericValue = parseFloat(currentVal);
        if (!isNaN(numericValue)) {
          onChange?.(numericValue);
        } else if (currentVal.endsWith(".") || currentVal === "-") {
          onChange?.(null); // Or handle as per desired behavior for partial input
        }
      }
    };

    const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      const currentVal = inputValue;
      if (currentVal === "" || currentVal === "-") {
        setInputValue("");
        onChange?.(null);
      } else {
        const numericValue = parseFloat(currentVal);
        if (!isNaN(numericValue)) {
          setInputValue(numericValue.toFixed(2)); // Format to 2 decimal places on blur
          onChange?.(numericValue); // Ensure the final numeric value is propagated
        } else {
          setInputValue("");
          onChange?.(null);
        }
      }
      onBlur?.(event); // Call original onBlur if provided
    };

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          $
        </span>
        <Input
          {...props}
          ref={ref}
          type="text" // Use text to allow more flexible input
          inputMode="decimal"
          value={inputValue} // Controlled by internal state
          className={cn(
            "pl-6 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            className,
          )}
          onChange={handleChange}
          onBlur={handleInputBlur} // Use the new blur handler
        />
      </div>
    );
  },
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
