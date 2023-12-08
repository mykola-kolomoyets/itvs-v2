import { memo } from 'react';
import AuthShowcase from './components/AuthShowcase';
import Image from 'next/image';
import Link from 'next/link';
import NavigationListItem from '@/components/NavigationListItem';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/NavigationMenu';
import ThemeChanger from '../ThemeChanger';
import { HEADER_DEPARTMENT_OPTIONS, HEADER_STUDY_OPTIONS } from './constants';

const Header: React.FC = () => {
    return (
        <header className="sticky top-3 z-50 flex items-center justify-center">
            <div className="container m-6 mt-2 flex max-w-[1040px] justify-between rounded-lg border border-border bg-accent/95 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-accent/50">
                <Link className="focus-primary mr-4 flex rounded-md" href="/">
                    <Image
                        className="w-[6.0625rem] flex-shrink-0 dark:hidden"
                        src="/images/logo-light.svg"
                        width={97}
                        height={32}
                        alt="ITVS"
                    />
                    <Image
                        className="hidden w-[6.0625rem] flex-shrink-0 dark:block"
                        src="/images/logo-dark.svg"
                        width={97}
                        height={32}
                        alt="ITVS"
                    />
                </Link>
                <div className="flex items-center">
                    <NavigationMenu>
                        <NavigationMenuList className="flex justify-center">
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Кафедра</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="w-[400px] gap-3 p-4">
                                        {HEADER_DEPARTMENT_OPTIONS.map((component) => (
                                            <NavigationListItem key={component.title} {...component}>
                                                {component.description}
                                            </NavigationListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Навчання</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="w-[400px] gap-3 p-4">
                                        {HEADER_STUDY_OPTIONS.map((component) => (
                                            <NavigationListItem key={component.title} {...component}>
                                                {component.description}
                                            </NavigationListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                    <ThemeChanger />
                    <div className="hidden md:block">
                        <AuthShowcase />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default memo(Header);
