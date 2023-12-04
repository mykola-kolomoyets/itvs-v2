import { memo } from 'react';
import Image from 'next/image';
import { ExternalLink, Mail, MapPin, PhoneCallIcon } from 'lucide-react';
import Link from 'next/link';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="z-50 mt-16 flex flex-col items-center justify-center">
            <div className="container m-6 mt-2 flex flex-col justify-between px-6 py-3 backdrop-blur md:flex-row">
                <div className="mb-5 flex flex-col md:mb-0">
                    <Image
                        className="w-24 flex-shrink-0 dark:invert dark:saturate-0"
                        src="/images/nulp-logo-ukr.svg"
                        width={97}
                        height={32}
                        alt="NULP"
                    />
                    <a
                        className="focus-primary md:text-md group mt-4 inline-flex justify-start rounded-sm text-sm font-medium transition-colors hover:text-accent-secondary hover:underline"
                        href="https://lpnu.ua/"
                    >
                        Національний університет “Львівська&nbsp;політехніка”
                        <ExternalLink
                            className="ml-2 hidden opacity-0 transition-opacity group-focus-within:block group-focus-within:opacity-100 group-hover:block group-hover:opacity-100"
                            size={16}
                        />
                    </a>
                    <p className="mb-3 mt-1 text-lg font-medium">Кафедра “Інформаційні технології видавничої справи”</p>
                    <p className="inline-flex items-center">
                        <MapPin className="mr-3" size={16} />
                        вул. С.Бандери, 28а, Львів-13, 79013.
                    </p>
                    <a
                        className="focus-primary inline-flex items-center rounded-sm transition-colors hover:text-accent-secondary hover:underline"
                        href="mailto:ikni_info(at)lp.edu.ua"
                    >
                        <Mail className="mr-3" size={16} />
                        ikni_info(at)lp.edu.ua
                    </a>
                    <div className="flex items-baseline">
                        <PhoneCallIcon className="mr-3" size={16} />
                        <ul>
                            <li>
                                <a
                                    className="focus-primary inline-flex items-center rounded-sm transition-colors hover:text-accent-secondary hover:underline"
                                    href="tel:+380322582404"
                                >
                                    (032) 258-24-04
                                </a>
                            </li>
                            <li>
                                <a
                                    className="focus-primary inline-flex items-center rounded-sm transition-colors hover:text-accent-secondary hover:underline"
                                    href="tel:+380322582779"
                                >
                                    (032) 258-27-79
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row">
                    <div className="mb-5 mr-10 flex flex-col md:mb-0">
                        <h5 className="mb-3 text-xl font-medium">Про нас</h5>
                        <ul>
                            <li>
                                <Link className="focus-primary rounded-sm hover:underline" href="/history">
                                    Історія
                                </Link>
                            </li>
                            <li>
                                <Link className="focus-primary rounded-sm hover:underline" href="/staff">
                                    Коллектив кафедри
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="flex flex-col">
                        <h5 className="mb-3 text-xl font-medium">Навчання</h5>
                        <ul>
                            <li>
                                <Link className="focus-primary rounded-sm hover:underline" href="/history">
                                    Дисципліни
                                </Link>
                            </li>
                            <li>
                                <Link className="focus-primary rounded-sm hover:underline" href="/staff">
                                    Бібліотека
                                </Link>
                            </li>
                            <li>
                                <Link className="focus-primary rounded-sm hover:underline" href="/staff">
                                    Наукова робота
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="container">
                <p className="text-sm">&copy; {currentYear}, ІКНІ, НУ “Львівська політехніка”</p>
                <div className="mt-2"></div>
            </div>
            <div className="container mb-5 flex justify-center">
                <p className="text-xs">
                    Design & Development by&nbsp;
                    <a className="hover:underline" href="https://www.linkedin.com/in/mykola-kolomoyets-874322190/">
                        m.kolo
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default memo(Footer);
