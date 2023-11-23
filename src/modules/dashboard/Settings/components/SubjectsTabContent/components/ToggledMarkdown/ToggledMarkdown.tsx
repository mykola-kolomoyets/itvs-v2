import { memo, useEffect, useRef, useState } from 'react';
import type { ToggledMarkdownProps } from './types';
import { useToggle } from '@/hooks/useToggle';
import { cn } from '@/utils/common';
import Markdown from '@/components/Markdown';
import { Button } from '@/components/Button';

const ToggledMarkdown: React.FC<ToggledMarkdownProps> = ({ children, className }) => {
    const markdownWrapperRef = useRef<React.ElementRef<'div'>>(null);
    const [markdownHeight, setMarkdownHeight] = useState(0);

    const [isOpened, toggleIsOpened] = useToggle();

    useEffect(() => {
        const markdownWrapperHeight = markdownWrapperRef.current?.getBoundingClientRect().height ?? 0;

        setMarkdownHeight(markdownWrapperHeight);
    }, []);

    return (
        <div>
            <div
                ref={markdownWrapperRef}
                className={cn('overflow-y-auto', className, {
                    'max-h-[150px]': !isOpened && markdownHeight > 150,
                    'max-h-[500px]': isOpened,
                })}
            >
                <Markdown>{children}</Markdown>
            </div>
            {markdownHeight > 150 ? (
                <Button
                    className="mt-2"
                    variant="outline"
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        toggleIsOpened();
                    }}
                >
                    {isOpened ? 'Згорнути' : 'Розгорнути'}
                </Button>
            ) : null}
        </div>
    );
};

export default memo(ToggledMarkdown);
