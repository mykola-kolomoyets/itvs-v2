import type { SubjectCardDataItemProps } from './types';
import { cn } from '@/utils/common';

const SubjectCardDataItem: React.FC<SubjectCardDataItemProps> = ({ className, label, value }) => {
    return (
        <p className={cn('text-base', className)}>
            <span className="text-muted-foreground">{label}: </span>
            {value}
        </p>
    );
};

export default SubjectCardDataItem;
