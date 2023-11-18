import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import type { ButtonProps } from "./types";
import { cn } from "@/utils/common";
import { BUTTON_VARIANTS } from "./constants";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(BUTTON_VARIANTS({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, BUTTON_VARIANTS as buttonVariants };
