import type { VariantProps } from "class-variance-authority";
import { badgeVariants } from "./constants";

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;
