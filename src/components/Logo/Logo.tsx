import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { LogoProps } from './types';
import { cn } from '@/utils/common';

const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <Link className={cn('focus-primary isolate z-[99] mr-4 flex rounded-md', className)} href="/">
            <Image
                className="w-[80px] flex-shrink-0 dark:hidden"
                // src="/images/logo-light.svg"
                src="/images/logo-black.webp"
                width={80}
                height={28}
                alt="ITVS"
            />
            <Image
                className="hidden w-[80px] flex-shrink-0 dark:block"
                // src="/images/logo-dark.svg"
                src="/images/logo-white.webp"
                width={80}
                height={28}
                alt="ITVS"
            />
        </Link>
    );
};

export default memo(Logo);
