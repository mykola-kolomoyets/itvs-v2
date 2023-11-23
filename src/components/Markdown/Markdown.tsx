import { memo } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import type { MarkdownProps } from './types';
import { cn } from '@/utils/common';

const Markdown: React.FC<MarkdownProps> = ({ children }) => {
    return (
        <ReactMarkdown
            className="text-foreground"
            components={{
                h1(props) {
                    const { node: _, children, className, ...rest } = props;

                    return (
                        <h1 className={cn('my-4 text-4xl font-semibold', className)} {...rest}>
                            {children}
                        </h1>
                    );
                },
                h2(props) {
                    const { node: _, children, className, ...rest } = props;

                    return (
                        <h2 className={cn('my-4 text-2xl font-semibold', className)} {...rest}>
                            {children}
                        </h2>
                    );
                },
                h3(props) {
                    const { node: _, children, className, ...rest } = props;

                    return (
                        <h3 className={cn('my-4 text-xl font-semibold', className)} {...rest}>
                            {children}
                        </h3>
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
                li(props) {
                    const { node: _, children, className, ...rest } = props;

                    return (
                        <li className={cn('mb-2 text-base', className)} {...rest}>
                            -&nbsp;{children}
                        </li>
                    );
                },
                blockquote(props) {
                    const { node: _, ...rest } = props;
                    return (
                        <blockquote
                            {...rest}
                            className="border-opacity-8 bg-dark bg-opacity-3 mt-4 border-l-4 border-solid border-l-muted-foreground px-4 pt-4 font-semibold"
                        />
                    );
                },
            }}
        >
            {children}
        </ReactMarkdown>
    );
};

export default memo(Markdown);