import { useLayoutEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeft, TabletSmartphone } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useToggle } from '@/hooks/useToggle';
import Header from '@/components/dashboard/Header';
import { Dialog, DialogContent, DialogPortal } from '../Dialog';
import { Button } from '../Button';

const APP_VERSION = '1.19.19';

const DashboardLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    // const { data: sessionData } = useSession();
    const [isRendered, , setIsRendered] = useToggle();
    const isWidthSuitable = useMediaQuery('(min-width: 1024px)');
    // const router = useRouter();

    useLayoutEffect(() => {
        setIsRendered(true);
    }, [setIsRendered]);

    // if (isRendered && !sessionData?.user) {
    //     router.replace('/');
    //     return;
    // }

    if (!isRendered) {
        return null;
    }

    return (
        <div className="relative flex min-h-screen flex-col ">
            {isWidthSuitable ? null : (
                <div className="pointer-events-none absolute inset-0 z-[60]  h-screen w-screen overflow-hidden bg-accent/95 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-accent/50">
                    <Dialog open={!isWidthSuitable} modal>
                        <DialogPortal>
                            <DialogContent className="z-[99] h-[120vh] border-none bg-transparent shadow-none">
                                <div className="flex flex-col items-center justify-center">
                                    <TabletSmartphone size={72} />
                                    <h1 className="mt-7 text-center text-2xl font-medium">
                                        Тут краще з більшим екраном
                                    </h1>
                                    <h2 className="mt-3 text-center text-base font-light">
                                        Цю частину сайту краще переглядати на пристроях з дещо більшим екраном.
                                    </h2>
                                    <Button className="mt-10" asChild>
                                        <Link href="/">
                                            <ArrowLeft className="mr-2" size={16} />
                                            Назад на головну
                                        </Link>
                                    </Button>
                                </div>
                            </DialogContent>
                        </DialogPortal>
                    </Dialog>
                </div>
            )}
            <Header />
            <main className="flex-grow pb-8">{children}</main>
            <footer className="flex items-center justify-center border-t border-solid border-border p-5 text-sm text-muted-foreground">
                v{APP_VERSION}
            </footer>
        </div>
    );
};

export default DashboardLayout;
