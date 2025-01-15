import * as React from "react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChange?: (value: number | null) => void;
  allowDecimals?: boolean;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, onChange, allowDecimals = false, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      if (!value) {
        onChange?.(null);
        return;
      }

      // Allow negative numbers, decimals if enabled, and handle backspace
      const regex = allowDecimals ? /^-?\d*\.?\d*$/ : /^-?\d*$/;

      if (regex.test(value)) {
        const numValue = allowDecimals ? parseFloat(value) : parseInt(value);
        if (!isNaN(numValue)) {
          onChange?.(numValue);
        }
      }
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode={allowDecimals ? "decimal" : "numeric"}
        className={cn(
          "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          className,
        )}
        onChange={handleChange}
      />
    );
  },
);

NumberInput.displayName = "NumberInput";

export { NumberInput };
