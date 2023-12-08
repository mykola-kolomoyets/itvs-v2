import { useState, useLayoutEffect } from 'react';

export const useWindowScroll = () => {
    const [state, setState] = useState({
        x: 0,
        y: 0,
    });

    useLayoutEffect(() => {
        const scrollHandler = () => {
            setState({ x: window.scrollX, y: window.scrollY });
        };

        scrollHandler();
        window.addEventListener('scroll', scrollHandler, { passive: true });

        return () => {
            window.removeEventListener('scroll', scrollHandler);
        };
    }, []);

    return state;
};
