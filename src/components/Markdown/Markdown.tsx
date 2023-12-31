import { memo } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { MarkdownProps } from './types';
import { cn } from '@/utils/common';

const Markdown: React.FC<MarkdownProps> = ({ children }) => {
    return (
        <ReactMarkdown
            className="text-foreground"
            remarkPlugins={[remarkGfm]}
            components={{
                h1(props) {
                    const { node: _, children, className, ...rest } = props;

                    return (
                        <h1 className={cn('my-4 text-4xl font-semibold', className)} {...rest}>
                            {children}
                        </h1>
                    );
                },
                table(props) {
                    const { node: _, className, ...rest } = props;

                    return <table className={cn('markdown-table', className)} {...rest} />;
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
                h4(props) {
                    const { node: _, children, className, ...rest } = props;

                    return (
                        <h4 className={cn('my-4 text-lg font-semibold', className)} {...rest}>
                            {children}
                        </h4>
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

                    let href = rest?.href;

                    if (!href?.startsWith('http') && !href?.startsWith('/')) {
                        href = `https://${href}`;
                    }

                    return (
                        <a
                            className={cn(
                                'text-accent-secondary outline-none transition-colors hover:text-accent-secondary hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring',
                                className
                            )}
                            {...rest}
                            target="_blank"
                            href={href}
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
                            >
                                {children}
                            </Image>
                        </span>
                    );
                },

                ul({ node: _, ...props }) {
                    return <ul {...props} className="my-3 ml-2 list-disc pl-3" />;
                },
                ol({ node: _, ...props }) {
                    return <ol {...props} className="my-3 ml-2 list-decimal pl-3" />;
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
                code(props) {
                    const { node: _, ...rest } = props;
                    return <code {...rest} className="rounded-sm bg-accent px-[0.4em] pb-[0.2em] pt-[0.1em]" />;
                },
            }}
        >
            {children}
        </ReactMarkdown>
    );
};

export default memo(Markdown);
