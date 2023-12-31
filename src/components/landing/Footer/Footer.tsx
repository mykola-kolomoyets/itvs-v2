import { memo } from 'react';
import DepartmentInfo from './components/DepartmentInfo';
import { HEADER_DEPARTMENT_OPTIONS, HEADER_STUDY_OPTIONS } from '@/constants';
import NavigationListItem from '@/components/NavigationListItem';
import { NavigationMenu } from '@/components/NavigationMenu';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="z-50 mt-16 flex flex-col items-center justify-center">
            <div className="container m-6 mt-2 flex flex-col justify-between px-6 py-3 backdrop-blur md:flex-row">
                <DepartmentInfo />
                <div className="flex flex-col md:flex-row">
                    <div className="mb-5 mr-10 flex flex-col md:mb-0">
                        <h5 className="mb-3 text-xl font-medium">Кафедра</h5>
                        <NavigationMenu className="flex-grow-0" orientation="vertical">
                            <ul>
                                {HEADER_DEPARTMENT_OPTIONS.map((component) => (
                                    <NavigationListItem key={component.title} {...component} />
                                ))}
                            </ul>
                        </NavigationMenu>
                    </div>
                    <div className="flex flex-col">
                        <h5 className="mb-3 text-xl font-medium">Навчання</h5>
                        <NavigationMenu className="flex-grow-0" orientation="vertical">
                            <ul>
                                {HEADER_STUDY_OPTIONS.map((component) => (
                                    <NavigationListItem key={component.title} {...component} />
                                ))}
                            </ul>
                        </NavigationMenu>
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
