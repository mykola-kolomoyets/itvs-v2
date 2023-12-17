import { memo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HIRO_TITLE_MAIN, HIRO_TITLE_SECONDARY } from './constants';
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
        <section className="relative flex h-max w-full justify-center overflow-hidden md:min-h-screen md:items-center">
            <div className="container md:mt-[-10rem]">
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
                    <h1 className="mx-auto mb-2 mt-5 flex max-w-[1280px] flex-wrap justify-center text-5xl font-black sm:text-7xl md:mx-auto md:mb-5 md:mt-14 md:text-8xl">
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
                        className="text-md focus-primary animate__fadeInUp animate__animated animate__delay-2s group mx-auto mb-3 flex flex-wrap justify-center rounded-lg px-2 pt-2 text-center font-medium underline transition-colors hover:text-accent-secondary hover:underline md:text-lg md:no-underline"
                        href="https://lpnu.ua/"
                    >
                        Національний університет “Львівська політехніка”
                        <ExternalLink
                            className="ml-2 hidden  opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 md:block "
                            size={24}
                        />
                    </a>
                    <h2 className="animate__fadeInUp animate__animated animate__delay-2s mx-auto flex flex-wrap justify-center text-center text-lg font-medium md:text-2xl">
                        Кафедра “Інформаційні технології видавничої справи”
                    </h2>
                    <Button size="lg" className="mt-3">
                        Звʼязатися з нами
                        <ArrowUpRightIcon className="ml-2" size={24} />
                    </Button>
                    <div className="relative mt-10 h-[120px] w-full md:mt-20">
                        <PartnersMarquee />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default memo(Hiro);
