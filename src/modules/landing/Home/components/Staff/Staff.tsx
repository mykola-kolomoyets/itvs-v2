import { memo } from 'react';
import { STAFF_IMAGES_CONFIG, STAFF_IMAGES_CONFIG_MOBILE } from './constants';
import Image from 'next/image';
import { cn } from '@/utils/common';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/HoverCard';

const Staff: React.FC = () => {
    return (
        <section className="container my-10">
            <header className="container mb-10 flex max-w-[64rem] flex-col items-center ">
                <h2 className="mb-4 text-center text-3xl font-black">Коллектив кафедри</h2>
                <p className="text-md  text-center font-medium md:text-xl">
                    На нашій кафедрі працюють викладачі з великим досвідом роботи в галузі IT та поліграфії. В тому
                    числі: <span className=" font-black text-accent-secondary">2 професори</span>,{' '}
                    <span className=" font-black text-accent-secondary">8 доцентів</span>,{' '}
                    <span className=" font-black text-accent-secondary">2 асистенти</span>,{' '}
                    <span className=" font-black text-accent-secondary">провідний спеціаліст</span> та{' '}
                    <span className=" font-black text-accent-secondary">інженер І категорії</span>
                </p>
            </header>
            <div className="mx-auto hidden flex-col items-center justify-center lg:flex lg:flex-row">
                {STAFF_IMAGES_CONFIG.map(({ url, name, position }, index) => {
                    return (
                        <HoverCard key={url}>
                            <HoverCardTrigger asChild>
                                <div
                                    className={cn(
                                        'mx-1 h-28 w-28 flex-shrink-0 rounded-full border-[0.25rem] border-border transition-all duration-500 hover:border-accent-secondary',
                                        {
                                            'z-10 h-36 w-36': index === Math.floor(STAFF_IMAGES_CONFIG.length / 2),
                                        }
                                    )}
                                >
                                    <Image
                                        className="h-full w-full rounded-full object-cover object-center"
                                        width={index === 2 ? 196 : 128}
                                        height={index === 2 ? 196 : 128}
                                        src={url}
                                        alt="Викладачі кафедри"
                                    />
                                </div>
                            </HoverCardTrigger>
                            <HoverCardContent>
                                <div className="flex flex-col  justify-center">
                                    <h3 className="text-lg font-semibold">{name}</h3>
                                    <p className="text-md">{position}</p>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    );
                })}
            </div>
            <div className="flex flex-col lg:hidden">
                {STAFF_IMAGES_CONFIG_MOBILE.map((urls, index) => {
                    return (
                        <div key={index} className="flex items-center justify-center">
                            {urls.map(({ url, name, position }, subUrlIndex) => {
                                return (
                                    <HoverCard key={url}>
                                        <HoverCardTrigger asChild>
                                            <div
                                                className={cn(
                                                    'm-1 h-24 w-24 flex-shrink-0 rounded-full border-[0.25rem] border-border transition-all duration-500 hover:border-accent-secondary',
                                                    {
                                                        'z-10 h-32 w-32':
                                                            index === 0 && subUrlIndex === Math.floor(urls.length / 2),
                                                    }
                                                )}
                                            >
                                                <Image
                                                    className="h-full w-full rounded-full object-cover object-center"
                                                    width={index === 2 ? 196 : 128}
                                                    height={index === 2 ? 196 : 128}
                                                    src={url}
                                                    alt="Викладачі кафедри"
                                                />
                                            </div>
                                        </HoverCardTrigger>
                                        <HoverCardContent>
                                            <div className="flex flex-col  justify-center">
                                                <h3 className="text-lg font-semibold">{name}</h3>
                                                <p className="text-md">{position}</p>
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default memo(Staff);
