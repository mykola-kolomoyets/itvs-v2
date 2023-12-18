/* eslint-disable @next/next/no-img-element */
import { cn } from '@/utils/common';
import { Loader2 } from 'lucide-react';

const Img: React.FC<React.ComponentProps<'img'> & { wrapperClassName?: string }> = ({
    className,
    wrapperClassName,
    ...rest
}) => {
    return (
        <div className={cn('relative z-30 w-full overflow-hidden rounded-lg', wrapperClassName)}>
            <Loader2 className="-translate-1/2 absolute left-1/2 top-1/2 isolate z-[-1] animate-spin" size={32} />
            <img className={cn('z-30 object-cover object-center', className)} {...rest} alt={rest?.alt ?? 'image'} />
        </div>
    );
};

export default Img;
