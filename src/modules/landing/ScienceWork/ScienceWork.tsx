import Markdown from '@/components/Markdown';
import LandingLayout from '@/components/layout/LandingLayout';
import { APP_HOSTNAME, DEFAULT_POSTER_URL } from '@/constants';
import Head from 'next/head';
import { memo, useEffect } from 'react';
import {
    SCIENCE_WORK_INTERNATIONAL_ACTIVITY_INTRO_SECTION,
    SCIENCE_WORK_EDUCATIONAL_SERVICES_SECTION,
    SCIENCE_WORK_HISTORY_SECTION,
} from './constants';
import { useToggle } from '@/hooks/useToggle';
import GoogleDriveVideoPlayer from '@/components/GoogleDriveVideoPlayer/GoogleDriveVideoPlayer';

const ScienceWorkModule: React.FC = () => {
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
                <title>ІТВС | Наукова робота</title>
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
                <meta name="twitter:url" content={`${APP_HOSTNAME}/science`} />
            </Head>
            <section className="container">
                <h2 className="my-8 text-center text-3xl font-black">Наукова робота кафедри</h2>
                <div>
                    <Markdown>{SCIENCE_WORK_INTERNATIONAL_ACTIVITY_INTRO_SECTION}</Markdown>
                    <GoogleDriveVideoPlayer url="https://drive.google.com/file/d/1sPM7bz2Eb5Gc5GxbFLjU1D-YoXhvBaj4/preview" />
                    <Markdown>{SCIENCE_WORK_EDUCATIONAL_SERVICES_SECTION}</Markdown>
                    <GoogleDriveVideoPlayer url="https://drive.google.com/file/d/1bR8A6hF6hw7Gin4PAA7d7HtI4IU9rAi0/preview" />
                    <Markdown>{SCIENCE_WORK_HISTORY_SECTION}</Markdown>
                </div>
            </section>
        </LandingLayout>
    );
};

export default memo(ScienceWorkModule);
