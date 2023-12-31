import { memo } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
// import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { ExternalLinkIcon } from 'lucide-react';
import { HEADER_CREATE_OPTIONS, HEADER_SETTINGS_OPTIONS } from './constants';
import NavigationListItem from '@/components/NavigationListItem';
import { Separator } from '@/components/Separator';
import { Skeleton } from '@/components/Skeleton';
import { Button } from '@/components/Button';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/NavigationMenu';
import { AuthShowcase } from './components/AuthShowcase';
import ThemeChanger from './components/ThemeChanger';
import Logo from '@/components/Logo';

const Header: React.FC = () => {
    const { data: session, status: sessionStatus } = useSession();

    const pathname = usePathname();

    const isAdmin = session?.user.role === 'ADMIN';

    return (
        <>
            <Head>
                <title>ІТВС - Адміністрування</title>
                <meta name="description" content="ІТВС - Кафдера інформаційних технологій видавничої справи" />
                <link rel="icon" href="/images/logo-mini.svg" />
            </Head>
            <header className="sticky top-0 z-50 flex items-center justify-between border-y border-solid border-border bg-background/95 px-6 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <section className="flex items-center">
                    <Logo className="scale-[80%]" />
                    <Separator orientation="vertical" className="-my-2 mx-3 h-[3.5625rem]" />
                    <Button variant="link" asChild>
                        <Link href="/">
                            Повернутися на сайт
                            <ExternalLinkIcon className="ml-2" size={16} />
                        </Link>
                    </Button>
                </section>
                <section className="flex items-center">
                    {sessionStatus === 'loading' ? (
                        <>
                            <Skeleton className="mr-2 h-[24px] w-[75px]" />
                            {/* <Skeleton className="mr-2 h-[24px] w-[105px]" /> */}
                            <Skeleton className="mr-2 h-[24px] w-[100px]" />
                            <Skeleton className="mr-2 h-[24px] w-[130px]" />
                            <Skeleton className="mx-4 h-[24px] w-[120px]" />
                            <Skeleton className="mr-2 h-[40px] w-[40px]" />
                            <Skeleton className="mr-4 h-[40px] w-[40px]" />
                            <Skeleton className="h-[40px] w-[40px]" />
                        </>
                    ) : (
                        <>
                            <nav className="relative flex items-center">
                                <NavigationMenu className="relative w-screen">
                                    <NavigationMenuList className="flex justify-center">
                                        <NavigationMenuItem>
                                            <Link href="/dashboard/articles" legacyBehavior passHref>
                                                <NavigationMenuLink
                                                    className={navigationMenuTriggerStyle()}
                                                    active={pathname === '/dashboard/articles'}
                                                >
                                                    Статті
                                                </NavigationMenuLink>
                                            </Link>
                                        </NavigationMenuItem>
                                        {isAdmin ? (
                                            <NavigationMenuItem>
                                                <Link href="/dashboard/users" legacyBehavior passHref>
                                                    <NavigationMenuLink
                                                        className={navigationMenuTriggerStyle()}
                                                        active={pathname === '/dashboard/users'}
                                                    >
                                                        Учасники
                                                    </NavigationMenuLink>
                                                </Link>
                                            </NavigationMenuItem>
                                        ) : null}
                                    </NavigationMenuList>
                                </NavigationMenu>
                                {isAdmin ? (
                                    <>
                                        <Separator orientation="vertical" className="-my-2 mx-3 h-[3.5625rem]" />
                                        <NavigationMenu>
                                            <NavigationMenuList>
                                                <NavigationMenuItem>
                                                    <NavigationMenuTrigger>Створити</NavigationMenuTrigger>
                                                    <NavigationMenuContent>
                                                        <ul className="w-[400px] gap-3 p-4">
                                                            {HEADER_CREATE_OPTIONS.map((component) => (
                                                                <NavigationListItem
                                                                    key={component.title}
                                                                    {...component}
                                                                >
                                                                    {component.description}
                                                                </NavigationListItem>
                                                            ))}
                                                        </ul>
                                                    </NavigationMenuContent>
                                                </NavigationMenuItem>
                                                <NavigationMenuItem>
                                                    <NavigationMenuTrigger>Налаштування</NavigationMenuTrigger>
                                                    <NavigationMenuContent>
                                                        <ul className=" w-[400px] gap-3 p-4">
                                                            {HEADER_SETTINGS_OPTIONS.map((component) => (
                                                                <NavigationListItem
                                                                    key={component.title}
                                                                    {...component}
                                                                >
                                                                    {component.description}
                                                                </NavigationListItem>
                                                            ))}
                                                        </ul>
                                                    </NavigationMenuContent>
                                                </NavigationMenuItem>
                                            </NavigationMenuList>
                                        </NavigationMenu>
                                    </>
                                ) : null}
                            </nav>
                            <Separator orientation="vertical" className="-my-2 mx-3 h-[3.5625rem]" />
                            <ThemeChanger />
                            <AuthShowcase />
                        </>
                    )}
                </section>
            </header>
        </>
    );
};

export default memo(Header);
