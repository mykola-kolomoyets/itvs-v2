import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/Accordion';
import { memo } from 'react';
import { FAQ_ITEMS } from './constants';

const FrequentlyAskedQuestions: React.FC = () => {
    return (
        <section className="container my-10">
            <header className="container mb-10 flex max-w-[64rem] flex-col items-center ">
                <h2 className="mb-4 text-center text-3xl font-black">Часті питання</h2>
                <p className="text-md  text-center font-medium md:text-xl">
                    Маєш питання? Тут ти знайдеш відповіді на найпоширеніші
                </p>
            </header>
            <div className="mx-auto">
                <Accordion type="single" collapsible>
                    {FAQ_ITEMS.map(({ id, text, title }) => {
                        return (
                            <AccordionItem key={id} value={id}>
                                <AccordionTrigger>{title}</AccordionTrigger>
                                <AccordionContent>{text}</AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </div>
        </section>
    );
};

export default memo(FrequentlyAskedQuestions);
