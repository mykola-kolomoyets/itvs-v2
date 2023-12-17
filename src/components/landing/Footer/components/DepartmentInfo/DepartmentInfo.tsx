import { memo } from 'react';
import Image from 'next/image';
import { ExternalLink, FacebookIcon, Mail, MapPin, PhoneCallIcon } from 'lucide-react';
import type { DepartmentInfoProps } from './types';

const DepartmentInfo: React.FC<DepartmentInfoProps> = ({ isWithNULPLogo = true }) => {
    return (
        <div className="mb-5 flex flex-col md:mb-0">
            {isWithNULPLogo ? (
                <>
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
                </>
            ) : null}
            <p className="mb-3 mt-1 text-lg font-medium">Кафедра “Інформаційні технології видавничої справи”</p>
            <a
                className="focus-primary inline-flex  items-center  rounded-sm transition-colors hover:text-accent-secondary hover:underline"
                href="https://maps.app.goo.gl/1ikwNJ1eVS6R2wtz9"
                target="_blank"
            >
                <MapPin className="mr-3" size={16} />
                вул. С.Бандери, 28а, 5 корпус кімн. 913, Львів-13, 79013.
            </a>
            <a
                className="focus-primary inline-flex items-center rounded-sm transition-colors hover:text-accent-secondary hover:underline"
                href="mailto:itvs.dept@lpnu.ua"
            >
                <Mail className="mr-3" size={16} />
                itvs.dept@lpnu.ua
            </a>
            <div className="group flex items-baseline">
                <PhoneCallIcon className="mr-3 group-hover:text-accent-secondary group-hover:underline" size={16} />
                <ul>
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
            <div className="group relative flex items-baseline">
                <FacebookIcon
                    className="ml-[-2px] mr-3 group-hover:text-accent-secondary group-hover:underline"
                    size={20}
                />
                <ul>
                    <li>
                        <a
                            className="focus-primary inline-flex items-center rounded-sm transition-colors hover:text-accent-secondary hover:underline"
                            href="https://www.facebook.com/ITVSDepartment"
                            target="_blank"
                        >
                            ITVSDepartment
                        </a>
                    </li>
                </ul>
            </div>
            <div className="group relative my-5 inline-flex w-full flex-col flex-wrap items-center rounded-xl bg-white p-5 md:w-max md:flex-row">
                <Image src="/images/ui-ux.webp" width={64} height={60} alt="https://itcluster.lviv.ua/ux-ui_nulp/" />
                <a
                    className="focus-primary ml-5 mt-3 items-center break-words rounded-sm text-center font-bold text-black transition-colors hover:text-accent-secondary hover:underline md:mt-0 md:text-left"
                    href="https://itcluster.lviv.ua/ux-ui_nulp/"
                    target="_blank"
                >
                    ОСВІТНЯ ПРОГРАМА “UX/UI DESIGN”
                </a>
            </div>
        </div>
    );
};

export default memo(DepartmentInfo);
