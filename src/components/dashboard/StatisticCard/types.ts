import { WithClassName } from "@/types";

export type StatisticCardProps = WithClassName<{
  title: string;
  description?: string;
  value: string | number;
  isLoading?: boolean;
}>;
