import * as React from "react";
import { Root as LabelRoot } from "@radix-ui/react-label";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/utils/common";
import { LABEL_VARIANTS } from "./constants";

const Label = React.forwardRef<
  React.ElementRef<typeof LabelRoot>,
  React.ComponentPropsWithoutRef<typeof LabelRoot> &
    VariantProps<typeof LABEL_VARIANTS>
>(({ className, ...props }, ref) => (
  <LabelRoot ref={ref} className={cn(LABEL_VARIANTS(), className)} {...props} />
));
Label.displayName = LabelRoot.displayName;

export { Label };
