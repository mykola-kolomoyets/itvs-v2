import { memo } from 'react';
import { motion } from 'framer-motion';
import type { HistoryCardProps } from './types';
import { cn } from '@/utils/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { HISTORY_CARD_VARIANTS } from './constants';
import { useToggle } from '@/hooks/useToggle';
import { Button } from '@/components/Button';
import { ArrowDownRight, ArrowUpLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ScrollArea';
import { Separator } from '@/components/Separator';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const HistoryCard: React.FC<HistoryCardProps> = ({
    className,
    title,
    description,
    index,
    subItems,
    level = 0,
    isSticky = true,
}) => {
    const [isSubItemsOpened, toggleIsSubItemsOpened] = useToggle();
    const isMobile = useMediaQuery('(max-width: 1024px)');

    return (
        <motion.div
            className={cn('mb-8', {
                'md:sticky md:top-[15rem]': isSticky,
                'mb-3': !isSticky,
            })}
            initial={!isMobile && isSticky ? 'offscreen' : 'onscreen'}
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.8 }}
            variants={HISTORY_CARD_VARIANTS}
        >
            <Card
                className={cn(
                    // ' sticky top-[10rem] mb-6 flex flex-col border-none bg-background/30 shadow-none backdrop-blur dark:supports-[backdrop-filter]:bg-background/30',
                    'mb-6 flex flex-col border-border bg-secondary/20 shadow-none backdrop-blur will-change-transform',
                    className,
                    {
                        'mb-0': !isSticky,
                    }
                )}
            >
                <CardHeader className="flex-grow">
                    {!level ? (
                        <div className="mb-2">
                            {/* <div className="bg-background/1 dark:supports-[backdrop-filter]:bg-background/1 inline-flex w-[60px] justify-center rounded-lg p-3 backdrop-blur "> */}
                            <div className="inline-flex  w-[60px] justify-center rounded-lg bg-accent p-3">
                                <span className="text-3xl font-black">{index + 1}</span>
                            </div>
                        </div>
                    ) : null}
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                    {subItems?.length ? (
                        <CardContent className="px-0 pb-0 pt-2">
                            {isSubItemsOpened ? <Separator className="-ml-6 w-[calc(100%+3rem)]" /> : null}
                            <motion.div
                                className=" flex flex-col overflow-hidden will-change-transform"
                                initial="collapsed"
                                animate={isSubItemsOpened ? 'expanded' : 'collapsed'}
                                variants={{
                                    collapsed: {
                                        height: 0,
                                    },
                                    expanded: {
                                        height: 'auto',
                                    },
                                }}
                            >
                                <ScrollArea className="h-[40vh]">
                                    {subItems.map((item, subIndex) => {
                                        return (
                                            <HistoryCard
                                                key={item.title}
                                                {...item}
                                                index={subIndex}
                                                level={level + 1}
                                                isSticky={false}
                                            />
                                        );
                                    })}
                                </ScrollArea>
                            </motion.div>
                            <Separator className="-ml-6 w-[calc(100%+3rem)]" />
                            <Button className="mt-5" variant="outline" onClick={toggleIsSubItemsOpened}>
                                {isSubItemsOpened ? (
                                    <>
                                        Згорнути
                                        <ArrowUpLeft className="ml-1" size={16} />
                                    </>
                                ) : (
                                    <>
                                        Розгорнути
                                        <ArrowDownRight className="ml-1" size={16} />
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    ) : null}
                </CardHeader>
            </Card>
        </motion.div>
    );
};

export default memo(HistoryCard);
