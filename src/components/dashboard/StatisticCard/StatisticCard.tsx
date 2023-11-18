import { memo } from "react";
import type { StatisticCardProps } from "./types";
import { cn } from "@/utils/common";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Card";
import { Skeleton } from "@/components/Skeleton";

const StatisticCard: React.FC<StatisticCardProps> = ({
  className,
  title,
  value,
  description,
  isLoading,
}) => {
  return (
    <Card className={cn("w-[250px]", className)}>
      <CardHeader className="pb-2 pt-4">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[28px] w-full" />
        ) : (
          <p className="text-lg font-bold">{value}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(StatisticCard);
