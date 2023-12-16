import { memo } from 'react';
import { Menu } from 'lucide-react';
import { HEADER_DEPARTMENT_OPTIONS, HEADER_STUDY_OPTIONS } from '@/constants';
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTrigger } from '@/components/Dialog';
import NavigationListItem from '@/components/NavigationListItem';
import { Button } from '@/components/Button';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/NavigationMenu';
import Logo from '@/components/Logo';
import AuthShowcase from './components/AuthShowcase';
import ThemeChanger from '../ThemeChanger';

const Header: React.FC = () => {
    return (
        <header className="sticky top-3 z-50 flex items-center justify-center">
            <div className="container m-6 mt-2 flex max-w-[1040px] justify-between rounded-lg border border-border bg-accent/95 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-accent/50">
                <Logo className="scale-90" />
                <div className="flex items-center">
                    <NavigationMenu className="mr-3 hidden md:block">
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
                    <Dialog modal>
                        <DialogTrigger className="mr-2 md:hidden" asChild>
                            <Button size="icon">
                                <Menu size={16} />
                            </Button>
                        </DialogTrigger>
                        <DialogPortal>
                            <DialogOverlay className="bg-background" />
                            <DialogContent className="flex h-[80vh] w-screen flex-col border-none shadow-none">
                                <Logo className="top-[-1.5rem] flex-grow-0" />
                                <NavigationMenu className=" w-full flex-grow overflow-auto">
                                    <ul className="w-full gap-3 p-4">
                                        {HEADER_DEPARTMENT_OPTIONS.map(({ description: _, ...rest }) => (
                                            <NavigationListItem
                                                className="w-full"
                                                key={rest.title}
                                                description=""
                                                {...rest}
                                            />
                                        ))}
                                        {HEADER_STUDY_OPTIONS.map(({ description: _, ...rest }) => (
                                            <NavigationListItem
                                                className="w-full"
                                                key={rest.title}
                                                description=""
                                                {...rest}
                                            />
                                        ))}
                                    </ul>
                                </NavigationMenu>
                                <div className="flex-grow-0">
                                    <AuthShowcase />
                                </div>
                            </DialogContent>
                        </DialogPortal>
                    </Dialog>
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
