import { memo } from 'react';
import Link from 'next/link';
import DepartmentInfo from './components/DepartmentInfo';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="z-50 mt-16 flex flex-col items-center justify-center">
            <div className="container m-6 mt-2 flex flex-col justify-between px-6 py-3 backdrop-blur md:flex-row">
                <DepartmentInfo />
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
