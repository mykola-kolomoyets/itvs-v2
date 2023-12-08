import { memo, useCallback, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { useWindowScroll } from '@/hooks/useWindowScroll';
import { useEffectEvent } from '@/hooks/useEffectEvent';
import { useToggle } from '@/hooks/useToggle';
import { cn } from '@/utils/common';
import { START_SCROLL_Y } from './constants';
import { Button } from '@/components/Button';

const ScrollToTop: React.FC = () => {
    const [isActive, , setIsActive] = useToggle();
    const previousScrollYRef = useRef<number>(0);
    const { y } = useWindowScroll();

    const scrollYEffectEvent = useEffectEvent((positionY: number) => {
        setIsActive(y >= START_SCROLL_Y);
        // if (positionY < previousScrollYRef.current && positionY >= START_SCROLL_Y && !isActive) {
        //     setIsActive(true);
        // } else if ((positionY >= previousScrollYRef.current && isActive) || (positionY < START_SCROLL_Y && isActive)) {
        //     setIsActive(false);
        // }

        previousScrollYRef.current = positionY;
    });

    const scrollToTopHandler = useCallback(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, []);

    useEffect(() => {
        console.log(y);
        scrollYEffectEvent(y);
    }, [scrollYEffectEvent, y]);

    return (
        <Button
            className={cn('z-1 pointer-events-none fixed bottom-5 right-5 opacity-0 transition-opacity', {
                'pointer-events-auto z-30 opacity-100': isActive,
            })}
            variant="outline"
            size="icon"
            tabIndex={isActive ? undefined : -1}
            aria-hidden={isActive ? undefined : true}
            onClick={scrollToTopHandler}
        >
            <ArrowUp size={16} />
        </Button>
    );
};

export default memo(ScrollToTop);
