import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import type { MarkdownProps } from './types';
import { cn } from '@/utils/common';
import Image from 'next/image';

const Markdown: React.FC<MarkdownProps> = ({ children }) => {
    return (
        <ReactMarkdown
            className="text-foreground"
            components={{
                h2(props) {
                    const { node: _, children, className, ...rest } = props;

                    return (
                        <h2 className={cn('my-4 text-2xl font-semibold', className)} {...rest}>
                            {children}
                        </h2>
                    );
                },
                p(props) {
                    const { node: _, children, className, ...rest } = props;

                    return (
                        <p className={cn('mb-2 text-base', className)} {...rest}>
                            {children}
                        </p>
                    );
                },
                a(props) {
                    const { node: _, children, className, ...rest } = props;

                    return (
                        <a
                            className={cn(
                                'text-blue-600 transition-colors hover:text-blue-400 hover:underline',
                                className
                            )}
                            {...rest}
                        >
                            {children}
                        </a>
                    );
                },
                img(props) {
                    const { node: _, children, className, width, height, src, placeholder: __, alt, ...___ } = props;

                    return (
                        <span className="my-5 flex justify-center">
                            <Image
                                src={src ?? '/images/placeholder.png'}
                                className={cn('mx-6 h-full w-full max-w-[640px] rounded-xl', className)}
                                loading="lazy"
                                alt={alt ?? 'Image'}
                                width={typeof width === 'number' ? width : 1280}
                                height={typeof height === 'number' ? height : 720}
                                // {...rest}
                            >
                                {children}
                            </Image>
                        </span>
                    );
                },
            }}
        >
            {children}
        </ReactMarkdown>
    );
};

export default memo(Markdown);
