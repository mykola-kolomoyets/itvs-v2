import { memo } from 'react';
import { ABOUT_CARDS_CONFIG } from './constants';
import AboutCard from './components/AboutCard';

const About: React.FC = () => {
    return (
        <section className="container my-10">
            <header className="container mb-10 flex max-w-[64rem] flex-col items-center ">
                <h2 className="mb-4 text-3xl font-black">Хто ми?</h2>
                <p className="text-center text-xl font-medium">
                    Отримуй нові знання та навички від професіоналів, які вже досягли успіху в IT-сфері, поліграфії та
                    готові поділитися своїм досвідом з тобою.
                </p>
            </header>
            <div className=" grid grid-cols-1 gap-5 md:grid-cols-fluid">
                {ABOUT_CARDS_CONFIG.map((card) => {
                    return <AboutCard key={card.title} {...card} />;
                })}
            </div>
        </section>
    );
};

export default memo(About);
