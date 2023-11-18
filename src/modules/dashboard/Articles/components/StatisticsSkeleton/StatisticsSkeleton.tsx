import { Skeleton } from "@/components/Skeleton";

const StatisticsSkeleton: React.FC = () => {
  return (
    <div className="flex">
      <Skeleton className=" mr-4 h-[148px] w-[250px] rounded-lg" />
      <Skeleton className="h-[148px] w-[250px] rounded-lg" />
    </div>
  );
};

export default StatisticsSkeleton;
