import Header from '@/components/dashboard/Header';

const DashboardLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <div className="min-h-screen">
            <Header />
            <main>{children}</main>
        </div>
    );
};

export default DashboardLayout;
