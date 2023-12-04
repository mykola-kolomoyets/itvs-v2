import { memo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HIRO_NULP_TITLE, HIRO_SUBTITLE, HIRO_TITLE_MAIN, HIRO_TITLE_SECONDARY } from './constants';
import AnimatedCharacters from '@/components/StaggerText/StaggerText';
import { useToggle } from '@/hooks/useToggle';
import { Button } from '@/components/Button';
import PartnersMarquee from './components/PartnersMarquee';
import { ArrowUpRightIcon, ExternalLink } from 'lucide-react';

const Hiro: React.FC = () => {
    const [isRendered, , setIsRendered] = useToggle();

    useEffect(() => {
        setIsRendered(true);
    }, [setIsRendered]);

    if (!isRendered) return null;

    return (
        <section className="relative flex h-[calc(100vh-6.75rem)] w-full items-center justify-center overflow-hidden">
            <div className="container -mt-[128px] flex flex-col items-center justify-center">
                <motion.div
                    className="relative flex flex-col flex-wrap items-center justify-center"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.035,
                            },
                        },
                    }}
                >
                    <h1 className="mx-32 mb-2 flex flex-wrap justify-center text-5xl font-black sm:text-7xl md:mx-48 md:mb-12 md:text-8xl">
                        {HIRO_TITLE_MAIN.split(' ').map((word, index) => {
                            return <AnimatedCharacters key={index} text={word} type="p" />;
                        })}
                        <span className="flex text-accent-secondary">
                            {HIRO_TITLE_SECONDARY.split(' ').map((word, index) => {
                                return <AnimatedCharacters key={index} text={word} type="p" />;
                            })}
                        </span>
                    </h1>
                    <a
                        className="text-md focus-primary group mx-24 flex flex-wrap justify-center truncate rounded-lg px-2 pt-2 font-medium transition-colors hover:text-accent-secondary md:text-lg"
                        href="https://lpnu.ua/"
                    >
                        {HIRO_NULP_TITLE.split(' ').map((word, index) => {
                            return (
                                <span key={index}>
                                    <AnimatedCharacters text={word} type="h1" />
                                </span>
                            );
                        })}
                        <ExternalLink
                            className="ml-2 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
                            size={24}
                        />
                    </a>
                    <h2 className="mx-24 flex flex-wrap justify-center truncate text-lg font-medium md:text-2xl">
                        {HIRO_SUBTITLE.split(' ').map((word, index) => {
                            return (
                                <span key={index}>
                                    <AnimatedCharacters text={word} type="h1" />
                                </span>
                            );
                        })}
                    </h2>
                    <Button size="lg" className="mt-8">
                        Звʼязатися з нами
                        <ArrowUpRightIcon className="ml-2" size={24} />
                    </Button>
                    <div className="relative mt-10 w-full md:mt-20">
                        <PartnersMarquee />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default memo(Hiro);
