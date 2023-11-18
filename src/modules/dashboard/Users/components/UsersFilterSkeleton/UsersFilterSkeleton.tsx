import { Skeleton } from "@/components/Skeleton";

const UsersFilterSkeleton: React.FC = () => {
  return (
    <>
      <div className="mb-6">
        <Skeleton className="mb-[6px] h-[20px] w-[46px]" />
        <Skeleton className="h-[40px] w-[384px] " />
      </div>
      <div className="mb-6 ml-2">
        <Skeleton className="mb-[6px] h-[20px] w-[46px]" />
        <Skeleton className="h-[40px] w-[200px] " />
      </div>
    </>
  );
};

export default UsersFilterSkeleton;
