import { memo, useEffect } from 'react';
import ReactPlayer from 'react-player';
import LandingLayout from '@/components/layout/LandingLayout';
import { ABOUT_CONTENT, ABOUT_VIDEO_POSTER_URL, ABOUT_VIDEO_URL } from './constants';
import { useToggle } from '@/hooks/useToggle';
import Markdown from '@/components/Markdown';

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
            <section className="container">
                <h2 className="my-8 mb-4 text-center text-3xl font-black">Хто ми?</h2>

                <div className="relative m-auto mt-8 w-full overflow-hidden rounded-lg px-8 pb-[56.25%]">
                    <ReactPlayer
                        className="absolute left-0 top-0"
                        width="100%"
                        height="100%"
                        url={ABOUT_VIDEO_URL}
                        controls
                        style={{
                            borderRadius: '1rem',
                            overflow: 'hidden',
                        }}
                        light={ABOUT_VIDEO_POSTER_URL}
                        pip
                        config={{
                            youtube: {
                                playerVars: { showinfo: 0, autoplay: 1, fs: 1 },
                                embedOptions: {
                                    poster: ABOUT_VIDEO_POSTER_URL,
                                },
                            },
                            file: {
                                attributes: {
                                    poster: ABOUT_VIDEO_POSTER_URL,
                                },
                            },
                        }}
                    />
                    <source src={ABOUT_VIDEO_URL} type="video/mp4" />
                </div>
                <div className="mx-auto mt-12 max-w-[1100px] md:px-8">
                    <Markdown>{ABOUT_CONTENT}</Markdown>
                </div>
            </section>
        </LandingLayout>
    );
};

export default memo(AboutModule);
