import { Skeleton } from "@/components/Skeleton";

const UsersTableSkeleton: React.FC = () => {
  return (
    <div className="container">
      <Skeleton className="mb-[2px] h-[40px] w-full rounded-t-lg" />
      <Skeleton className="mb-[2px] h-[58px] w-full" />
      <Skeleton className="mb-[2px] h-[58px] w-full" />
      <Skeleton className="mb-[2px] h-[58px] w-full" />
      <Skeleton className="mb-[2px] h-[58px] w-full" />
    </div>
  );
};

export default UsersTableSkeleton;
