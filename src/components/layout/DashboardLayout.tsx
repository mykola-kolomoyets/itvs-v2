import Header from '@/components/dashboard/Header';

const APP_VERSION = '0.2.4';

const DashboardLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow pb-8">{children}</main>
            <footer className="flex items-center justify-center border-t border-solid border-border p-5 text-sm text-muted-foreground">
                v{APP_VERSION}
            </footer>
        </div>
    );
};

export default DashboardLayout;
