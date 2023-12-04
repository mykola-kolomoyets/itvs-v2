import { memo } from 'react';
import Image from 'next/image';
import { shimmer, toBase64 } from '@/utils/common';
import { HISTORY_IMAGES_URLS, HISTORY_ITEMS } from './constants';
import HistoryCard from './components/HistoryCard';

const History: React.FC = () => {
    return (
        <section className="container my-32">
            <div className="grid gap-10 md:grid-cols-2">
                <div className="z-20 flex flex-col">
                    <header className=" container mb-10 flex max-w-[64rem] flex-col">
                        <h2 className="sticky top-[20rem] mb-4 text-3xl font-black">Наша історія</h2>
                        {/* <p className=" text-xl font-medium">
                            Отримуй нові знання та навички від професіоналів, які вже досягли успіху в IT-сфері,
                            поліграфії та готові поділитися своїм досвідом з тобою.
                        </p> */}
                    </header>
                    <div className="flex flex-col">
                        {HISTORY_ITEMS.map((item, index) => {
                            return (
                                <div key={item.title} className="md:h-screen">
                                    <HistoryCard {...item} index={index} />
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="flex flex-col">
                    {HISTORY_IMAGES_URLS.map((url) => {
                        return (
                            <div
                                key={url}
                                className="sticky top-[7rem] mb-32 h-[70vh] md:top-[10rem] md:mb-5 md:h-screen"
                            >
                                <Image
                                    className=" h-full w-full rounded-lg border-border object-cover "
                                    src={url}
                                    width={720}
                                    height={1280}
                                    placeholder="blur"
                                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(720, 1280))}`}
                                    alt="Історія кафедри"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default memo(History);
