import { memo, useEffect } from 'react';
import LandingLayout from '@/components/layout/LandingLayout';
import { ABOUT_CONTENT, ABOUT_DEPARTMENT_URL, ABOUT_VIDEO_URL } from './constants';
import { useToggle } from '@/hooks/useToggle';
import Markdown from '@/components/Markdown';
import Head from 'next/head';
import { APP_HOSTNAME, DEFAULT_POSTER_URL } from '@/constants';
import YouTubeVideoPlayer from '@/components/YouTubeVideoPlayer/YouTubeVideoPlayer';

const AboutModule: React.FC = () => {
    const [isRendered, , setIsRendered] = useToggle();

    useEffect(() => {
        setIsRendered(true);
    }, [setIsRendered]);

    if (!isRendered) {
        return null;
    }

    return (
        <LandingLayout>
            <Head>
                <title>ІТВС | Про нас</title>
                <link rel="icon" href="/images/logo-mini.svg" />
                <meta name="robots" content="all" />
                <meta name="description" content="Кафедра Інформаційних Технологій Видавничої Справи" />
                <meta property="og:image" content={DEFAULT_POSTER_URL} />
                <meta property="og:title" content="ІТВС" />
                <meta property="og:description" content="Кафедра Інформаційних Технологій Видавничої Справи" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content={APP_HOSTNAME} />
                <meta name="twitter:title" content="ІТВС" />
                <meta name="twitter:description" content="Кафедра Інформаційних Технологій Видавничої Справи" />
                <meta name="twitter:image" content={DEFAULT_POSTER_URL} />
                <meta name="twitter:url" content={`${APP_HOSTNAME}/about`} />
            </Head>
            <section className="container">
                <h2 className="my-8 mb-4 text-center text-3xl font-black">Хто ми?</h2>
                <YouTubeVideoPlayer url={ABOUT_DEPARTMENT_URL} />
                <div className="mx-auto mt-12 max-w-[1100px] md:px-8">
                    <Markdown>{ABOUT_CONTENT}</Markdown>
                </div>
                <YouTubeVideoPlayer url={ABOUT_VIDEO_URL} />
            </section>
        </LandingLayout>
    );
};

export default memo(AboutModule);
