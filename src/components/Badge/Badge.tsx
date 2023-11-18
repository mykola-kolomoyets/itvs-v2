import * as React from "react";
import type { BadgeProps } from "./types";
import { cn } from "@/utils/common";
import { badgeVariants } from "./constants";

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
