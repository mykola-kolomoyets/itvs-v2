import { memo } from 'react';
import LandingLayout from '@/components/layout/LandingLayout';
import Head from 'next/head';
import { APP_HOSTNAME, DEFAULT_POSTER_URL } from '@/constants';
import DepartmentInfo from '@/components/landing/Footer/components/DepartmentInfo';

const ContactsModule: React.FC = () => {
    return (
        <LandingLayout>
            <Head>
                <title>ІТВС | Звʼязтися з нами</title>
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
                <meta name="twitter:url" content={`${APP_HOSTNAME}/contacts`} />
            </Head>
            <section className="container">
                <h2 className="my-8 text-center text-3xl font-black">Знайти нас або звʼязатися з нами</h2>

                <div className="flex flex-col items-stretch lg:flex-row">
                    <div className=" mb-8 flex flex-grow flex-col items-center justify-center lg:mb-0 lg:mr-8 lg:h-[28.125rem]">
                        <DepartmentInfo isWithNULPLogo={false} />
                    </div>

                    <div className="flex-[1_1_50%] overflow-hidden rounded-xl">
                        <iframe
                            className="border-none"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2573.3884374392646!2d24.003499394482827!3d49.83515849794799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473add78dd898fdb%3A0x8f8a7845779b2296!2z0JrQvtGA0L_Rg9GBIOKEljUg0J3QoyAi0JvQnyIsINCy0YPQu9C40YbRjyDQodGC0LXQv9Cw0L3QsCDQkdCw0L3QtNC10YDQuCwgMjjQkCwg0JvRjNCy0ZbQsiwg0JvRjNCy0ZbQstGB0YzQutCwINC-0LHQu9Cw0YHRgtGMLCA3OTAwMA!5e0!3m2!1suk!2sua!4v1702750239015!5m2!1suk!2sua"
                            width="100%"
                            height="450"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </section>
        </LandingLayout>
    );
};

export default memo(ContactsModule);
