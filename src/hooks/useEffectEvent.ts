import { useCallback, useLayoutEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useEffectEvent = <T extends (...args: any[]) => any>(fn: T) => {
    const fnRef = useRef(fn);

    useLayoutEffect(() => {
        fnRef.current = fn;
    }, [fn]);

    const eventCb = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (...args: any[]) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return fnRef.current.apply(null, args);
        },
        [fnRef]
    );

    return eventCb as unknown as T;
};
