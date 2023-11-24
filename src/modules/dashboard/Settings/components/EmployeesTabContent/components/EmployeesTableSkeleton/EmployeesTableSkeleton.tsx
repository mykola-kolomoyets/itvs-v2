import { Skeleton } from '@/components/Skeleton';

const EmployeesTableSkeleton: React.FC = () => {
    return (
        <div className="container mt-6">
            <div className="mb-6">
                <Skeleton className="mb-[6px] h-[20px] w-[46px]" />
                <Skeleton className="h-[40px] w-[384px] " />
            </div>
            <Skeleton className="mb-[2px] h-[40px] w-full rounded-t-lg" />
            <Skeleton className="mb-[2px] h-[58px] w-full" />
            <Skeleton className="mb-[2px] h-[58px] w-full" />
            <Skeleton className="mb-[2px] h-[58px] w-full" />
            <Skeleton className="mb-[2px] h-[58px] w-full" />
        </div>
    );
};

export default EmployeesTableSkeleton;
