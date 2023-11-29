import { memo, useCallback } from 'react';
import Image from 'next/image';
import { PARTNERS_IMAGES } from './constants';

const PartnersMarquee: React.FC = () => {
    const renderMarqueeItem = useCallback((image: string, index: number) => {
        return (
            <div
                key={index}
                className=" mr-6 inline-flex w-[10.625rem] rounded-lg border-border bg-background/30 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/30 dark:bg-white dark:backdrop-blur-none"
            >
                <Image
                    className="h-[80px] w-[250px] object-contain "
                    src={`/images/${image}`}
                    width={500}
                    height={80}
                    alt="Partners"
                />
            </div>
        );
    }, []);

    return (
        <div className="absolute left-[0] flex min-w-[200vw] animate-marquee whitespace-nowrap">
            {[...PARTNERS_IMAGES].map(renderMarqueeItem)}
            {[...PARTNERS_IMAGES].map(renderMarqueeItem)}
            {[...PARTNERS_IMAGES].map(renderMarqueeItem)}
            {[...PARTNERS_IMAGES].map(renderMarqueeItem)}
        </div>
    );
};

export default memo(PartnersMarquee);
