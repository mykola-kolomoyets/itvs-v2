import { useCallback } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { Link2Icon } from 'lucide-react';
import {
    TwitterShareButton,
    TwitterIcon,
    FacebookShareButton,
    FacebookIcon,
    TelegramShareButton,
    TelegramIcon,
} from 'react-share';
import type { GetServerSideProps, NextPage } from 'next';
import type { Article, Tag, User } from '@prisma/client';
import { useToast } from '@/components/Toaster/hooks/useToast';
import { appRouter } from '@/server/api/root';
import { cn, copyToClipboard, getFirstLetters, shimmer, toBase64 } from '@/utils/common';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar';
import Markdown from '@/components/Markdown';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import LandingLayout from '@/components/layout/LandingLayout';

type ArticleItem = NonNullable<Article> & {
    tags: Tag[];
    author: Pick<User, 'name' | 'image'>;
};

const DEFAULT_POSTER_URL = 'https://lpnu.ua/sites/default/files/2023/7/18/news/24194/itvs-prog-t.jpg';
const APP_HOSTNAME = ' https://itvs-v2-dev.vercel.app';

const ArticleItemPage: NextPage<{ article: ArticleItem }> = ({ article }) => {
    console.log(article);

    const posterUrl = article.posterUrl;

    // TODO: UTILS
    const getMetaTitle = useCallback(() => {
        return `ІТВС | ${article.title}`;
    }, [article.title]);

    const getMetaPageUrl = useCallback(() => {
        return `${APP_HOSTNAME}/articles/${article.slug}`;
    }, [article.slug]);

    const getMetaImage = useCallback(() => {
        return article.posterUrl ?? DEFAULT_POSTER_URL;
    }, [article.posterUrl]);

    const { toast } = useToast();

    return (
        <>
            <Head>
                <title>ІТВС | {article.title}</title>
                <link rel="icon" href="/images/logo-mini.svg" />
                <meta name="robots" content="all" />
                <meta name="description" content={article?.title} />
                <meta property="og:image" content={getMetaImage()} />
                <meta property="og:title" content={getMetaTitle()} />
                <meta property="og:description" content="Кафедра Інформаційних Технологій Видавничої Справи" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content={APP_HOSTNAME} />
                <meta name="twitter:title" content={getMetaTitle()} />
                <meta name="twitter:description" content="Кафедра Інформаційних Технологій Видавничої Справи" />
                <meta name="twitter:image" content={getMetaImage()} />
                <meta name="twitter:url" content={getMetaPageUrl()} />
            </Head>
            <LandingLayout>
                <div className="mt-[-98px] ">
                    <div
                        className={cn('relative h-[80vh] w-full overflow-hidden border-b border-border md:h-[500px]', {
                            'h-auto': !posterUrl,
                        })}
                    >
                        {posterUrl ? (
                            <Image
                                className="h-[80vh] w-full object-cover md:h-[500px]"
                                src={posterUrl}
                                alt={article.title}
                                width={1280}
                                height={720}
                                placeholder="blur"
                                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(1280, 720))}`}
                            />
                        ) : null}
                        <div
                            className={cn(
                                'absolute bottom-0 left-1/2 w-full -translate-x-1/2 bg-background/90 px-6 py-6  backdrop-blur supports-[backdrop-filter]:bg-background/40',
                                {
                                    'relative pt-36': !posterUrl,
                                }
                            )}
                        >
                            <div className="mx-auto w-full max-w-[1024px] md:px-8">
                                <h1 className="mb-3 line-clamp-6 w-full text-4xl font-bold md:text-5xl">
                                    {article.title}
                                </h1>
                                {article.tags.length ? (
                                    <div className="mb-4 flex flex-wrap">
                                        {article.tags.map((tag) => {
                                            return (
                                                <Badge key={tag.id} className="mr-2 mt-2 flex-shrink-0">
                                                    {tag.name}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                ) : null}
                                <div className="flex items-center">
                                    <Avatar>
                                        <AvatarImage
                                            src={article.author.image ?? ''}
                                            alt={article.author.name ?? 'No Name'}
                                        />
                                        <AvatarFallback>{getFirstLetters(article.author.name ?? '')}</AvatarFallback>
                                    </Avatar>
                                    <h6 className="ml-2 text-base font-medium">{article.author.name}</h6>
                                </div>
                                <div className="mt-4 flex flex-wrap">
                                    <h6 className="sr-only">Поділитись статтею</h6>
                                    <TwitterShareButton
                                        className="mr-2 block !rounded-md !bg-[#04abed] !p-1"
                                        url={getMetaPageUrl()}
                                        title={getMetaTitle()}
                                    >
                                        <TwitterIcon size={32} />
                                    </TwitterShareButton>
                                    <FacebookShareButton
                                        className="mr-2 block !rounded-md !bg-[#0964fe] !p-1"
                                        url={getMetaPageUrl()}
                                        title={getMetaTitle()}
                                        hashtag="#itvs"
                                    >
                                        <FacebookIcon size={32} />
                                    </FacebookShareButton>
                                    <TelegramShareButton
                                        className="mr-2 block !rounded-md !bg-[#24a3e2] !p-2"
                                        url={getMetaPageUrl()}
                                        title={getMetaTitle()}
                                    >
                                        <TelegramIcon size={24} />
                                    </TelegramShareButton>
                                    <Button
                                        variant="secondary"
                                        title="Копіювати посилання на статтю"
                                        size="icon"
                                        onClick={() => {
                                            void copyToClipboard(getMetaPageUrl(), () => {
                                                toast({
                                                    title: 'Посилання скопійовано',
                                                });
                                            });
                                        }}
                                    >
                                        <Link2Icon size={16} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mx-auto w-full max-w-[1024px] px-8 py-8">
                        <Markdown>{article.content}</Markdown>
                    </div>
                </div>
            </LandingLayout>
        </>
    );
};

export const getServerSideProps: GetServerSideProps<{ article: ArticleItem }> = async (ctx) => {
    const trpc = appRouter.createCaller(ctx as never);
    const slug = ctx.params?.slug;

    if (!slug) {
        return {
            notFound: true,
        };
    }

    const article = await trpc.articles.getArticleItem({
        slug: slug as string,
    });

    if (!article) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            article: article as ArticleItem,
        },
    };
};

export default ArticleItemPage;
